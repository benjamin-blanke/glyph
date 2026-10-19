import type { BadgeStyle } from "./types";
const STYLES = new Set(["flat", "flat-square", "rounded"]);
export function safeText(value: unknown, fallback: string, max = 80): string {
  if (typeof value !== "string") return fallback;
  return value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max) || fallback;
}
export function safeStyle(value: unknown): BadgeStyle {
  const style = typeof value === "string" ? value : "flat";
  return STYLES.has(style) ? style as BadgeStyle : "flat";
}
export function safeLogo(value: string): string { return /^[a-z0-9-]{1,32}$/i.test(value) ? value.toLowerCase() : "discord"; }
