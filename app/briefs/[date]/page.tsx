import { notFound } from "next/navigation";
import { getBrief, listBriefDates } from "@/lib/brief-store";
import { BriefView } from "@/components/dashboard/brief-view";

export const dynamic = "force-dynamic";

export default async function BriefByDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound();
  }

  const [brief, dates] = await Promise.all([getBrief(date), listBriefDates()]);

  if (!brief) {
    notFound();
  }

  return <BriefView brief={brief} availableDates={dates} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  return {
    title: `Daily Brief · ${date}`,
  };
}
