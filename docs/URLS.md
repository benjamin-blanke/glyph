# Badge URLs

## Dynamic API

The API uses this format:

```text
https://YOUR_API_HOST/badge/<label>-<message>-<color>.svg?logo=<icon>&style=<style>
```

Examples:

```text
https://benjamin-blanke.github.io/glyph/badges/discord.svg
https://benjamin-blanke.github.io/glyph/badges/build.svg
https://benjamin-blanke.github.io/glyph/badges/github.svg
```

## GitHub Pages

Static preset badges use this format:

```text
https://benjamin-blanke.github.io/glyph/badges/<preset>.svg
```

Examples:

```text
https://benjamin-blanke.github.io/glyph/badges/discord.svg
https://benjamin-blanke.github.io/glyph/badges/status-degraded.svg
https://benjamin-blanke.github.io/glyph/badges/contributors-active.svg
```

See [`BADGES.md`](../BADGES.md) for the complete preset gallery.

## Livck Cloud beta

```text
https://YOUR_API_HOST/badge/livck?url=https%3A%2F%2Fstatus.waveserv.com
```

The URL can also be supplied as the query key:

```text
https://YOUR_API_HOST/badge/livck?https://status.waveserv.com
```
