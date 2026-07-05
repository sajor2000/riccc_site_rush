# RICCC Website

Website for the **Rush Interdisciplinary Consortium for Critical Care Trials and Data Science (RICCC)** at Rush University, Chicago.

## Contact
- Public lab email: info@riccc-lab.com

## Branding & Naming (IMPORTANT)
The site is **investigator-neutral**: visible titles, headings, and metadata lead with the RICCC consortium name — never "J.C. Rojas Lab", "Rojas Lab", or any single-investigator branding in on-page/SEO-visible copy.
- `siteConfig.name` ("RICCC") and `siteConfig.fullName` come from `content/site-config.json`; use them instead of hardcoding.
- Investigator names (J.C. Rojas, Kevin Buell) are kept **only in the invisible SEO layer** so the site still ranks for name searches: `keywords`, per-page `Person`/`NewsArticle` JSON-LD, and secondary ("Investigators include …") positions in meta descriptions. Do not surface them as primary page titles or H1s.

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Vercel hosting with Analytics + Speed Insights
- Resend for contact-form email delivery
- Staff admin panel at /staff/ (passphrase-protected, commits to GitHub via API)
- PubMed + Semantic Scholar + OpenAlex APIs for publications (author-name search)
- Content stored as MDX/JSON files in content/ directory

## Content Model
- Team members: `content/team/*.mdx` (frontmatter + bio). `name: "TBD"` is filtered out — do not commit placeholder members.
- Publications: `content/publications.json` (monthly snapshot; live APIs merge on top). Entries with unavailable metadata (empty title/year) are filtered out at render; the `Unknown` year group sorts last. See `lib/publications-*`.
- News: `content/news/*.mdx` → renders as a teaser list at `/news` **and** individual article pages at `/news/[slug]` (with `NewsArticle` JSON-LD, canonical, and `dynamicParams = false`). New articles must have a rebuild/deploy to appear.
- Site config: `content/site-config.json` — `metrics` holds only `founded` (the other counts were unused and removed; do not re-add stale hardcoded counts).

## SEO Conventions
- **Every public page sets its own `alternates: { canonical: "/path" }`** in `metadata`. The root layout canonical is `/` — a page without its own canonical inherits it and looks like a homepage duplicate to search engines.
- `Person` JSON-LD is emitted for **all current team members** (not just PIs) on `/team`; alumni are excluded.
- `sitemap.ts` enumerates news articles dynamically — keep it in sync when adding routes.

## Staff Admin Panel
- Login: /staff/login (shared passphrase, 8-hour session)
- Manage team members: /staff/members (add, edit, archive, upload photos)
- All edits commit directly to GitHub repo via Octokit + GITHUB_BOT_TOKEN
- Team members: content/team/*.mdx
- Research spotlights: content/spotlights.json (edit JSON directly or via code)
- Site config: content/site-config.json (edit JSON directly or via code)
- Photos: public/images/team/ as WebP (1024×1024; staff upload or `npm run optimize:team-photos`). Pipeline trims uniform borders (e.g. Teams/LinkedIn circle-on-gray) then attention-crops to square.
- **Headshot sources:** Prefer rectangular originals or LinkedIn profile photo at full size—not circular Teams thumbnails. Aim for ~800px+ on the short side before upload; re-crop in a photo app if needed. Team page avatars are `rounded-sm` squares; mission PI chips use `rounded-full`.

## Rush Brand System (from Rush Digital Quick Guide)
Official Rush colors with green as primary, defined in globals.css:
- `rush-green` (#006332): Growth Green — official primary brand color
- `rush-dark-green` (#004923): Derived heading shade — actual color used for h1–h3, CTA button backgrounds, active nav (darker for accessibility contrast ~9:1 on warm ivory)
- `rush-teal` (#00A66C): Legacy Green — links, secondary buttons, accents, focus rings, and **hover states only**. It is ~2.8:1 on ivory, so it **fails WCAG AA for text** — never use `text-rush-teal` for resting body copy, labels, or eyebrow text. Use `rush-dark-green` for any teal-*colored* text; keep teal for hover, decorative marks, and focus rings.
- `rush-emerald` (#5FEEA2): Vitality Green — highlights, badges
- `rush-ivory` (#FFFBEC): Page background (Rush tertiary)
- `rush-sage` (#DFF9EB), `rush-mint` (#E8F8F0): Rush tertiary greens — available as tokens; **do not** use as full-bleed section backgrounds (use `rush-surface-container-low` / `-container` / `-container-high` instead)
- `rush-charcoal` (#0C0C0C): Body text (Rush Black)
- `rush-mid-gray` (#A59F9F): Secondary text (Rush Wash Gray)
- `rush-umber` (#5F5858): Muted text (Rush Raw Umber)
- `rush-light-gray` (#EAEAEA): Borders, cards (Rush Gray)

## Anti-Patterns (DO NOT USE)
- No symmetric 3-column icon grids
- No gradient buttons (solid Rush Deep Blue only)
- No centered body text (left-aligned throughout)
- No colored side-borders on cards
- No Cerulean Blue text on light backgrounds
- No `text-rush-teal` for resting/label text on ivory (fails AA — use `rush-dark-green`)
- No single-investigator branding ("JC Rojas Lab" etc.) in visible titles/headings

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm test` — Vitest unit tests
- `npm run optimize:team-photos` — reprocess `public/images/team/` to 1024² WebP
- `npm run fetch:publications` — refresh `content/publications.json` snapshot (also via the `refresh-publications` skill)

## Verifying UI changes
Screenshots are the fastest way to check design work. Chromium + Playwright are preinstalled (`/opt/pw-browsers`, global `playwright`). Build + `npm run start`, then drive `localhost:3000` — and **scroll the page before capturing**, since team/news images lazy-load below the fold (an un-scrolled `fullPage` shot shows blank avatar boxes that are fine in the browser).

## GitHub & Deployment (for agents)
- Repo: `sajor2000/riccc_site_rush`. Vercel auto-deploys: every push builds a preview; merging to `main` deploys production (riccc-lab.com). CI status on a PR is the Vercel deployment check.
- The **staff admin panel** writes content by committing MDX/JSON directly to the repo via Octokit + `GITHUB_BOT_TOKEN`, then triggers ISR revalidation (`/api/revalidate`). So `content/` can change outside of normal PRs — treat it as the source of truth, not something only devs edit.
- Content pages use ISR (`export const revalidate = 3600`); `/news/[slug]` and other static routes only regenerate on deploy, so new `content/news/*.mdx` needs a build to appear.
- Agent workflow: branch from `main`, commit with `git config user.email noreply@anthropic.com`, open a **draft PR**, let the Vercel check pass, then hand off. A merged PR is final — start follow-up work from a fresh branch off `main`.

## Design References
- Parker Healthcare Allocation Lab: https://healthcare-allocation-lab.github.io/
- CLIF Consortium: https://clif-icu.com
