import type { Database } from "@/lib/database.types";

export type Player = Database["public"]["Tables"]["players"]["Row"];
export type Match = Database["public"]["Tables"]["matches"]["Row"];
export type Standing = Database["public"]["Tables"]["standings"]["Row"];
export type Division = Database["public"]["Tables"]["divisions"]["Row"];
export type AppConfig = Database["public"]["Tables"]["app_config"]["Row"];
export type ClubAlias = Database["public"]["Tables"]["club_aliases"]["Row"];
export type MatchReport = Database["public"]["Tables"]["match_reports"]["Row"];
export type ReportPlayer = Database["public"]["Tables"]["report_players"]["Row"];

export type Dorsal = number | "—";

// Draft produced by the SetPoint parser and consumed by ReportForm.
export interface ReportPlayerDraft {
  num: number | null;
  nombre: string;
  saq: number | null;
  rec: number | null;
  ata: number | null;
  bloq: number | null;
  def: number | null;
  cata: number | null;
  err: number | null;
  mas_menos: number | null;
  rating: number | null;
}

export interface ReportDraft {
  torneo: string | null;
  categoria: string | null;
  fecha: string | null; // ISO yyyy-mm-dd
  duracion_min: number | null;
  sets_local: number | null;
  sets_visitante: number | null;
  equipo_local: string | null;
  equipo_visitante: string | null;
  equipo_puntos: number | null;
  equipo_errores: number | null;
  efectividad: number | null;
  rival_nombre: string | null;
  rival_puntos: number | null;
  rival_errores: number | null;
  resultado_por_set: { set: number; local: number; visitante: number }[];
  fundamentos: {
    ataque: number | null;
    recepcion: number | null;
    saque: number | null;
    bloqueo: number | null;
    defensa: number | null;
    contraataque: number | null;
  };
  destacados: {
    mejorRendimiento: { jugador: string; num: number | null; rating: number | null } | null;
    menorRendimiento: { jugador: string; num: number | null; rating: number | null } | null;
    mejorSacador: { jugador: string; num: number | null; saque: number | null } | null;
  };
  // Jugador del partido (MVP) editable a mano. Opcional: el parser de PDF no lo provee.
  mvp_nombre?: string | null;
  mvp_posicion?: string | null;
  mvp_num?: number | null;
  mvp_foto?: string | null;
  jugadores: ReportPlayerDraft[];
}

// Parsed row from the AMV standings paste.
export interface StandingPasteRow {
  pos: number;
  equipo: string;
  pj: number; pg: number; pp: number;
  sf: number; sc: number; ds: number;
  rs: number; psf: number; psc: number; rp: number; pts: number;
}
