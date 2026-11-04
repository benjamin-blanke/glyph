import type { VercelRequest, VercelResponse } from "@vercel/node";
import { renderBadge } from "../lib/render";
import { setSvgHeaders } from "../lib/headers";

type Json = Record<string, unknown> | unknown[];

const STATES = {
  operational: ["Operational", "16A34A", "check"],
  degraded: ["Degraded", "F59E0B", "status"],
  down: ["Down", "DC2626", "status"],
  maintenance: ["Maintenance", "7C3AED", "status"],
  incident: ["Incident", "EA580C", "status"],
  investigating: ["Investigating", "F59E0B", "status"],
  monitoring: ["Monitoring", "2563EB", "status"],
  resolved: ["Resolved", "16A34A", "check"],
} as const;

const stateAliases: Record<string, keyof typeof STATES> = {
  up: "operational",
  healthy: "operational",
  ok: "operational",
  operational: "operational",
  degraded: "degraded",
  warning: "degraded",
  partial_outage: "degraded",
  down: "down",
  outage: "down",
  major_outage: "down",
  maintenance: "maintenance",
  incident: "incident",
  investigating: "investigating",
  monitoring: "monitoring",
  resolved: "resolved",
};

function firstUrl(query: VercelRequest["query"]): string {
  for (const [key, value] of Object.entries(query || {})) {
    const candidate = Array.isArray(value) ? value[0] : value;
    if (key === "url" || key === "statusPageUrl" || key === "page") {
      return typeof candidate === "string" ? candidate : "";
    }
    if (/^https?:\/\//i.test(key)) return key;
  }
  return "";
}

function stateFromJson(value: unknown): keyof typeof STATES | undefined {
  if (!value || typeof value !== "object") return undefined;
  if (Array.isArray(value)) {
    for (const item of value) {
      const state = stateFromJson(item);
      if (state) return state;
    }
    return undefined;
  }
  const record = value as Record<string, unknown>;
  for (const key of ["status", "indicator", "overall_status", "overallStatus"]) {
    const raw = record[key];
    if (typeof raw === "string") {
      const normalized = raw.toLowerCase().replace(/[\s-]+/g, "_");
      if (stateAliases[normalized]) return stateAliases[normalized];
    }
  }
  for (const nested of Object.values(record)) {
    const state = stateFromJson(nested);
    if (state) return state;
  }
  return undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).send("Method not allowed");
  }

  const rawUrl = firstUrl(req.query);
  let pageUrl: URL;
  try {
    pageUrl = new URL(rawUrl);
    if (pageUrl.protocol !== "https:") throw new Error("HTTPS required");
  } catch {
    return res.status(400).send("Provide a public HTTPS Livck status page URL");
  }

  const endpoints = [
    new URL("/api/v3/summary", pageUrl),
    new URL("/api/v3/status", pageUrl),
    new URL("/api/v3/categories", pageUrl),
  ];
  let detected: keyof typeof STATES | undefined;
  let lastError = "No supported public status response";

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json", "User-Agent": "glyph-livck-beta" },
      });
      if (!response.ok) {
        lastError = `Livck returned ${response.status}`;
        continue;
      }
      const data = (await response.json()) as Json;
      detected = stateFromJson(data);
      if (detected) break;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Livck request failed";
    }
  }

  if (!detected) return res.status(502).send(lastError);

  const [message, color, logo] = STATES[detected];
  const svg = renderBadge({
    label: "Livck Beta",
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
