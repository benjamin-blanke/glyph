import type { VercelRequest, VercelResponse } from "@vercel/node";

type Point = { label: string; value: number };
type ChartKind = "stars" | "commits" | "contributors" | "languages" | "releases";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!
  );

const number = (value: number) => value.toLocaleString("en-US");

async function github<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2026-03-10",
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${detail.slice(0, 300)}`);
  }

  return (await response.json()) as T;
}

function lineChart(points: Point[], left: number, top: number, width: number, height: number) {
  const max = Math.max(1, ...points.map((point) => point.value));
  const coords = points.map((point, index) => ({
    x: left + (points.length === 1 ? width / 2 : (index / (points.length - 1)) * width),
    y: top + height - (point.value / max) * height,
  }));
  const line = coords
    .map((point, index) => `${index ? "L" : "M"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${coords[coords.length - 1].x} ${top + height} L ${coords[0].x} ${
    top + height
  } Z`;
  const grid = [0, 0.25, 0.5, 0.75, 1]
    .map((ratio) => {
      const y = top + height * ratio;
      return `<line x1="${left}" y1="${y}" x2="${left + width}" y2="${y}" stroke="#25252d" stroke-dasharray="3 5"/><text x="${left - 12}" y="${y + 4}" text-anchor="end" fill="#8b8b98" font-size="11">${number(
        Math.round(max * (1 - ratio))
      )}</text>`;
    })
    .join("");

  return {
    max,
    body: `${grid}<path d="${area}" fill="url(#fill)"/><path d="${line}" fill="none" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${
      coords[coords.length - 1].x
    }" cy="${coords[coords.length - 1].y}" r="3" fill="#a78bfa" stroke="#0d0d10" stroke-width="1.5"/>`,
  };
}

