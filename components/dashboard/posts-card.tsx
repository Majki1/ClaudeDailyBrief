import { ExternalLink, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { SocialPost } from "@/lib/brief-schema";

function platformTone(
  platform?: string,
): "neutral" | "accent" | "success" | "info" | "warning" {
  if (!platform) return "neutral";
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return "warning";
  if (p.includes("tiktok")) return "accent";
  if (p.includes("linkedin")) return "info";
  if (p.includes("x") || p.includes("twitter")) return "neutral";
  if (p.includes("youtube")) return "warning";
  if (p.includes("thread")) return "neutral";
  return "accent";
}

export function PostsCard({ posts }: { posts: SocialPost[] }) {
  return (
    <Card
      icon={Send}
      title="Posts to publish"
      subtitle="Community calendar"
      meta={
        <span className="font-mono">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </span>
      }
      className="md:col-span-5 lg:col-span-5"
    >
      {posts.length === 0 ? (
        <EmptyState
          icon={Send}
          title="Nothing scheduled"
          description="No posts lined up from the community database."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {posts.map((post, i) => (
            <li
              key={`${post.title}-${i}`}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  {post.url ? (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] rounded"
                    >
                      <span className="line-clamp-2">{post.title}</span>
                      <ExternalLink
                        className="h-3 w-3 flex-none text-[var(--color-text-subtle)]"
                        strokeWidth={2}
                      />
                    </a>
                  ) : (
                    <p className="line-clamp-2 text-sm font-medium text-[var(--color-text)]">
                      {post.title}
                    </p>
                  )}
                </div>
                {post.platform ? (
                  <Badge tone={platformTone(post.platform)}>{post.platform}</Badge>
                ) : null}
              </div>

              {post.caption ? (
                <p className="mt-1.5 line-clamp-3 text-xs text-[var(--color-text-muted)]">
                  {post.caption}
                </p>
              ) : null}

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {post.status ? <Badge tone="neutral">{post.status}</Badge> : null}
                {post.scheduledFor ? (
                  <span className="font-mono text-[11px] text-[var(--color-text-subtle)]">
                    {post.scheduledFor}
                  </span>
                ) : null}
                {post.tags?.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-text-subtle)]"
                  >
                    #{t.replace(/^#/, "")}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
