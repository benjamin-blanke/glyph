# Contributing

Thanks for helping improve Glyph. Keep changes focused, accessible, and easy
to copy into a real README.

## Local setup

```bash
git clone https://github.com/benjamin-blanke/glyph.git
cd glyph
npm install
npm run typecheck
```

## Adding an icon

1. Add an inline SVG path definition under `lib/icons/`.
2. Export it from `lib/icons/index.ts`.
3. Use a lowercase, URL-safe identifier.
4. Document it in `docs/ICONS.md`.
5. Add a representative preset or example when appropriate.

Do not load remote image assets inside generated SVGs.

## Adding a preset badge

Add the preset to `lib/presets.ts`, generate the corresponding Pages SVG in
`docs/badges/`, and update [`BADGES.md`](../BADGES.md) with a preview and a
copyable Markdown snippet.

## Graph changes

Graph generation lives in `scripts/update-pages-graphs.mjs`. Keep generated
files valid SVG, escape repository-provided text, and preserve a useful
zero-data state.

## Before opening a pull request

```bash
npm run typecheck
git diff --check
```

For visual changes, open the generated SVGs in a browser and verify that the
Markdown examples in the documentation render correctly.
