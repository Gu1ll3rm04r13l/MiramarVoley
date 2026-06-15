"use client";

import { useState } from "react";
import Image from "next/image";
import DivisionToggle from "@/components/DivisionToggle";
import { isMiramar, normalizeName } from "@/lib/format";
import type { Standing } from "@/lib/types";

type Div = "ascenso" | "top8";

// Escudo de cada club según el nombre que figura en la tabla. Los rivales son
// strings sueltos (no hay fila en `clubs`), así que mapeamos por nombre normalizado.
function escudoFor(equipo: string): string | null {
  const n = normalizeName(equipo);
  if (n.startsWith("miramar")) return "/escudo.png";
  if (n.startsWith("penarol")) return "/escudos/penarol.png";
  if (n.startsWith("quilmes")) return "/escudos/quilmes.png";
  if (n.startsWith("sudamerica")) return "/escudos/sudamerica.png";
  if (n === "cdt" || n.startsWith("cdt ")) return "/escudos/cdtv.png"; // CDT, CDT B, CDT C
  if (n.startsWith("talleres")) return "/escudos/talleres.png";
  if (n.startsWith("agp")) return "/escudos/agp.png";
  if (n.startsWith("edal")) return "/escudos/edal.png";
  if (n.startsWith("cai")) return "/escudos/cai.png"; // CAI Dolores
  if (n.includes("gesell")) return "/escudos/gesell.png"; // Atle Gesell
  return null;
}

// Color del número de posición según la copa de playoffs (mismos accents que /playoffs).
function tierColor(pos: number | null): string {
  if (pos == null) return "text-hueso";
  if (pos <= 4) return "text-[#e3c16b]"; // Copa de Oro
  if (pos <= 8) return "text-[#cdd3da]"; // Copa de Plata
  if (pos <= 12) return "text-[#cd8e5e]"; // Copa de Bronce
  return "text-hueso";
}

export default function StandingsTable({
  ascenso, top8, nombreEnTablas, actualizadoAscenso, actualizadoTop8,
}: {
  ascenso: Standing[]; top8: Standing[]; nombreEnTablas: string;
  actualizadoAscenso: string | null; actualizadoTop8: string | null;
}) {
  const [div, setDiv] = useState<Div>("ascenso");
  const rows = div === "ascenso" ? ascenso : top8;
  const actualizado = div === "ascenso" ? actualizadoAscenso : actualizadoTop8;

  const th = "font-display font-bold uppercase tracking-wider text-[0.7rem] px-2 py-3 text-center";

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <DivisionToggle value={div} onChange={setDiv} />
        {actualizado && (
          <span className="text-xs text-acero tabular-nums">Actualizado {actualizado}</span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl surface card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="panel-2 text-acero">
                <th className={`${th} text-left pl-4`}>#</th>
                <th className={`${th} text-left`}>Equipo</th>
                <th className={th}>PJ</th>
                <th className={th}>PG-PP</th>
                <th className={`${th} hidden sm:table-cell`}>SF</th>
                <th className={`${th} hidden sm:table-cell`}>SC</th>
                <th className={th}>Sets</th>
                <th className={`${th} hidden md:table-cell`}>RS</th>
                <th className={`${th} hidden md:table-cell`}>RP</th>
                <th className={`${th} pr-4`}>PTS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const mine = isMiramar(r.equipo, nombreEnTablas);
                const escudo = escudoFor(r.equipo);
                return (
                  <tr
                    key={r.id}
                    className={`border-t border-acero/10 transition-colors hover:bg-panel-2 ${
                      mine ? "bg-gradient-to-r from-azul/25 to-azul/5" : ""
                    }`}
                  >
                    <td
                      className={`pl-4 pr-2 py-3 ${
                        mine ? "shadow-[inset_4px_0_0_0_var(--color-azul-bright)]" : ""
                      }`}
                    >
                      <span className={`num-display text-lg leading-none ${tierColor(r.pos)}`}>
                        {r.pos}
                      </span>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-2 ${mine ? "font-bold text-hueso" : "font-medium text-hueso/90"}`}>
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                          {escudo && (
                            <Image
                              src={escudo}
                              alt=""
                              width={20}
                              height={20}
                              className={mine ? "h-5 w-5 rounded-full object-cover" : "h-5 w-5 object-contain"}
                            />
                          )}
                        </span>
                        {r.equipo}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center tabular-nums text-acero">{r.pj}</td>
                    <td className="px-2 py-3 text-center tabular-nums">{r.pg}-{r.pp}</td>
                    <td className="px-2 py-3 text-center tabular-nums text-acero hidden sm:table-cell">{r.sf}</td>
                    <td className="px-2 py-3 text-center tabular-nums text-acero hidden sm:table-cell">{r.sc}</td>
                    <td className="px-2 py-3 text-center tabular-nums">{r.sf}-{r.sc}</td>
                    <td className="px-2 py-3 text-center tabular-nums text-acero hidden md:table-cell">{r.rs}</td>
                    <td className="px-2 py-3 text-center tabular-nums text-acero hidden md:table-cell">{r.rp}</td>
                    <td className="px-2 py-3 text-center pr-4">
                      <span className="num-display text-lg text-azul-bright">{r.pts}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="panel-2 border-t border-acero/10 px-4 py-3 text-[0.72rem] text-acero flex flex-wrap items-center gap-x-4 gap-y-1">
          <span><span className="text-[#e3c16b]">●</span> Copa de Oro (1° a 4°)</span>
          <span><span className="text-[#cdd3da]">●</span> Copa de Plata (5° a 8°)</span>
          <span><span className="text-[#cd8e5e]">●</span> Copa de Bronce (9° a 12°)</span>
        </div>
      </div>
    </section>
  );
}
