import { describe, it, expect } from "vitest";
import { getDorsal, rivalDeMiramar } from "@/lib/format";
import { isMiramar, normalizeName } from "@/lib/format";
import { normalizeClub, matchReportPlayer } from "@/lib/format";

const base = {
  id: "p", club_id: "miramar", nombre: "X", posicion: "Punta",
  estado: "activo", foto_url: null, orden: 1,
} as const;

describe("getDorsal", () => {
  it("uses numero_actual when usarNuevo is false", () => {
    expect(getDorsal({ ...base, numero_actual: 12, numero_nuevo: 20 }, false)).toBe(12);
  });
  it("uses numero_nuevo when usarNuevo is true", () => {
    expect(getDorsal({ ...base, numero_actual: 12, numero_nuevo: 20 }, true)).toBe(20);
  });
  it("falls back to numero_nuevo when actual is null and usarNuevo false (buena_fe)", () => {
    expect(getDorsal({ ...base, numero_actual: null, numero_nuevo: 9 }, false)).toBe(9);
  });
  it("returns dash when both are null with usarNuevo false", () => {
    expect(getDorsal({ ...base, numero_actual: null, numero_nuevo: null }, false)).toBe("—");
  });
  it("returns dash when numero_nuevo is null with usarNuevo true", () => {
    expect(getDorsal({ ...base, numero_actual: 12, numero_nuevo: null }, true)).toBe("—");
  });
});

describe("isMiramar", () => {
  it("matches exact nombre_en_tablas", () => {
    expect(isMiramar("MIRAMAR V", "MIRAMAR V")).toBe(true);
  });
  it("matches ignoring surrounding whitespace and case", () => {
    expect(isMiramar("  miramar v ", "MIRAMAR V")).toBe(true);
  });
  it("does not match other teams", () => {
    expect(isMiramar("PEÑAROL", "MIRAMAR V")).toBe(false);
  });
});

describe("normalizeName", () => {
  it("strips accents and lowercases", () => {
    expect(normalizeName("Nicolás Krasnopolski")).toBe("nicolas krasnopolski");
  });
  it("collapses internal whitespace", () => {
    expect(normalizeName("  Ariel   Del  Fresno ")).toBe("ariel del fresno");
  });
});

describe("normalizeClub", () => {
  const aliases = new Map([
    ["MIRAMAR", "MIRAMAR V"],
    ["ATLE", "ATLE GESELL"],
  ]);
  it("maps a known alias to its canonical", () => {
    expect(normalizeClub("MIRAMAR", aliases)).toBe("MIRAMAR V");
  });
  it("returns the original (trimmed) when no alias exists", () => {
    expect(normalizeClub("  PEÑAROL ", aliases)).toBe("PEÑAROL");
  });
});

describe("matchReportPlayer", () => {
  const players = [
    { id: "p08", nombre: "Guillermo Ariel del Fresno", numero_nuevo: 20 },
    { id: "p03", nombre: "Nicolás Krasnopolski", numero_nuevo: 5 },
  ];
  it("matches by num === numero_nuevo even when names differ", () => {
    expect(matchReportPlayer({ num: 20, nombre: "Ariel Del Fresno" }, players)?.id).toBe("p08");
  });
  it("falls back to normalized name when num is null", () => {
    expect(matchReportPlayer({ num: null, nombre: "nicolas krasnopolski" }, players)?.id).toBe("p03");
  });
  it("returns undefined when nothing matches", () => {
    expect(matchReportPlayer({ num: 99, nombre: "Nadie" }, players)).toBeUndefined();
  });
});

import { pickNextMatch } from "@/lib/format";

const mk = (id: string, fecha: string, estado: string) =>
  ({ id, fecha, estado } as { id: string; fecha: string | null; estado: string | null });

describe("pickNextMatch", () => {
  const today = "2026-06-07";
  it("picks earliest future match, ignoring a past pendiente", () => {
    const ms = [mk("m08", "2026-06-06", "pendiente_resultado"), mk("m09", "2026-06-13", "proximo"), mk("m11", "2026-06-20", "proximo")];
    expect(pickNextMatch(ms, today)?.id).toBe("m09");
  });
  it("returns most recent pendiente when no future matches exist", () => {
    const ms = [mk("a", "2026-06-01", "pendiente_resultado"), mk("b", "2026-06-06", "pendiente_resultado")];
    expect(pickNextMatch(ms, today)?.id).toBe("b");
  });
  it("falls back to earliest proximo when no future and no pendiente", () => {
    const ms = [mk("z", "2026-05-01", "proximo")];
    expect(pickNextMatch(ms, today)?.id).toBe("z");
  });
  it("returns null when there are no candidate matches", () => {
    expect(pickNextMatch([mk("j", "2026-06-13", "jugado")], today)).toBeNull();
  });
});

import { aggregateReportStats } from "@/lib/format";

describe("aggregateReportStats", () => {
  it("averages non-null values per fundamento and counts matches", () => {
    const rows = [
      { saq: 50, rec: null, ata: 88, bloq: 50, def: null, cata: 84, rating: 66 },
      { saq: 56, rec: 75, ata: 46, bloq: 50, def: null, cata: 72, rating: 60 },
    ];
    const r = aggregateReportStats(rows);
    expect(r.partidos).toBe(2);
    expect(r.saq).toBe(53); // (50+56)/2
    expect(r.rec).toBe(75); // only one non-null
    expect(r.def).toBeNull(); // all null
    expect(r.rating).toBe(63);
  });
  it("excludes matches where the player did not play (all stats null)", () => {
    const rows = [
      { saq: 50, rec: null, ata: 88, bloq: 50, def: null, cata: 84, rating: 66 },
      { saq: null, rec: null, ata: null, bloq: null, def: null, cata: null, rating: null },
    ];
    const r = aggregateReportStats(rows);
    expect(r.partidos).toBe(1);
    expect(r.saq).toBe(50);
  });
});

describe("rivalDeMiramar", () => {
  it("devuelve el visitante cuando Miramar es local", () => {
    expect(rivalDeMiramar({ local: "MIRAMAR V", visitante: "QUILMES A" })).toBe("QUILMES A");
  });
  it("devuelve el local cuando Miramar es visitante", () => {
    expect(rivalDeMiramar({ local: "SUDAMÉRICA", visitante: "MIRAMAR VOLEY" })).toBe("SUDAMÉRICA");
  });
  it("cae al local si ninguno es Miramar", () => {
    expect(rivalDeMiramar({ local: "A", visitante: "B" })).toBe("A");
  });
});
