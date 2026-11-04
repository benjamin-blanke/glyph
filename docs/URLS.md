# Badge URLs

## Dynamic API

The API uses this format:

```text
https://glyphbadges.dev/badge/<label>-<message>-<color>.svg?text=<text>&bg=<background>&labelBg=<label-background>&logo=<icon>&style=<style>
```

Customer URL parameters:

| Parameter | What it does |
|---|---|
| `?text=` | Brings custom text to the message side. `?message=` is an alias. |
| `?bg=` | Changes the message background color. `?color=` and `?background=` are aliases. |
| `?label=` | Changes the left-side label. |
| `?labelBg=` | Changes the label background color. `?labelColor=` and `?labelBackground=` are aliases. |
| `?logo=` | Selects an inline icon. |
| `?style=` | Uses `flat`, `flat-square`, or `rounded`. |

Examples:

```text
https://glyphbadges.dev/badge/Discord-Join-the-community-5865F2.svg?text=Join%20us&bg=5865F2&labelBg=23272A&logo=discord&style=flat
https://glyphbadges.dev/badge/Build-Passing-16A34A.svg?text=Passing&bg=16A34A&labelBg=23272A&logo=check&style=rounded
https://glyphbadges.dev/badge/GitHub-Star-the-repo-181717.svg?text=Star%20it&bg=181717&labelBg=23272A&logo=github&style=flat-square
```

If a badge cannot be rendered, Glyph returns a native red warning badge with an inline warning icon instead of a broken image placeholder.

See [`BADGES.md`](../BADGES.md) for the complete preset gallery.

## Dynamic Discord badge

Use a Discord user ID to fetch the current username and avatar through Lanyard:

```text
https://glyphbadges.dev/badge/discorduser?userId=123456789012345678
```

The badge displays the user's avatar and `@username`. The Discord user ID must
be public and the Lanyard API must be able to resolve it.

## Livck Cloud beta (Beta)

```text
https://glyphbadges.dev/badge/livck?url=https%3A%2F%2Fstatus.waveserv.com
```

The endpoint fetches the public Livck status page when the image is requested.
