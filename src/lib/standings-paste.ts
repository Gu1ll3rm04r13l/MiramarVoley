import type { StandingPasteRow } from "@/lib/types";

const dec = (s: string) => Number(s.trim().replace(",", "."));
const int = (s: string) => parseInt(s.trim(), 10);

export function parseStandingsPaste(text: string): StandingPasteRow[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((line) => {
      const c = line.split("\t").map((x) => x.trim());
      if (c.length !== 13) {
        throw new Error(`Fila con ${c.length} columnas (se esperan 13): "${line}"`);
      }
      return {
        pos: int(c[0]), equipo: c[1],
        pj: int(c[2]), pg: int(c[3]), pp: int(c[4]),
        sf: int(c[5]), sc: int(c[6]), ds: int(c[7]),
        rs: dec(c[8]), psf: int(c[9]), psc: int(c[10]), rp: dec(c[11]), pts: int(c[12]),
      };
    });
}
