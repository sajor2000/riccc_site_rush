---
name: refresh-publications
description: Refresh the lab's publications + published conference abstracts from OpenAlex/PubMed/Semantic Scholar into content/publications.json. Use when adding a new author, after a paper should have appeared but hasn't, or to manually run the monthly snapshot refresh.
---

# Refresh publications

The `/publications` page renders from a committed snapshot, `content/publications.json`,
with a live fetch merged on top for freshness. The snapshot is regenerated **monthly**
by `.github/workflows/refresh-publications.yml` (cron `0 6 1 * *`), which runs the fetch
script and commits any changes — the push to `main` triggers a Vercel redeploy.

## How it fits together

- **Authors are configured in** `content/site-config.json`:
  - `openalex_authors` — `[{ name, id }]` (OpenAlex author IDs, e.g. `A5077904660`) — primary, most reliable
  - `authors` — display names used for the Semantic Scholar search
  - `pubmed_query` — the PubMed author/affiliation query
  - `exclude_title_patterns` — case-insensitive substrings that drop off-topic papers
- **Fetch script:** `scripts/fetch-publications.ts` (`npm run fetch:publications`). Reuses the
  same adapters as the page — `src/lib/openalex.ts`, `src/lib/pubmed.ts`,
  `src/lib/semantic-scholar.ts` — and `mergePublications()` (`src/lib/merge-publications.ts`)
  for dedup (by DOI) + filtering. Writes `content/publications.json`.
- **Snapshot loader:** `src/lib/publications-snapshot.ts` — `getPublicationsSnapshot()` reads the
  file; `mergeWithSnapshot(live, snapshot)` overlays a live fetch (live wins, snapshot is the floor).
- **Conference abstracts:** OpenAlex indexes published meeting/conference abstracts as
  `type:article`, so `fetchAuthorWorks` captures them automatically — no special handling needed.

## Run it manually

```bash
npm run fetch:publications   # writes content/publications.json
git add content/publications.json && git commit -m "chore(publications): refresh" && git push
```

The script **exits non-zero without writing** if all sources return nothing (API outage),
so a bad run never wipes the committed snapshot.

## Add a new author (most common task)

1. Find their OpenAlex author ID: `https://api.openalex.org/authors?search=<Full Name>`
   (take the `id` like `A5077904660` from the best match).
2. Add to `content/site-config.json` → `openalex_authors` (and their name to `authors`,
   and extend `pubmed_query` if you want PubMed coverage too).
3. Run `npm run fetch:publications`, review the diff, commit + push.

## Verify

- `npm run fetch:publications` prints per-source counts and the total written.
- `npx tsc --noEmit` and `npm test` stay green.
- Load `/publications` locally (`npm run dev`) — the new/updated papers appear.
