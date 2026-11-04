![Project covers](https://glyphbadges.dev/cover?title=Project%20Covers&description=Create%20beautiful%20project%20covers%20with%20Glyph)

# Project covers

Glyph covers use a fixed visual style based on the supplied reference:

- 720 × 252 SVG canvas
- Dark background
- Visible dotted grid
- Soft vignette
- Centered title and description
- Bricolage Grotesque from Google Fonts
- Fixed visual treatment with no font or layout options

## URL

```text
https://glyphbadges.dev/cover?title=TITLE&description=DESCRIPTION
```

Example:

```md
![Acme Toolkit](https://glyphbadges.dev/cover?title=Acme%20Toolkit&description=A%20delightful%20component%20library)
```

The `title` and `description` values are URL-encoded and sanitized before
rendering. The SVG embeds the official Bricolage Grotesque variable font from Google Fonts
and uses weight 800 for the title and weight 400 for the description. The
embedded family supports weights 200 through 800, so GitHub renders the same
font without needing to load an external stylesheet. Customers cannot change
the font or style.
