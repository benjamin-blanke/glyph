# SVG safety

Badge labels and messages are XML-escaped. Color input is normalized against a strict hexadecimal allowlist. Logo identifiers are restricted to letters, digits, and hyphens. Do not interpolate raw HTML or untrusted SVG markup.
