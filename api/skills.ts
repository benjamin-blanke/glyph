import type { VercelRequest, VercelResponse } from "@vercel/node";
import { escapeXml } from "../lib/escape";
import { setSvgHeaders } from "../lib/headers";

const OWNER = "lakshanjayalath";
const REPOSITORY = "skillicons";
const BRANCH = "main";
const CONTENTS_URL = `https://api.github.com/repos/${OWNER}/${REPOSITORY}/contents/icons?ref=${BRANCH}`;
const RAW_URL = `https://raw.githubusercontent.com/${OWNER}/${REPOSITORY}/${BRANCH}/icons`;

let filesPromise: Promise<string[]> | undefined;

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function queryTokens(req: VercelRequest): string[] {
  const raw = typeof req.url === "string" ? req.url.split("?")[1]?.split("#")[0] || "" : "";
  const query = new URLSearchParams(raw);
  const values = [
    query.get("i"),
    query.get("icons"),
    query.get("skills"),
    ...[...query.entries()]
      .filter(([key]) => !["i", "icons", "skills", "theme"].includes(key))
      .map(([key, value]) => (value ? `${key},${value}` : key)),
  ]
    .filter(Boolean)
    .join(",");

  return values
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 24);
}

async function availableFiles(): Promise<string[]> {
  if (!filesPromise) {
    filesPromise = fetch(CONTENTS_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "Glyph-Skills",
      },
    }).then(async (response) => {
      if (!response.ok) throw new Error(`Skill icon catalog unavailable (${response.status})`);
      const entries = (await response.json()) as { name: string; type: string }[];
      return entries.filter((entry) => entry.type === "file" && entry.name.endsWith(".svg")).map((entry) => entry.name);
    });
  }
  return filesPromise;
}

function preferredFile(token: string, files: string[], theme: string): string | undefined {
  const aliases: Record<string, string> = {
    js: "JavaScript",
    javascript: "JavaScript",
    ts: "TypeScript",
    typescript: "TypeScript",
    html: "HTML",
    css: "CSS",
    next: "NextJS",
    nextjs: "NextJS",
    node: "NodeJS",
    nodejs: "NodeJS",
    react: "React",
    vue: "VueJS",
    tailwind: "TailwindCSS",
    tailwindcss: "TailwindCSS",
    python: "Python",
    php: "PHP",
    postgres: "PostgreSQL",
    postgresql: "PostgreSQL",
    mysql: "MySQL",
    github: "Github",
    actions: "GithubActions",
    wordpress: "Wordpress",
    gitlab: "GitLab",
    vercel: "Vercel",
    go: "GoLang",
    golang: "GoLang",
    cpp: "CPP",
    csharp: "CS",
    dotnet: "DotNet",
  };
  const base = aliases[normalize(token)] || token;
  const normalized = normalize(base);
  const matching = files.filter((file) => normalize(file.replace(/\.svg$/, "").replace(/-(dark|light)$/i, "")) === normalized);
  if (!matching.length) {
    return files.find((file) => normalize(file.replace(/\.svg$/, "")) === normalize(token));
  }
  if (matching.length === 1) return matching[0];
  const suffix = theme === "light" ? "-Light.svg" : "-Dark.svg";
  return matching.find((file) => file.endsWith(suffix)) || matching[0];
}

async function fetchIcon(file: string): Promise<string> {
  const response = await fetch(`${RAW_URL}/${encodeURIComponent(file)}`);
  if (!response.ok) throw new Error(`Unable to load ${file}`);
  return response.text();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).send("Method not allowed");
  }

  try {
    const tokens = queryTokens(req);
    if (!tokens.length) return res.status(400).send("Add skill icons, for example /skills?js,ts,react");
    const raw = typeof req.url === "string" ? req.url.split("?")[1] || "" : "";
    const theme = new URLSearchParams(raw).get("theme") === "light" ? "light" : "dark";
    const files = await availableFiles();
    const selected = tokens.map((token) => ({ token, file: preferredFile(token, files, theme) }));
    const missing = selected.filter((item) => !item.file).map((item) => item.token);
    if (missing.length) return res.status(404).send(`Unknown skill icon: ${missing.join(", ")}`);

    const icons = await Promise.all(selected.map(async ({ file }) => fetchIcon(file!)));
    const size = 96;
    const gap = 16;
    const padding = 32;
    const width = padding * 2 + icons.length * size + (icons.length - 1) * gap;
    const height = size + padding * 2;
    const label = selected.map((item) => item.file!.replace(/\.svg$/, "")).join(", ");
    const images = icons
      .map((icon, index) => {
        const x = padding + index * (size + gap);
        const data = Buffer.from(icon, "utf8").toString("base64");
        return `<image x="${x}" y="${padding}" width="${size}" height="${size}" href="data:image/svg+xml;base64,${data}"/>`;
      })
      .join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(label)}"><title>${escapeXml(label)}</title><rect width="${width}" height="${height}" fill="#0d1117"/>${images}</svg>`;

    setSvgHeaders(res);
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
    if (req.method === "HEAD") return res.status(200).end();
    return res.status(200).send(svg);
  } catch (error) {
    return res.status(502).send(error instanceof Error ? error.message : "Skill icon rendering failed");
  }
}
