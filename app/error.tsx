"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-rose-400">
        Something went wrong
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
        Couldn&apos;t load the brief.
      </h1>
      <p className="max-w-[48ch] text-sm text-[var(--color-text-muted)]">
        {error.message || "The data on disk may be malformed. Try again."}
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-sm text-[var(--color-text)] transition-colors hover:border-[var(--color-border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
      >
        Try again
      </button>
    </main>
  );
}
