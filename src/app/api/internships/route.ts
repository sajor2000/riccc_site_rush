import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import {
  DEGREE_LEVELS,
  getInternshipCycle,
  isHttpUrl,
  sanitizeHeaderValue,
  SKILL_OPTIONS,
} from "@/lib/internships";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const RECIPIENTS = [
  "juan_rojas@rush.edu",
  "juancroj@gmail.com",
  "Kevin_Buell@rush.edu",
];

// Rate limit: 3 submissions per IP per 15 minutes
const submissions = new Map<string, { count: number; resetAt: number }>();

function checkInternshipRateLimit(ip: string): boolean {
  const now = Date.now();
  if (submissions.size > 200) {
    for (const [key, entry] of submissions) {
      if (now > entry.resetAt) submissions.delete(key);
    }
  }
  const entry = submissions.get(ip);
  if (!entry || now > entry.resetAt) {
    submissions.set(ip, { count: 1, resetAt: now + 15 * 60_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

const httpUrl = z
  .string()
  .max(500)
  .refine(isHttpUrl, { message: "URL must start with http:// or https://" });

const InternshipSchema = z
  .object({
    name: z.string().min(1).max(200),
    email: z.string().email().max(254),
    phone: z.string().min(1).max(40),
    school: z.string().min(1).max(200),
    degreeLevel: z.enum(DEGREE_LEVELS),
    major: z.string().min(1).max(200),
    graduation: z.string().min(1).max(40),
    availabilityStart: z.string().min(1).max(40),
    availabilityEnd: z.string().min(1).max(40),
    skills: z.array(z.enum(SKILL_OPTIONS)).max(SKILL_OPTIONS.length).default([]),
    skillsOther: z.string().max(200).optional().default(""),
    whyRiccc: z.string().min(1).max(2500),
    experience: z.string().min(1).max(2500),
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type InternshipData = z.infer<typeof InternshipSchema>;

function row(label: string, value: string, alt = false): string {
  const bg = alt ? ' style="background: #f8f4e5;"' : "";
  return `<tr${bg}>
      <td style="padding: 8px 12px; font-weight: bold; width: 160px; vertical-align: top; color: #5f5858;">${escapeHtml(label)}</td>
      <td style="padding: 8px 12px;">${value}</td>
    </tr>`;
}

function buildHtml(data: InternshipData, summerYear: number, siteUrl: string): string {
  const skills = [...data.skills, data.skillsOther.trim()].filter(Boolean).join(", ");
  const portfolio = data.portfolioUrl
    ? `<a href="${escapeHtml(data.portfolioUrl)}" style="color: #00A66C;">${escapeHtml(data.portfolioUrl)}</a>`
    : "—";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, Helvetica, sans-serif; color: #1c1c13; line-height: 1.6; max-width: 640px;">
  <div style="border-bottom: 3px solid #004923; padding-bottom: 12px; margin-bottom: 24px;">
    <strong style="color: #004923; font-size: 18px;">RICCC Lab: Summer ${summerYear} Internship Application</strong>
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    ${row("Name", escapeHtml(data.name))}
    ${row("Email", `<a href="mailto:${escapeHtml(data.email)}" style="color: #00A66C;">${escapeHtml(data.email)}</a>`, true)}
    ${row("Phone", escapeHtml(data.phone))}
    ${row("School", escapeHtml(data.school), true)}
    ${row("Degree level", escapeHtml(data.degreeLevel))}
    ${row("Major / program", escapeHtml(data.major), true)}
    ${row("Expected graduation", escapeHtml(data.graduation))}
    ${row("Availability", `${escapeHtml(data.availabilityStart)} – ${escapeHtml(data.availabilityEnd)}`, true)}
    ${row("Skills", escapeHtml(skills))}
    ${row("Resume / CV", `<a href="${escapeHtml(data.resumeUrl)}" style="color: #00A66C;">${escapeHtml(data.resumeUrl)}</a>`, true)}
    ${row("Portfolio / GitHub", portfolio)}
    ${row("How they heard about us", escapeHtml(data.heardAbout || "—"), true)}
  </table>
  <div style="margin-bottom: 24px;">
    <strong style="color: #5f5858;">Why RICCC / healthcare data science</strong>
    <div style="margin-top: 8px; padding: 16px; background: #f8f4e5; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(data.whyRiccc)}</div>
  </div>
  <div style="margin-bottom: 24px;">
    <strong style="color: #5f5858;">Prior research, coursework, or projects</strong>
    <div style="margin-top: 8px; padding: 16px; background: #f8f4e5; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(data.experience)}</div>
  </div>
  <div style="font-size: 12px; color: #a59f9f; border-top: 1px solid #eaeaea; padding-top: 12px;">
    Sent from the RICCC Lab website internship form · <a href="${escapeHtml(siteUrl)}/internships" style="color: #00A66C;">riccc-lab.com/internships</a>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const cycle = getInternshipCycle();
  if (!cycle.open) {
    return NextResponse.json(
      {
        error:
          "Applications are closed for this cycle. Please check back after January 1.",
      },
      { status: 403 }
    );
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkInternshipRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = InternshipSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot triggered — silently succeed so bots think it worked
  if (data.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const domain = process.env.RESEND_DOMAIN ?? "riccc-lab.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${domain}`;
  const safeName = sanitizeHeaderValue(data.name);
  const skillsLine = [...data.skills, data.skillsOther.trim()]
    .filter(Boolean)
    .join(", ");

  try {
    await getResend().emails.send({
      from: `RICCC Lab <noreply@${domain}>`,
      to: RECIPIENTS,
      replyTo: data.email,
      subject: `Summer Internship Application: ${safeName}`,
      html: buildHtml(data, cycle.summerYear, siteUrl),
      text: [
        `Summer ${cycle.summerYear} Internship Application`,
        "",
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `School: ${data.school}`,
        `Degree level: ${data.degreeLevel}`,
        `Major / program: ${data.major}`,
        `Expected graduation: ${data.graduation}`,
        `Availability: ${data.availabilityStart} – ${data.availabilityEnd}`,
        `Skills: ${skillsLine}`,
        `Resume / CV: ${data.resumeUrl}`,
        `Portfolio / GitHub: ${data.portfolioUrl || "—"}`,
        `How they heard about us: ${data.heardAbout || "—"}`,
        "",
        "Why RICCC / healthcare data science:",
        data.whyRiccc,
        "",
        "Prior research, coursework, or projects:",
        data.experience,
        "",
        "---",
        "Sent from the RICCC Lab website internship form",
      ].join("\n"),
      headers: {
        "X-Entity-Ref-ID": `riccc-internship-${Date.now()}`,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[internships] send error:", err);
    return NextResponse.json(
      { error: "Failed to send. Please email us directly at info@riccc-lab.com" },
      { status: 500 }
    );
  }
}
