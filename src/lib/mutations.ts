"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase-server";
import type { ReportDraft, StandingPasteRow } from "@/lib/types";
import type { Json } from "@/lib/database.types";

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

  // Atomic delete+insert of player rows (single transaction inside the RPC),
  // so a failed insert can't leave the report with an empty grid.
  const { error: rpErr } = await supabase.rpc("replace_report_players", {
    p_report_id: reportId,
    p_rows: draft.jugadores.map((j) => ({
      num: j.num, nombre: j.nombre,
      saq: j.saq, rec: j.rec, ata: j.ata, bloq: j.bloq, def: j.def, cata: j.cata,
      err: j.err, mas_menos: j.mas_menos, rating: j.rating,
    })),
  });
  if (rpErr) return { ok: false, error: rpErr.message };
  revalidatePath(`/partido/${matchId}`);
  revalidatePath("/plantel");
  revalidatePath("/fixture");
  return { ok: true, reportId };
}

export async function replaceStandings(
  divisionId: string, actualizado: string | null, rows: StandingPasteRow[],
): Promise<ActionResult> {
  const supabase = await createSupabaseServer();
  // Atomic delete+insert+actualizado bump inside the RPC, so a failed insert
  // can't leave the division with an empty standings table.
  const { error } = await supabase.rpc("replace_division_standings", {
    p_division_id: divisionId,
    p_actualizado: actualizado as unknown as string, // RPC handles null (skips the bump)
    p_rows: rows as unknown as Json,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/tabla");
  revalidatePath("/");
  return { ok: true };
}
