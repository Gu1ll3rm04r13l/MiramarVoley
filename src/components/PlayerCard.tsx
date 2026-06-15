"use client";

import Image from "next/image";
import { useState } from "react";
import type { Player, Dorsal } from "@/lib/types";

export default function PlayerCard({ player, dorsal, onClick }: { player: Player; dorsal: Dorsal; onClick: () => void }) {
  // foto_url (DB) gana; si no, foto local por dorsal en /public/jugadores/{n}.png.
  const localFoto = typeof dorsal === "number" ? `/jugadores/${dorsal}.png` : null;
  const [src, setSrc] = useState<string | null>(player.foto_url ?? localFoto);
  return (
    <button
      type="button"
      onClick={onClick}
      className="group h-full text-left w-full rounded-xl surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-azul/60 hover:glow-soft"
    >
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-panel-2 shrink-0 grid place-items-center">
          {src ? (
            <Image src={src} alt={player.nombre} fill sizes="56px" className="object-cover transition-transform duration-300 group-hover:scale-110" onError={() => setSrc(null)} />
          ) : (
            <>
              <span className="absolute inset-0 shimmer opacity-40" aria-hidden />
              <span className="relative font-display text-2xl font-bold text-acero">
                {typeof dorsal === "number" ? dorsal : "—"}
              </span>
            </>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-display text-3xl font-bold leading-none tabular-nums">{dorsal}</p>
          <p className="font-medium truncate mt-1">{player.nombre}</p>
          <p className="text-xs text-acero">{player.posicion}</p>
        </div>
      </div>
    </button>
  );
}
