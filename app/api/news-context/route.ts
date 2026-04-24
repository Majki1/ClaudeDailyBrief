import { NextResponse } from "next/server";
import { getNewsContext } from "@/lib/brief-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns the news items written in recent briefs so the Co-Work scheduled task
 * can deduplicate stories it already covered. Call this before generating a new
 * brief and pass the items' titles/URLs into the prompt as "already covered".
 *
 *   GET /api/news-context            -> last 7 days of news
 *   GET /api/news-context?days=3     -> last 3 days
 *   GET /api/news-context?before=YYYY-MM-DD   -> days strictly before given date
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const daysParam = url.searchParams.get("days");
  const before = url.searchParams.get("before") ?? undefined;

  const days = Math.max(
    1,
    Math.min(30, Number.parseInt(daysParam ?? "7", 10) || 7),
  );

  try {
    const context = await getNewsContext({ days, beforeDate: before });
    return NextResponse.json(
      {
        ...context,
        count: context.items.length,
        instructions:
          "These news items were already covered in the listed recent briefs. Do not repeat them verbatim; if a story has a genuine update, lead with the new angle and note what changed.",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[api/news-context] failed", err);
    return NextResponse.json(
      { error: "Failed to build news context." },
      { status: 500 },
    );
  }
}