function barChart(points: Point[], left: number, top: number, width: number, height: number) {
  const max = Math.max(1, ...points.map((point) => point.value));
  const slot = width / points.length;
  const bars = points
    .map((point, index) => {
      const barHeight = (point.value / max) * height;
      const x = left + index * slot + slot * 0.18;
      const y = top + height - barHeight;
      return `<rect x="${x}" y="${y}" width="${slot * 0.64}" height="${barHeight}" rx="3" fill="#8b5cf6"/><text x="${
        x + slot * 0.32
      }" y="${y - 7}" text-anchor="middle" fill="#c4b5fd" font-size="10">${number(
        point.value
      )}</text><text x="${x + slot * 0.32}" y="${top + height + 20}" text-anchor="middle" fill="#8b8b98" font-size="10">${esc(
        point.label
      )}</text>`;
    })
    .join("");
  return {
    max,
    body: `<line x1="${left}" y1="${top + height}" x2="${left + width}" y2="${
      top + height
    }" stroke="#25252d"/>${bars}`,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const owner = String(req.query.owner || "");
  const repo = String(req.query.repo || "");
  const kind = String(req.query.type || "stars") as ChartKind;

  if (!/^[\w.-]{1,100}$/.test(owner) || !/^[\w.-]{1,100}$/.test(repo)) {
    return res.status(400).send("Invalid owner or repository");
  }
  if (!["stars", "commits", "contributors", "languages", "releases"].includes(kind)) {
    return res.status(400).send("Invalid chart type");
  }

  try {
    const repoPath = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
    let points: Point[];
    let title: string;
    let subtitle: string;
    let line = true;

    if (kind === "stars") {
      const weeks: { week: number; total: number }[] = [];
      for (let page = 1; page <= 100; page++) {
        const batch = await github<{ week: number; total: number }[]>(
          `${repoPath}/stargazers/history?per_page=30&page=${page}`
        );
        weeks.push(...batch);
        if (batch.length < 30) break;
      }
      let total = 0;
      points = weeks.reverse().map((week) => ({
        label: new Date(week.week * 1000).toLocaleDateString("en", {
          month: "short",
          year: "2-digit",
          timeZone: "UTC",
        }),
        value: (total += week.total),
      }));
      title = "Star history";
      subtitle = `${number(points.at(-1)?.value || 0)} stars`;
    } else if (kind === "commits") {
      const activity = await github<{ week: number; total: number }[]>(
        `${repoPath}/stats/commit_activity`
      );
      points = activity.slice(-26).map((week) => ({
        label: new Date(week.week * 1000).toLocaleDateString("en", {
          month: "short",
          year: "2-digit",
          timeZone: "UTC",
        }),
        value: week.total,
      }));
      title = "Commit activity";
      subtitle = `${number(points.reduce((sum, point) => sum + point.value, 0))} commits in 6 months`;
    } else if (kind === "contributors") {
      const contributors = await github<{ login: string; contributions: number }[]>(
        `${repoPath}/contributors?per_page=8`
      );
      points = contributors.reverse().map((contributor) => ({
        label: contributor.login.slice(0, 12),
        value: contributor.contributions,
      }));
      title = "Top contributors";
      subtitle = `${number(contributors.length)} contributors shown`;
      line = false;
    } else if (kind === "languages") {
      const languages = await github<Record<string, number>>(`${repoPath}/languages`);
      points = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .reverse()
        .map(([language, bytes]) => ({ label: language.slice(0, 12), value: bytes }));
      title = "Language breakdown";
      subtitle = `${number(Object.values(languages).reduce((sum, bytes) => sum + bytes, 0))} bytes analyzed`;
      line = false;
    } else {
      const releases = await github<{ tag_name: string; published_at: string | null }[]>(
        `${repoPath}/releases?per_page=12`
      );
      points = releases
        .filter((release) => release.published_at)
        .reverse()
        .map((release, index) => ({
          label: release.tag_name.slice(0, 12),
          value: index + 1,
        }));
      title = "Release timeline";
      subtitle = `${number(points.length)} recent releases`;
      line = false;
    }

    if (!points.length) return res.status(404).send("No chart data available");

    const width = 828;
    const height = 442;
    const left = 72;
    const right = 24;
    const top = 108;
    const bottom = 58;
    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;
    const chart = line
      ? lineChart(points, left, top, chartWidth, chartHeight)
      : barChart(points, left, top, chartWidth, chartHeight);
    const latest = points[points.length - 1];
    const labels = line
      ? `<text x="${left}" y="${height - 22}" fill="#8b8b98" font-size="11">${esc(
          points[0].label
        )}</text><text x="${width - right}" y="${height - 22}" text-anchor="end" fill="#8b8b98" font-size="11">${esc(
          latest.label
        )}</text>`
      : "";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8b5cf6" stop-opacity=".34"/><stop offset="68%" stop-color="#8b5cf6" stop-opacity=".12"/><stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/></linearGradient></defs>
      <rect x="20" y="24" width="${width - 40}" height="${height - 48}" rx="14" fill="#0d0d10" stroke="#27272f"/>
      <g font-family="Inter,ui-sans-serif,system-ui,sans-serif">
        <circle cx="86" cy="50" r="13" fill="#f3f4f6"/>
        <path d="M86 39c-6.1 0-11 4.9-11 11 0 4.9 3.2 9.1 7.7 10.6.6.1.8-.3.8-.5V58c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.1 1.1-2.9-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 3 1.1.9-.2 1.8-.3 2.7-.3s1.8.1 2.7.3c2-1.4 3-1.1 3-1.1.6 1.4.2 2.5.1 2.8.7.8 1.1 1.7 1.1 2.9 0 4.3-2.6 5.2-5.1 5.5.4.3.7 1 .7 2v3c0 .3.2.7.8.5A11 11 0 0 0 97 50c0-6.1-4.9-11-11-11Z" fill="#0d0d10"/>
        <text x="112" y="48" fill="#f4f4f5" font-size="15" font-weight="600">${esc(owner)}/${esc(repo)}</text>
        <text x="112" y="69" fill="#8b8b98" font-size="11">${esc(title)} · ${esc(subtitle)}</text>
        <text x="${width - 28}" y="48" text-anchor="end" fill="#71717a" font-size="11">glyphbadges.dev</text>
        <path d="M${width - 50} 42l8 8-8 8 4 0 8-8-8-8z" fill="#71717a"/>
        ${chart.body}
        ${labels}
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
