import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";
import { getInternshipCycle, sanitizeHeaderValue } from "@/lib/internships";
import {
  InternshipSchema,
  type InternshipData,
} from "@/lib/internships-schema";
import {
  insertInternshipApplication,
  updateApplicationResendId,
} from "@/lib/internship-applications";
import { getNotifyRecipients } from "@/lib/notify-recipients";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
    ${row("Phone", escapeHtml(data.phone.trim() || "—"))}
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

  // Persist first so a Resend failure still leaves a reviewable row.
  let applicationId: string | null = null;
  try {
    applicationId = await insertInternshipApplication(data, {
      cycleYear: cycle.summerYear,
      submittedIp: ip === "unknown" ? undefined : ip,
    });
  } catch (err) {
    console.error("[internships] persist error:", err);
    return NextResponse.json(
      { error: "Failed to save application. Please email us directly at info@riccc-lab.com" },
      { status: 500 }
    );
  }

  try {
    const { data: sent, error } = await getResend().emails.send({
      from: `RICCC Lab <noreply@${domain}>`,
      to: getNotifyRecipients(),
      replyTo: data.email,
      subject: `[RICCC Internship] Summer ${cycle.summerYear}: ${safeName}`,
      html: buildHtml(data, cycle.summerYear, siteUrl),
      text: [
        `Summer ${cycle.summerYear} Internship Application`,
        "",
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone.trim() || "—"}`,
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
        "X-Entity-Ref-ID": `riccc-internship-${applicationId ?? Date.now()}`,
      },
    });

    if (error || !sent?.id) {
      console.error("[internships] Resend error:", error);
      // Application is already stored — tell the applicant to email if needed,
      // but staff can still review the saved row.
      return NextResponse.json(
        { error: "Failed to send. Please email us directly at info@riccc-lab.com" },
        { status: 500 }
      );
    }

    if (applicationId && sent.id) {
      try {
        await updateApplicationResendId(applicationId, sent.id);
      } catch (err) {
        console.error("[internships] resend id update error:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[internships] send error:", err);
    return NextResponse.json(
      { error: "Failed to send. Please email us directly at info@riccc-lab.com" },
      { status: 500 }
    );
  }
}
