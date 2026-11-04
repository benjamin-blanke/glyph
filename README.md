![Glyph Badges](https://glyphbadges.dev/cover?title=Glyph%20Badges&description=Beautiful%2C%20customizable%20SVG%20badges%20for%20your%20README.)

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

## Dynamic Discord badge

Fetch a Discord user's current avatar and username through Lanyard:

```md
![Discord User](https://glyphbadges.dev/badge/discorduser?userId=123456789012345678)
```

The badge displays the avatar and username as `@username`.

## Repository charts

Display a live GitHub star-history chart for any public repository:

```md
![Star history](https://glyphbadges.dev/chart?owner=benjamin-blanke&repo=glyph)
```

See [`docs/graphs/README.md`](docs/graphs/README.md) for the chart URL and
parameter documentation.

## Project covers

Create a fixed-style project cover matching Glyph's dark dotted design:

```md
![Project cover](https://glyphbadges.dev/cover?title=Acme%20Toolkit&description=A%20delightful%20component%20library)
```

The cover uses Bricolage Grotesque from Google Fonts, with the title rendered
at weight 800 and the description at weight 400. The font family and visual
style are fixed so covers stay consistent.

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
