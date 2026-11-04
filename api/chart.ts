
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

    const width = 760, height = 320;
    const left = 48, right = 24, top = 74, bottom = 48;
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

    const grid = [0, 0.5, 1].map((r) => {
      const y = top + ch * r;
      return `<line x1="${left}" y1="${y}" x2="${width-right}" y2="${y}" stroke="#34343f" stroke-dasharray="3 5"/><text x="${left-10}" y="${y+4}" text-anchor="end" fill="#a1a1aa" font-size="11">${Math.round(max * (1-r))}</text>`;
    }).join("");

    const date = (t: number) => new Date(t).toLocaleDateString("en", {
      month: "short", year: "2-digit", timeZone: "UTC"
    });

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8b5cf6" stop-opacity=".35"/><stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/></linearGradient></defs>
      <rect x=".5" y=".5" width="${width-1}" height="${height-1}" rx="16" fill="#111116" stroke="#30303a"/>
      <g font-family="Inter,ui-sans-serif,system-ui,sans-serif">
        <rect x="20" y="19" width="30" height="30" rx="9" fill="#8b5cf6"/>
        <path d="M36 24 L29 35 H35 L32 44 L42 31 H36 Z" fill="#fff"/>
        <text x="60" y="31" fill="#fafafa" font-size="15" font-weight="600">${esc(owner)}/${esc(repo)}</text>
        <text x="60" y="47" fill="#a1a1aa" font-size="11">Star history · ${latest.stars} stars</text>
        <text x="${width-20}" y="30" text-anchor="end" fill="#a1a1aa" font-size="11">benjamin-blanke.github.io/glyph</text>
        ${grid}
        <path d="${area}" fill="url(#fill)"/>
        <path d="${line}" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${coords[coords.length-1].x}" cy="${coords[coords.length-1].y}" r="3.5" fill="#c4b5fd"/>
        <text x="${left}" y="${height-18}" fill="#a1a1aa" font-size="11">${date(points[0].time)}</text>
        <text x="${width-right}" y="${height-18}" text-anchor="end" fill="#a1a1aa" font-size="11">${date(latest.time)}</text>
        <text x="${width/2}" y="${height-18}" text-anchor="middle" fill="#a1a1aa" font-size="11">Made with Glyph</text>
      </g>
    </svg>`;

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(svg);
  } catch (error) {
    return res.status(500).send(
      `Chart generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
