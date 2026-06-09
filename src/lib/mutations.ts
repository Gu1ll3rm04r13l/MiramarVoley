"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase-server";
import type { ReportDraft, StandingPasteRow } from "@/lib/types";

export type ActionResult = { ok: true; reportId?: string } | { ok: false; error: string };

export type MatchInput = {
  id: string;
  division_id: string | null;
  jornada: string | null;
  fecha: string | null;
  hora: string | null;
  local: string;
  visitante: string;
  sets_local: number | null;
  sets_visitante: number | null;
  parciales: string | null;
  estado: string | null;
  nota: string | null;
};

export async function upsertMatch(input: MatchInput): Promise<ActionResult> {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.from("matches").upsert(input);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/fixture");
  revalidatePath(`/partido/${input.id}`);
  return { ok: true };
}

export async function saveReport(matchId: string, draft: ReportDraft): Promise<ActionResult> {
  const supabase = await createSupabaseServer();
  const reportId = `rep_${matchId}`;
  const { error: rErr } = await supabase.from("match_reports").upsert({
    id: reportId,
    match_id: matchId,
    torneo: draft.torneo,
    categoria: draft.categoria,
    fecha: draft.fecha,
    duracion_min: draft.duracion_min,
    sets_local: draft.sets_local,
    sets_visitante: draft.sets_visitante,
    equipo_puntos: draft.equipo_puntos,
    equipo_errores: draft.equipo_errores,
    efectividad: draft.efectividad,
    rival_nombre: draft.rival_nombre,
    rival_puntos: draft.rival_puntos,
    rival_errores: draft.rival_errores,
    resultado_por_set: draft.resultado_por_set,
    fundamentos: draft.fundamentos,
    destacados: draft.destacados,
  });
  if (rErr) return { ok: false, error: rErr.message };

  const { error: delErr } = await supabase.from("report_players").delete().eq("report_id", reportId);
  if (delErr) return { ok: false, error: delErr.message };

  if (draft.jugadores.length) {
    const rows = draft.jugadores.map((j) => ({
      report_id: reportId,
      num: j.num, nombre: j.nombre,
      saq: j.saq, rec: j.rec, ata: j.ata, bloq: j.bloq, def: j.def, cata: j.cata,
      err: j.err, mas_menos: j.mas_menos, rating: j.rating,
    }));
    const { error: insErr } = await supabase.from("report_players").insert(rows);
    if (insErr) return { ok: false, error: insErr.message };
  }
  revalidatePath(`/partido/${matchId}`);
  revalidatePath("/plantel");
  revalidatePath("/fixture");
  return { ok: true, reportId };
}

export async function replaceStandings(
  divisionId: string, actualizado: string | null, rows: StandingPasteRow[],
): Promise<ActionResult> {
  const supabase = await createSupabaseServer();
  const { error: delErr } = await supabase.from("standings").delete().eq("division_id", divisionId);
  if (delErr) return { ok: false, error: delErr.message };

  const insertRows = rows.map((r) => ({ division_id: divisionId, ...r }));
  const { error: insErr } = await supabase.from("standings").insert(insertRows);
  if (insErr) return { ok: false, error: insErr.message };

  if (actualizado) {
    const { error: updErr } = await supabase.from("divisions").update({ actualizado }).eq("id", divisionId);
    if (updErr) return { ok: false, error: updErr.message };
  }
  revalidatePath("/tabla");
  revalidatePath("/");
  return { ok: true };
}
