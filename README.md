# Glyph

<p align="center">
  <strong>Beautiful SVG badges and repository graphs for your README.</strong><br>
  A small, customizable alternative to Shields.io, built for static hosting.
</p>

<p align="center">
  <a href="https://benjamin-blanke.github.io/glyph/">Website</a> ·
  <a href="BADGES.md">Badge gallery</a> ·
  <a href="docs/graphs/README.md">Graphs</a> ·
  <a href="STATUS.md">Status badges</a>
</p>

<p align="center">
  <a href="https://discord.gg/opushost">
    <img src="https://benjamin-blanke.github.io/glyph/badges/discord.svg" alt="Join the Discord">
  </a>
  <a href="https://github.com/benjamin-blanke/glyph">
    <img src="https://benjamin-blanke.github.io/glyph/badges/github.svg" alt="Star the repo">
  </a>
</p>

Glyph gives projects polished SVG assets that work anywhere Markdown images work:
GitHub, GitLab, documentation sites, blogs, and static websites. Every gallery
asset is hosted on GitHub Pages, requires no JavaScript, and can be copied
directly into a README.

## Quick start

Copy a badge:

```md
[![Join the Discord](https://benjamin-blanke.github.io/glyph/badges/discord.svg)](https://discord.gg/opushost)
```

Add a repository graph:

```md
![Contributors](https://benjamin-blanke.github.io/glyph/graphs/contributors.svg)
```

Browse the complete collection in [`BADGES.md`](BADGES.md).

## Dynamic status badges

For live status values, use the API deployment:

```md
![Status](https://benjamin-blanke.github.io/glyph/badges/status-degraded.svg)
```

Supported states include `OPERATIONAL`, `DEGRADED`, `DOWN`, `MAINTENANCE`,
`INCIDENT`, `INVESTIGATING`, `MONITORING`, `RESOLVED`, `SCHEDULED`, `ONLINE`,
and `OFFLINE`.

GitHub Pages is static, so query-string states cannot be evaluated there. Use
the matching static files, such as
`https://benjamin-blanke.github.io/glyph/badges/status-degraded.svg`, when you
need a Pages-only solution. See [`STATUS.md`](STATUS.md) for all formats.

### Livck Cloud beta

Glyph has a **Beta** integration for public Livck status pages. Paste this
single URL into your Markdown:

```md
![Livck status](https://glyph-six.vercel.app/badge/livck?url=https%3A%2F%2Fstatus.waveserv.com)
```

It checks Livck whenever the image is requested. No GitHub Action or repository
configuration is required. Replace the encoded URL to use another public Livck
status page.

## Graphs

The Pages gallery includes repository snapshots for:

- stars
- forks
- open issues
- watchers
- top contributors
- language usage

```md
![Stars](https://benjamin-blanke.github.io/glyph/graphs/stars.svg)
![Languages](https://benjamin-blanke.github.io/glyph/graphs/languages.svg)
```

Graphs are refreshed daily by GitHub Actions. See
[`docs/graphs/README.md`](docs/graphs/README.md) for the full list and local
generation command.

## URL format

The API badge renderer accepts the compact path format:

```text
/badge/<label>-<message>-<color>.svg?logo=<icon>&style=<style>
```

Example:

```text
https://benjamin-blanke.github.io/glyph/badges/build.svg
```

Available styles are `flat`, `flat-square`, and `rounded`. See
[`docs/URLS.md`](docs/URLS.md), [`docs/STYLES.md`](docs/STYLES.md), and
[`docs/ICONS.md`](docs/ICONS.md).

## GitHub Pages deployment

The static site is deployed from `docs/` by
[`.github/workflows/pages.yml`](.github/workflows/pages.yml) on every push to
`main`. Set **Settings → Pages → Build and deployment → Source** to
**GitHub Actions** once. The site will then be available at:

```text
https://benjamin-blanke.github.io/glyph/
```

## Development

```bash
npm install
npm run typecheck
```

To regenerate repository graphs:

```bash
GLYPH_REPOSITORY=owner/repository npm run update:graphs
```

## Contributing

See [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for the icon, SVG, testing,
and documentation conventions. Bug reports and improvements are welcome.

## License

Glyph is available under the [MIT License](LICENSE).
