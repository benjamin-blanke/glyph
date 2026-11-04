
import type { VercelRequest, VercelResponse } from "@vercel/node";

type Week = {
  week: number;
  total: number;
  days: number[];
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!
  );

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const owner = String(req.query.owner || "");
  const repo = String(req.query.repo || "");

  if (!/^[\w.-]{1,100}$/.test(owner) || !/^[\w.-]{1,100}$/.test(repo)) {
    return res.status(400).send("Invalid owner or repository");
  }

  try {
    const weeks: Week[] = [];

    for (let page = 1; page <= 100; page++) {
      const response = await fetch(
        `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/stargazers/history?per_page=30&page=${page}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2026-03-10",
          },
        }
      );

      if (!response.ok) {
        const detail = await response.text();
        return res.status(response.status).send(
          `GitHub API error (${response.status}): ${detail.slice(0, 300)}`
        );
      }

      const batch = (await response.json()) as Week[];
      weeks.push(...batch);
      if (batch.length < 30) break;
    }

    if (!weeks.length) {
      return res.status(404).send("No star history available");
    }

    const chronological = weeks.reverse();
    let total = 0;
    const points = chronological.map((w) => {
      total += w.total;
      return { time: w.week * 1000, stars: total };
    });

    const width = 828, height = 442;
    const left = 72, right = 24, top = 88, bottom = 48;
    const cw = width - left - right, ch = height - top - bottom;
    const max = Math.max(1, ...points.map((p) => p.stars));

    const coords = points.map((p, i) => ({
      x: left + (points.length === 1 ? cw / 2 : i / (points.length - 1) * cw),
      y: top + ch - p.stars / max * ch,
    }));

    const line = coords.map((p, i) =>
      `${i ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    ).join(" ");

    const area = `${line} L ${coords[coords.length - 1].x} ${top + ch} L ${coords[0].x} ${top + ch} Z`;
    const latest = points[points.length - 1];

    const grid = [0, 0.25, 0.5, 0.75, 1].map((r) => {
      const y = top + ch * r;
      return `<line x1="${left}" y1="${y}" x2="${width-right}" y2="${y}" stroke="#25252d" stroke-dasharray="3 5"/><text x="${left-12}" y="${y+4}" text-anchor="end" fill="#8b8b98" font-size="11">${Math.round(max * (1-r))}</text>`;
    }).join("");

    const date = (t: number) => new Date(t).toLocaleDateString("en", {
      month: "short", year: "2-digit", timeZone: "UTC"
    });

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8b5cf6" stop-opacity=".34"/><stop offset="68%" stop-color="#8b5cf6" stop-opacity=".12"/><stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/></linearGradient></defs>
      <rect x="20" y="24" width="${width-40}" height="${height-48}" rx="14" fill="#0d0d10" stroke="#27272f"/>
      <g font-family="Inter,ui-sans-serif,system-ui,sans-serif">
        <circle cx="86" cy="50" r="13" fill="#f3f4f6"/>
        <path d="M86 39c-6.1 0-11 4.9-11 11 0 4.9 3.2 9.1 7.7 10.6.6.1.8-.3.8-.5V58c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.1 1.1-2.9-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 3 1.1.9-.2 1.8-.3 2.7-.3s1.8.1 2.7.3c2-1.4 3-1.1 3-1.1.6 1.4.2 2.5.1 2.8.7.8 1.1 1.7 1.1 2.9 0 4.3-2.6 5.2-5.1 5.5.4.3.7 1 .7 2v3c0 .3.2.7.8.5A11 11 0 0 0 97 50c0-6.1-4.9-11-11-11Z" fill="#0d0d10"/>
        <text x="112" y="48" fill="#f4f4f5" font-size="15" font-weight="600">${esc(owner)}/${esc(repo)}</text>
        <text x="112" y="69" fill="#8b8b98" font-size="11">${latest.stars} stars</text>
        <text x="${width-28}" y="48" text-anchor="end" fill="#71717a" font-size="11">glyphbadges.dev</text>
        <path d="M${width-50} 42l8 8-8 8 4 0 8-8-8-8z" fill="#71717a"/>
        ${grid}
        <path d="${area}" fill="url(#fill)"/>
        <path d="${line}" fill="none" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${coords[coords.length-1].x}" cy="${coords[coords.length-1].y}" r="3" fill="#a78bfa" stroke="#0d0d10" stroke-width="1.5"/>
        <text x="${left}" y="${height-22}" fill="#8b8b98" font-size="11">${date(points[0].time)}</text>
        <text x="${width-right}" y="${height-22}" text-anchor="end" fill="#8b8b98" font-size="11">${date(latest.time)}</text>
      </g>
    </svg>`;

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");
    return res.status(200).send(svg);
  } catch (error) {
    return res.status(500).send(
      `Chart generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
