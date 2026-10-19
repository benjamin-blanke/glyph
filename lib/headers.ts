import type { VercelResponse } from "@vercel/node";
export function setSvgHeaders(res: VercelResponse) {
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=86400");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Access-Control-Allow-Origin", "*");
}
