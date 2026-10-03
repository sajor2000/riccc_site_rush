import { describe, expect, it } from "vitest";
import { toApplicationInsert } from "@/lib/internship-applications";
import {
  InternshipReviewPatchSchema,
  InternshipSchema,
} from "@/lib/internships-schema";

const validPayload = {
  name: "Ada Lovelace",
  email: "ada@example.edu",
  phone: "312-555-0100",
  school: "Rush University",
  degreeLevel: "Undergraduate" as const,
  major: "Data Science",
  graduation: "May 2028",
  availabilityStart: "May",
  availabilityEnd: "August",
  skills: ["Python", "SQL"] as ("Python" | "SQL")[],
  skillsOther: "",
  whyRiccc: "I want to apply data science to critical care.",
  experience: "Coursework in biostatistics and a capstone on EHR data.",
  resumeUrl: "https://example.com/resume.pdf",
  portfolioUrl: "https://github.com/ada",
  heardAbout: "RICCC website",
  website: "",
};

describe("InternshipSchema", () => {
  it("accepts a complete application payload", () => {
    const parsed = InternshipSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
  });

  it("rejects when skills and skillsOther are both empty", () => {
    const parsed = InternshipSchema.safeParse({
      ...validPayload,
      skills: [],
      skillsOther: "",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("toApplicationInsert", () => {
  it("maps form fields into a DB insert row", () => {
    const data = InternshipSchema.parse(validPayload);
    const row = toApplicationInsert(data, {
      cycleYear: 2027,
      submittedIp: "203.0.113.10",
      resendMessageId: "re_123",
    });

    expect(row.cycleYear).toBe(2027);
    expect(row.name).toBe("Ada Lovelace");
    expect(row.email).toBe("ada@example.edu");
    expect(row.skills).toEqual(["Python", "SQL"]);
    expect(row.submittedIp).toBe("203.0.113.10");
    expect(row.resendMessageId).toBe("re_123");
    expect(row.portfolioUrl).toBe("https://github.com/ada");
  });

  it("trims optional string fields", () => {
    const data = InternshipSchema.parse({
      ...validPayload,
      phone: "  ",
      skillsOther: "  R tidyverse  ",
      portfolioUrl: "",
      heardAbout: "  LinkedIn  ",
    });
    const row = toApplicationInsert(data, { cycleYear: 2027 });
    expect(row.phone).toBe("");
    expect(row.skillsOther).toBe("R tidyverse");
    expect(row.heardAbout).toBe("LinkedIn");
  });
});

describe("InternshipReviewPatchSchema", () => {
  it("accepts status and notes", () => {
    const parsed = InternshipReviewPatchSchema.safeParse({
      reviewStatus: "shortlisted",
      internalNotes: "Strong Python background",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects unknown review status", () => {
    const parsed = InternshipReviewPatchSchema.safeParse({
      reviewStatus: "hired",
    });
    expect(parsed.success).toBe(false);
  });
});
