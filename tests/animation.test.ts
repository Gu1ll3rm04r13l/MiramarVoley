import { describe, it, expect } from "vitest";
import { easeOutCubic, lerpValue } from "@/lib/animation";

describe("easeOutCubic", () => {
  it("returns 0 at start and 1 at end", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });
  it("is past the midpoint at t=0.5 (ease-out)", () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});

describe("lerpValue", () => {
  it("returns target when progress is 1", () => {
    expect(lerpValue(0, 42, 1)).toBe(42);
  });
  it("returns start when progress is 0", () => {
    expect(lerpValue(0, 42, 0)).toBe(0);
  });
  it("rounds to an integer", () => {
    expect(Number.isInteger(lerpValue(0, 7, 0.5))).toBe(true);
  });
});
