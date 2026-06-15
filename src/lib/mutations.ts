"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase-server";
import type { ReportDraft, StandingPasteRow, ClubAlias, Standing } from "@/lib/types";
import type { Json } from "@/lib/database.types";
import { matchContribution, applyDelta, recomputeDerived, recomputePositions, findStandingIndex, type TeamDelta } from "@/lib/standings-calc";

export type ActionResult = { ok: true; reportId?: string; warnings?: string[] } | { ok: false; error: string };

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
  mvp_nombre: string | null;
  mvp_posicion: string | null;
  mvp_num: number | null;
  mvp_foto: string | null;
};

export async function upsertMatch(input: MatchInput): Promise<ActionResult> {
  const supabase = await createSupabaseServer();

  // Read the previous row BEFORE the upsert so we can reverse its old contribution.
  const { data: old } = await supabase.from("matches").select("*").eq("id", input.id).maybeSingle();

  const { error } = await supabase.from("matches").upsert(input);
  if (error) return { ok: false, error: error.message };

  const warnings = await applyMatchToStandings(supabase, old as MatchInput | null, input);

  revalidatePath("/");
  revalidatePath("/fixture");
  revalidatePath("/tabla");
  revalidatePath(`/partido/${input.id}`);
  return { ok: true, warnings: warnings.length ? warnings : undefined };
}

type StandingsOp = { divisionId: string; team: string; delta: TeamDelta; sign: 1 | -1 };

async function applyMatchToStandings(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  old: MatchInput | null,
  next: MatchInput,
): Promise<string[]> {
  const warnings: string[] = [];

  const ops: StandingsOp[] = [];
  const oldContrib = old ? matchContribution(old) : null;
  if (oldContrib && old?.division_id) {
    ops.push({ divisionId: old.division_id, team: old.local, delta: oldContrib.local, sign: -1 });
    ops.push({ divisionId: old.division_id, team: old.visitante, delta: oldContrib.visitante, sign: -1 });
  }
  const nextContrib = matchContribution(next);
  if (nextContrib && next.division_id) {
    ops.push({ divisionId: next.division_id, team: next.local, delta: nextContrib.local, sign: 1 });
    ops.push({ divisionId: next.division_id, team: next.visitante, delta: nextContrib.visitante, sign: 1 });
  }
  if (ops.length === 0) return warnings;

  const { data: aliasData } = await supabase.from("club_aliases").select("*");
  const aliases = new Map((aliasData ?? []).map((a: ClubAlias) => [a.alias, a.canonical]));

  const divisions = [...new Set(ops.map((o) => o.divisionId))];
  for (const div of divisions) {
    const { data: rowsData } = await supabase.from("standings").select("*").eq("division_id", div);
    let rows = (rowsData ?? []) as Standing[];

    for (const op of ops.filter((o) => o.divisionId === div)) {
      const idx = findStandingIndex(rows, op.team, aliases);
      if (idx < 0) {
        warnings.push(`${op.team} no está en la tabla — esa fila no se actualizó.`);
        continue;
      }
      rows[idx] = recomputeDerived(applyDelta(rows[idx], op.delta, op.sign));
    }

    rows = recomputePositions(rows);
    for (const row of rows) {
      const { id, ...fields } = row;
      const { error: upErr } = await supabase.from("standings").update(fields).eq("id", id);
      if (upErr) warnings.push(`No se pudo guardar la tabla (${div}): ${upErr.message}`);
    }
  }

  return warnings;
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
