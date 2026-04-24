# Claude Daily Brief

A local Next.js 16 dashboard that receives a JSON payload from a Claude
Co-Work scheduled task each morning and renders it as a dashboard.

Categories:

- **Calendar** · today's Google Calendar events
- **Sprint tasks** · active-sprint tasks from the Notion Projects dashboard
- **Posts to publish** · posts queued in the community database
- **Weather** · Rijeka, Croatia
- **News** · Claude · Expo · React Native · Swift · SwiftUI

News already sent in the last 7 days is served back to the brief generator
via `GET /api/news-context` so stories don't repeat day-to-day.

---

## Stack

- Next.js 16 (App Router, Turbopack, typed routes)
- React 19
- Tailwind CSS v4 (CSS-first `@theme`)
- Zod for strict payload validation
- Lucide icons, Geist fonts
- Persistence: local filesystem in dev, [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) in production — no database

---

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

On first load with no briefs you'll see an empty-state page with endpoint
documentation. POST a brief (see below) to render the dashboard.

### Try it with the sample

```bash
curl -X POST http://localhost:3000/api/brief \
  -H "content-type: application/json" \
  --data @samples/brief.example.json
```

Then open <http://localhost:3000>.

---

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/brief` | Ingest today's brief (Zod-validated). Returns `422` with `issues[]` if malformed. |
| `GET`  | `/api/brief` | Returns the latest brief. |
| `GET`  | `/api/brief?date=YYYY-MM-DD` | Returns a specific day. |
| `GET`  | `/api/news-context?days=7&before=YYYY-MM-DD` | Returns past news items so the generator can avoid repeating stories. |

---

## Routes

| Path | What |
|------|------|
| `/` | Latest brief (or empty state). |
| `/briefs/YYYY-MM-DD` | A specific day from the archive. |

---

## MCP Server (for Cowork)

Cowork's sandbox blocks outbound HTTP. The included MCP server
(`mcp/daily-brief-server.js`) runs outside the sandbox and proxies
`post_brief` / `get_news_context` tool calls to the dashboard API.

See [`mcp/README.md`](./mcp/README.md) for setup instructions.

## Co-Work prompt

See [`PROMPT.md`](./PROMPT.md) for the tuned prompt to paste into the
scheduled task. It uses the MCP tools instead of direct HTTP calls.

---

## Personalising

This project is built as a personal daily brief — fork it and make it yours.
Here's what to change:

### 1. Weather location

In [`PROMPT.md`](./PROMPT.md), replace every mention of **Rijeka, Croatia**
with your city. Also update the default in
[`lib/brief-schema.ts`](./lib/brief-schema.ts):

```ts
// lib/brief-schema.ts — line ~89
location: z.string().default("Your City, Country"),
```

### 2. News topics

Edit the `NewsTopicEnum` in [`lib/brief-schema.ts`](./lib/brief-schema.ts)
to list the topics you care about:

```ts
export const NewsTopicEnum = z.enum([
  "Your Topic 1",
  "Your Topic 2",
  "Your Topic 3",
  // ...
]);
```

Then update the matching section in [`PROMPT.md`](./PROMPT.md) (Step 3,
item 5) so the Co-Work prompt knows what to research and which exact
`topic` strings to use.

### 3. Timezone

The prompt uses `Europe/Zagreb`. Search [`PROMPT.md`](./PROMPT.md) for
`Europe/Zagreb` and replace with your
[IANA timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

### 4. Calendar & task sources

The prompt reads from Google Calendar and a specific Notion dashboard. In
[`PROMPT.md`](./PROMPT.md):

- **Calendar** — if you don't use Google Calendar, rewrite Step 3 item 1 to
  describe your calendar source (or remove the section entirely).
- **Sprint tasks** — replace the Notion URL in Step 3 item 2 with your own
  project tracker, or remove it.
- **Posts to publish** — replace or remove the Notion URL in Step 3 item 3.

### 5. Dashboard URL

The MCP server defaults to `https://claude-daily-brief.vercel.app`. After
deploying your fork, update the `DAILY_BRIEF_URL` in your Claude Desktop
config (see [`mcp/README.md`](./mcp/README.md)).

### 6. Sections you don't need

Every section (calendar, tasks, posts, weather, news) is optional in the
schema — the brief validates as long as `date` is present. To drop a
section:

1. Remove it from the prompt in [`PROMPT.md`](./PROMPT.md)
2. Optionally hide its card in the dashboard UI (the component already
   handles empty arrays gracefully)

---

## Data model

See [`lib/brief-schema.ts`](./lib/brief-schema.ts) for the authoritative
Zod schema. Every POST is validated against it.

Locally, persistence lives in `data/briefs/` (gitignored). On Vercel, briefs
are stored in [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
(selected automatically when `BLOB_READ_WRITE_TOKEN` is set). To nuke a bad
entry locally: delete `data/briefs/YYYY-MM-DD.json`.
