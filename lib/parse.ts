import type { VercelRequest } from "@vercel/node";
import type { BadgeRequest } from "./types";
import { normalizeColor } from "./colors";
import { safeLogo, safeStyle, safeText } from "./validate";
function first(value: unknown): string | undefined {
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : undefined;
  return typeof value === "string" ? value : undefined;
}
export function parseBadgeRequest(req: VercelRequest): BadgeRequest {
  const q = req.query || {};
  const rawPath = first(q.badge) || first(q.path) || "";
  const parts = rawPath.replace(/\.svg$/i, "").split("-");
  const pathLabel = parts.shift();
  const pathColor = parts.length ? parts.pop() : undefined;
  const pathMessage = parts.join("-").replace(/-/g, " ");
  return {
    label: safeText(first(q.label) || pathLabel, "Discord", 32),
    message: safeText(first(q.text) || first(q.message) || pathMessage, "Join the community", 80),
    color: normalizeColor(first(q.color) || pathColor || "5865F2", "5865F2"),
    labelColor: normalizeColor(first(q.labelColor) || "23272A", "23272A"),
    logo: safeLogo(first(q.logo) || "discord"),
    style: safeStyle(first(q.style))
  };
}
