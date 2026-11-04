# Dynamic status badges

The dynamic status endpoint supports one reusable URL instead of a separate file for every state:

```md
![Status](https://glyph-six.vercel.app/badge/status?DEGRADED)
```

Supported states: `OPERATIONAL`, `DEGRADED`, `DOWN`, `MAINTENANCE`, `INCIDENT`, `INVESTIGATING`, `MONITORING`, `RESOLVED`, `SCHEDULED`, `ONLINE`, and `OFFLINE`.

For explicit query syntax, use `?status=degraded`. GitHub Pages is static and cannot interpret query strings in image URLs, so Pages users should use the static equivalents under `https://benjamin-blanke.github.io/glyph/badges/`, such as `status-degraded.svg`.
