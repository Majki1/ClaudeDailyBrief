# Daily Brief MCP Server

A lightweight MCP (Model Context Protocol) server that lets Claude Desktop
and Cowork post briefs to the Claude Daily Brief dashboard.

Cowork runs inside a sandbox that blocks outbound HTTP. This MCP server runs
**outside** the sandbox as a local Node process, so it can freely call the
dashboard API on your behalf.

## Prerequisites

- Node.js 18+
- The dashboard deployed (e.g. on Vercel) or running locally

## Setup

### 1. Register the MCP server

Add this to your Claude Desktop config at
`~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "daily-brief": {
      "command": "node",
      "args": ["/absolute/path/to/ClaudeDailyBrief/mcp/daily-brief-server.js"]
    }
  }
}
```

Replace the path with the actual absolute path to `daily-brief-server.js`.

### 2. (Optional) Override the dashboard URL

By default the server posts to `https://claude-daily-brief.vercel.app`. To
use a different URL (e.g. localhost), set the `DAILY_BRIEF_URL` env var:

```json
{
  "mcpServers": {
    "daily-brief": {
      "command": "node",
      "args": ["/absolute/path/to/ClaudeDailyBrief/mcp/daily-brief-server.js"],
      "env": {
        "DAILY_BRIEF_URL": "http://localhost:3000"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

Quit and reopen Claude Desktop so it picks up the new MCP server.

## Tools

### `post_brief`

Posts a daily brief to the dashboard.

**Input:**

```json
{
  "brief": {
    "date": "2026-04-24",
    "summary": "...",
    "calendar": { "events": [] },
    "tasks": { "items": [] },
    "posts": { "items": [] },
    "weather": { ... },
    "news": { "items": [] }
  }
}
```

The brief must conform to the schema defined in
[`lib/brief-schema.ts`](../lib/brief-schema.ts). The server returns the API
response — `{ "ok": true, "brief": ... }` on success, or a validation error
with an `issues` array on `422`.

### `get_news_context`

Fetches previously covered news items so briefs don't repeat stories.

**Input:**

```json
{
  "days": 7,
  "before": "2026-04-24"
}
```

Both parameters are optional. Returns an array of news items from recent
briefs along with dedup instructions.

## Verifying it works

You can test the server directly from a terminal:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
  | node mcp/daily-brief-server.js
```

This should print the JSON-RPC response listing both tools.
