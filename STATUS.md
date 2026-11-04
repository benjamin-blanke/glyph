# Status badges

## Dynamic Livck badge

Use these URLs directly in Markdown:

```md
![Livck Beta](https://glyph-six.vercel.app/badge/livck?url=https%3A%2F%2Fstatus.waveserv.com)
![Status](https://benjamin-blanke.github.io/glyph/badges/status-degraded.svg)
```

The Livck badge is **Beta** and reads the public status page on every request.
Use URL encoding for the status-page URL.

Supported Livck states are Operational, Degraded, Down, Maintenance, Incident,
Investigating, Monitoring, and Resolved.

## Static GitHub Pages fallback

GitHub Pages cannot fetch Livck dynamically. Use the static beta preview when
you need a Pages-only asset:

```md
![Livck Beta](https://benjamin-blanke.github.io/glyph/badges/livck-beta.svg)
```
