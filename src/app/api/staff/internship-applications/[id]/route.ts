import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/staff/auth";
import { checkOrigin } from "@/lib/staff/csrf";
import { InternshipReviewPatchSchema } from "@/lib/internships-schema";
import {
  getInternshipApplication,
  isDatabaseConfigured,
  updateInternshipReview,
} from "@/lib/internship-applications";

type RouteContext = { params: Promise<{ id: string }> };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** GET /api/staff/internship-applications/[id] — full application for staff. */
export async function GET(_req: NextRequest, { params }: RouteContext) {
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

  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json(
      { error: "invalid_id", message: "Invalid application id" },
      { status: 400 }
    );
  }

  try {
    const row = await getInternshipApplication(id);
    if (!row) {
      return NextResponse.json(
        { error: "not_found", message: "Application not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: row });
  } catch (err) {
    console.error("[staff] get internship application error:", err);
    return NextResponse.json(
      { error: "server_error", message: "Failed to load application" },
      { status: 500 }
    );
  }
}

/** PATCH /api/staff/internship-applications/[id] — update review status/notes. */
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const csrfError = checkOrigin(req);
  if (csrfError) return csrfError;

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error: "database_unavailable",
        message: "DATABASE_URL is not configured.",
      },
      { status: 503 }
    );
  }

  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json(
      { error: "invalid_id", message: "Invalid application id" },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = InternshipReviewPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  if (
    parsed.data.reviewStatus === undefined &&
    parsed.data.internalNotes === undefined
  ) {
    return NextResponse.json(
      { error: "empty_patch", message: "No review fields to update" },
      { status: 400 }
    );
  }

  try {
    const row = await updateInternshipReview(id, {
      reviewStatus: parsed.data.reviewStatus,
      internalNotes: parsed.data.internalNotes,
    });
    if (!row) {
      return NextResponse.json(
        { error: "not_found", message: "Application not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: row });
  } catch (err) {
    console.error("[staff] patch internship application error:", err);
    return NextResponse.json(
      { error: "server_error", message: "Failed to update application" },
      { status: 500 }
    );
  }
}
