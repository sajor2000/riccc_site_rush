/** Summer internship application cycle: open Jan 1–Dec 1 for the following summer. */

export interface InternshipCycle {
  /** Whether applications are currently accepted. */
  open: boolean;
  /** Deadline (end of Dec 1 local calendar day, as a Date). */
  deadline: Date;
  /** Calendar year of the summer the applicant would join. */
  summerYear: number;
  /** When the next application window opens (only set when closed). */
  reopensAt?: Date;
}

function endOfDayLocal(year: number, monthIndex: number, day: number): Date {
  return new Date(year, monthIndex, day, 23, 59, 59, 999);
}

/**
 * Returns the current internship application cycle relative to `now`.
 * Open from Jan 1 through Dec 1 (inclusive) for the following summer;
 * closed Dec 2–Dec 31 until the next Jan 1.
 */
export function getInternshipCycle(now: Date = new Date()): InternshipCycle {
  const year = now.getFullYear();
  const deadlineThisYear = endOfDayLocal(year, 11, 1);

  if (now.getTime() <= deadlineThisYear.getTime()) {
    return {
      open: true,
      deadline: deadlineThisYear,
      summerYear: year + 1,
    };
  }

  return {
    open: false,
    deadline: endOfDayLocal(year + 1, 11, 1),
    summerYear: year + 2,
    reopensAt: new Date(year + 1, 0, 1),
  };
}

export function formatDeadline(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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
