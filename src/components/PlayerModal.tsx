"use client";

import { useEffect, useRef } from "react";
import StatBar from "@/components/StatBar";
import type { Player, Dorsal } from "@/lib/types";
import type { AggStats } from "@/lib/format";

export default function PlayerModal({ player, dorsal, stats, onClose }: { player: Player; dorsal: Dorsal; stats: AggStats; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-negro/80 p-4" role="dialog" aria-modal="true" aria-label={player.nombre} onClick={onClose}>
      <div tabIndex={-1} className="w-full max-w-md rounded-2xl border border-acero/20 bg-navy p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-4xl font-bold tabular-nums">{dorsal}</p>
            <h2 className="font-display text-2xl font-bold mt-1">{player.nombre}</h2>
            <p className="text-sm text-acero">{player.posicion}</p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Cerrar" className="text-acero hover:text-hueso text-2xl leading-none">×</button>
        </div>
        <p className="text-xs text-acero mt-4 mb-2">Promedios ({stats.partidos} {stats.partidos === 1 ? "partido" : "partidos"})</p>
        <div className="space-y-2">
          <StatBar label="Saque" value={stats.saq} />
          <StatBar label="Recepción" value={stats.rec} />
          <StatBar label="Ataque" value={stats.ata} />
          <StatBar label="Bloqueo" value={stats.bloq} />
          <StatBar label="Defensa" value={stats.def} />
          <StatBar label="Contraataque" value={stats.cata} />
          <StatBar label="Rating" value={stats.rating} />
        </div>
      </div>
    </div>
  );
}
