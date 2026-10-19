
export default function handler(req: any, res: any) {
  const text = String(req.query.text || "Join the community").slice(0, 80);
  const color = String(req.query.color || "5865F2");
  const logo = String(req.query.logo || "discord");

  if (!/^[0-9a-fA-F]{6}$/.test(color)) {
    return res.status(400).send("Invalid color");
  }

  const escapeXml = (s: string) =>
    s.replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    }[c]!));

  const left = "Discord";
  const right = text;
  const leftWidth = 62;
  const rightWidth = Math.max(100, right.length * 7 + 20);
  const width = leftWidth + rightWidth;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg"
    width="${width}" height="28" viewBox="0 0 ${width} 28"
    role="img" aria-label="${escapeXml(left + " " + right)}">
    <title>${escapeXml(left + " " + right)}</title>
    <rect width="${leftWidth}" height="28" rx="4" fill="#${color}"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="28"
      rx="4" fill="#292929"/>
    <g fill="#fff" font-family="Verdana,sans-serif"
      font-size="11" text-anchor="middle">
      <text x="31" y="18">${escapeXml(logo === "discord" ? "Discord" : logo)}</text>
      <text x="${leftWidth + rightWidth / 2}" y="18">${escapeXml(right)}</text>
    </g>
  </svg>`;

  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  return res.status(200).send(svg);
}
