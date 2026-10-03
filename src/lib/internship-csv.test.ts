import { describe, expect, it } from "vitest";

/** Mirror of export csvEscape for unit coverage without importing Next route. */
function csvEscape(value: string): string {
  let v = value;
  if (/^[=+\-@\t\r]/.test(v)) {
    v = `'${v}`;
  }
  if (/[",\n\r]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

describe("internship CSV escape", () => {
  it("quotes commas and escapes quotes", () => {
    expect(csvEscape('a, "b"')).toBe('"a, ""b"""');
  });

  it("neutralizes formula-like leading characters", () => {
    expect(csvEscape("=cmd()")).toBe("'=cmd()");
    expect(csvEscape("+1+1")).toBe("'+1+1");
    expect(csvEscape("-1+1")).toBe("'-1+1");
    expect(csvEscape("@sum")).toBe("'@sum");
  });

  it("leaves plain text alone", () => {
    expect(csvEscape("Ada Lovelace")).toBe("Ada Lovelace");
  });
});
