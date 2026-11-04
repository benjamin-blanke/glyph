import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parseBadgeRequest } from "../lib/parse";
import { renderBadge } from "../lib/render";
import { setSvgHeaders } from "../lib/headers";
import { renderErrorBadge } from "../lib/error";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).send("Method not allowed");
  }
  try {
    const badge = parseBadgeRequest(req);
    const svg = renderBadge(badge);
    setSvgHeaders(res);
    if (req.method === "HEAD") return res.status(200).end();
    return res.status(200).send(svg);
  } catch {
    setSvgHeaders(res);
    const svg = renderErrorBadge("Rendering failed");
    if (req.method === "HEAD") return res.status(200).end();
    return res.status(200).send(svg);
  }
}
