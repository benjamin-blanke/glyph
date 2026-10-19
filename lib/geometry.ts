export function textWidth(value: string, fontSize = 11, padding = 10): number {
  return Math.max(28, Math.ceil(value.length * fontSize * 0.62 + padding * 2));
}
export function cornerRadius(style: string): number {
  if (style === "flat-square") return 0;
  if (style === "rounded") return 8;
  return 4;
}
