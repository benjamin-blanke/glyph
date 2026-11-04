import { escapeXml } from "./escape";
import { textWidth } from "./geometry";

export function renderErrorBadge(message = "Rendering failed"): string {
  const label = "⚠️ Glyph";
  const safeMessage = message.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 80) || "Rendering failed";
  const leftWidth = textWidth(label, 11, 10) + 22;
  const rightWidth = textWidth(safeMessage, 11, 11);
  const width = leftWidth + rightWidth;
  const messageX = leftWidth + rightWidth / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="28" viewBox="0 0 ${width} 28" role="img" aria-label="${escapeXml(`${label} ${safeMessage}`)}"><title>${escapeXml(`${label} ${safeMessage}`)}</title><rect width="${width}" height="28" rx="4" fill="#DC2626"/><g fill="#fff" font-family="Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif" font-size="11" font-weight="600" text-anchor="middle"><text x="${leftWidth / 2}" y="18.5">${escapeXml(label)}</text><text x="${messageX}" y="18.5">${escapeXml(safeMessage)}</text></g></svg>`;
}
