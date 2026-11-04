import type { IconDefinition } from "../types";
import { discord } from "./discord"; import { github } from "./github"; import { gitlab } from "./gitlab";
import { youtube } from "./youtube"; import { twitch } from "./twitch"; import { instagram } from "./instagram";
import { x } from "./x"; import { tiktok } from "./tiktok"; import { npm } from "./npm";
import { vercel } from "./vercel"; import { website } from "./website"; import { status } from "./status";
import { check } from "./check"; import { star } from "./star"; import { heart } from "./heart";
import { mail } from "./mail";
export const icons: Record<string, IconDefinition> = { discord, github, gitlab, youtube, twitch, instagram, x, tiktok, npm, vercel, website, status, check, star, heart, mail };
export function getIcon(name: string): IconDefinition | undefined { return icons[name.toLowerCase()]; }
