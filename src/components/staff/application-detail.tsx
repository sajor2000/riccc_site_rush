"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  REVIEW_STATUSES,
  type ReviewStatusValue,
} from "@/lib/internships-schema";

interface ApplicationDetail {
  id: string;
  createdAt: string;
  cycleYear: number;
  name: string;
  email: string;
  phone: string;
  school: string;
  degreeLevel: string;
  major: string;
  graduation: string;
  availabilityStart: string;
  availabilityEnd: string;
  skills: string[];
  skillsOther: string;
  whyRiccc: string;
  experience: string;
  resumeUrl: string;
  portfolioUrl: string;
  heardAbout: string;
  reviewStatus: ReviewStatusValue;
  internalNotes: string;
}

function formatSubmittedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-widest text-rush-umber">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-rush-on-surface">{children}</dd>
    </div>
  );
}

export function ApplicationDetail({ id }: { id: string }) {
  const [row, setRow] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<ReviewStatusValue>("new");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/staff/internship-applications/${id}`);
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message ?? "Failed to load application");
      }
      const { data } = (await res.json()) as { data: ApplicationDetail };
      setRow(data);
      setStatus(data.reviewStatus);
      setNotes(data.internalNotes ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error loading application");
      setRow(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`/api/staff/internship-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewStatus: status,
          internalNotes: notes,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message ?? "Save failed");
      }
      const { data } = (await res.json()) as { data: ApplicationDetail };
      setRow(data);
      setStatus(data.reviewStatus);
      setNotes(data.internalNotes ?? "");
      setSaveMsg("Saved");
    } catch (e) {
      setSaveMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-rush-mid-gray">Loading application…</p>;
  }

  if (error || !row) {
    return (
      <div className="space-y-4">
        <Link
          href="/staff/applications"
          className="text-sm text-rush-dark-green hover:text-rush-teal"
        >
          ← Back to applications
        </Link>
        <p className="text-sm text-rush-umber">{error || "Not found"}</p>
      </div>
    );
  }

  const skillsLine = [...row.skills, row.skillsOther].filter(Boolean).join(", ");

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/staff/applications"
          className="text-sm text-rush-dark-green hover:text-rush-teal"
        >
          ← Back to applications
        </Link>
        <p className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mt-4 mb-2">
          Summer {row.cycleYear}
        </p>
        <h1 className="text-3xl font-bold text-rush-dark-green tracking-tight">
          {row.name}
        </h1>
        <p className="mt-2 text-sm text-rush-on-surface-variant">
          Submitted {formatSubmittedAt(row.createdAt)} (Chicago)
        </p>
      </div>

      <section className="rounded-sm border border-rush-outline-variant bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold text-rush-dark-green">Review</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-rush-umber">
              Status
            </span>
            <select
              className="mt-1 w-full rounded-sm border border-rush-outline-variant bg-white px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as ReviewStatusValue)}
            >
              {REVIEW_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-rush-umber">
            Internal notes
          </span>
          <textarea
            className="mt-1 w-full min-h-28 rounded-sm border border-rush-outline-variant bg-white px-3 py-2 text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={5000}
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex min-h-11 items-center rounded-sm bg-rush-dark-green px-5 text-sm font-medium text-white hover:bg-rush-teal disabled:opacity-60 transition-colors"
          >
            {saving ? "Saving…" : "Save review"}
          </button>
          {saveMsg && (
            <span className="text-sm text-rush-on-surface-variant">{saveMsg}</span>
          )}
        </div>
      </section>

      <section className="rounded-sm border border-rush-outline-variant bg-white p-6">
        <h2 className="text-lg font-semibold text-rush-dark-green mb-4">
          Contact & education
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label="Email">
            <a
              href={`mailto:${row.email}`}
              className="text-rush-dark-green hover:text-rush-teal underline underline-offset-2"
            >
              {row.email}
            </a>
          </Field>
          <Field label="Phone">{row.phone || "—"}</Field>
          <Field label="School">{row.school}</Field>
          <Field label="Degree level">{row.degreeLevel}</Field>
          <Field label="Major / program">{row.major}</Field>
          <Field label="Expected graduation">{row.graduation}</Field>
          <Field label="Availability">
            {row.availabilityStart} – {row.availabilityEnd}
          </Field>
          <Field label="Skills">{skillsLine || "—"}</Field>
          <Field label="How they heard about us">{row.heardAbout || "—"}</Field>
        </dl>
      </section>

      <section className="rounded-sm border border-rush-outline-variant bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold text-rush-dark-green">Links</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href={row.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rush-dark-green hover:text-rush-teal underline underline-offset-2"
            >
              Resume / CV
            </a>
          </li>
          <li>
            {row.portfolioUrl ? (
              <a
                href={row.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rush-dark-green hover:text-rush-teal underline underline-offset-2"
              >
                Portfolio / GitHub
              </a>
            ) : (
              <span className="text-rush-mid-gray">No portfolio URL</span>
            )}
          </li>
        </ul>
      </section>

      <section className="rounded-sm border border-rush-outline-variant bg-white p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-rush-dark-green mb-3">
            Why RICCC / healthcare data science
          </h2>
          <div className="rounded-sm bg-rush-surface-container-low p-4 text-sm whitespace-pre-wrap leading-relaxed">
            {row.whyRiccc}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-rush-dark-green mb-3">
            Prior research, coursework, or projects
          </h2>
          <div className="rounded-sm bg-rush-surface-container-low p-4 text-sm whitespace-pre-wrap leading-relaxed">
            {row.experience}
          </div>
        </div>
      </section>
    </div>
  );
}
