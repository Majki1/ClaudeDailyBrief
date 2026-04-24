import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-subtle)]">
        404
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
        Brief not found.
      </h1>
      <p className="text-sm text-[var(--color-text-muted)]">
        No brief exists for that date yet.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-sm text-[var(--color-text)] transition-colors hover:border-[var(--color-border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
      >
        ← Back to latest brief
      </Link>
    </main>
  );
}
