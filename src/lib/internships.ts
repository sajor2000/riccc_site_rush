/** Summer internship application cycle: open Jan 1–Dec 1 (America/Chicago) for the following summer. */

export const INTERNSHIP_TIMEZONE = "America/Chicago";

export interface InternshipCycle {
  /** Whether applications are currently accepted. */
  open: boolean;
  /** Calendar year of the December 1 deadline for this cycle. */
  deadlineYear: number;
  /** Human-readable deadline, e.g. "December 1, 2026". */
  deadlineLabel: string;
  /** Calendar year of the summer the applicant would join. */
  summerYear: number;
  /** Human-readable reopen date when closed, e.g. "January 1, 2027". */
  reopensLabel?: string;
}

/** YYYY-MM-DD in America/Chicago for the given instant. */
export function chicagoDateString(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: INTERNSHIP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Returns the current internship application cycle relative to `now`.
 * Open from Jan 1 through Dec 1 inclusive (Chicago calendar);
 * closed Dec 2–Dec 31 until the next Jan 1.
 */
export function getInternshipCycle(now: Date = new Date()): InternshipCycle {
  const [year, month, day] = chicagoDateString(now).split("-").map(Number);

  // Open Jan 1 – Dec 1 (month 1–11, or Dec 1)
  if (month < 12 || day <= 1) {
    return {
      open: true,
      deadlineYear: year,
      deadlineLabel: `December 1, ${year}`,
      summerYear: year + 1,
    };
  }

  // Dec 2–31: closed until Jan 1 next year
  return {
    open: false,
    deadlineYear: year + 1,
    deadlineLabel: `December 1, ${year + 1}`,
    summerYear: year + 2,
    reopensLabel: `January 1, ${year + 1}`,
  };
}

/** Strip CR/LF from header-bound strings (defense in depth for email subject). */
export function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** Accept only http(s) URLs. */
export function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export const DEGREE_LEVELS = ["Undergraduate", "Master's"] as const;
export type DegreeLevel = (typeof DEGREE_LEVELS)[number];

export const SKILL_OPTIONS = [
  "Python",
  "R",
  "SQL",
  "Statistics",
  "Machine learning",
] as const;
export type SkillOption = (typeof SKILL_OPTIONS)[number];
