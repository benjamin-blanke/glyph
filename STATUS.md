# Status badges

## Static GitHub Pages badges

Use these URLs directly in Markdown:

```md
![Livck status](https://benjamin-blanke.github.io/glyph/badges/livck.svg)
![Status](https://benjamin-blanke.github.io/glyph/badges/status-degraded.svg)
```

`livck.svg` is the **Beta** live-status badge. A GitHub Action checks
`https://status.waveserv.com` every 15 minutes and updates the file in this
repository. GitHub Pages then serves the newest committed SVG.

Supported Livck states are Operational, Degraded, Down, Maintenance, Incident,
Investigating, Monitoring, and Resolved.

## Configure another Livck page

Edit `LIVCK_STATUS_URL` in
[`.github/workflows/update-livck.yml`](.github/workflows/update-livck.yml), then
run the workflow manually once. The Markdown URL stays exactly the same.

## Important limitation

GitHub Pages cannot query Livck when a visitor reloads an image. The scheduled
workflow is the reliable Pages-compatible solution: it fetches Livck server-side
and publishes a static SVG.
