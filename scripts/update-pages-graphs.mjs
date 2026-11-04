import { mkdir, writeFile } from "node:fs/promises";

const repository = process.env.GLYPH_REPOSITORY || "benjamin-blanke/glyph";
const token = process.env.GITHUB_TOKEN;
const [owner, repo] = repository.split("/");

if (!owner || !repo) {
  throw new Error("GLYPH_REPOSITORY must use the owner/repository format");
}

const headers = {
  Accept: "application/vnd.github.star+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "glyph-pages-graph",
};
if (token) headers.Authorization = `Bearer ${token}`;

const stars = [];
for (let page = 1; page <= 100; page += 1) {
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/stargazers?per_page=100&page=${page}`,
    { headers }
  );
  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}: ${await response.text()}`);
  }
  const batch = await response.json();
  stars.push(...batch);
  if (batch.length < 100) break;
}

const dated = stars
  .map((star) => star.starred_at)
  .filter((date) => typeof date === "string")
  .sort();
const months = new Map();

if (!dated.length) {
  const repositoryResponse = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    { headers }
  );
  if (!repositoryResponse.ok) {
    throw new Error(`GitHub API returned ${repositoryResponse.status}: ${await repositoryResponse.text()}`);
  }
  const repositoryData = await repositoryResponse.json();
  const month = new Date().toISOString().slice(0, 7);
  months.set(month, Number(repositoryData.stargazers_count || 0));
}

for (const date of dated) {
  const month = date.slice(0, 7);
  months.set(month, (months.get(month) || 0) + 1);
}

let total = 0;
const points = [...months.entries()].map(([month, count]) => {
  total += count;
  return { month, total };
});

const esc = (value) =>
  value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[character]);
const formatNumber = (value) => new Intl.NumberFormat("en").format(value);
const formatMonth = (value) =>
  new Date(`${value}-01T00:00:00Z`).toLocaleDateString("en", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });

const width = 760;
const height = 320;
const left = 48;
const right = 24;
const top = 74;
const bottom = 48;
const chartWidth = width - left - right;
const chartHeight = height - top - bottom;
const max = Math.max(1, ...points.map((point) => point.total));
const coords = points.map((point, index) => ({
  x: left + (points.length === 1 ? chartWidth / 2 : (index / (points.length - 1)) * chartWidth),
  y: top + chartHeight - (point.total / max) * chartHeight,
}));
const line = coords
  .map((point, index) => `${index ? "L" : "M"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
  .join(" ");
const area = `${line} L ${coords.at(-1).x.toFixed(1)} ${top + chartHeight} L ${coords[0].x.toFixed(1)} ${top + chartHeight} Z`;
const grid = [0, 0.5, 1]
  .map((ratio) => {
    const y = top + chartHeight * ratio;
    return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="#34343f" stroke-dasharray="3 5"/><text x="${left - 10}" y="${y + 4}" text-anchor="end" fill="#a1a1aa" font-size="11">${formatNumber(Math.round(max * (1 - ratio)))}</text>`;
  })
  .join("");

const githubPath = "M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.3-1.23-1.65-1.23-1.65-1.01-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z";
const latest = points.at(-1);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(repository)} star history">
<title>${esc(repository)} star history</title>
<defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8b5cf6" stop-opacity=".35"/><stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/></linearGradient></defs>
<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="16" fill="#111116" stroke="#30303a"/>
<g font-family="Inter,ui-sans-serif,system-ui,sans-serif">
<path fill="#fff" transform="translate(22 21) scale(1.25)" d="${githubPath}"/>
<text x="84" y="51" fill="#fafafa" font-size="15" font-weight="600">${esc(repository)}</text>
<text x="84" y="69" fill="#a1a1aa" font-size="11">Star history · ${formatNumber(latest.total)} stars</text>
<text x="${width - 20}" y="32" text-anchor="end" fill="#a1a1aa" font-size="11">glyph · GitHub Pages</text>
${grid}
<path d="${area}" fill="url(#fill)"/>
<path d="${line}" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="${coords.at(-1).x}" cy="${coords.at(-1).y}" r="3.5" fill="#c4b5fd"/>
<text x="${left}" y="${height - 18}" fill="#a1a1aa" font-size="11">${formatMonth(points[0].month)}</text>
<text x="${width - right}" y="${height - 18}" text-anchor="end" fill="#a1a1aa" font-size="11">${formatMonth(latest.month)}</text>
<text x="${width / 2}" y="${height - 18}" text-anchor="middle" fill="#a1a1aa" font-size="11">Made with Glyph</text>
</g></svg>
`;

await mkdir("docs/graphs", { recursive: true });
await writeFile("docs/graphs/stars.svg", svg);
