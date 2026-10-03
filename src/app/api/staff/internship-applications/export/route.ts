import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/staff/auth";
import { getInternshipCycle } from "@/lib/internships";
import {
  isDatabaseConfigured,
  listApplicationsForExport,
} from "@/lib/internship-applications";

function csvEscape(value: string): string {
  // Neutralize Excel/Sheets formula injection on leading control chars.
  let v = value;
  if (/^[=+\-@\t\r]/.test(v)) {
    v = `'${v}`;
  }
  if (/[",\n\r]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

/** GET /api/staff/internship-applications/export?cycle=YYYY — CSV download. */
export async function GET(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error: "database_unavailable",
        message: "DATABASE_URL is not configured.",
      },
      { status: 503 }
    );
  }

  const url = new URL(req.url);
  const cycleParam = url.searchParams.get("cycle");
  const cycle = getInternshipCycle();
  const cycleYear = cycleParam ? Number(cycleParam) : cycle.summerYear;
  if (!Number.isInteger(cycleYear) || cycleYear < 2000 || cycleYear > 2100) {
    return NextResponse.json(
      { error: "invalid_cycle", message: "Invalid cycle year" },
      { status: 400 }
    );
  }

  try {
    const rows = await listApplicationsForExport(cycleYear);
    const header = [
      "id",
      "created_at",
      "cycle_year",
      "name",
      "email",
      "phone",
      "school",
      "degree_level",
      "major",
      "graduation",
      "availability_start",
      "availability_end",
      "skills",
      "skills_other",
      "why_riccc",
      "experience",
      "resume_url",
      "portfolio_url",
      "heard_about",
      "review_status",
      "internal_notes",
    ];

    const lines = [header.join(",")];
    for (const r of rows) {
      const skills = Array.isArray(r.skills) ? r.skills.join("; ") : "";
      lines.push(
        [
          r.id,
          r.createdAt.toISOString(),
          String(r.cycleYear),
          r.name,
          r.email,
          r.phone,
          r.school,
          r.degreeLevel,
          r.major,
          r.graduation,
          r.availabilityStart,
          r.availabilityEnd,
          skills,
          r.skillsOther,
          r.whyRiccc,
          r.experience,
          r.resumeUrl,
          r.portfolioUrl,
          r.heardAbout,
          r.reviewStatus,
          r.internalNotes,
        ]
          .map((v) => csvEscape(String(v ?? "")))
          .join(",")
      );
    }

    const body = lines.join("\n") + "\n";
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="riccc-internship-${cycleYear}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[staff] export internship applications error:", err);
    return NextResponse.json(
      { error: "server_error", message: "Failed to export applications" },
      { status: 500 }
    );
  }
}
