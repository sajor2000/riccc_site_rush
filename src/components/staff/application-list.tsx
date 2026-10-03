"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getInternshipCycle } from "@/lib/internships";
import type { ReviewStatusValue } from "@/lib/internships-schema";

interface ApplicationRow {
  id: string;
  createdAt: string;
  cycleYear: number;
  name: string;
  email: string;
  school: string;
  degreeLevel: string;
  major: string;
  reviewStatus: ReviewStatusValue;
}

const STATUS_STYLES: Record<ReviewStatusValue, string> = {
  new: "bg-rush-emerald/20 text-rush-dark-green",
  reviewed: "bg-rush-surface-container-high text-rush-on-surface",
  shortlisted: "bg-rush-dark-green text-white",
  declined: "bg-rush-light-gray text-rush-umber",
};

function formatSubmittedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ApplicationList() {
  const defaultCycle = getInternshipCycle().summerYear;
  const [cycleYear, setCycleYear] = useState(defaultCycle);
  const [cycles, setCycles] = useState<number[]>([defaultCycle]);
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRows = useCallback(async (cycle: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/staff/internship-applications?cycle=${cycle}&limit=100`
      );
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message ?? "Failed to load applications");
      }
      const json = (await res.json()) as {
        data: ApplicationRow[];
        total: number;
        cycles: number[];
        cycleYear: number;
      };
      setRows(json.data);
      setTotal(json.total);
      setCycles(json.cycles.length ? json.cycles : [cycle]);
      setCycleYear(json.cycleYear);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error loading applications");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRows(cycleYear);
  }, [cycleYear, fetchRows]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-rush-dark-green mb-2">
            Staff
          </p>
          <h1 className="text-3xl font-bold text-rush-dark-green tracking-tight">
            Internship applications
          </h1>
          <p className="mt-2 text-sm text-rush-on-surface-variant max-w-xl">
            Review Summer cycle applicants stored from the public form. Email
            notifications still go out as before.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-mono uppercase tracking-widest text-rush-umber">
            Cycle
            <select
              className="ml-2 rounded-sm border border-rush-outline-variant bg-white px-3 py-2 text-sm text-rush-on-surface normal-case tracking-normal"
              value={cycleYear}
              onChange={(e) => setCycleYear(Number(e.target.value))}
            >
              {cycles.map((y) => (
                <option key={y} value={y}>
                  Summer {y}
                </option>
              ))}
            </select>
          </label>
          <a
            href={`/api/staff/internship-applications/export?cycle=${cycleYear}`}
            className="inline-flex min-h-11 items-center rounded-sm border border-rush-outline-variant px-4 text-sm font-medium text-rush-dark-green hover:border-rush-teal hover:text-rush-teal transition-colors"
          >
            Export CSV
          </a>
        </div>
      </div>

      {error && (
        <div className="rounded-sm border border-rush-outline-variant bg-white px-4 py-3 text-sm text-rush-umber">
          {error}
        </div>
      )}

      <div className="rounded-sm border border-rush-outline-variant bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-rush-outline-variant/60">
          <span className="font-mono text-xs uppercase tracking-widest text-rush-umber">
            {loading ? "Loading…" : `${total} applicant${total === 1 ? "" : "s"}`}
          </span>
          <button
            type="button"
            onClick={() => fetchRows(cycleYear)}
            className="text-xs font-mono uppercase tracking-widest text-rush-dark-green hover:text-rush-teal"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="px-4 py-10 text-sm text-rush-mid-gray">Loading applications…</p>
        ) : rows.length === 0 ? (
          <div className="px-4 py-12">
            <p className="text-sm text-rush-on-surface">
              No applications for Summer {cycleYear} yet.
            </p>
            <p className="mt-2 text-sm text-rush-on-surface-variant max-w-lg">
              New submissions from{" "}
              <a
                href="/internships"
                className="text-rush-dark-green underline underline-offset-2 hover:text-rush-teal"
              >
                /internships
              </a>{" "}
              appear here after they are saved to the database.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-rush-outline-variant/60 text-xs font-mono uppercase tracking-widest text-rush-umber">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">School</th>
                  <th className="px-4 py-3 font-medium">Degree</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-rush-outline-variant/40 last:border-0 hover:bg-rush-surface-container-low/80"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/staff/applications/${row.id}`}
                        className="font-medium text-rush-dark-green hover:text-rush-teal"
                      >
                        {row.name}
                      </Link>
                      <div className="text-xs text-rush-mid-gray mt-0.5">
                        {row.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-rush-on-surface">
                      <div>{row.school}</div>
                      <div className="text-xs text-rush-mid-gray mt-0.5">
                        {row.major}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-rush-on-surface">
                      {row.degreeLevel}
                    </td>
                    <td className="px-4 py-3 text-rush-on-surface-variant whitespace-nowrap">
                      {formatSubmittedAt(row.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-sm px-2 py-1 text-xs font-mono uppercase tracking-wider ${STATUS_STYLES[row.reviewStatus]}`}
                      >
                        {row.reviewStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
