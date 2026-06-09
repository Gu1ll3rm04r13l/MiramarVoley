"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseStandingsPaste } from "@/lib/standings-paste";
import { normalizeClub } from "@/lib/format";
import { replaceStandings } from "@/lib/mutations";
import type { StandingPasteRow, Division } from "@/lib/types";

export default function StandingsPasteForm({ divisions, aliases }: { divisions: Division[]; aliases: Record<string, string> }) {
  const router = useRouter();
  const [divisionId, setDivisionId] = useState(divisions[0]?.id ?? "ascenso");
  const [actualizado, setActualizado] = useState("");
  const [text, setText] = useState("");
  const [rows, setRows] = useState<StandingPasteRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const aliasMap = new Map(Object.entries(aliases));

  function onParse() {
    setMsg(null);
    try {
      // Rule 5: normalize team names through club_aliases on import.
      setRows(parseStandingsPaste(text).map((r) => ({ ...r, equipo: normalizeClub(r.equipo, aliasMap) })));
    } catch (e) {
      setRows([]);
      setMsg(e instanceof Error ? e.message : "Error al parsear");
    }
  }

  async function onSave() {
    setSaving(true); setMsg(null);
    const res = await replaceStandings(divisionId, actualizado || null, rows);
    setSaving(false);
    setMsg(res.ok ? "Tabla reemplazada." : `Error: ${res.error}`);
    if (res.ok) router.refresh();
  }

  const input = "rounded bg-navy border border-acero/30 px-2 py-1.5 text-sm";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <label className="text-sm">División
          <select className={`${input} block`} value={divisionId} onChange={(e) => setDivisionId(e.target.value)}>
            {divisions.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>
        </label>
        <label className="text-sm">Actualizado
          <input type="date" className={`${input} block`} value={actualizado} onChange={(e) => setActualizado(e.target.value)} />
        </label>
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8}
        placeholder="Pegá las filas desde AMV (tab-separadas): POS EQUIPO PJ PG PP SF SC DS RS PSF PSC RP PTS"
        className="w-full rounded bg-navy border border-acero/30 px-3 py-2 text-sm font-mono" />

      <div className="flex items-center gap-3">
        <button type="button" onClick={onParse} className="rounded bg-navy border border-acero/30 px-4 py-2 text-sm hover:border-azul">Previsualizar</button>
        <button type="button" onClick={onSave} disabled={!rows.length || saving} className="rounded bg-azul px-4 py-2 text-sm font-medium hover:bg-azul-bright disabled:opacity-60">
          {saving ? "Guardando…" : `Reemplazar (${rows.length})`}
        </button>
        {msg && <span className="text-sm text-acero">{msg}</span>}
      </div>

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded border border-acero/20">
          <table className="w-full text-xs">
            <thead className="bg-navy text-acero text-left">
              <tr>{["POS", "EQUIPO", "PJ", "PG", "PP", "SF", "SC", "DS", "RS", "PSF", "PSC", "RP", "PTS"].map((h) => <th key={h} className="px-2 py-1">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.pos} className="border-t border-acero/10">
                  {[r.pos, r.equipo, r.pj, r.pg, r.pp, r.sf, r.sc, r.ds, r.rs, r.psf, r.psc, r.rp, r.pts].map((v, i) => <td key={i} className="px-2 py-1 tabular-nums">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
