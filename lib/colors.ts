const HEX = /^[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;
export function normalizeColor(value: string, fallback: string): string {
  const cleaned = value.trim().replace(/^#/, "");
  if (!HEX.test(cleaned)) return fallback;
  return cleaned.length === 3 ? cleaned.split("").map(c => c + c).join("").toUpperCase() : cleaned.toUpperCase();
}
