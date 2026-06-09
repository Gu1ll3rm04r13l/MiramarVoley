"use client";

import { useState } from "react";
import DivisionToggle from "@/components/DivisionToggle";
import { isMiramar } from "@/lib/format";
import type { Standing } from "@/lib/types";

type Div = "ascenso" | "top8";

export default function StandingsTable({
  ascenso, top8, nombreEnTablas, actualizadoAscenso, actualizadoTop8,
}: {
  ascenso: Standing[]; top8: Standing[]; nombreEnTablas: string;
  actualizadoAscenso: string | null; actualizadoTop8: string | null;
}) {
  const [div, setDiv] = useState<Div>("ascenso");
  const rows = div === "ascenso" ? ascenso : top8;
  const actualizado = div === "ascenso" ? actualizadoAscenso : actualizadoTop8;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <DivisionToggle value={div} onChange={setDiv} />
        {actualizado && <span className="text-xs text-acero">Actualizado: {actualizado}</span>}
      </div>
      <div className="overflow-x-auto rounded-lg border border-acero/20">
        <table className="w-full text-sm">
          <thead className="sticky top-14 z-10 bg-navy/95 backdrop-blur text-acero">
            <tr className="text-left">
              <th className="px-2 py-2">#</th>
              <th className="px-2 py-2">Equipo</th>
              <th className="px-2 py-2 text-center">PJ</th>
              <th className="px-2 py-2 text-center">PG-PP</th>
              <th className="px-2 py-2 text-center hidden sm:table-cell">SF</th>
              <th className="px-2 py-2 text-center hidden sm:table-cell">SC</th>
              <th className="px-2 py-2 text-center">Sets</th>
              <th className="px-2 py-2 text-center hidden md:table-cell">RS</th>
              <th className="px-2 py-2 text-center hidden md:table-cell">RP</th>
              <th className="px-2 py-2 text-center font-bold">PTS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const mine = isMiramar(r.equipo, nombreEnTablas);
              return (
                <tr
                  key={r.id}
                  className={`border-t border-acero/10 transition-colors hover:bg-azul/10 ${
                    mine ? "bg-azul/25 font-semibold shadow-[inset_3px_0_0_0_var(--color-azul-bright)]" : ""
                  }`}
                >
                  <td className="px-2 py-2 tabular-nums">{r.pos}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{r.equipo}</td>
                  <td className="px-2 py-2 text-center tabular-nums">{r.pj}</td>
                  <td className="px-2 py-2 text-center tabular-nums">{r.pg}-{r.pp}</td>
                  <td className="px-2 py-2 text-center tabular-nums hidden sm:table-cell">{r.sf}</td>
                  <td className="px-2 py-2 text-center tabular-nums hidden sm:table-cell">{r.sc}</td>
                  <td className="px-2 py-2 text-center tabular-nums">{r.sf}-{r.sc}</td>
                  <td className="px-2 py-2 text-center tabular-nums hidden md:table-cell">{r.rs}</td>
                  <td className="px-2 py-2 text-center tabular-nums hidden md:table-cell">{r.rp}</td>
                  <td className="px-2 py-2 text-center tabular-nums font-bold">{r.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
