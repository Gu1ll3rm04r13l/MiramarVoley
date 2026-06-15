import { describe, it, expect } from "vitest";
import { parseParciales } from "@/lib/standings-calc";

describe("parseParciales", () => {
  it("sums points per side", () => {
    expect(parseParciales("25-20/19-25/20-25/17-25")).toEqual({ local: 81, visitante: 95 });
  });
  it("tolerates spaces", () => {
    expect(parseParciales(" 25-23 / 25-20 ")).toEqual({ local: 50, visitante: 43 });
  });
  it("returns null for empty/invalid", () => {
    expect(parseParciales(null)).toBeNull();
    expect(parseParciales("")).toBeNull();
    expect(parseParciales("foo")).toBeNull();
  });
});
