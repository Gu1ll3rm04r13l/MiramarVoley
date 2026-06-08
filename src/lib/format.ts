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
