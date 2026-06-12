"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertMatch, type MatchInput } from "@/lib/mutations";
import { toNum, numStr } from "@/lib/form-utils";
import type { Match, Division } from "@/lib/types";

const EMPTY: MatchInput = {
  id: "", division_id: "ascenso", jornada: "", fecha: "", hora: "",
  local: "MIRAMAR V", visitante: "", sets_local: null, sets_visitante: null,
  parciales: "", estado: "proximo", nota: "",
  mvp_nombre: null, mvp_posicion: null, mvp_num: null, mvp_foto: null,
};

function toInput(m: Match): MatchInput {
  return {
    id: m.id, division_id: m.division_id, jornada: m.jornada, fecha: m.fecha,
    hora: m.hora ? m.hora.slice(0, 5) : "", local: m.local, visitante: m.visitante,
    sets_local: m.sets_local, sets_visitante: m.sets_visitante, parciales: m.parciales,
    estado: m.estado, nota: m.nota,
    mvp_nombre: m.mvp_nombre, mvp_posicion: m.mvp_posicion, mvp_num: m.mvp_num, mvp_foto: m.mvp_foto,
  };
}

export default function MatchForm({ matches, divisions }: { matches: Match[]; divisions: Division[] }) {
  const router = useRouter();
  const [form, setForm] = useState<MatchInput>(EMPTY);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof MatchInput>(k: K, v: MatchInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const payload: MatchInput = {
      ...form,
      jornada: form.jornada || null, fecha: form.fecha || null, hora: form.hora || null,
      parciales: form.parciales || null, nota: form.nota || null,
    };
    const res = await upsertMatch(payload);
    setSaving(false);
    setMsg(res.ok ? "Guardado." : `Error: ${res.error}`);
    if (res.ok) router.refresh();
  }

  const input = "w-full rounded bg-navy border border-acero/30 px-2 py-1.5 text-sm";

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <aside>
        <button type="button" onClick={() => setForm(EMPTY)} className="mb-2 text-sm text-azul-bright">+ Nuevo partido</button>
        <ul className="space-y-1 max-h-[60vh] overflow-y-auto">
          {matches.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => setForm(toInput(m))}
                className={`w-full text-left px-2 py-1.5 rounded text-sm ${form.id === m.id ? "bg-azul text-hueso" : "hover:bg-navy text-acero"}`}>
                {m.jornada} · {m.local} v {m.visitante}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">ID<input className={input} required value={form.id} onChange={(e) => set("id", e.target.value)} placeholder="m13" /></label>
          <label className="text-sm">División
            <select className={input} value={form.division_id ?? ""} onChange={(e) => set("division_id", e.target.value || null)}>
              {divisions.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </select>
          </label>
          <label className="text-sm">Jornada<input className={input} value={form.jornada ?? ""} onChange={(e) => set("jornada", e.target.value)} placeholder="Fecha 13" /></label>
          <label className="text-sm">Estado
            <select className={input} value={form.estado ?? ""} onChange={(e) => set("estado", e.target.value)}>
              <option value="proximo">Próximo</option>
              <option value="pendiente_resultado">Pendiente resultado</option>
              <option value="jugado">Jugado</option>
            </select>
          </label>
          <label className="text-sm">Fecha<input type="date" className={input} value={form.fecha ?? ""} onChange={(e) => set("fecha", e.target.value)} /></label>
          <label className="text-sm">Hora<input type="time" className={input} value={form.hora ?? ""} onChange={(e) => set("hora", e.target.value)} /></label>
          <label className="text-sm">Local<input className={input} required value={form.local} onChange={(e) => set("local", e.target.value)} /></label>
          <label className="text-sm">Visitante<input className={input} required value={form.visitante} onChange={(e) => set("visitante", e.target.value)} /></label>
          <label className="text-sm">Sets local<input className={input} value={numStr(form.sets_local)} onChange={(e) => set("sets_local", toNum(e.target.value))} /></label>
          <label className="text-sm">Sets visitante<input className={input} value={numStr(form.sets_visitante)} onChange={(e) => set("sets_visitante", toNum(e.target.value))} /></label>
        </div>
        <label className="block text-sm">Parciales<input className={input} value={form.parciales ?? ""} onChange={(e) => set("parciales", e.target.value)} placeholder="25-18/25-21/25-19" /></label>
        <label className="block text-sm">Nota<input className={input} value={form.nota ?? ""} onChange={(e) => set("nota", e.target.value)} /></label>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="rounded bg-azul px-4 py-2 text-sm font-medium hover:bg-azul-bright disabled:opacity-60">{saving ? "Guardando…" : "Guardar"}</button>
          {msg && <span className="text-sm text-acero">{msg}</span>}
        </div>
      </form>
    </div>
  );
}
