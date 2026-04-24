import { ExternalLink, Newspaper } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { NewsItem, NewsTopic } from "@/lib/brief-schema";

const TOPIC_ORDER: NewsTopic[] = [
  "Claude",
  "Expo",
  "React Native",
  "Swift",
  "SwiftUI",
  "Other",
];

const TOPIC_COLOR: Record<NewsTopic, string> = {
  Claude: "var(--color-topic-claude)",
  Expo: "var(--color-topic-expo)",
  "React Native": "var(--color-topic-react-native)",
  Swift: "var(--color-topic-swift)",
  SwiftUI: "var(--color-topic-swiftui)",
  Other: "var(--color-topic-other)",
};

function groupByTopic(items: NewsItem[]): Array<{ topic: NewsTopic; items: NewsItem[] }> {
  const buckets = new Map<NewsTopic, NewsItem[]>();
  for (const item of items) {
    const list = buckets.get(item.topic) ?? [];
    list.push(item);
    buckets.set(item.topic, list);
  }
  return TOPIC_ORDER.filter((t) => buckets.has(t)).map((topic) => ({
    topic,
    items: buckets.get(topic)!,
  }));
}

export function NewsCard({ items }: { items: NewsItem[] }) {
  const groups = groupByTopic(items);

  return (
    <Card
      icon={Newspaper}
      title="News"
      subtitle="Claude · Expo · React Native · Swift · SwiftUI"
      meta={
        <span className="font-mono">
          {items.length} {items.length === 1 ? "story" : "stories"}
        </span>
      }
      className="md:col-span-12 lg:col-span-12"
      contentClassName="px-0 py-0"
    >
      {items.length === 0 ? (
        <div className="px-5 py-6">
          <EmptyState
            icon={Newspaper}
            title="No news today"
            description="Either nothing notable happened, or all stories were already covered in previous briefs."
          />
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border)]/70">
          {groups.map(({ topic, items }) => (
            <section key={topic} className="px-5 py-4">
              <div className="mb-3 flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{ background: TOPIC_COLOR[topic] }}
                />
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text)]">
                  {topic}
                </h3>
                <span className="font-mono text-[11px] text-[var(--color-text-subtle)]">
                  {items.length}
                </span>
              </div>
              <ul className="grid gap-3 md:grid-cols-2">
                {items.map((item, i) => (
                  <li
                    key={`${item.title}-${i}`}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-start gap-1.5 text-sm font-medium leading-snug text-[var(--color-text)] hover:text-[var(--color-accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] rounded"
                        >
                          <span>{item.title}</span>
                          <ExternalLink
                            className="mt-0.5 h-3 w-3 flex-none text-[var(--color-text-subtle)]"
                            strokeWidth={2}
                          />
                        </a>
                      ) : (
                        <p className="text-sm font-medium leading-snug text-[var(--color-text)]">
                          {item.title}
                        </p>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {item.summary}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-text-subtle)]">
                      {item.source ? (
                        <Badge tone="neutral">{item.source}</Badge>
                      ) : null}
                      {item.publishedAt ? (
                        <span className="font-mono">{item.publishedAt}</span>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Card>
  );
}
