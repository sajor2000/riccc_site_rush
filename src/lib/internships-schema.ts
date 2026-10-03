import { z } from "zod";
import { DEGREE_LEVELS, isHttpUrl, SKILL_OPTIONS } from "@/lib/internships";

const httpUrl = z
  .string()
  .max(500)
  .refine(isHttpUrl, { message: "URL must start with http:// or https://" });

/** Zod schema for public internship application POST bodies. */
export const InternshipSchema = z
  .object({
    name: z.string().min(1).max(200),
    email: z.string().email().max(254),
    phone: z.string().max(40).optional().default(""),
    school: z.string().min(1).max(200),
    degreeLevel: z.enum(DEGREE_LEVELS),
    major: z.string().min(1).max(200),
    graduation: z.string().min(1).max(40),
    availabilityStart: z.string().min(1).max(40),
    availabilityEnd: z.string().min(1).max(40),
    skills: z.array(z.enum(SKILL_OPTIONS)).max(SKILL_OPTIONS.length).default([]),
    skillsOther: z.string().max(200).optional().default(""),
    whyRiccc: z.string().min(1).max(2500),
    experience: z.string().min(1).max(1200),
    resumeUrl: httpUrl,
    portfolioUrl: z
      .string()
      .max(500)
      .optional()
      .default("")
      .refine((v) => !v || isHttpUrl(v), {
        message: "URL must start with http:// or https://",
      }),
    heardAbout: z.string().max(500).optional().default(""),
    // Honeypot — allow any string so bots that fill it get silent success
    website: z.string().max(200).optional().default(""),
  })
  .refine(
    (data) => data.skills.length > 0 || data.skillsOther.trim().length > 0,
    {
      message: "Select at least one skill or describe other relevant skills.",
      path: ["skills"],
    }
  );

export type InternshipData = z.infer<typeof InternshipSchema>;

export const REVIEW_STATUSES = [
  "new",
  "reviewed",
  "shortlisted",
  "declined",
] as const;

export type ReviewStatusValue = (typeof REVIEW_STATUSES)[number];

/** Staff PATCH body for review workflow fields only. */
export const InternshipReviewPatchSchema = z.object({
  reviewStatus: z.enum(REVIEW_STATUSES).optional(),
  internalNotes: z.string().max(5000).optional(),
});
