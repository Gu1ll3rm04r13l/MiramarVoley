"use client";

import { useState } from "react";
import PlayerCard from "@/components/PlayerCard";
import PlayerModal from "@/components/PlayerModal";
import Reveal from "@/components/Reveal";
import { getDorsal, matchReportPlayer, aggregateReportStats } from "@/lib/format";
import type { Player, ReportPlayer } from "@/lib/types";

export default function PlantelGrid({ players, usarNuevo, reportPlayers }: { players: Player[]; usarNuevo: boolean; reportPlayers: ReportPlayer[] }) {
  const [open, setOpen] = useState<Player | null>(null);
  const statsFor = (p: Player) => {
    const rows = reportPlayers.filter((rp) => matchReportPlayer({ num: rp.num, nombre: rp.nombre ?? "" }, [p]) === p);
    return aggregateReportStats(rows);
  };
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 9) * 50}>
            <PlayerCard player={p} dorsal={getDorsal(p, usarNuevo)} onClick={() => setOpen(p)} />
          </Reveal>
        ))}
      </div>
      {open && (
        <PlayerModal player={open} dorsal={getDorsal(open, usarNuevo)} stats={statsFor(open)} onClose={() => setOpen(null)} />
      )}
    </>
  );
}
