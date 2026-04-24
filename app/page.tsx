import { getLatestBrief, listBriefDates } from "@/lib/brief-store";
import { BriefView } from "@/components/dashboard/brief-view";
import { EmptyDashboard } from "@/components/dashboard/empty-dashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [brief, dates] = await Promise.all([getLatestBrief(), listBriefDates()]);

  if (!brief) {
    return <EmptyDashboard />;
  }

  return <BriefView brief={brief} availableDates={dates} />;
}
