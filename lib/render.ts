import type { BadgeRequest } from "./types";
import { escapeXml } from "./escape";
import { textWidth, cornerRadius } from "./geometry";
import { getIcon } from "./icons";
export function renderBadge(b: BadgeRequest): string {
  const icon = getIcon(b.logo);
  const iconSpace = icon || b.avatar ? 22 : 0;
  const leftWidth = textWidth(b.label, 11, 10) + iconSpace;
  const rightWidth = textWidth(b.message, 11, 11);
  const width = leftWidth + rightWidth;
  const r = cornerRadius(b.style);
  const iconSvg = b.avatar
    ? `<image x="7" y="6" width="15" height="15" preserveAspectRatio="xMidYMid slice" href="${escapeXml(b.avatar)}" clip-path="url(#avatar-clip)" aria-hidden="true"/>`
    : icon
      ? `<svg x="7" y="6" width="15" height="15" viewBox="${icon.viewBox || "0 0 24 24"}" aria-hidden="true"><path fill="${icon.color || "#FFFFFF"}" d="${icon.path}"/></svg>`
      : "";
  const labelX = leftWidth / 2 + (icon || b.avatar ? 7 : 0);
  const messageX = leftWidth + rightWidth / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="28" viewBox="0 0 ${width} 28" role="img" aria-label="${escapeXml(b.label + " " + b.message)}"><title>${escapeXml(b.label + " " + b.message)}</title><defs><linearGradient id="shine" x2="0" y2="100%"><stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".04"/></linearGradient><clipPath id="clip"><rect width="${width}" height="28" rx="${r}"/></clipPath><clipPath id="avatar-clip"><circle cx="14.5" cy="13.5" r="7.5"/></clipPath></defs><g clip-path="url(#clip)"><rect width="${leftWidth}" height="28" fill="#${b.labelColor}"/><rect x="${leftWidth}" width="${rightWidth}" height="28" fill="#${b.color}"/><rect width="${width}" height="28" fill="url(#shine)"/>${iconSvg}<g fill="#fff" font-family="Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif" font-size="11" font-weight="600" text-anchor="middle"><text x="${labelX}" y="18.5">${escapeXml(b.label)}</text><text x="${messageX}" y="18.5">${escapeXml(b.message)}</text></g></g></svg>`;
}
