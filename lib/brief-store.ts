import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { BriefSchema, type Brief, type NewsItem } from "./brief-schema";

const DATA_DIR = path.join(process.cwd(), "data", "briefs");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function briefPath(date: string) {
  if (!DATE_RE.test(date)) {
    throw new Error(`Invalid date: ${date}`);
  }
  return path.join(DATA_DIR, `${date}.json`);
}

export async function saveBrief(brief: Brief): Promise<Brief> {
  await ensureDir();
  const parsed = BriefSchema.parse(brief);
  const payload: Brief = {
    ...parsed,
    generatedAt: parsed.generatedAt ?? new Date().toISOString(),
  };
  await fs.writeFile(briefPath(payload.date), JSON.stringify(payload, null, 2), "utf8");
  return payload;
}

export async function getBrief(date: string): Promise<Brief | null> {
  try {
    const raw = await fs.readFile(briefPath(date), "utf8");
    return BriefSchema.parse(JSON.parse(raw));
  } catch (err: unknown) {
    if (isEnoent(err)) return null;
    throw err;
  }
}

export async function listBriefDates(): Promise<string[]> {
  try {
    await ensureDir();
    const entries = await fs.readdir(DATA_DIR);
    return entries
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""))
      .filter((d) => DATE_RE.test(d))
      .sort((a, b) => (a < b ? 1 : -1));
  } catch (err) {
    if (isEnoent(err)) return [];
    throw err;
  }
}

export async function getLatestBrief(): Promise<Brief | null> {
  const dates = await listBriefDates();
  if (dates.length === 0) return null;
  return getBrief(dates[0]);
}

/**
 * Returns news items from the last `days` briefs prior to `beforeDate` so the
 * brief generator can avoid repeating stories it already summarized.
 */
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
  const relevant = dates.filter((d) => (before ? d < before : true)).slice(0, days);

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
