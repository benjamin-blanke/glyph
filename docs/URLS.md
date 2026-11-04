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

## Livck Cloud beta (Beta)

```text
https://glyph-six.vercel.app/badge/livck?url=https%3A%2F%2Fstatus.waveserv.com
```

The endpoint fetches the public Livck status page when the image is requested.
