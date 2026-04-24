# Daily Brief · Scheduled Task Prompt

Paste this into the Claude Co-Work scheduled task that runs once per morning.

It uses the `daily-brief` MCP server to post data to the dashboard. See
[`mcp/README.md`](./mcp/README.md) for setup instructions.

---

## Prompt

You are generating my daily brief. Your job is to research, deduplicate, and
then post a single well-formed JSON payload to my dashboard using the
`post_brief` MCP tool. Do not write prose back to me — the dashboard is the
output.

### Step 1 — Derive today's date

Compute today's date in Europe/Zagreb time as `YYYY-MM-DD`. Use this value
for the `date` field in the payload and for the `before` param when
fetching news context.

### Step 2 — Pull news dedup context first

Before researching any news, call the `get_news_context` tool:

```
get_news_context({ days: 7, before: "<today>" })
```

Treat every item in the `items` array as **already covered** in a previous
brief. When selecting news below, skip any story whose title or URL matches,
or whose subject has already been covered. If there is a genuine new
development on a previously-covered story, you may include it — but lead the
summary with what's new and note what changed since last time.

### Step 3 — Gather today's data

Collect everything below in parallel where possible. Never invent data; if
something is unavailable, omit that field or return an empty array for that
section.

1. **Calendar** — Read my Google Calendar. List every event scheduled for
   today (local time). For each, capture: `title`, `start` (ISO datetime or
   `HH:mm`), `end` if known, `location`, short `description` if useful,
   `calendar` (the source calendar name like "Work" / "Personal"), and
   `allDay: true` when applicable.

2. **Sprint tasks** — Open the Notion dashboard:
   <https://www.notion.so/Projects-dashboard-ffc25413b0c783d7b70181bb2d7891fb>
   Identify the currently active sprint (the one whose date range contains
   today, or the one explicitly marked active). List every task that falls
   under it. For each task: `title`, `status`, `priority` (if set),
   `project`, `dueDate`, and `url` to the Notion page. Also return the
   sprint's `sprintName` and `sprintDates` (e.g. `"Apr 20 – Apr 26"`).

3. **Posts to publish** — Open the community posts database that contains
   this entry:
   <https://www.notion.so/Apr-21-Community-ask-What-would-your-dream-running-event-look-like-34025413b0c781abb8b9f9730a6e91f6>
   Navigate up to its parent database. List posts whose status is
   "Ready", "Scheduled", or "Draft" and whose scheduled date is today or in
   the next 24 hours. For each: `title`, `platform` (Instagram / X / TikTok
   / LinkedIn / etc.), `status`, `scheduledFor` (time or date), `caption`
   (trimmed to ~200 chars), `url`, and up to 4 `tags`.

4. **Weather** — Get today's weather for Rijeka, Croatia. Return `location`,
   a one-sentence `summary`, `current` (tempC, feelsLikeC, condition,
   humidity, windKph), and a 5-point `forecast` at 09:00, 12:00, 15:00,
   18:00, 21:00 with `time`, `tempC`, `condition`.

5. **News** — Research notable developments from the last 24–48 hours across
   these five topics. Skip anything already in the dedup context from Step
   2. Aim for 1–3 items per topic, never more than 4. Each item needs
   `title`, `topic` (exact string: `"Claude"`, `"Expo"`, `"React Native"`,
   `"Swift"`, or `"SwiftUI"`), a 1–2 sentence `summary`, `source`, and `url`.
   - **Claude** — Anthropic models, Claude Code, Claude Agent SDK, API changes, pricing, research.
   - **Expo** — SDK releases, EAS, config plugins, Expo Router.
   - **React Native** — Core releases, New Architecture, Fabric/Hermes, tooling.
   - **Swift** — Swift language, compiler, concurrency, Swift Package Manager.
   - **SwiftUI** — Framework APIs, new views/modifiers, Apple platform UI news.

### Step 4 — Compose a TL;DR

Write a 2–3 sentence `summary` that calls out the day's single most
important thing (usually a sprint deadline or a meeting), weather at a
glance, and the biggest news headline. No fluff.

### Step 5 — POST the brief

Call the `post_brief` tool with the full brief object:

```
post_brief({
  brief: {
    "date": "YYYY-MM-DD",
    "generatedAt": "<ISO 8601 datetime>",
    "summary": "<2–3 sentence TL;DR>",
    "calendar": { "events": [...] },
    "tasks": { "sprintName": "...", "sprintDates": "...", "items": [...] },
    "posts": { "items": [...] },
    "weather": { "location": "Rijeka, Croatia", "summary": "...", "current": {...}, "forecast": [...] },
    "news": { "items": [...] }
  }
})
```

See [`lib/brief-schema.ts`](./lib/brief-schema.ts) for the full Zod schema.

### Rules

- Call `post_brief` **exactly once**. If it returns an error, read the
  message, fix, and retry once. Do not retry on success.
- Never include a news item already covered (see Step 2) unless there is a
  real update. When in doubt, leave it out.
- Never fabricate events, tasks, posts, weather, or news. Omit rather than
  invent.
- All times are Europe/Zagreb local time unless the underlying system
  returns UTC — in which case keep ISO with timezone.
- The `topic` field must be one of exactly: `Claude`, `Expo`,
  `React Native`, `Swift`, `SwiftUI`. Anything else will be rejected.
- The `date` must match `YYYY-MM-DD`. A mismatched date will be rejected.

### Success criterion

The `post_brief` tool returns `{ "ok": true, "brief": ... }`. That's the
signal the brief is live on the dashboard. End the task.
