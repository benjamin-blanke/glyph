import type { VercelRequest, VercelResponse } from "@vercel/node";
import { renderBadge } from "../lib/render";
import { setSvgHeaders } from "../lib/headers";
import { renderErrorBadge } from "../lib/error";

function queryValue(value: unknown): string {
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : "";
  return typeof value === "string" ? value : "";
}

function errorResponse(req: VercelRequest, res: VercelResponse, message: string) {
  setSvgHeaders(res);
  const svg = renderErrorBadge(message);
  if (req.method === "HEAD") return res.status(200).end();
  return res.status(200).send(svg);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).send("Method not allowed");
  }

  const userId = queryValue(req.query?.userId || req.query?.id);
  if (!/^\d{17,20}$/.test(userId)) {
    return errorResponse(req, res, "Invalid Discord ID");
  }

  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
      headers: { Accept: "application/json", "User-Agent": "glyph-discord-badge" },
    });
    if (!response.ok) return errorResponse(req, res, "Lanyard unavailable");

    const payload = await response.json() as {
      success?: boolean;
      data?: {
        discord_user?: {
          username?: string;
          global_name?: string | null;
          avatar?: string | null;
        };
      };
    };
    const user = payload.data?.discord_user;
    const username = user?.username?.trim();
    if (!payload.success || !user || !username) return errorResponse(req, res, "Discord user not found");

    let avatar: string | undefined;
    if (user.avatar) {
      const avatarResponse = await fetch(
        `https://cdn.discordapp.com/avatars/${userId}/${encodeURIComponent(user.avatar)}.png?size=64`,
        { headers: { Accept: "image/png,image/*", "User-Agent": "glyph-discord-badge" } }
      );
      if (avatarResponse.ok) {
        const contentType = avatarResponse.headers.get("content-type") || "image/png";
        const bytes = Buffer.from(await avatarResponse.arrayBuffer());
        if (bytes.length <= 100_000 && /^image\/(?:png|jpeg|webp|gif)$/i.test(contentType)) {
          avatar = `data:${contentType};base64,${bytes.toString("base64")}`;
        }
      }
    }

    const svg = renderBadge({
      label: "Discord",
      message: `@${username}`,
      color: "5865F2",
      labelColor: "23272A",
      logo: "discord",
      avatar,
      style: "flat",
    });
    setSvgHeaders(res);
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=3600");
    if (req.method === "HEAD") return res.status(200).end();
    return res.status(200).send(svg);
  } catch {
    return errorResponse(req, res, "Discord lookup failed");
  }
}
