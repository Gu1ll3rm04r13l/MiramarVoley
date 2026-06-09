import { describe, it, expect } from "vitest";
import { parseSetpoint, parseSpanishDate } from "@/lib/setpoint";

// Synthetic lines following the spec's anchor contract; values mirror seed r01.
const LINES = [
  "Resultado (Sets) 3 - 0",
  "Total Puntos 123",
  "Duración 75 min",
  "Categoría Primera Masculina",
  "Fecha domingo, 29 de marzo de 2026",
  "Equipo Local",
  "MIRAMAR V",
  "Puntos totales: 75",
  "Errores: 24",
  "Equipo Visitante",
  "CAI DOLORES",
  "Puntos totales: 48",
  "Errores: 36",
  "Rendimiento del Equipo por Fundamento",
  "Ataque 60",
  "Recepción 38",
  "Saque 45",
  "Bloqueo 58",
  "Defensa 63",
  "Contraataque 68",
  "Jugadores Destacados",
  "MEJOR RENDIMIENTO #18 Alex Angel Rating: 75",
  "MENOR RENDIMIENTO #15 Gastón Espindola Rating: 35",
  "MEJOR SACADOR #17 Matias Gerber Saque: 56",
  "Rendimiento por Jugador",
  "# Jugador Saq Rec Ata Bloq Def C.Ata Err +/- Rating",
  "8 Francisco Pomares 42 - 88 50 - 84 2 +10 66",
  "4 Carlos Ledesma - - - - - - 0 0 -",
  "15 Gastón Espindola 13 0 58 0 75 65 5 -1 35",
  "FIN",
];

describe("parseSpanishDate", () => {
  it("converts a Spanish long date to ISO", () => {
    expect(parseSpanishDate("domingo, 29 de marzo de 2026")).toBe("2026-03-29");
  });
  it("returns null on unparseable input", () => {
    expect(parseSpanishDate("no es fecha")).toBeNull();
  });
});

describe("parseSetpoint", () => {
  const d = parseSetpoint(LINES);

  it("reads sets from Resultado (Sets)", () => {
    expect(d.sets_local).toBe(3);
    expect(d.sets_visitante).toBe(0);
  });
  it("reads duration and category", () => {
    expect(d.duracion_min).toBe(75);
    expect(d.categoria).toBe("Primera Masculina");
  });
  it("converts the date to ISO", () => {
    expect(d.fecha).toBe("2026-03-29");
  });
  it("assigns own (Miramar) vs rival points/errors", () => {
    expect(d.equipo_local).toBe("MIRAMAR V");
    expect(d.equipo_visitante).toBe("CAI DOLORES");
    expect(d.equipo_puntos).toBe(75);
    expect(d.equipo_errores).toBe(24);
    expect(d.rival_nombre).toBe("CAI DOLORES");
    expect(d.rival_puntos).toBe(48);
    expect(d.rival_errores).toBe(36);
  });
  it("reads the six fundamentos", () => {
    expect(d.fundamentos).toEqual({ ataque: 60, recepcion: 38, saque: 45, bloqueo: 58, defensa: 63, contraataque: 68 });
  });
  it("reads destacados", () => {
    expect(d.destacados.mejorRendimiento).toEqual({ jugador: "Alex Angel", num: 18, rating: 75 });
    expect(d.destacados.menorRendimiento).toEqual({ jugador: "Gastón Espindola", num: 15, rating: 35 });
    expect(d.destacados.mejorSacador).toEqual({ jugador: "Matias Gerber", num: 17, saque: 56 });
  });
  it("parses player rows, mapping dashes to null and signed +/-", () => {
    expect(d.jugadores).toHaveLength(3);
    expect(d.jugadores[0]).toEqual({ num: 8, nombre: "Francisco Pomares", saq: 42, rec: null, ata: 88, bloq: 50, def: null, cata: 84, err: 2, mas_menos: 10, rating: 66 });
    expect(d.jugadores[1]).toEqual({ num: 4, nombre: "Carlos Ledesma", saq: null, rec: null, ata: null, bloq: null, def: null, cata: null, err: 0, mas_menos: 0, rating: null });
    expect(d.jugadores[2].mas_menos).toBe(-1);
  });
});
