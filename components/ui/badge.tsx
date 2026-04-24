import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeTone =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

const toneClasses: Record<BadgeTone, string> = {
  neutral:
    "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] border-[var(--color-border)]",
  accent:
    "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)] border-[color-mix(in_oklab,var(--color-accent)_35%,transparent)]",
  success:
    "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  warning:
    "bg-amber-500/10 text-amber-300 border-amber-500/20",
  danger:
    "bg-rose-500/10 text-rose-300 border-rose-500/25",
  info:
    "bg-sky-500/10 text-sky-300 border-sky-500/20",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  style,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={style}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4 tracking-wide",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
