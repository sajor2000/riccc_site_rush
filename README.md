# RICCC Lab Website

Website for the Rush Interdisciplinary Consortium for Critical Care Trials and Data Science (RICCC) at Rush University Medical Center, Chicago.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Hosting:** Vercel (Analytics + Speed Insights)
- **Admin:** Staff panel at `/staff/` (passphrase-protected, GitHub-backed)
- **Email:** Resend (contact form delivery)
- **Publications:** PubMed + Semantic Scholar + OpenAlex APIs

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.local.example` below or decrypt the existing secrets:

```bash
git secret reveal  # requires GPG key
```

| Variable | Purpose |
|---|---|
| `NCBI_API_KEY` | PubMed API rate limit increase |
| `SEMANTIC_SCHOLAR_API_KEY` | Semantic Scholar API |
| `CRON_SECRET` | Vercel cron job authentication |
| `ADMIN_PASSPHRASE` | Staff admin login at `/staff/login` |
| `SESSION_SECRET` | iron-session cookie encryption (32+ chars) |
| `GITHUB_BOT_TOKEN` | Fine-grained PAT for admin panel writes |
| `RESEND_API_KEY` | Contact form email delivery |
| `RESEND_DOMAIN` | Verified sending domain |
| `NEXT_PUBLIC_SITE_URL` | Production URL for CSRF checks |

## Project Structure

```
content/            # MDX/JSON content (git-backed CMS)
  team/*.mdx        # Team member profiles (name: "TBD" entries are filtered out)
  news/*.mdx        # News articles → /news list + /news/[slug] pages
  site-config.json  # Consortium name, PubMed query, links
  spotlights.json   # Research spotlights
  publications.json # Publications snapshot (live APIs merge on top)
public/images/      # Team photos (1024² WebP), logos
src/
  app/(public)/     # Public pages (team, research, news, contact, etc.)
  app/staff/        # Admin panel (passphrase-protected)
  app/api/          # API routes (contact, staff CRUD, revalidation)
  components/       # React components
  lib/              # Shared utilities (team, news, publications, config)
  lib/staff/        # Admin panel backend (auth, GitHub I/O, validation)
```

The site is investigator-neutral: visible copy leads with the RICCC consortium name, while
investigator names live only in the SEO layer (keywords, `Person`/`NewsArticle` JSON-LD). See
`CLAUDE.md` for branding, SEO, and color-contrast conventions before making UI changes.

## Staff Admin Panel

Passphrase-protected at `/staff/login`. Manages team members via GitHub Contents API (reads/writes MDX files directly to the repo).

Features: create, edit, archive/restore members, photo upload (sharp processing), and ISR revalidation.

## Commands

```bash
npm run dev       # Development server
npm run build     # Production build
npm run lint      # ESLint
```

## License

Private repository. All rights reserved.
