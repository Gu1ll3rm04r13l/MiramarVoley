"use client";

import { useState } from "react";
import MatchCard from "@/components/MatchCard";
import Reveal from "@/components/Reveal";
import type { Match } from "@/lib/types";

type Filter = "todos" | "jugado" | "pendiente_resultado" | "proximo";
const FILTERS: { v: Filter; label: string }[] = [
  { v: "todos", label: "Todos" },
  { v: "jugado", label: "Jugados" },
  { v: "pendiente_resultado", label: "Pendientes" },
  { v: "proximo", label: "Próximos" },
];

export default function FixtureList({ matches, reportMatchIds }: { matches: Match[]; reportMatchIds: string[] }) {
  const [f, setF] = useState<Filter>("todos");
  const shown = f === "todos" ? matches : matches.filter((m) => m.estado === f);
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map((x) => (
          <button key={x.v} type="button" onClick={() => setF(x.v)} aria-pressed={f === x.v}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${f === x.v ? "bg-azul text-hueso" : "bg-navy text-acero hover:text-hueso"}`}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {shown.map((m, i) => (
          <Reveal key={m.id} delay={Math.min(i, 8) * 60}>
            <MatchCard match={m} hasReport={reportMatchIds.includes(m.id)} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
