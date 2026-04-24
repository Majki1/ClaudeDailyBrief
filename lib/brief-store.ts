import "server-only";

import { BriefSchema, type Brief, type NewsItem } from "./brief-schema";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const BLOB_PREFIX = "briefs/";

function blobKey(date: string): string {
  if (!DATE_RE.test(date)) {
    throw new Error(`Invalid date: ${date}`);
  }
  return `${BLOB_PREFIX}${date}.json`;
}

// ── Local filesystem (dev) ──────────────────────────────────────────

async function localStore() {
  const { promises: fs } = await import("node:fs");
  const path = await import("node:path");
  const DATA_DIR = path.join(process.cwd(), "data", "briefs");

  return {
    async save(brief: Brief): Promise<void> {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(
        path.join(DATA_DIR, `${brief.date}.json`),
        JSON.stringify(brief, null, 2),
        "utf8",
      );
    },

    async load(date: string): Promise<Brief | null> {
      try {
        const raw = await fs.readFile(
          path.join(DATA_DIR, `${date}.json`),
          "utf8",
        );
        return BriefSchema.parse(JSON.parse(raw));
      } catch (err: unknown) {
        if (isEnoent(err)) return null;
        throw err;
      }
    },

    async listDates(): Promise<string[]> {
      try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        const entries = await fs.readdir(DATA_DIR);
        return entries
          .filter((f) => f.endsWith(".json"))
          .map((f) => f.replace(/\.json$/, ""))
          .filter((d) => DATE_RE.test(d))
          .sort((a, b) => (a < b ? 1 : -1));
      } catch (err: unknown) {
        if (isEnoent(err)) return [];
        throw err;
      }
    },
  };
}

// ── Vercel Blob (production) ────────────────────────────────────────

async function blobStore() {
  const { put, list, head } = await import("@vercel/blob");

  return {
    async save(brief: Brief): Promise<void> {
      await put(blobKey(brief.date), JSON.stringify(brief, null, 2), {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
      });
    },

    async load(date: string): Promise<Brief | null> {
      try {
        const meta = await head(blobKey(date));
        const res = await fetch(meta.url);
        if (!res.ok) return null;
        const raw = await res.json();
        return BriefSchema.parse(raw);
      } catch {
        return null;
      }
    },

    async listDates(): Promise<string[]> {
      const { blobs } = await list({ prefix: BLOB_PREFIX });
      return blobs
        .map((b) => b.pathname.replace(BLOB_PREFIX, "").replace(/\.json$/, ""))
        .filter((d) => DATE_RE.test(d))
        .sort((a, b) => (a < b ? 1 : -1));
    },
  };
}

// ── Store selection ─────────────────────────────────────────────────

function getStore() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return blobStore();
  }
  return localStore();
}

// ── Public API (unchanged signatures) ───────────────────────────────

export async function saveBrief(brief: Brief): Promise<Brief> {
  const parsed = BriefSchema.parse(brief);
  const payload: Brief = {
    ...parsed,
    generatedAt: parsed.generatedAt ?? new Date().toISOString(),
  };
  const store = await getStore();
  await store.save(payload);
  return payload;
}

export async function getBrief(date: string): Promise<Brief | null> {
  const store = await getStore();
  return store.load(date);
}

export async function listBriefDates(): Promise<string[]> {
  const store = await getStore();
  return store.listDates();
}

export async function getLatestBrief(): Promise<Brief | null> {
  const dates = await listBriefDates();
  if (dates.length === 0) return null;
  return getBrief(dates[0]);
}

export async function getNewsContext(options?: {
  beforeDate?: string;
  days?: number;
}): Promise<{
  generatedFor: string | null;
  window: { from: string; to: string } | null;
  items: Array<NewsItem & { date: string }>;
}> {
  const days = options?.days ?? 7;
  const dates = await listBriefDates();
  const before = options?.beforeDate;
  const relevant = dates
    .filter((d) => (before ? d < before : true))
    .slice(0, days);

  const items: Array<NewsItem & { date: string }> = [];
  for (const date of relevant) {
    const brief = await getBrief(date);
    if (!brief) continue;
    for (const item of brief.news.items) {
      items.push({ ...item, date });
    }
  }

  return {
    generatedFor: before ?? null,
    window:
      relevant.length === 0
        ? null
        : { from: relevant[relevant.length - 1], to: relevant[0] },
    items,
  };
}

function isEnoent(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: unknown }).code === "ENOENT"
  );
}
