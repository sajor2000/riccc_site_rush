import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/staff/auth";
import { getInternshipCycle } from "@/lib/internships";
import {
  isDatabaseConfigured,
  listApplicationCycleYears,
  listInternshipApplications,
} from "@/lib/internship-applications";

/** GET /api/staff/internship-applications — paginated list for staff review. */
export async function GET(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error: "database_unavailable",
        message:
          "DATABASE_URL is not configured. Add a Neon connection string in Vercel env.",
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

  const limit = Number(url.searchParams.get("limit") ?? "50");
  const offset = Number(url.searchParams.get("offset") ?? "0");

  try {
    const [{ items, total }, cycles] = await Promise.all([
      listInternshipApplications({
        cycleYear,
        limit: Number.isFinite(limit) ? limit : 50,
        offset: Number.isFinite(offset) ? offset : 0,
      }),
      listApplicationCycleYears(),
    ]);

    const cycleOptions = Array.from(
      new Set([cycle.summerYear, ...cycles, cycleYear])
    ).sort((a, b) => b - a);

    return NextResponse.json({
      data: items,
      total,
      cycleYear,
      cycles: cycleOptions,
    });
  } catch (err) {
    console.error("[staff] list internship applications error:", err);
    return NextResponse.json(
      { error: "server_error", message: "Failed to load applications" },
      { status: 500 }
    );
  }
}
