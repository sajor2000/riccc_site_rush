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
  const publications = mergePublications(pubmedPubs, s2Papers, oaWorks);

  // Guard: never overwrite a good snapshot with an empty one (API outage protection).
  if (publications.length === 0) {
    console.error(
      "No publications returned from any source — refusing to overwrite the existing snapshot."
    );
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
  console.log(
    `Wrote ${publications.length} publications to ${path.relative(process.cwd(), OUT)} ` +
      `(pubmed=${pubmedPubs.length}, s2=${s2Papers.length}, openalex=${oaWorks.length})`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
