# Glyph

<p align="center">
  <strong>Beautiful, customizable SVG badges for your README.</strong><br>
  A small alternative to Shields.io, powered by a dynamic API.
</p>

<p align="center">
  <a href="https://glyphbadges.dev/">Website</a> ·
  <a href="BADGES.md">Badge gallery</a> ·
  <a href="STATUS.md">Status badges</a>
</p>

<p align="center">
  <a href="https://discord.gg/opushost">
    <img src="https://glyphbadges.dev/badge/Discord-Join-the-community-5865F2.svg?text=Join%20the%20community&bg=5865F2&labelBg=23272A&logo=discord" alt="Join the Discord">
  </a>
  <a href="https://github.com/benjamin-blanke/glyph">
    <img src="https://glyphbadges.dev/badge/GitHub-Star-the-repo-181717.svg?text=Star%20the%20repo&bg=181717&labelBg=23272A&logo=github" alt="Star the repo">
  </a>
</p>

Glyph gives projects polished SVG badges that work anywhere Markdown images
work: GitHub, GitLab, documentation sites, blogs, and static websites.

## Quick start

```md
[![Join the Discord](https://glyphbadges.dev/badge/Discord-Join-the-community-5865F2.svg?text=Join%20our%20community&bg=5865F2&labelBg=23272A&logo=discord&style=flat)](https://discord.gg/opushost)
```

Browse the complete collection in [`BADGES.md`](BADGES.md). Every entry shows
the rendered badge followed by its customer URL parameters.

## Dynamic status badges

```md
![Status](https://glyphbadges.dev/badge/Status-Degraded-F59E0B.svg?text=Degraded&bg=F59E0B&labelBg=23272A&logo=status)
```

Supported states include `OPERATIONAL`, `DEGRADED`, `DOWN`, `MAINTENANCE`,
`INCIDENT`, `INVESTIGATING`, `MONITORING`, `RESOLVED`, `SCHEDULED`, `ONLINE`,
and `OFFLINE`. See [`STATUS.md`](STATUS.md) for all formats.

### Livck Cloud beta

Glyph has a **Beta** integration for public Livck status pages:

```md
![Livck Beta](https://glyphbadges.dev/badge/livck?url=https%3A%2F%2Fstatus.waveserv.com)
```

It checks Livck whenever the image is requested. Replace the encoded URL to
use another public Livck status page.

## URL format

```text
https://glyphbadges.dev/badge/<label>-<message>-<color>.svg?text=<text>&bg=<background>&labelBg=<label-background>&logo=<icon>&style=<style>
```

Example:

```text
https://glyphbadges.dev/badge/Build-Passing-16A34A.svg?text=Passing&bg=16A34A&labelBg=23272A&logo=check&style=rounded
```

`?text=` brings custom text, `?bg=` changes the message background,
`?label=` changes the label, `?labelBg=` changes the label background,
`?logo=` selects an inline logo, and `?style=` selects `flat`, `flat-square`,
or `rounded`. Aliases include `message`, `color`, `background`, `labelColor`,
and `labelBackground`. See
[`docs/URLS.md`](docs/URLS.md), [`docs/STYLES.md`](docs/STYLES.md), and
[`docs/ICONS.md`](docs/ICONS.md).

If rendering fails, Glyph returns a native red warning badge with an inline
warning icon instead of leaving Markdown with a broken-image placeholder.

## Development

```bash
npm install
npm run typecheck
```

## Contributing

See [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for the icon, SVG, testing,
and documentation conventions.

## License

Glyph is available under the [MIT License](LICENSE).
