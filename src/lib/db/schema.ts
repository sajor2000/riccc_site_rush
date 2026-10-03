import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/** Staff-only review workflow status for internship applications. */
export const reviewStatusEnum = pgEnum("review_status", [
  "new",
  "reviewed",
  "shortlisted",
  "declined",
]);

export const internshipApplications = pgTable(
  "internship_applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    cycleYear: integer("cycle_year").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull().default(""),
    school: text("school").notNull(),
    degreeLevel: text("degree_level").notNull(),
    major: text("major").notNull(),
    graduation: text("graduation").notNull(),
    availabilityStart: text("availability_start").notNull(),
    availabilityEnd: text("availability_end").notNull(),
    skills: jsonb("skills").$type<string[]>().notNull().default([]),
    skillsOther: text("skills_other").notNull().default(""),
    whyRiccc: text("why_riccc").notNull(),
    experience: text("experience").notNull(),
    resumeUrl: text("resume_url").notNull(),
    portfolioUrl: text("portfolio_url").notNull().default(""),
    heardAbout: text("heard_about").notNull().default(""),
    submittedIp: text("submitted_ip"),
    resendMessageId: text("resend_message_id"),
    reviewStatus: reviewStatusEnum("review_status").notNull().default("new"),
    internalNotes: text("internal_notes").notNull().default(""),
  },
  (table) => [
    index("internship_applications_cycle_created_idx").on(
      table.cycleYear,
      table.createdAt.desc()
    ),
    uniqueIndex("internship_applications_email_cycle_uidx").on(
      table.email,
      table.cycleYear
    ),
  ]
);

export type InternshipApplication = typeof internshipApplications.$inferSelect;
export type NewInternshipApplication =
  typeof internshipApplications.$inferInsert;
export type ReviewStatus = (typeof reviewStatusEnum.enumValues)[number];
