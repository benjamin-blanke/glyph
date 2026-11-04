# Repository graphs

Glyph graphs are static SVG snapshots hosted on GitHub Pages. They use a dark
card, GitHub mark, purple data visualization, and Glyph branding.

## Available graphs

```md
![Stars](https://benjamin-blanke.github.io/glyph/graphs/stars.svg)
![Forks](https://benjamin-blanke.github.io/glyph/graphs/forks.svg)
![Open issues](https://benjamin-blanke.github.io/glyph/graphs/issues.svg)
![Watchers](https://benjamin-blanke.github.io/glyph/graphs/watchers.svg)
![Contributors](https://benjamin-blanke.github.io/glyph/graphs/contributors.svg)
![Languages](https://benjamin-blanke.github.io/glyph/graphs/languages.svg)
```

The repository graph workflow refreshes these files daily. Zero-value metrics
render a clean baseline with an explicit empty-state label instead of inventing
data.

## Refresh locally

```bash
GLYPH_REPOSITORY=owner/repository npm run update:graphs
```

The script uses `GITHUB_TOKEN` when available and writes the generated SVGs to
this directory. See the [badge gallery](../../BADGES.md) for matching badge
assets.
