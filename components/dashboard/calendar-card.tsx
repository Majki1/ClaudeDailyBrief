import { CalendarDays, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { CalendarEvent } from "@/lib/brief-schema";

function formatTime(value: string, allDay?: boolean) {
  if (allDay) return "All day";
  if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function CalendarCard({ events }: { events: CalendarEvent[] }) {
  return (
    <Card
      icon={CalendarDays}
      title="Calendar"
      subtitle="Today's events"
      meta={
        <span className="font-mono">
          {events.length} {events.length === 1 ? "event" : "events"}
        </span>
      }
      className="md:col-span-7 lg:col-span-8"
    >
      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Clear day ahead"
          description="No events pulled from your calendar for today."
        />
      ) : (
        <ol className="flex flex-col divide-y divide-[var(--color-border)]/70">
          {events.map((event, i) => (
            <li
              key={`${event.title}-${i}`}
              className="grid grid-cols-[auto_1fr] items-start gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex flex-col items-end pt-0.5">
                <span className="font-mono text-sm text-[var(--color-text)]">
                  {formatTime(event.start, event.allDay)}
                </span>
                {event.end && !event.allDay ? (
                  <span className="font-mono text-[11px] text-[var(--color-text-subtle)]">
                    → {formatTime(event.end)}
                  </span>
                ) : null}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium text-[var(--color-text)]">
                    {event.title}
                  </p>
                  {event.calendar ? (
                    <Badge tone="neutral">{event.calendar}</Badge>
                  ) : null}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-text-muted)]">
                  {event.location ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" strokeWidth={2} />
                      {event.location}
                    </span>
                  ) : null}
                  {event.description ? (
                    <span className="line-clamp-2">{event.description}</span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
