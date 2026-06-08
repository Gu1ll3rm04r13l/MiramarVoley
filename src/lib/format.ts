import type { Player, Dorsal } from "@/lib/types";

export function getDorsal(player: Pick<Player, "numero_actual" | "numero_nuevo">, usarNuevo: boolean): Dorsal {
  if (usarNuevo) return player.numero_nuevo ?? "—";
  return player.numero_actual ?? player.numero_nuevo ?? "—";
}
