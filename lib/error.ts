import { escapeXml } from "./escape";
import { textWidth } from "./geometry";

export function renderErrorBadge(message = "Rendering failed"): string {
  const label = "Glyph";
  const safeMessage = message.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 80) || "Rendering failed";
  const leftWidth = textWidth(label, 11, 10) + 22;
  const rightWidth = textWidth(safeMessage, 11, 11);
  const width = leftWidth + rightWidth;
  const labelX = leftWidth / 2 + 7;
  const messageX = leftWidth + rightWidth / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="28" viewBox="0 0 ${width} 28" role="img" aria-label="${escapeXml(`${label} ${safeMessage}`)}"><title>${escapeXml(`${label} ${safeMessage}`)}</title><defs><linearGradient id="shine" x2="0" y2="100%"><stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".04"/></linearGradient><clipPath id="clip"><rect width="${width}" height="28" rx="4"/></clipPath></defs><g clip-path="url(#clip)"><rect width="${leftWidth}" height="28" fill="#991B1B"/><rect x="${leftWidth}" width="${rightWidth}" height="28" fill="#DC2626"/><rect width="${width}" height="28" fill="url(#shine)"/><svg x="7" y="6" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 3 2.8 20h18.4L12 3Z M12 9v5 M12 17v.1"/></svg><g fill="#fff" font-family="Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif" font-size="11" font-weight="600" text-anchor="middle"><text x="${labelX}" y="18.5">${escapeXml(label)}</text><text x="${messageX}" y="18.5">${escapeXml(safeMessage)}</text></g></g></svg>`;
}
