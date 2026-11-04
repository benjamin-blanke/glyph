# Badge URLs

## Dynamic API

The API uses this format:

```text
https://glyph-six.vercel.app/badge/<label>-<message>-<color>.svg?text=<text>&color=<bg>&labelColor=<label-bg>&logo=<icon>&style=<style>
```

Query parameters:

| Parameter | Purpose |
|---|---|
| `label` | Replace the left-side label. |
| `text` or `message` | Replace the right-side text. |
| `color`, `bg`, or `background` | Change the right-side background. |
| `labelColor`, `labelBg`, or `labelBackground` | Change the left-side background. |
| `logo` | Select an inline icon. |
| `style` | Use `flat`, `flat-square`, or `rounded`. |

Examples:

```text
https://glyph-six.vercel.app/badge/Discord-Join-the-community-5865F2.svg?text=Join%20us&color=5865F2&labelColor=23272A&logo=discord&style=flat
https://glyph-six.vercel.app/badge/Build-Passing-16A34A.svg?text=Passing&color=16A34A&labelColor=23272A&logo=check&style=rounded
https://glyph-six.vercel.app/badge/GitHub-Star-the-repo-181717.svg?text=Star%20it&color=181717&labelColor=23272A&logo=github&style=flat-square
```

## GitHub Pages

Static preset badges use this format and cannot process query parameters:

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
