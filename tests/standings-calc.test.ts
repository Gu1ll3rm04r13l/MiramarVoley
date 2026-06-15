import { describe, it, expect } from "vitest";
import { parseParciales, matchContribution, applyDelta, recomputeDerived, type TeamDelta } from "@/lib/standings-calc";
import type { Standing } from "@/lib/types";

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

const row = (over: Partial<Standing> = {}): Standing => ({
  id: 1, division_id: "ascenso", equipo: "MIRAMAR V", pos: 1,
  pj: 9, pg: 6, pp: 3, sf: 20, sc: 12, ds: 8, rs: 1.667,
  psf: 800, psc: 700, rp: 1.143, pts: 18, ...over,
});

const delta: TeamDelta = { pj: 1, pg: 1, pp: 0, sf: 3, sc: 1, psf: 95, psc: 81, pts: 3 };

describe("applyDelta", () => {
  it("adds additive fields with sign +1", () => {
    const r = applyDelta(row(), delta, 1);
    expect(r.pj).toBe(10); expect(r.pg).toBe(7); expect(r.sf).toBe(23);
    expect(r.sc).toBe(13); expect(r.psf).toBe(895); expect(r.psc).toBe(781); expect(r.pts).toBe(21);
  });
  it("subtracts with sign -1 (reverse)", () => {
    const r = applyDelta(row(), delta, -1);
    expect(r.pj).toBe(8); expect(r.sf).toBe(17); expect(r.pts).toBe(15);
  });
  it("treats null additive fields as 0", () => {
    const r = applyDelta(row({ pts: null, sf: null }), delta, 1);
    expect(r.pts).toBe(3); expect(r.sf).toBe(3);
  });
});

describe("recomputeDerived", () => {
  it("computes ds, rs, rp", () => {
    const r = recomputeDerived(row({ sf: 23, sc: 13, psf: 895, psc: 781 }));
    expect(r.ds).toBe(10);
    expect(r.rs).toBeCloseTo(1.769, 3);
    expect(r.rp).toBeCloseTo(1.146, 3);
  });
  it("uses 0 ratio when divisor is 0", () => {
    const r = recomputeDerived(row({ sf: 3, sc: 0, psf: 80, psc: 0 }));
    expect(r.rs).toBe(0); expect(r.rp).toBe(0);
  });
});
