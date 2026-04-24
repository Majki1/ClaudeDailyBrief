import { Sunrise } from "lucide-react";

export function EmptyDashboard() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[760px] flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:px-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]">
        <Sunrise className="h-5 w-5" strokeWidth={2.25} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
          Daily Brief
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl">
          Waiting for your first brief.
        </h1>
        <p className="mx-auto mt-3 max-w-[52ch] text-sm leading-relaxed text-[var(--color-text-muted)]">
          Once the Claude Co-Work scheduled task runs and posts a brief to{" "}
          <code className="rounded bg-[var(--color-surface-muted)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-text)]">
            POST /api/brief
          </code>
          , it will render here.
        </p>
      </div>

      <section className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
          Endpoints
        </p>
        <ul className="mt-3 flex flex-col gap-2 font-mono text-xs text-[var(--color-text-muted)]">
          <li>
            <span className="mr-2 inline-block rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
              POST
            </span>
            /api/brief
            <span className="ml-2 text-[var(--color-text-subtle)]">
              — ingest a brief JSON
            </span>
          </li>
          <li>
            <span className="mr-2 inline-block rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-sky-300">
              GET
            </span>
            /api/brief?date=YYYY-MM-DD
            <span className="ml-2 text-[var(--color-text-subtle)]">
              — fetch a specific day
            </span>
          </li>
          <li>
            <span className="mr-2 inline-block rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-sky-300">
              GET
            </span>
            /api/news-context?days=7
            <span className="ml-2 text-[var(--color-text-subtle)]">
              — fetch recent news (dedup context for Claude)
            </span>
          </li>
        </ul>
      </section>
    </main>
  );
}
