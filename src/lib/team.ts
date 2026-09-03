import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type { TeamTier } from "./team-constants";
export {
  TEAM_TIERS,
  TIER_DISPLAY_ORDER,
  TIER_LABELS,
  COLLABORATION_AREA_ORDER,
} from "./team-constants";
import type { TeamTier } from "./team-constants";
import { COLLABORATION_AREA_ORDER } from "./team-constants";

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  tier: TeamTier;
  email: string;
  bio: string;
  photo?: string;
  pubmedName?: string;
  orcid?: string;
  scholar?: string;
  linkedin?: string;
  website?: string;
  github?: string;
  displayOrder: number;
  missionSubtitle?: string;
  missionBlurb?: string;
  alternateNames?: string[];
  /** Discipline grouping for Multidisciplinary Collaborations section. */
  collaborationArea?: string;
}

const tierOrder: Record<TeamTier, number> = {
  pi: 0,
  staff: 1,
  student: 2,
  alumni: 3,
  collaborator: 4,
};

const validTiers = new Set<string>(["pi", "staff", "student", "alumni", "collaborator"]);

export function getAllTeamMembers(): TeamMember[] {
  const teamDir = path.join(process.cwd(), "content/team");

  if (!fs.existsSync(teamDir)) return [];

  const files = fs.readdirSync(teamDir).filter((f) => f.endsWith(".mdx"));

  const members = files.map((file) => {
    const raw = fs.readFileSync(path.join(teamDir, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.mdx$/, "");
    const tier = validTiers.has(data.tier) ? (data.tier as TeamTier) : "student";

    return {
      slug,
      name: data.name ?? slug,
      role: data.role ?? "",
      tier,
      email: data.email ?? "",
      bio: content.trim(),
      photo: data.photo || undefined,
      pubmedName: data.pubmed_name || undefined,
      orcid: data.orcid || undefined,
      scholar: data.scholar || undefined,
      linkedin: data.linkedin || undefined,
      website: data.website || undefined,
      github: data.github || undefined,
      displayOrder: data.display_order ?? 50,
      missionSubtitle: data.mission_subtitle || undefined,
      missionBlurb: data.mission_blurb || undefined,
      alternateNames: data.alternate_names || undefined,
      collaborationArea: data.collaboration_area || undefined,
    };
  });

  return members
    .filter((m) => m.name !== "TBD")
    .sort((a, b) => {
      const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
      if (tierDiff !== 0) return tierDiff;
      return a.displayOrder - b.displayOrder;
    });
}

/** Returns up to two uppercase initials from a member's name. */
export function getMemberInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getTeamMembersByTier(): Record<TeamTier, TeamMember[]> {
  const members = getAllTeamMembers();
  const grouped: Record<TeamTier, TeamMember[]> = {
    pi: [],
    staff: [],
    student: [],
    alumni: [],
    collaborator: [],
  };

  for (const member of members) {
    grouped[member.tier].push(member);
  }

  return grouped;
}

/** Group collaborators by collaboration_area for Multidisciplinary Collaborations. */
export function groupCollaboratorsByArea(
  collaborators: TeamMember[]
): { area: string; members: TeamMember[] }[] {
  const byArea = new Map<string, TeamMember[]>();

  for (const member of collaborators) {
    const area = member.collaborationArea?.trim() || "Collaborators";
    const list = byArea.get(area) ?? [];
    list.push(member);
    byArea.set(area, list);
  }

  const ordered: { area: string; members: TeamMember[] }[] = [];
  for (const area of COLLABORATION_AREA_ORDER) {
    const members = byArea.get(area);
    if (members && members.length > 0) {
      ordered.push({ area, members });
      byArea.delete(area);
    }
  }
  for (const [area, members] of byArea) {
    ordered.push({ area, members });
  }
  return ordered;
}

