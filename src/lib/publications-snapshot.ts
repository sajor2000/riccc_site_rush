import fs from "fs";
import path from "path";
import { type Publication } from "./types";

export interface PublicationsSnapshot {
  generatedAt: string;
  count: number;
  sources?: Record<string, number>;
  authors?: string[];
  publications: Publication[];
}

/**
 * Read the committed publications snapshot (content/publications.json), produced
 * monthly by `npm run fetch:publications`. Returns [] if the file is missing or
 * malformed so the page can still render from a live fetch on a fresh checkout.
 */
export function getPublicationsSnapshot(): Publication[] {
  const file = path.join(process.cwd(), "content/publications.json");
  try {
    if (!fs.existsSync(file)) return [];
    const data = JSON.parse(fs.readFileSync(file, "utf-8")) as PublicationsSnapshot;
    return Array.isArray(data.publications) ? data.publications : [];
  } catch {
    return [];
  }
}

/** Dedup key: DOI when present, else a normalized title. */
function pubKey(p: Publication): string {
  return p.doi?.toLowerCase() || p.title.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Deterministic ordering: newest year first, then title A→Z as a stable tiebreaker.
 * The title tiebreaker keeps the committed snapshot's order stable across monthly
 * runs, so diffs show only real additions/changes — not reshuffled rows.
 */
export function comparePublications(a: Publication, b: Publication): number {
  return (
    b.year.localeCompare(a.year) ||
    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  );
}

/**
 * Merge a live fetch over the committed snapshot: snapshot is the resilient base,
 * live results win on conflict (fresher metadata / citation counts) and add any
 * brand-new papers indexed since the last monthly refresh. Sorted newest-first.
 */
export function mergeWithSnapshot(
  live: readonly Publication[],
  snapshot: readonly Publication[]
): Publication[] {
  const byKey = new Map<string, Publication>();
  for (const p of snapshot) byKey.set(pubKey(p), p);
  for (const p of live) byKey.set(pubKey(p), p); // live overwrites snapshot
  return Array.from(byKey.values()).sort(comparePublications);
}
