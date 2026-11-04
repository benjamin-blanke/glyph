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
rendering. The SVG loads Bricolage Grotesque from Google Fonts and uses weight
800 for the title and weight 400 for the description. The Google Fonts variable
family supports weights 200 through 800, but customers cannot change the font
or style.
