"use client";

import { toNum, numStr } from "@/lib/form-utils";
import { emptyPlayerRow } from "@/lib/report-draft";
import type { ReportPlayerDraft } from "@/lib/types";

const COLS: { key: keyof ReportPlayerDraft; label: string }[] = [
  { key: "num", label: "#" }, { key: "nombre", label: "Jugador" },
  { key: "saq", label: "Saq" }, { key: "rec", label: "Rec" }, { key: "ata", label: "Ata" },
  { key: "bloq", label: "Bloq" }, { key: "def", label: "Def" }, { key: "cata", label: "C.Ata" },
  { key: "err", label: "Err" }, { key: "mas_menos", label: "+/-" }, { key: "rating", label: "Rating" },
];

export default function PlayerStatsGrid({ rows, onChange }: { rows: ReportPlayerDraft[]; onChange: (rows: ReportPlayerDraft[]) => void }) {
  function update(i: number, key: keyof ReportPlayerDraft, raw: string) {
    const next = rows.map((r, idx) => {
      if (idx !== i) return r;
      if (key === "nombre") return { ...r, nombre: raw };
      return { ...r, [key]: toNum(raw) };
    });
    onChange(next);
  }
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded border border-acero/20">
        <table className="w-full text-xs">
          <thead className="bg-navy text-acero text-left">
            <tr>{COLS.map((c) => <th key={c.key} className="px-1.5 py-1">{c.label}</th>)}<th /></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-acero/10">
                {COLS.map((c) => (
                  <td key={c.key} className="px-1 py-1">
                    <input
                      className={`bg-navy border border-acero/20 rounded px-1 py-1 text-xs ${c.key === "nombre" ? "w-36" : "w-12"}`}
                      value={c.key === "nombre" ? r.nombre : numStr(r[c.key] as number | null)}
                      onChange={(e) => update(i, c.key, e.target.value)}
                    />
                  </td>
                ))}
                <td className="px-1"><button type="button" onClick={() => onChange(rows.filter((_, idx) => idx !== i))} className="text-acero hover:text-red-400" aria-label="Quitar fila">×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={() => onChange([...rows, emptyPlayerRow()])} className="text-sm text-azul-bright">+ Agregar jugador</button>
    </div>
  );
}
