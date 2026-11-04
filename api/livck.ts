import type { VercelRequest, VercelResponse } from "@vercel/node";
import { renderBadge } from "../lib/render";
import { setSvgHeaders } from "../lib/headers";

const states = {
  up: ["Operational", "16A34A", "check"],
  operational: ["Operational", "16A34A", "check"],
  healthy: ["Operational", "16A34A", "check"],
  ok: ["Operational", "16A34A", "check"],
  degraded: ["Degraded", "F59E0B", "status"],
  warning: ["Degraded", "F59E0B", "status"],
  down: ["Down", "DC2626", "status"],
  outage: ["Down", "DC2626", "status"],
  maintenance: ["Maintenance", "7C3AED", "status"],
  incident: ["Incident", "EA580C", "status"],
  investigating: ["Investigating", "F59E0B", "status"],
  monitoring: ["Monitoring", "2563EB", "status"],
  resolved: ["Resolved", "16A34A", "check"],
} as const;

type State = keyof typeof states;

function queryValue(value: unknown): string {
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : "";
  return typeof value === "string" ? value : "";
}

function findState(value: unknown): State | undefined {
  if (!value || typeof value !== "object") return undefined;
  if (Array.isArray(value)) {
    for (const item of value) {
      const state = findState(item);
      if (state) return state;
    }
    return undefined;
  }
  const record = value as Record<string, unknown>;
  for (const [key, nested] of Object.entries(record)) {
    if (
      ["status", "indicator", "overall_status", "overallStatus"].includes(key) &&
      typeof nested === "string"
    ) {
      const state = nested.toLowerCase().replace(/[\s-]+/g, "_") as State;
      if (state in states) return state;
    }
    const state = findState(nested);
    if (state) return state;
  }
  return undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).send("Method not allowed");
  }

  const rawUrl =
    queryValue(req.query?.url) ||
    queryValue(req.query?.statusPageUrl) ||
    Object.keys(req.query || {}).find((key) => /^https?:\/\//i.test(key)) ||
    "";

  let pageUrl: URL;
  try {
    pageUrl = new URL(rawUrl);
    if (pageUrl.protocol !== "https:") throw new Error("HTTPS required");
  } catch {
    return res.status(400).send("Use ?url=https://your-livck-status-page.example");
  }

  let detected: State | undefined;
  for (const path of ["/api/v3/summary", "/api/v3/status", "/api/v3/categories"]) {
    try {
      const response = await fetch(new URL(path, pageUrl), {
        headers: { Accept: "application/json", "User-Agent": "glyph-livck-beta" },
      });
      if (!response.ok) continue;
      detected = findState(await response.json());
      if (detected) break;
    } catch {
      // Try the next public Livck endpoint.
    }
  }

  if (!detected) return res.status(502).send("Could not read Livck status");

  const [message, color, logo] = states[detected];
  const svg = renderBadge({
    label: "Livck",
    message,
    color,
    labelColor: "23272A",
    logo,
    style: "flat",
  });
  setSvgHeaders(res);
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (req.method === "HEAD") return res.status(200).end();
  return res.status(200).send(svg);
}
