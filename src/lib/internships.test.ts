import { describe, expect, it } from "vitest";
import {
  chicagoDateString,
  getInternshipCycle,
  isHttpUrl,
  sanitizeHeaderValue,
} from "./internships";

describe("chicagoDateString", () => {
  it("uses America/Chicago calendar date", () => {
    // 2026-12-02 05:30 UTC = Dec 1 23:30 CST → still Dec 1 in Chicago
    expect(chicagoDateString(new Date("2026-12-02T05:30:00.000Z"))).toBe(
      "2026-12-01"
    );
    // 2026-12-02 06:00 UTC = Dec 2 00:00 CST → Dec 2 in Chicago
    expect(chicagoDateString(new Date("2026-12-02T06:00:00.000Z"))).toBe(
      "2026-12-02"
    );
  });
});

describe("getInternshipCycle", () => {
  it("is open before December 1 Chicago for the following summer", () => {
    const cycle = getInternshipCycle(new Date("2026-08-25T17:00:00.000Z"));
    expect(cycle.open).toBe(true);
    expect(cycle.summerYear).toBe(2027);
    expect(cycle.deadlineYear).toBe(2026);
    expect(cycle.deadlineLabel).toBe("December 1, 2026");
    expect(cycle.reopensLabel).toBeUndefined();
  });

  it("is open late on December 1 Chicago (evening CST)", () => {
    const cycle = getInternshipCycle(new Date("2026-12-02T05:30:00.000Z"));
    expect(cycle.open).toBe(true);
    expect(cycle.summerYear).toBe(2027);
    expect(cycle.deadlineLabel).toBe("December 1, 2026");
  });

  it("is closed at midnight December 2 Chicago", () => {
    const cycle = getInternshipCycle(new Date("2026-12-02T06:00:00.000Z"));
    expect(cycle.open).toBe(false);
    expect(cycle.summerYear).toBe(2028);
    expect(cycle.deadlineLabel).toBe("December 1, 2027");
    expect(cycle.reopensLabel).toBe("January 1, 2027");
  });
});

describe("sanitizeHeaderValue", () => {
  it("strips CR and LF", () => {
    expect(sanitizeHeaderValue("Ada\r\nBcc: evil@x.com")).toBe(
      "Ada Bcc: evil@x.com"
    );
  });
});

describe("graduationYearSelectOptions", () => {
  it("includes a wide year range and before/after sentinels", async () => {
    const { graduationYearSelectOptions } = await import("./internships");
    const opts = graduationYearSelectOptions(2027);
    expect(opts[0]).toBe("Before 2017");
    expect(opts).toContain("2017");
    expect(opts).toContain("2027");
    expect(opts).toContain("2037");
    expect(opts.at(-1)).toBe("After 2037");
  });
});

describe("isHttpUrl", () => {
  it("allows http and https only", () => {
    expect(isHttpUrl("https://example.com/cv.pdf")).toBe(true);
    expect(isHttpUrl("http://example.com/cv.pdf")).toBe(true);
    expect(isHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isHttpUrl("data:text/html,hi")).toBe(false);
    expect(isHttpUrl("not-a-url")).toBe(false);
  });
});
