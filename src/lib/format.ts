import type { Player, Dorsal } from "@/lib/types";

export function getDorsal(player: Pick<Player, "numero_actual" | "numero_nuevo">, usarNuevo: boolean): Dorsal {
  if (usarNuevo) return player.numero_nuevo ?? "—";
  return player.numero_actual ?? player.numero_nuevo ?? "—";
}

export function normalizeName(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function isMiramar(equipo: string, nombreEnTablas: string): boolean {
  return equipo.trim().toUpperCase() === nombreEnTablas.trim().toUpperCase();
}

export function normalizeClub(name: string, aliases: Map<string, string>): string {
  const trimmed = name.trim();
  return aliases.get(trimmed) ?? trimmed;
}

export function matchReportPlayer<T extends { nombre: string; numero_nuevo: number | null }>(
  rp: { num: number | null; nombre: string },
  players: T[],
): T | undefined {
  if (rp.num != null) {
    const byNum = players.find((p) => p.numero_nuevo === rp.num);
    if (byNum) return byNum;
  }
  const target = normalizeName(rp.nombre);
  return players.find((p) => normalizeName(p.nombre) === target);
}

type StatRow = { saq: number | null; rec: number | null; ata: number | null; bloq: number | null; def: number | null; cata: number | null; rating: number | null };
export type AggStats = { partidos: number } & { [K in keyof StatRow]: number | null };

export function aggregateReportStats(rows: StatRow[]): AggStats {
  const keys: (keyof StatRow)[] = ["saq", "rec", "ata", "bloq", "def", "cata", "rating"];
  const out = { partidos: rows.length } as AggStats;
  for (const k of keys) {
    const vals = rows.map((r) => r[k]).filter((v): v is number => v != null);
    out[k] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  }
  return out;
}

type NextMatchLike = { fecha: string | null; estado: string | null };

export function pickNextMatch<T extends NextMatchLike>(matches: T[], today: string): T | null {
  const cands = matches.filter((m) => m.estado === "proximo" || m.estado === "pendiente_resultado");
  const future = cands
    .filter((m) => m.fecha && m.fecha >= today)
    .sort((a, b) => (a.fecha! < b.fecha! ? -1 : a.fecha! > b.fecha! ? 1 : 0));
  if (future.length) return future[0];
  const pend = cands
    .filter((m) => m.estado === "pendiente_resultado" && m.fecha)
    .sort((a, b) => (a.fecha! > b.fecha! ? -1 : a.fecha! < b.fecha! ? 1 : 0));
  if (pend.length) return pend[0];
  const prox = cands
    .filter((m) => m.estado === "proximo" && m.fecha)
    .sort((a, b) => (a.fecha! < b.fecha! ? -1 : a.fecha! > b.fecha! ? 1 : 0));
  return prox[0] ?? null;
}
