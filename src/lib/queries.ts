import { supabase } from "@/lib/supabase";
import type { AppConfig, Division, Standing, Player, Match, MatchReport, ReportPlayer, ClubAlias } from "@/lib/types";

export async function getAppConfig(): Promise<AppConfig> {
  const { data, error } = await supabase.from("app_config").select("*").eq("id", 1).single();
  if (error) throw error;
  return data;
}

export async function getClubAliases(): Promise<Map<string, string>> {
  const { data, error } = await supabase.from("club_aliases").select("*");
  if (error) throw error;
  return new Map((data as ClubAlias[]).map((a) => [a.alias, a.canonical]));
}

export async function getDivisions(): Promise<Division[]> {
  const { data, error } = await supabase.from("divisions").select("*").order("id");
  if (error) throw error;
  return data;
}

export async function getStandings(divisionId: string): Promise<Standing[]> {
  const { data, error } = await supabase
    .from("standings").select("*").eq("division_id", divisionId).order("pos");
  if (error) throw error;
  return data;
}

export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from("players").select("*").order("orden");
  if (error) throw error;
  return data;
}

export async function getMiramarMatches(): Promise<Match[]> {
  // Miramar plays in every listed match (local or visitante == "MIRAMAR V").
  const { data, error } = await supabase
    .from("matches").select("*")
    .or("local.eq.MIRAMAR V,visitante.eq.MIRAMAR V")
    .order("fecha", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getMatchById(id: string): Promise<Match | null> {
  const { data, error } = await supabase.from("matches").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getReportByMatchId(matchId: string): Promise<MatchReport | null> {
  const { data, error } = await supabase
    .from("match_reports").select("*").eq("match_id", matchId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getReportPlayers(reportId: string): Promise<ReportPlayer[]> {
  const { data, error } = await supabase
    .from("report_players").select("*").eq("report_id", reportId);
  if (error) throw error;
  return data;
}

export async function getAllReportPlayers(): Promise<ReportPlayer[]> {
  // For player modal aggregate stats.
  const { data, error } = await supabase.from("report_players").select("*");
  if (error) throw error;
  return data;
}

export async function getMatches(): Promise<Match[]> {
  const { data, error } = await supabase.from("matches").select("*").order("fecha");
  if (error) throw error;
  return data;
}
