# Status badges

Glyph supports both dynamic status badges and static GitHub Pages assets.

## Dynamic API

Use one endpoint and select the state with either shorthand or an explicit
query parameter:

```md
![Status](https://benjamin-blanke.github.io/glyph/badges/status-degraded.svg)
![Status](https://benjamin-blanke.github.io/glyph/badges/status-maintenance.svg)
```

Supported states:

| State | Example |
|---|---|
| Operational | `?OPERATIONAL` |
| Degraded | `?DEGRADED` |
| Down | `?DOWN` |
| Maintenance | `?MAINTENANCE` |
| Incident | `?INCIDENT` |
| Investigating | `?INVESTIGATING` |
| Monitoring | `?MONITORING` |
| Resolved | `?RESOLVED` |
| Scheduled | `?SCHEDULED` |
| Online | `?ONLINE` |
| Offline | `?OFFLINE` |

The explicit form is useful when the state comes from a monitoring system:

```text
https://YOUR_API_HOST/badge/status?status=degraded
```

## GitHub Pages equivalents

Pages serves static files and does not execute query-string logic. Use these
files when the entire badge must stay on GitHub Pages:

```text
https://benjamin-blanke.github.io/glyph/badges/status-operational.svg
https://benjamin-blanke.github.io/glyph/badges/status-degraded.svg
https://benjamin-blanke.github.io/glyph/badges/status-down.svg
https://benjamin-blanke.github.io/glyph/badges/status-maintenance.svg
https://benjamin-blanke.github.io/glyph/badges/status-monitoring.svg
https://benjamin-blanke.github.io/glyph/badges/status-resolved.svg
```

## Link a badge

```md
[![Status](https://benjamin-blanke.github.io/glyph/badges/status-operational.svg)](https://status.example.com)
```

## Livck Cloud beta

For a public Livck status page, use:

```md
![Livck status](https://YOUR_API_HOST/badge/livck?url=https%3A%2F%2Fstatus.waveserv.com)
```

The endpoint also accepts the shorthand form `/badge/livck?https://status.waveserv.com`.
It queries the public Livck status API on every request and returns a fresh
badge. This integration is marked **Beta**.
