import { describe, it, expect } from "vitest";
import { getDorsal } from "@/lib/format";
import { isMiramar, normalizeName } from "@/lib/format";

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
