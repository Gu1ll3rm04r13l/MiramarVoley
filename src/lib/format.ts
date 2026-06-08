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
