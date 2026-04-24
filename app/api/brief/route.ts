import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { BriefSchema } from "@/lib/brief-schema";
import { getBrief, getLatestBrief, saveBrief } from "@/lib/brief-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400, headers: corsHeaders },
    );
  }

  try {
    const parsed = BriefSchema.parse(body);
    const saved = await saveBrief(parsed);
    revalidatePath("/");
    revalidatePath(`/briefs/${saved.date}`);
    return NextResponse.json(
      { ok: true, brief: saved },
      { status: 200, headers: corsHeaders },
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Brief failed schema validation.",
          issues: err.issues,
        },
        { status: 422, headers: corsHeaders },
      );
    }
    console.error("[api/brief] save failed", err);
    return NextResponse.json(
      { error: "Failed to persist brief." },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date");

  try {
    const brief = date ? await getBrief(date) : await getLatestBrief();
    if (!brief) {
      return NextResponse.json(
        { error: date ? `No brief for ${date}.` : "No briefs yet." },
        { status: 404, headers: corsHeaders },
      );
    }
    return NextResponse.json(
      { brief },
      { status: 200, headers: corsHeaders },
    );
  } catch (err) {
    console.error("[api/brief] load failed", err);
    return NextResponse.json(
      { error: "Failed to load brief." },
      { status: 500, headers: corsHeaders },
    );
  }
}
