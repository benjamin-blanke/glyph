import type { VercelRequest, VercelResponse } from "@vercel/node";
import { escapeXml } from "../lib/escape";
import { setSvgHeaders } from "../lib/headers";

function queryValue(value: unknown): string {
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : "";
  return typeof value === "string" ? value : "";
}

function safeText(value: string, fallback: string, max: number): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max) || fallback;
}

function renderCover(title: string, description: string): string {
  const titleSize = title.length > 34 ? 30 : title.length > 24 ? 34 : 38;
  const titleWidth = Math.min(640, Math.max(220, title.length * titleSize * 0.52));
  const descriptionWidth = Math.min(620, Math.max(180, description.length * 9.2));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="252" viewBox="0 0 720 252" role="img" aria-label="${escapeXml(`${title}: ${description}`)}"><title>${escapeXml(`${title}: ${description}`)}</title><defs><style>@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&amp;display=swap');</style><pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#252832" fill-opacity=".72"/></pattern><radialGradient id="vignette" cx="50%" cy="48%" r="72%"><stop offset="0%" stop-color="#0d0f15" stop-opacity=".16"/><stop offset="100%" stop-color="#05060a" stop-opacity=".72"/></radialGradient><filter id="soft"><feGaussianBlur stdDeviation="3"/></filter></defs><rect x=".5" y=".5" width="719" height="251" rx="10" fill="#080a0f" stroke="#1b1e27"/><rect x="1" y="1" width="718" height="250" rx="9" fill="url(#dots)"/><rect x="1" y="1" width="718" height="250" rx="9" fill="url(#vignette)"/><ellipse cx="360" cy="124" rx="${titleWidth / 2 + 72}" ry="48" fill="#11141c" fill-opacity=".24" filter="url(#soft)"/><g text-anchor="middle" font-family="'Bricolage Grotesque',sans-serif"><text x="360" y="125" fill="#f4f4f5" font-size="${titleSize}" font-weight="800" letter-spacing="-1.1">${escapeXml(title)}</text><text x="360" y="161" fill="#a8abb5" font-size="18" font-weight="400" letter-spacing=".1">${escapeXml(description)}</text></g></svg>`;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).send("Method not allowed");
  }

  const title = safeText(queryValue(req.query?.title), "Your Project", 80);
  const description = safeText(queryValue(req.query?.description || req.query?.subtitle), "A delightful project", 120);
  const svg = renderCover(title, description);
  setSvgHeaders(res);
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=3600");
  if (req.method === "HEAD") return res.status(200).end();
  return res.status(200).send(svg);
}
