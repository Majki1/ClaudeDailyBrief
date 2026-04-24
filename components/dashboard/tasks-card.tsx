import { CheckSquare, ExternalLink, Flag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { Brief, SprintTask } from "@/lib/brief-schema";

type TasksBlock = Brief["tasks"];

function statusTone(status?: string): "neutral" | "success" | "warning" | "info" | "danger" {
  if (!status) return "neutral";
  const s = status.toLowerCase();
  if (s.includes("done") || s.includes("complete")) return "success";
  if (s.includes("progress") || s.includes("doing")) return "info";
  if (s.includes("block") || s.includes("overdue")) return "danger";
  if (s.includes("review") || s.includes("wait")) return "warning";
  return "neutral";
}

function priorityTone(p?: string): "neutral" | "danger" | "warning" | "info" {
  if (!p) return "neutral";
  const v = p.toLowerCase();
  if (v.includes("high") || v.includes("p0") || v.includes("p1") || v.includes("urgent"))
    return "danger";
  if (v.includes("medium") || v.includes("p2")) return "warning";
  if (v.includes("low") || v.includes("p3") || v.includes("p4")) return "info";
  return "neutral";
}

export function TasksCard({ tasks }: { tasks: TasksBlock }) {
  const items: SprintTask[] = tasks.items;

  return (
    <Card
      icon={CheckSquare}
      title="Sprint Tasks"
      subtitle={tasks.sprintName ?? "Active sprint"}
      meta={
        <div className="flex items-center gap-2">
          {tasks.sprintDates ? (
            <span className="font-mono">{tasks.sprintDates}</span>
          ) : null}
          <span className="font-mono">
            {items.length} {items.length === 1 ? "task" : "tasks"}
          </span>
        </div>
      }
      className="md:col-span-7 lg:col-span-7"
    >
      {items.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No sprint tasks"
          description="No tasks found in the active sprint."
        />
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.map((task, i) => (
            <li
              key={`${task.title}-${i}`}
              className="group flex items-start justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--color-surface-muted)]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {task.url ? (
                    <a
                      href={task.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] rounded"
                    >
                      <span>{task.title}</span>
                      <ExternalLink
                        className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                        strokeWidth={2}
                      />
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {task.title}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {task.status ? (
                    <Badge tone={statusTone(task.status)}>{task.status}</Badge>
                  ) : null}
                  {task.priority ? (
                    <Badge tone={priorityTone(task.priority)}>
                      <Flag className="h-3 w-3" strokeWidth={2} />
                      {task.priority}
                    </Badge>
                  ) : null}
                  {task.project ? <Badge tone="neutral">{task.project}</Badge> : null}
                  {task.dueDate ? (
                    <span className="font-mono text-[11px] text-[var(--color-text-subtle)]">
                      due {task.dueDate}
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
