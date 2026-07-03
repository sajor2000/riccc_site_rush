import { describe, it, expect } from "vitest";
import { mergeWithSnapshot, comparePublications, unionSnapshot } from "./publications-snapshot";
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

describe("unionSnapshot (monotonic snapshot builder)", () => {
  it("never drops a paper when a fresh run omits it (transient outage)", () => {
    const existing = [
      pub({ title: "Kept", year: "2025", doi: "10.1/keep" }),
      pub({ title: "Also Kept", year: "2024", doi: "10.1/keep2" }),
    ];
    const fresh = [pub({ title: "Kept", year: "2025", doi: "10.1/keep" })]; // 2nd paper missing this run
    const merged = unionSnapshot(existing, fresh);
    expect(merged.map((p) => p.title).sort()).toEqual(["Also Kept", "Kept"]);
  });

  it("adds newly indexed papers from the fresh run", () => {
    const existing = [pub({ title: "Old", year: "2024", doi: "10.1/old" })];
    const fresh = [pub({ title: "Brand New", year: "2026", doi: "10.1/new" })];
    const merged = unionSnapshot(existing, fresh);
    expect(merged.map((p) => p.title)).toEqual(["Brand New", "Old"]);
  });

  it("keeps existing metadata but bumps citation count to the max", () => {
    const existing = [
      pub({ title: "P", year: "2025", doi: "10.1/x", journal: "BMJ", citationCount: 3 }),
    ];
    const fresh = [
      pub({ title: "P", year: "2025", doi: "10.1/x", journal: "British medical journal", citationCount: 8 }),
    ];
    const merged = unionSnapshot(existing, fresh);
    expect(merged).toHaveLength(1);
    expect(merged[0].journal).toBe("BMJ"); // existing metadata stays (stable diffs)
    expect(merged[0].citationCount).toBe(8); // citations refresh upward
  });

  it("does not mutate the input arrays", () => {
    const existing = [pub({ title: "P", year: "2025", doi: "10.1/x", citationCount: 1 })];
    const fresh = [pub({ title: "P", year: "2025", doi: "10.1/x", citationCount: 5 })];
    unionSnapshot(existing, fresh);
    expect(existing[0].citationCount).toBe(1); // original untouched
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
