import { describe, it, expect } from "vitest";
import { parseParciales, matchContribution } from "@/lib/standings-calc";

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

describe("matchContribution", () => {
  const base = { estado: "jugado", parciales: "25-20/19-25/20-25/17-25" };
  it("3-1 away win: FIVB 3/0, sets and points per side", () => {
    const c = matchContribution({ ...base, sets_local: 1, sets_visitante: 3 })!;
    expect(c.local).toEqual({ pj: 1, pg: 0, pp: 1, sf: 1, sc: 3, psf: 81, psc: 95, pts: 0 });
    expect(c.visitante).toEqual({ pj: 1, pg: 1, pp: 0, sf: 3, sc: 1, psf: 95, psc: 81, pts: 3 });
  });
  it("3-2 gives 2 to winner and 1 to loser", () => {
    const c = matchContribution({ estado: "jugado", parciales: null, sets_local: 3, sets_visitante: 2 })!;
    expect(c.local.pts).toBe(2);
    expect(c.visitante.pts).toBe(1);
  });
  it("3-0 gives 3/0", () => {
    const c = matchContribution({ estado: "jugado", parciales: null, sets_local: 3, sets_visitante: 0 })!;
    expect(c.local.pts).toBe(3);
    expect(c.visitante.pts).toBe(0);
  });
  it("psf/psc are 0 when parciales missing", () => {
    const c = matchContribution({ estado: "jugado", parciales: null, sets_local: 3, sets_visitante: 0 })!;
    expect(c.local.psf).toBe(0);
    expect(c.local.psc).toBe(0);
  });
  it("returns null when not jugado or sets missing", () => {
    expect(matchContribution({ ...base, estado: "proximo", sets_local: 1, sets_visitante: 3 })).toBeNull();
    expect(matchContribution({ ...base, estado: "jugado", sets_local: null, sets_visitante: 3 })).toBeNull();
  });
});
