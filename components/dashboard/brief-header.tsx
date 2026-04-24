import { Clock, Sunrise } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function formatFullDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatGeneratedAt(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });
}

export function BriefHeader({
  date,
  generatedAt,
  availableDates,
  summary,
}: {
  date: string;
  generatedAt?: string;
  availableDates: string[];
  summary?: string;
}) {
  const generated = formatGeneratedAt(generatedAt);
  const otherDates = availableDates.filter((d) => d !== date).slice(0, 6);

  return (
    <header className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[var(--color-accent-strong)]">
            <Sunrise className="h-4 w-4" strokeWidth={2} />
            <span className="text-xs font-medium uppercase tracking-[0.18em]">
              Daily Brief
            </span>
          </div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl">
            {formatFullDate(date)}
          </h1>
          {generated ? (
            <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-subtle)]">
              <Clock className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="font-mono">Generated {generated}</span>
            </p>
          ) : null}
        </div>

        {otherDates.length > 0 ? (
          <nav aria-label="Archive" className="flex flex-wrap items-center gap-1.5">
            <span className="pr-1 text-[11px] uppercase tracking-wider text-[var(--color-text-subtle)]">
              Archive
            </span>
            {otherDates.map((d) => (
              <a
                key={d}
                href={`/briefs/${d}`}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
              >
                {d.slice(5)}
              </a>
            ))}
          </nav>
        ) : null}
      </div>

      {summary ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-accent-soft)] to-transparent p-5">
          <Badge tone="accent" className="mb-2">TL;DR</Badge>
          <p className="max-w-3xl text-base leading-relaxed text-[var(--color-text)]">
            {summary}
          </p>
        </div>
      ) : null}
    </header>
  );
}
