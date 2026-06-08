import { describe, it, expect } from "vitest";
import { getDorsal } from "@/lib/format";

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
