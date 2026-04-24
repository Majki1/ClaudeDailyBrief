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
- File-backed persistence at `data/briefs/YYYY-MM-DD.json` — no database

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

## Co-Work prompt

See [`PROMPT.md`](./PROMPT.md) for the tuned prompt to paste into the
scheduled task.

---

## Data model

See [`lib/brief-schema.ts`](./lib/brief-schema.ts) for the authoritative
Zod schema. Every POST is validated against it.

Persistence lives in `data/briefs/` (gitignored). Each day is one file. To
nuke a bad entry: delete `data/briefs/YYYY-MM-DD.json`.
