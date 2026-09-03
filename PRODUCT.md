# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

*[Inferred from repo / CLAUDE.md — confirm or correct]*

Primary: clinicians, data scientists, trainees, and academic collaborators evaluating RICCC for partnership, collaboration, or joining ICU research at Rush University (Chicago). Secondary: search visitors looking for RICCC, Rush critical care trials / data science, or investigator names (SEO layer only). Staff admins update team content via a passphrase-protected panel.

## Product Purpose

*[Inferred]*

Public website for the **Rush Interdisciplinary Consortium for Critical Care Trials and Data Science (RICCC)** — communicate the consortium’s mission, team, research, publications, tools, news, internships, and multidisciplinary collaborations; enable contact and collaboration inquiries.

## Positioning

*[Inferred]*

Investigator-neutral consortium brand (RICCC / Rush), not a single-PI “lab” site. Visible titles and H1s lead with RICCC; investigator names (J.C. Rojas, Kevin Buell) stay in invisible SEO / secondary meta only. Focus: critical care trials and data science, with Rush multidisciplinary partners (EM, critical care, respiratory care, HCD).

## Operating Context

*[Inferred]*

- Content: MDX/JSON under `content/` (team, news, publications snapshot, site-config, spotlights)
- Public App Router pages + ISR; staff panel commits to GitHub via Octokit
- Contact and internship forms via Resend
- Publications merge live APIs (PubMed / Semantic Scholar / OpenAlex) over monthly snapshot
- Hosted on Vercel (`riccc-lab.com`); public email `info@riccc-lab.com`

## Capabilities and Constraints

*[Inferred]*

- Public routes: home, mission, research, team, collaborations, publications, tools, news, contact, internships
- Staff: `/staff/` passphrase session; manage team MDX + photos
- Brand: Rush Digital Quick Guide tokens in CSS (`rush-green`, `rush-dark-green`, `rush-teal` for hover/focus only — not resting text, etc.)
- Anti-patterns documented in CLAUDE.md (no 3-col icon grids, no investigator branding in visible titles, no `text-rush-teal` for resting copy)
- Open: PRODUCT.md audience nuance and success metrics not yet confirmed with stakeholders

## Brand Commitments

*[Inferred from CLAUDE.md — binding for this repo]*

- Name: RICCC; full name from `content/site-config.json`
- Visible branding is consortium-first / investigator-neutral
- Rush color system and typography conventions as implemented in the site
- Design references: Parker Healthcare Allocation Lab; CLIF Consortium

## Evidence on Hand

- Live site content and team MDX (including multidisciplinary collaborators)
- `content/publications.json` + fetch scripts
- Logo / team photo pipeline under `public/images/`
- Do **not** fabricate testimonials, grant amounts, or unpublished trial claims

## Product Principles

1. Consortium identity over individual investigator branding in visible UI.
2. Clinical and academic credibility through clear structure, real Rush partners, and accurate profiles.
3. Content is the source of truth (`content/`); the site should stay editable by staff without a redesign.
4. Accessibility: prefer WCAG-minded Rush tokens (dark green for text; teal for interaction only).
5. Prefer Rush system patterns already shipped on `/team` and peers over one-off page inventions.

## Accessibility & Inclusion

*[Inferred]*

Target WCAG AA contrast for body/UI text on ivory surfaces; usable keyboard focus (Rush teal rings); touch targets ≥44px on interactive controls where polished.
