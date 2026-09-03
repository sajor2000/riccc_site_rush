import { describe, expect, it } from "vitest";
import { collaboratorBioParagraphs } from "@/components/team/collaborator-profile-card";

describe("collaboratorBioParagraphs", () => {
  it("removes template RICCC partnership closers", () => {
    const bio =
      "Lead paragraph about their work.\n\nShe partners with RICCC investigators on clinical trials and other multidisciplinary projects connected to RICCC.";
    expect(collaboratorBioParagraphs(bio)).toEqual([
      "Lead paragraph about their work.",
    ]);
  });

  it("keeps substantive paragraphs", () => {
    const bio = "First.\n\nSecond detail.";
    expect(collaboratorBioParagraphs(bio)).toEqual(["First.", "Second detail."]);
  });
});
