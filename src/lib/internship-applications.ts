import { desc, eq, sql } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import {
  internshipApplications,
  type InternshipApplication,
  type NewInternshipApplication,
  type ReviewStatus,
} from "@/lib/db/schema";
import type { InternshipData } from "@/lib/internships-schema";

export type ApplicationListItem = Pick<
  InternshipApplication,
  | "id"
  | "createdAt"
  | "cycleYear"
  | "name"
  | "email"
  | "school"
  | "degreeLevel"
  | "major"
  | "reviewStatus"
>;

/** Map validated form data + metadata into a Drizzle insert row. */
export function toApplicationInsert(
  data: InternshipData,
  meta: {
    cycleYear: number;
    submittedIp?: string;
    resendMessageId?: string | null;
  }
): NewInternshipApplication {
  return {
    cycleYear: meta.cycleYear,
    name: data.name,
    email: data.email,
    phone: data.phone.trim(),
    school: data.school,
    degreeLevel: data.degreeLevel,
    major: data.major,
    graduation: data.graduation,
    availabilityStart: data.availabilityStart,
    availabilityEnd: data.availabilityEnd,
    skills: [...data.skills],
    skillsOther: data.skillsOther.trim(),
    whyRiccc: data.whyRiccc,
    experience: data.experience,
    resumeUrl: data.resumeUrl,
    portfolioUrl: data.portfolioUrl.trim(),
    heardAbout: data.heardAbout.trim(),
    submittedIp: meta.submittedIp ?? null,
    resendMessageId: meta.resendMessageId ?? null,
  };
}

/**
 * Persist a successful internship application.
 * Returns the new row id, or null when the database is not configured.
 */
export async function insertInternshipApplication(
  data: InternshipData,
  meta: {
    cycleYear: number;
    submittedIp?: string;
    resendMessageId?: string | null;
  }
): Promise<string | null> {
  const db = getDb();
  if (!db) {
    console.warn(
      "[internships] DATABASE_URL unset — skipping application persist"
    );
    return null;
  }

  const [row] = await db
    .insert(internshipApplications)
    .values(toApplicationInsert(data, meta))
    .returning({ id: internshipApplications.id });

  return row?.id ?? null;
}

/** Attach Resend message id after a successful email send. */
export async function updateApplicationResendId(
  id: string,
  resendMessageId: string
): Promise<void> {
  const db = getDb();
  if (!db) return;
  await db
    .update(internshipApplications)
    .set({ resendMessageId })
    .where(eq(internshipApplications.id, id));
}

export async function listInternshipApplications(opts: {
  cycleYear: number;
  limit?: number;
  offset?: number;
}): Promise<{ items: ApplicationListItem[]; total: number }> {
  const db = getDb();
  if (!db) {
    return { items: [], total: 0 };
  }

  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200);
  const offset = Math.max(opts.offset ?? 0, 0);
  const where = eq(internshipApplications.cycleYear, opts.cycleYear);

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(internshipApplications)
    .where(where);

  const items = await db
    .select({
      id: internshipApplications.id,
      createdAt: internshipApplications.createdAt,
      cycleYear: internshipApplications.cycleYear,
      name: internshipApplications.name,
      email: internshipApplications.email,
      school: internshipApplications.school,
      degreeLevel: internshipApplications.degreeLevel,
      major: internshipApplications.major,
      reviewStatus: internshipApplications.reviewStatus,
    })
    .from(internshipApplications)
    .where(where)
    .orderBy(desc(internshipApplications.createdAt))
    .limit(limit)
    .offset(offset);

  return { items, total: countRow?.count ?? 0 };
}

export async function getInternshipApplication(
  id: string
): Promise<InternshipApplication | null> {
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .select()
    .from(internshipApplications)
    .where(eq(internshipApplications.id, id))
    .limit(1);
  return row ?? null;
}

export async function updateInternshipReview(
  id: string,
  patch: { reviewStatus?: ReviewStatus; internalNotes?: string }
): Promise<InternshipApplication | null> {
  const db = getDb();
  if (!db) return null;

  const updates: Partial<
    Pick<InternshipApplication, "reviewStatus" | "internalNotes">
  > = {};
  if (patch.reviewStatus !== undefined) updates.reviewStatus = patch.reviewStatus;
  if (patch.internalNotes !== undefined) {
    updates.internalNotes = patch.internalNotes;
  }
  if (Object.keys(updates).length === 0) {
    return getInternshipApplication(id);
  }

  const [row] = await db
    .update(internshipApplications)
    .set(updates)
    .where(eq(internshipApplications.id, id))
    .returning();
  return row ?? null;
}

/** Distinct cycle years present in the table (newest first). */
export async function listApplicationCycleYears(): Promise<number[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .selectDistinct({ cycleYear: internshipApplications.cycleYear })
    .from(internshipApplications)
    .orderBy(desc(internshipApplications.cycleYear));
  return rows.map((r) => r.cycleYear);
}

export async function listApplicationsForExport(
  cycleYear: number
): Promise<InternshipApplication[]> {
  const db = getDb();
  if (!db) return [];
  return db
    .select()
    .from(internshipApplications)
    .where(eq(internshipApplications.cycleYear, cycleYear))
    .orderBy(desc(internshipApplications.createdAt));
}

export { isDatabaseConfigured };
