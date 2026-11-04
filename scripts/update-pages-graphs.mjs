import { mkdir, writeFile } from "node:fs/promises";

const repository = process.env.GLYPH_REPOSITORY || "benjamin-blanke/glyph";
const token = process.env.GITHUB_TOKEN;
const [owner, repo] = repository.split("/");

if (!owner || !repo) {
  throw new Error("GLYPH_REPOSITORY must use the owner/repository format");
}

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "glyph-pages-graph",
};
if (token) headers.Authorization = `Bearer ${token}`;

async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

const repositoryData = await github(
  `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
);

const metrics = [
  ["stars", "Stars", Number(repositoryData.stargazers_count || 0)],
  ["forks", "Forks", Number(repositoryData.forks_count || 0)],
  ["issues", "Open issues", Number(repositoryData.open_issues_count || 0)],
  ["watchers", "Watchers", Number(repositoryData.subscribers_count || 0)],
];

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[character]);
const formatNumber = (value) => new Intl.NumberFormat("en").format(value);
const formatMonth = (date) =>
  new Date(date).toLocaleDateString("en", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });

const githubPath =
  "M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.3-1.23-1.65-1.23-1.65-1.01-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z";

function graph(metric, label, value) {
  const width = 760;
  const height = 320;
  const left = 48;
  const right = 24;
  const top = 74;
  const bottom = 48;
  const chartHeight = height - top - bottom;
  const max = Math.max(1, value);
  const start = new Date(repositoryData.created_at);
  const end = new Date();
  const sameMonth = start.toISOString().slice(0, 7) === end.toISOString().slice(0, 7);
  const startLabel = sameMonth ? "Start" : formatMonth(start);
  const endLabel = sameMonth ? "Today" : formatMonth(end);
  const firstY = top + chartHeight;
  const lastY = top + chartHeight - (value / max) * chartHeight;
  const line = `M ${left} ${firstY} L ${width - right} ${lastY}`;
  const area = `${line} L ${width - right} ${top + chartHeight} L ${left} ${top + chartHeight} Z`;
  const grid = [0, 0.5, 1]
    .map((ratio) => {
      const y = top + chartHeight * ratio;
      const labelValue = value === 0 ? 0 : Math.round(max * (1 - ratio));
      return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="#34343f" stroke-dasharray="3 5"/><text x="${left - 10}" y="${y + 4}" text-anchor="end" fill="#a1a1aa" font-size="11">${formatNumber(labelValue)}</text>`;
    })
    .join("");
  const summary = value === 0 ? `No ${label.toLowerCase()} yet` : `${formatNumber(value)} ${label.toLowerCase()}`;
  const slug = `${owner}/${repo}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(slug)} ${label.toLowerCase()} graph">
<title>${esc(slug)} ${label.toLowerCase()} graph</title>
<defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8b5cf6" stop-opacity=".35"/><stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/></linearGradient></defs>
<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="16" fill="#111116" stroke="#30303a"/>
<g font-family="Inter,ui-sans-serif,system-ui,sans-serif">
<path fill="#fff" transform="translate(22 21) scale(1.25)" d="${githubPath}"/>
<text x="84" y="51" fill="#fafafa" font-size="15" font-weight="600">${esc(slug)}</text>
<text x="84" y="69" fill="#a1a1aa" font-size="11">${esc(label)} · ${esc(summary)}</text>
<text x="${width - 20}" y="32" text-anchor="end" fill="#a1a1aa" font-size="11">glyph · GitHub Pages</text>
${grid}
<path d="${area}" fill="url(#fill)"/>
<path d="${line}" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="${width - right}" cy="${lastY}" r="3.5" fill="#c4b5fd"/>
<text x="${left}" y="${height - 18}" fill="#a1a1aa" font-size="11">${startLabel}</text>
<text x="${width - right}" y="${height - 18}" text-anchor="end" fill="#a1a1aa" font-size="11">${endLabel}</text>
<text x="${width / 2}" y="${height - 18}" text-anchor="middle" fill="#a1a1aa" font-size="11">Made with Glyph</text>
</g></svg>
`;
}

await mkdir("docs/graphs", { recursive: true });
for (const [metric, label, value] of metrics) {
  await writeFile(`docs/graphs/${metric}.svg`, graph(metric, label, value));
}
