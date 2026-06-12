import type { ReportDraft, ReportPlayerDraft, MatchReport, ReportPlayer, Match } from "@/lib/types";

export function emptyDraft(): ReportDraft {
  return {
    torneo: null, categoria: null, fecha: null, duracion_min: null,
    sets_local: null, sets_visitante: null, equipo_local: null, equipo_visitante: null,
    equipo_puntos: null, equipo_errores: null, efectividad: null,
    rival_nombre: null, rival_puntos: null, rival_errores: null,
    resultado_por_set: [],
    fundamentos: { ataque: null, recepcion: null, saque: null, bloqueo: null, defensa: null, contraataque: null },
    destacados: { mejorRendimiento: null, menorRendimiento: null, mejorSacador: null },
    jugadores: [],
  };
}

export function emptyPlayerRow(): ReportPlayerDraft {
  return { num: null, nombre: "", saq: null, rec: null, ata: null, bloq: null, def: null, cata: null, err: null, mas_menos: null, rating: null };
}

export function draftFromReport(report: MatchReport, players: ReportPlayer[], match: Match): ReportDraft {
  return {
    torneo: report.torneo, categoria: report.categoria, fecha: report.fecha,
    duracion_min: report.duracion_min, sets_local: report.sets_local, sets_visitante: report.sets_visitante,
    equipo_local: match.local, equipo_visitante: match.visitante,
    equipo_puntos: report.equipo_puntos, equipo_errores: report.equipo_errores, efectividad: report.efectividad,
    rival_nombre: report.rival_nombre, rival_puntos: report.rival_puntos, rival_errores: report.rival_errores,
    resultado_por_set: (report.resultado_por_set as unknown as ReportDraft["resultado_por_set"]) ?? [],
    fundamentos: (report.fundamentos as unknown as ReportDraft["fundamentos"]) ?? emptyDraft().fundamentos,
    destacados: (report.destacados as unknown as ReportDraft["destacados"]) ?? emptyDraft().destacados,
    jugadores: players.map((p) => ({
      num: p.num, nombre: p.nombre ?? "", saq: p.saq, rec: p.rec, ata: p.ata, bloq: p.bloq,
      def: p.def, cata: p.cata, err: p.err, mas_menos: p.mas_menos, rating: p.rating,
    })),
  };
}
