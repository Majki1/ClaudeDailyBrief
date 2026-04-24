import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
      {Icon ? (
        <Icon
          aria-hidden
          className="h-5 w-5 text-[var(--color-text-subtle)]"
          strokeWidth={1.75}
        />
      ) : null}
      <p className="text-sm font-medium text-[var(--color-text)]">{title}</p>
      {description ? (
        <p className="max-w-[28ch] text-xs text-[var(--color-text-muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
