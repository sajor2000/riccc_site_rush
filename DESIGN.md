---
name: RICCC
description: Rush Interdisciplinary Consortium for Critical Care Trials and Data Science — Critical Care Editorial
colors:
  rush-green: "#006332"
  rush-dark-green: "#004923"
  rush-teal: "#00A66C"
  rush-emerald: "#5FEEA2"
  rush-wash-green: "#9AEFC2"
  rush-secondary-container: "#79fbb8"
  rush-ivory: "#FFFBEC"
  rush-surface: "#fdf9ea"
  rush-surface-container-low: "#f8f4e5"
  rush-surface-container: "#f2eedf"
  rush-surface-container-high: "#ece8da"
  rush-on-surface: "#1c1c13"
  rush-on-surface-variant: "#3f4940"
  rush-charcoal: "#0C0C0C"
  rush-umber: "#5F5858"
  rush-mid-gray: "#A59F9F"
  rush-light-gray: "#EAEAEA"
  rush-outline: "#6f7a6f"
  rush-outline-variant: "#bfc9bd"
  rush-white: "#FFFFFF"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.025em"
    lineHeight: 1.1
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.625
  mono-label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.1em"
rounded:
  sm: "2px"
  md: "6px"
spacing:
  section-y: "6rem"
  gutter: "3rem"
  measure: "48rem"
components:
  button-primary:
    backgroundColor: "{colors.rush-dark-green}"
    textColor: "{colors.rush-white}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.rush-dark-green}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  link-mono:
    textColor: "{colors.rush-dark-green}"
    typography: "{typography.mono-label}"
---

## Overview

Critical Care Editorial: ivory Rush surfaces, dark-green headings, mono uppercase labels, asymmetric `lg:ml-12` gutters, and short teal accent rules under section titles. Consortium-first branding; investigator names stay in SEO/meta, not H1s.

## Colors

- Canvas: `rush-surface` / ivory; bands use `surface-container-low` → `high` (not sage/mint full-bleed).
- Headings and primary CTAs: `rush-dark-green` (~9:1 on ivory).
- `rush-teal`: hover, focus rings, decorative rules only — never resting body/label text.
- Body: `rush-on-surface`; secondary: `rush-on-surface-variant`.

## Typography

- Sans display/body: Inter via `--font-sans`.
- Labels/eyebrows: Geist Mono, `uppercase tracking-widest`, `text-xs` (or larger when roles wrap).
- Page H1: ~4–6xl bold tracking-tight; section H2: 2–4xl with teal rule beneath.

## Layout

- `max-w-screen-2xl` shell; reading measure `max-w-3xl` / ~65–75ch.
- Prefer left-aligned copy; asymmetric gutter `ml-0 lg:ml-12` on major headers.
- One job per section; cards only when they aid interaction (default: no card chrome).

## Elevation & Depth

- Soft shadows: `shadow-card` / `shadow-card-sm` on roster rows when needed.
- Borders: `border-rush-outline-variant` at low opacity; no colored side borders on cards.

## Shapes

- Corners: `rounded-sm` (near-square). Team avatars square; mission PI chips may be `rounded-full`.

## Components

- Primary button: solid `rush-dark-green`, white text, `min-h-11`.
- Secondary: outline on outline-variant.
- Mono text links: underline via border-b, dark-green.
- Compact member rows: initials tile + name + role + socials.
- Teal rule: `h-1 w-16|w-24 bg-rush-teal` under titles.

## Do's and Don'ts

**Do**

- Lead visible titles with RICCC / consortium language.
- Match `/team` craft (teal rules, gutters, initials) on related people surfaces.
- Keep teal for interaction and decoration only.

**Don't**

- Single-investigator branding in H1s or primary titles (“Rojas Lab”, etc.).
- Symmetric 3-column icon grids; gradient buttons; centered body text.
- `text-rush-teal` for resting labels on ivory.
- Colored left/right borders on cards; sage/mint full-bleed section washes.
