import { BriefHeader } from "./brief-header";
import { CalendarCard } from "./calendar-card";
import { TasksCard } from "./tasks-card";
import { PostsCard } from "./posts-card";
import { WeatherCard } from "./weather-card";
import { NewsCard } from "./news-card";
import type { Brief } from "@/lib/brief-schema";

export function BriefView({
  brief,
  availableDates,
}: {
  brief: Brief;
  availableDates: string[];
}) {
  return (
    <main className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-14">
      <BriefHeader
        date={brief.date}
        generatedAt={brief.generatedAt}
        availableDates={availableDates}
        summary={brief.summary}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <CalendarCard events={brief.calendar.events} />
        <WeatherCard weather={brief.weather} />
        <TasksCard tasks={brief.tasks} />
        <PostsCard posts={brief.posts.items} />
        <NewsCard items={brief.news.items} />
      </div>
    </main>
  );
}
