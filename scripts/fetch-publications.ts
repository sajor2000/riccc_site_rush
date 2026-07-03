/**
 * Fetch papers + published conference abstracts for the lab's configured authors
 * and write a committed snapshot to content/publications.json.
 *
 * Reuses the SAME source adapters and merge logic as the live /publications page
 * (OpenAlex by author ID, PubMed by author query, Semantic Scholar by name), so
 * the snapshot is identical in shape to what the page would fetch live.
 *
 * Conference abstracts: OpenAlex indexes published meeting/conference abstracts as
 * `type:article`, so fetchAuthorWorks already captures them alongside journal papers.
 *
 * Run locally:   npm run fetch:publications
 * Automated:     .github/workflows/refresh-publications.yml (monthly cron)
 *
 * Optional env (higher rate limits, not required):
 *   NCBI_API_KEY, SEMANTIC_SCHOLAR_API_KEY
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { siteConfig } from "../src/lib/config";
import { searchByAuthor } from "../src/lib/pubmed";
import { searchAuthorPapers } from "../src/lib/semantic-scholar";
import { fetchAuthorWorks } from "../src/lib/openalex";
import { mergePublications } from "../src/lib/merge-publications";
import { getPublicationsSnapshot, unionSnapshot } from "../src/lib/publications-snapshot";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "content", "publications.json");

async function main() {
  const [pubmedPubs, s2Results, oaResults] = await Promise.all([
    searchByAuthor(siteConfig.pubmedQuery),
    Promise.all(siteConfig.authors.map((author) => searchAuthorPapers(author))),
    Promise.all(siteConfig.openalexAuthors.map((a) => fetchAuthorWorks(a.id))),
  ]);

  const s2Papers = s2Results.flat();
  const oaWorks = oaResults.flat();
  const fresh = mergePublications(pubmedPubs, s2Papers, oaWorks);

  // Monotonic union with the existing snapshot: a transient source outage this run
  // can never DROP previously captured papers; new papers are added, citation
  // counts refreshed. Keeps the committed snapshot stable and diffs minimal.
  const existing = getPublicationsSnapshot();
  const publications = unionSnapshot(existing, fresh);

  // Guard: only fails if there is neither prior snapshot nor any fresh result.
  if (publications.length === 0) {
    console.error("No publications available from any source or the existing snapshot.");
    process.exit(1);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    count: publications.length,
    sources: {
      pubmed: pubmedPubs.length,
      semanticScholar: s2Papers.length,
      openalex: oaWorks.length,
    },
    authors: siteConfig.openalexAuthors.map((a) => a.name),
    publications,
  };

  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n");
  const added = publications.length - existing.length;
  console.log(
    `Wrote ${publications.length} publications to ${path.relative(process.cwd(), OUT)} ` +
      `(existing=${existing.length}, +${added} new; this run's sources: ` +
      `pubmed=${pubmedPubs.length}, s2=${s2Papers.length}, openalex=${oaWorks.length})`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
