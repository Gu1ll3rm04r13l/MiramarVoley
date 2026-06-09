import Image from "next/image";
import type { Player, Dorsal } from "@/lib/types";

export default function PlayerCard({ player, dorsal, onClick }: { player: Player; dorsal: Dorsal; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="text-left rounded-xl border border-acero/20 bg-navy/40 p-4 hover:border-azul/60 transition-colors w-full">
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-navy shrink-0 grid place-items-center">
          {player.foto_url
            ? <Image src={player.foto_url} alt={player.nombre} fill className="object-cover" />
            : <span className="font-display text-2xl font-bold text-acero">{typeof dorsal === "number" ? dorsal : "—"}</span>}
        </div>
        <div className="min-w-0">
          <p className="font-display text-3xl font-bold leading-none tabular-nums">{dorsal}</p>
          <p className="font-medium truncate mt-1">{player.nombre}</p>
          <p className="text-xs text-acero">{player.posicion}</p>
        </div>
      </div>
      {player.estado === "buena_fe" && (
        <span className="mt-3 inline-block text-xs rounded-full px-2 py-0.5 bg-acero/20 text-acero">En lista</span>
      )}
    </button>
  );
}
