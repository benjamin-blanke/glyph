import { mkdir, writeFile } from "node:fs/promises";

const pageUrl = process.env.LIVCK_STATUS_URL || "https://status.waveserv.com";
const states = {
  operational: ["Operational", "16A34A", "check"],
  degraded: ["Degraded", "F59E0B", "status"],
  down: ["Down", "DC2626", "status"],
  maintenance: ["Maintenance", "7C3AED", "status"],
  incident: ["Incident", "EA580C", "status"],
  investigating: ["Investigating", "F59E0B", "status"],
  monitoring: ["Monitoring", "2563EB", "status"],
  resolved: ["Resolved", "16A34A", "check"],
};
const aliases = {
  up: "operational",
  healthy: "operational",
  ok: "operational",
  operational: "operational",
  degraded: "degraded",
  warning: "degraded",
  partial_outage: "degraded",
  down: "down",
  outage: "down",
  major_outage: "down",
  maintenance: "maintenance",
  incident: "incident",
  investigating: "investigating",
  monitoring: "monitoring",
  resolved: "resolved",
};

const page = new URL(pageUrl);
if (page.protocol !== "https:") throw new Error("LIVCK_STATUS_URL must use HTTPS");

function findState(value) {
  if (!value || typeof value !== "object") return undefined;
  if (Array.isArray(value)) {
    for (const item of value) {
      const state = findState(item);
      if (state) return state;
    }
    return undefined;
  }
  for (const [key, nested] of Object.entries(value)) {
    if (["status", "indicator", "overall_status", "overallStatus"].includes(key)) {
      if (typeof nested === "string") {
        const state = aliases[nested.toLowerCase().replace(/[\s-]+/g, "_")];
        if (state) return state;
      }
    }
    const state = findState(nested);
    if (state) return state;
  }
  return undefined;
}

let state;
for (const path of ["/api/v3/summary", "/api/v3/status", "/api/v3/categories"]) {
  const response = await fetch(new URL(path, page), {
    headers: { Accept: "application/json", "User-Agent": "glyph-livck-pages" },
  });
  if (!response.ok) continue;
  state = findState(await response.json());
  if (state) break;
}

if (!state) throw new Error(`Could not read a supported status from ${pageUrl}`);

const [message, color, icon] = states[state];
const paths = {
  check: "m9.2 16.2-4-4-1.8 1.8 5.8 5.8L21 8l-1.8-1.8-10 10Z",
  status: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.5-4-4 1.7-1.7 2.3 2.3 4.9-4.9 1.7 1.7-6.6 6.6Z",
};
const esc = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
}[character]));
const label = "Livck";
const left = 64;
const right = Math.max(52, Math.ceil(message.length * 6.82 + 22));
const width = left + right;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="28" viewBox="0 0 ${width} 28" role="img" aria-label="${esc(`${label} ${message}`)}"><title>${esc(`${label} ${message}`)}</title><defs><linearGradient id="shine" x2="0" y2="100%"><stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".04"/></linearGradient><clipPath id="clip"><rect width="${width}" height="28" rx="4"/></clipPath></defs><g clip-path="url(#clip)"><rect width="${left}" height="28" fill="#23272A"/><rect x="${left}" width="${right}" height="28" fill="#${color}"/><rect width="${width}" height="28" fill="url(#shine)"/><svg x="7" y="6" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="${paths[icon]}"/></svg><g fill="#fff" font-family="Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif" font-size="11" font-weight="600" text-anchor="middle"><text x="${left / 2 + 7}" y="18.5">${label}</text><text x="${left + right / 2}" y="18.5">${esc(message)}</text></g></g></svg>\n`;

await mkdir("docs/badges", { recursive: true });
await writeFile("docs/badges/livck.svg", svg);
console.log(`Updated Livck badge: ${message}`);
