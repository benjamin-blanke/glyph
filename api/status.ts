import type { VercelRequest, VercelResponse } from "@vercel/node";
import { renderBadge } from "../lib/render";
import { setSvgHeaders } from "../lib/headers";

const STATES = {
  operational: ["Operational", "16A34A", "check"],
  degraded: ["Degraded", "F59E0B", "status"],
  down: ["Down", "DC2626", "status"],
  maintenance: ["Maintenance", "7C3AED", "status"],
  incident: ["Incident", "EA580C", "status"],
  investigating: ["Investigating", "F59E0B", "status"],
  monitoring: ["Monitoring", "2563EB", "status"],
  resolved: ["Resolved", "16A34A", "check"],
  scheduled: ["Scheduled maintenance", "7C3AED", "status"],
  online: ["Online", "16A34A", "check"],
  offline: ["Offline", "DC2626", "status"],
} as const;

function queryValue(value: unknown): string {
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : "";
  return typeof value === "string" ? value : "";
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).send("Method not allowed");
  }

  const query = req.query || {};
  const explicit = queryValue(query.status || query.state).toLowerCase();
  const shorthand = Object.keys(query).find((key) => key.toLowerCase() in STATES) || "operational";
  const state = explicit || shorthand;
  const preset = STATES[state as keyof typeof STATES];

  if (!preset) {
    return res.status(400).send(`Unknown status. Use: ${Object.keys(STATES).join(", ")}`);
  }

  const [message, color, logo] = preset;
  const svg = renderBadge({
    label: "Status",
    message,
    color,
    labelColor: "23272A",
    logo,
    style: "flat",
  });
  setSvgHeaders(res);
  if (req.method === "HEAD") return res.status(200).end();
  return res.status(200).send(svg);
}
