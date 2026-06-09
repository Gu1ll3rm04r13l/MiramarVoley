"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlayerStatsGrid from "@/components/admin/PlayerStatsGrid";
import { saveReport } from "@/lib/mutations";
import { emptyDraft, draftFromReport } from "@/lib/report-draft";
import { toNum, numStr } from "@/lib/form-utils";
import type { ReportDraft, Match, MatchReport, ReportPlayer } from "@/lib/types";
import PdfImportButton from "@/components/admin/PdfImportButton";

type Existing = { report: MatchReport; players: ReportPlayer[] };

export default function ReportForm({
  matches, existingByMatch,
}: { matches: Match[]; existingByMatch: Record<string, Existing> }) {
  const router = useRouter();
  const [matchId, setMatchId] = useState<string>(matches[0]?.id ?? "");
  const [draft, setDraft] = useState<ReportDraft>(emptyDraft());
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function loadMatch(id: string) {
    setMatchId(id);
    const ex = existingByMatch[id];
    const m = matches.find((mm) => mm.id === id);
    setDraft(ex && m ? draftFromReport(ex.report, ex.players, m) : emptyDraft());
    setMsg(null);
  }

  function setField<K extends keyof ReportDraft>(k: K, v: ReportDraft[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }
  function setFund(k: keyof ReportDraft["fundamentos"], raw: string) {
    setDraft((d) => ({ ...d, fundamentos: { ...d.fundamentos, [k]: toNum(raw) } }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!matchId) { setMsg("Elegí un partido."); return; }
    setSaving(true); setMsg(null);
    const res = await saveReport(matchId, draft);
    setSaving(false);
    setMsg(res.ok ? "Reporte guardado." : `Error: ${res.error}`);
    if (res.ok) router.refresh();
  }

  const input = "w-full rounded bg-navy border border-acero/30 px-2 py-1.5 text-sm";
  const fundKeys: (keyof ReportDraft["fundamentos"])[] = ["ataque", "recepcion", "saque", "bloqueo", "defensa", "contraataque"];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">Partido
          <select className={`${input} block min-w-64`} value={matchId} onChange={(e) => loadMatch(e.target.value)}>
            {matches.map((m) => <option key={m.id} value={m.id}>{m.jornada} · {m.local} v {m.visitante}</option>)}
          </select>
        </label>
        <PdfImportButton onParsed={(d) => { setDraft(d); setMsg("PDF importado — revisá y guardá."); }} />
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <label className="text-sm">Torneo<input className={input} value={draft.torneo ?? ""} onChange={(e) => setField("torneo", e.target.value || null)} /></label>
        <label className="text-sm">Categoría<input className={input} value={draft.categoria ?? ""} onChange={(e) => setField("categoria", e.target.value || null)} /></label>
        <label className="text-sm">Fecha<input type="date" className={input} value={draft.fecha ?? ""} onChange={(e) => setField("fecha", e.target.value || null)} /></label>
        <label className="text-sm">Duración (min)<input className={input} value={numStr(draft.duracion_min)} onChange={(e) => setField("duracion_min", toNum(e.target.value))} /></label>
        <label className="text-sm">Sets local<input className={input} value={numStr(draft.sets_local)} onChange={(e) => setField("sets_local", toNum(e.target.value))} /></label>
        <label className="text-sm">Sets visitante<input className={input} value={numStr(draft.sets_visitante)} onChange={(e) => setField("sets_visitante", toNum(e.target.value))} /></label>
        <label className="text-sm">Puntos propios<input className={input} value={numStr(draft.equipo_puntos)} onChange={(e) => setField("equipo_puntos", toNum(e.target.value))} /></label>
        <label className="text-sm">Errores propios<input className={input} value={numStr(draft.equipo_errores)} onChange={(e) => setField("equipo_errores", toNum(e.target.value))} /></label>
        <label className="text-sm">Efectividad<input className={input} value={numStr(draft.efectividad)} onChange={(e) => setField("efectividad", toNum(e.target.value))} /></label>
        <label className="text-sm">Rival<input className={input} value={draft.rival_nombre ?? ""} onChange={(e) => setField("rival_nombre", e.target.value || null)} /></label>
        <label className="text-sm">Puntos rival<input className={input} value={numStr(draft.rival_puntos)} onChange={(e) => setField("rival_puntos", toNum(e.target.value))} /></label>
        <label className="text-sm">Errores rival<input className={input} value={numStr(draft.rival_errores)} onChange={(e) => setField("rival_errores", toNum(e.target.value))} /></label>
      </div>

      <fieldset>
        <legend className="font-display font-bold mb-2">Fundamentos (0-100)</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {fundKeys.map((k) => (
            <label key={k} className="text-sm capitalize">{k}
              <input className={input} value={numStr(draft.fundamentos[k])} onChange={(e) => setFund(k, e.target.value)} />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display font-bold mb-2">Jugador del partido (MVP)</legend>
        <div className="grid sm:grid-cols-4 gap-3">
          <label className="text-sm sm:col-span-2">Nombre<input className={input} value={draft.mvp_nombre ?? ""} onChange={(e) => setField("mvp_nombre", e.target.value || null)} placeholder="Ej: Rodrigo Pérez" /></label>
          <label className="text-sm">Posición<input className={input} value={draft.mvp_posicion ?? ""} onChange={(e) => setField("mvp_posicion", e.target.value || null)} placeholder="Punta" /></label>
          <label className="text-sm">Número<input className={input} value={numStr(draft.mvp_num ?? null)} onChange={(e) => setField("mvp_num", toNum(e.target.value))} placeholder="2" /></label>
          <label className="text-sm sm:col-span-4">Foto (URL, opcional)<input className={input} value={draft.mvp_foto ?? ""} onChange={(e) => setField("mvp_foto", e.target.value || null)} placeholder="https://…" /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display font-bold mb-2">Jugadores</legend>
        <PlayerStatsGrid rows={draft.jugadores} onChange={(rows) => setField("jugadores", rows)} />
      </fieldset>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="rounded bg-azul px-4 py-2 text-sm font-medium hover:bg-azul-bright disabled:opacity-60">{saving ? "Guardando…" : "Guardar reporte"}</button>
        {msg && <span className="text-sm text-acero">{msg}</span>}
      </div>
    </form>
  );
}
