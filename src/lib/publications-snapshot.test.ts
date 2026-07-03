import { describe, it, expect } from "vitest";
import { mergeWithSnapshot, comparePublications } from "./publications-snapshot";
import { type Publication } from "./types";

function pub(p: Partial<Publication> & { title: string; year: string }): Publication {
  return {
    pmid: "",
    authors: "",
    journal: "",
    doi: null,
    source: "openalex",
    ...p,
  };
}

describe("mergeWithSnapshot", () => {
  it("uses the snapshot as the base when live is empty", () => {
    const snapshot = [pub({ title: "A", year: "2025", doi: "10.1/a" })];
    const merged = mergeWithSnapshot([], snapshot);
    expect(merged).toHaveLength(1);
    expect(merged[0].title).toBe("A");
  });

  it("adds brand-new live papers on top of the snapshot", () => {
    const snapshot = [pub({ title: "Old", year: "2024", doi: "10.1/old" })];
    const live = [pub({ title: "New", year: "2026", doi: "10.1/new" })];
    const merged = mergeWithSnapshot(live, snapshot);
    expect(merged.map((p) => p.title)).toEqual(["New", "Old"]); // newest year first
  });

  it("dedupes by DOI and lets live win (fresher citation counts)", () => {
    const snapshot = [pub({ title: "Paper", year: "2025", doi: "10.1/X", citationCount: 3 })];
    const live = [pub({ title: "Paper", year: "2025", doi: "10.1/X", citationCount: 9 })];
    const merged = mergeWithSnapshot(live, snapshot);
    expect(merged).toHaveLength(1);
    expect(merged[0].citationCount).toBe(9);
  });

  it("dedupes DOI case-insensitively", () => {
    const snapshot = [pub({ title: "P", year: "2025", doi: "10.1/AbC" })];
    const live = [pub({ title: "P", year: "2025", doi: "10.1/abc" })];
    expect(mergeWithSnapshot(live, snapshot)).toHaveLength(1);
  });

  it("falls back to normalized title when DOI is missing", () => {
    const snapshot = [pub({ title: "No  DOI  Paper", year: "2025", doi: null })];
    const live = [pub({ title: "no doi paper", year: "2025", doi: null })];
    expect(mergeWithSnapshot(live, snapshot)).toHaveLength(1);
  });
});

describe("comparePublications", () => {
  it("orders by year desc, then title A→Z", () => {
    const items = [
      pub({ title: "Zebra", year: "2025" }),
      pub({ title: "Apple", year: "2025" }),
      pub({ title: "Older", year: "2020" }),
    ];
    const sorted = [...items].sort(comparePublications).map((p) => p.title);
    expect(sorted).toEqual(["Apple", "Zebra", "Older"]);
  });

  it("is stable for identical content (produces clean diffs)", () => {
    const a = [pub({ title: "B", year: "2025" }), pub({ title: "A", year: "2025" })];
    const first = [...a].sort(comparePublications).map((p) => p.title);
    const second = [...a].sort(comparePublications).map((p) => p.title);
    expect(first).toEqual(second);
    expect(first).toEqual(["A", "B"]);
  });
});
