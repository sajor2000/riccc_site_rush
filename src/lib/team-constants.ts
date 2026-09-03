// Client-safe team constants — no Node.js imports (fs, path, gray-matter)
// Used by both server-side team.ts and client-side admin components

export type TeamTier = "pi" | "staff" | "student" | "alumni" | "collaborator";

// Canonical tier list — single source of truth for forms, validation, and display
export const TEAM_TIERS: readonly TeamTier[] = ["pi", "staff", "student", "alumni", "collaborator"] as const;

// Display order for admin UI — alumni last
export const TIER_DISPLAY_ORDER: readonly TeamTier[] = ["pi", "staff", "student", "collaborator", "alumni"] as const;

export const TIER_LABELS: Record<TeamTier, string> = {
  pi: "Principal Investigators",
  staff: "Staff",
  student: "Students & Trainees",
  collaborator: "Multidisciplinary Collaborations",
  alumni: "Alumni",
};

/** Display order for Multidisciplinary Collaborations domain headings. */
export const COLLABORATION_AREA_ORDER = [
  "Emergency Medicine",
  "Respiratory Care",
  "Human-Centered Design",
] as const;
