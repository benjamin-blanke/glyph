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
    <img src="https://glyphbadges.dev/badge/Discord-Join-the-community-5865F2.svg?text=Join%20the%20community&color=5865F2&labelColor=23272A&logo=discord" alt="Join the Discord">
  </a>
  <a href="https://github.com/benjamin-blanke/glyph">
    <img src="https://glyphbadges.dev/badge/GitHub-Star-the-repo-181717.svg?text=Star%20the%20repo&color=181717&labelColor=23272A&logo=github" alt="Star the repo">
  </a>
</p>

Glyph gives projects polished SVG badges that work anywhere Markdown images
work: GitHub, GitLab, documentation sites, blogs, and static websites.

## Quick start

```md
[![Join the Discord](https://glyphbadges.dev/badge/Discord-Join-the-community-5865F2.svg?text=Join%20our%20community&color=5865F2&labelColor=23272A&logo=discord&style=flat)](https://discord.gg/opushost)
```

Browse the complete collection in [`BADGES.md`](BADGES.md). Every entry shows
the rendered badge followed by its customer URL parameters.

## Dynamic status badges

```md
![Status](https://glyphbadges.dev/badge/Status-Degraded-F59E0B.svg?text=Degraded&color=F59E0B&labelColor=23272A&logo=status)
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
https://glyphbadges.dev/badge/<label>-<message>-<color>.svg?text=<text>&color=<bg>&labelColor=<label-bg>&logo=<icon>&style=<style>
```

Example:

```text
https://glyphbadges.dev/badge/Build-Passing-16A34A.svg?text=Passing&color=16A34A&labelColor=23272A&logo=check&style=rounded
```

Available query parameters are `label`, `text`/`message`, `color`/`bg`/`background`,
`labelColor`/`labelBg`/`labelBackground`, `logo`, and `style`. Available styles
are `flat`, `flat-square`, and `rounded`. See
[`docs/URLS.md`](docs/URLS.md), [`docs/STYLES.md`](docs/STYLES.md), and
[`docs/ICONS.md`](docs/ICONS.md).

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
