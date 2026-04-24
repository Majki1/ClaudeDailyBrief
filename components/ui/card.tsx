import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export function Card({
  icon: Icon,
  title,
  subtitle,
  meta,
  action,
  className,
  contentClassName,
  children,
}: CardProps) {
  return (
    <section
      className={cn(
        "relative flex flex-col rounded-2xl border border-[var(--color-border)]",
        "bg-[var(--color-surface-raised)]/80 backdrop-blur-sm",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_24px_48px_-24px_rgba(0,0,0,0.6)]",
        "overflow-hidden",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4 border-b border-[var(--color-border)]/80 px-5 py-4">
        <div className="flex items-start gap-3 min-w-0">
          {Icon ? (
            <span
              aria-hidden
              className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]"
            >
              <Icon className="h-4 w-4" strokeWidth={2.25} />
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text)]">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-0.5 text-sm text-[var(--color-text-muted)] truncate">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs text-[var(--color-text-subtle)]">
          {meta}
          {action}
        </div>
      </header>
      <div className={cn("flex-1 px-5 py-4", contentClassName)}>{children}</div>
    </section>
  );
}
