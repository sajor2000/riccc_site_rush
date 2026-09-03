import { describe, expect, it } from "vitest";
import {
  groupCollaboratorsByArea,
  normalizeCollaborationArea,
  type TeamMember,
} from "./team";

function stub(partial: Partial<TeamMember> & Pick<TeamMember, "slug" | "name">): TeamMember {
  return {
    role: "",
    tier: "collaborator",
    email: "",
    bio: "",
    displayOrder: 50,
    ...partial,
  };
}

describe("groupCollaboratorsByArea", () => {
  it("orders known areas and keeps members", () => {
    const grouped = groupCollaboratorsByArea([
      stub({
        slug: "basapur",
        name: "Santosh Basapur",
        collaborationArea: "Human-Centered Design",
        displayOrder: 4,
      }),
      stub({
        slug: "gottlieb",
        name: "Michael Gottlieb",
        collaborationArea: "Emergency Medicine",
        displayOrder: 1,
      }),
      stub({
        slug: "li",
        name: "Jie Li",
        collaborationArea: "Respiratory Care",
        displayOrder: 2,
      }),
    ]);

    expect(grouped.map((g) => g.area)).toEqual([
      "Emergency Medicine",
      "Respiratory Care",
      "Human-Centered Design",
    ]);
    expect(grouped[0].members[0].slug).toBe("gottlieb");
  });

  it("inserts Critical Care Medicine in canonical order when present", () => {
    const grouped = groupCollaboratorsByArea([
      stub({
        slug: "li",
        name: "Jie Li",
        collaborationArea: "Respiratory Care",
      }),
      stub({
        slug: "greenberg",
        name: "Jared Greenberg",
        collaborationArea: "Critical Care Medicine",
      }),
      stub({
        slug: "gottlieb",
        name: "Michael Gottlieb",
        collaborationArea: "Emergency Medicine",
      }),
    ]);
    expect(grouped.map((g) => g.area)).toEqual([
      "Emergency Medicine",
      "Critical Care Medicine",
      "Respiratory Care",
    ]);
  });

  it("falls back when collaboration_area is missing", () => {
    const grouped = groupCollaboratorsByArea([
      stub({ slug: "x", name: "Someone" }),
    ]);
    expect(grouped).toEqual([
      { area: "Collaborators", members: [expect.objectContaining({ slug: "x" })] },
    ]);
  });

  it("falls back when collaboration_area is a non-string value", () => {
    const grouped = groupCollaboratorsByArea([
      stub({
        slug: "x",
        name: "Someone",
        collaborationArea: 123 as unknown as string,
      }),
    ]);
    expect(grouped[0].area).toBe("Collaborators");
  });
});

describe("normalizeCollaborationArea", () => {
  it("returns trimmed strings and rejects non-strings", () => {
    expect(normalizeCollaborationArea("  Emergency Medicine  ")).toBe(
      "Emergency Medicine"
    );
    expect(normalizeCollaborationArea("")).toBeUndefined();
    expect(normalizeCollaborationArea(123)).toBeUndefined();
    expect(normalizeCollaborationArea(null)).toBeUndefined();
  });
});
