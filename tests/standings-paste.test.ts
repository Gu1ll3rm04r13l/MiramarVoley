import { describe, it, expect } from "vitest";
import { parseStandingsPaste } from "@/lib/standings-paste";

describe("parseStandingsPaste", () => {
  it("parses tab-separated rows and converts comma decimals", () => {
    const text = [
      "1\tPEÑAROL\t8\t7\t1\t23\t6\t17\t3,83\t678\t491\t1,38\t21",
      "4\tMIRAMAR V\t7\t5\t2\t18\t7\t11\t2,57\t567\t440\t1,29\t16",
    ].join("\n");
    const rows = parseStandingsPaste(text);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ pos: 1, equipo: "PEÑAROL", pj: 8, pg: 7, pp: 1, sf: 23, sc: 6, ds: 17, rs: 3.83, psf: 678, psc: 491, rp: 1.38, pts: 21 });
    expect(rows[1].equipo).toBe("MIRAMAR V");
    expect(rows[1].rs).toBe(2.57);
  });
  it("skips blank lines", () => {
    expect(parseStandingsPaste("\n  \n")).toHaveLength(0);
  });
  it("throws on a row with the wrong column count", () => {
    expect(() => parseStandingsPaste("1\tONLY\t2")).toThrow();
  });
});
