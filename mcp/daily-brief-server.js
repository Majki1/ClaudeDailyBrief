#!/usr/bin/env node

/**
 * MCP server that lets Claude Desktop / Cowork post briefs to the
 * Claude Daily Brief dashboard deployed on Vercel.
 *
 * Runs outside the sandbox so HTTP requests are unrestricted.
 *
 * Tools:
 *   post_brief        – POST a brief JSON to /api/brief
 *   get_news_context  – GET /api/news-context for dedup
 */

const BASE_URL =
  process.env.DAILY_BRIEF_URL || "https://claude-daily-brief.vercel.app";

// ── Helpers ──────────────────────────────────────────────────────────

function jsonRpcResponse(id, result) {
  return JSON.stringify({ jsonrpc: "2.0", id, result });
}

function jsonRpcError(id, code, message) {
  return JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } });
}

async function postBrief(brief) {
  const res = await fetch(`${BASE_URL}/api/brief`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brief),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(
      `POST /api/brief returned ${res.status}: ${JSON.stringify(body)}`
    );
  }
  return body;
}

async function getNewsContext(days, before) {
  const params = new URLSearchParams();
  if (days) params.set("days", String(days));
  if (before) params.set("before", before);
  const url = `${BASE_URL}/api/news-context?${params}`;
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) {
    throw new Error(
      `GET /api/news-context returned ${res.status}: ${JSON.stringify(body)}`
    );
  }
  return body;
}

// ── MCP Protocol ─────────────────────────────────────────────────────

const SERVER_INFO = {
  name: "daily-brief",
  version: "1.0.0",
};

const TOOLS = [
  {
    name: "post_brief",
    description:
      "Post a daily brief to the Claude Daily Brief dashboard. The brief must conform to the BriefSchema (date, calendar, tasks, posts, weather, news).",
    inputSchema: {
      type: "object",
      properties: {
        brief: {
          type: "object",
          description: "The full brief object matching BriefSchema.",
          properties: {
            date: {
              type: "string",
              description: "YYYY-MM-DD format",
            },
          },
          required: ["date"],
        },
      },
      required: ["brief"],
    },
  },
  {
    name: "get_news_context",
    description:
      "Retrieve previously covered news items so you can avoid repeating them in a new brief.",
    inputSchema: {
      type: "object",
      properties: {
        days: {
          type: "number",
          description: "Number of days to look back (1-30, default 7)",
        },
        before: {
          type: "string",
          description: "Only include briefs before this date (YYYY-MM-DD)",
        },
      },
    },
  },
];

async function handleMessage(msg) {
  const { id, method, params } = msg;

  switch (method) {
    case "initialize":
      return jsonRpcResponse(id, {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });

    case "notifications/initialized":
      return null; // no response needed

    case "tools/list":
      return jsonRpcResponse(id, { tools: TOOLS });

    case "tools/call": {
      const toolName = params?.name;
      const args = params?.arguments ?? {};

      try {
        if (toolName === "post_brief") {
          const result = await postBrief(args.brief);
          return jsonRpcResponse(id, {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          });
        }

        if (toolName === "get_news_context") {
          const result = await getNewsContext(args.days, args.before);
          return jsonRpcResponse(id, {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          });
        }

        return jsonRpcError(id, -32601, `Unknown tool: ${toolName}`);
      } catch (err) {
        return jsonRpcResponse(id, {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          isError: true,
        });
      }
    }

    default:
      return jsonRpcError(id, -32601, `Method not found: ${method}`);
  }
}

// ── Stdio transport ──────────────────────────────────────────────────

let buffer = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", async (chunk) => {
  buffer += chunk;

  let newlineIdx;
  while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, newlineIdx).trim();
    buffer = buffer.slice(newlineIdx + 1);
    if (!line) continue;

    try {
      const msg = JSON.parse(line);
      const response = await handleMessage(msg);
      if (response) {
        process.stdout.write(response + "\n");
      }
    } catch (err) {
      process.stderr.write(`Parse error: ${err.message}\n`);
    }
  }
});
