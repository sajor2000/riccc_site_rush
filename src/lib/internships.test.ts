import { describe, expect, it } from "vitest";
import { formatDeadline, getInternshipCycle } from "./internships";

describe("getInternshipCycle", () => {
  it("is open before December 1 for the following summer", () => {
    const cycle = getInternshipCycle(new Date(2026, 7, 25)); // Aug 25, 2026
    expect(cycle.open).toBe(true);
    expect(cycle.summerYear).toBe(2027);
    expect(cycle.deadline.getFullYear()).toBe(2026);
    expect(cycle.deadline.getMonth()).toBe(11);
    expect(cycle.deadline.getDate()).toBe(1);
    expect(cycle.reopensAt).toBeUndefined();
  });

  it("is open on December 1", () => {
    const cycle = getInternshipCycle(new Date(2026, 11, 1, 12, 0, 0));
    expect(cycle.open).toBe(true);
    expect(cycle.summerYear).toBe(2027);
  });

  it("is closed after December 1 until the next year", () => {
    const cycle = getInternshipCycle(new Date(2026, 11, 2)); // Dec 2, 2026
    expect(cycle.open).toBe(false);
    expect(cycle.summerYear).toBe(2028);
    expect(cycle.deadline.getFullYear()).toBe(2027);
    expect(cycle.reopensAt?.getFullYear()).toBe(2027);
    expect(cycle.reopensAt?.getMonth()).toBe(0);
    expect(cycle.reopensAt?.getDate()).toBe(1);
  });
});

describe("formatDeadline", () => {
  it("formats as Month Day, Year", () => {
    expect(formatDeadline(new Date(2026, 11, 1))).toBe("December 1, 2026");
  });
});
