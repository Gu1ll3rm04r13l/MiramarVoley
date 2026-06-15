import type { Standing } from "@/lib/types";
import { normalizeClub } from "@/lib/format";

export function parseParciales(s: string | null | undefined): { local: number; visitante: number } | null {
  if (!s) return null;
  const sets = s.split("/").map((x) => x.trim()).filter(Boolean);
  let local = 0, visitante = 0, count = 0;
  for (const set of sets) {
    const m = set.match(/^(\d+)\s*-\s*(\d+)$/);
    if (!m) continue;
    local += Number(m[1]);
    visitante += Number(m[2]);
    count++;
  }
  return count > 0 ? { local, visitante } : null;
}

export type TeamDelta = {
  pj: number; pg: number; pp: number; sf: number; sc: number;
  psf: number; psc: number; pts: number;
};

type MatchLike = {
  sets_local: number | null;
  sets_visitante: number | null;
  parciales: string | null;
  estado: string | null;
};

function fivbPoints(localSets: number, visSets: number): { local: number; visitante: number } {
  const localWon = localSets > visSets;
  const loserSets = Math.min(localSets, visSets);
  const winnerPts = loserSets === 2 ? 2 : 3;
  const loserPts = loserSets === 2 ? 1 : 0;
  return localWon
    ? { local: winnerPts, visitante: loserPts }
    : { local: loserPts, visitante: winnerPts };
}

export function matchContribution(m: MatchLike): { local: TeamDelta; visitante: TeamDelta } | null {
  if (m.estado !== "jugado") return null;
  if (m.sets_local == null || m.sets_visitante == null) return null;
  const sl = m.sets_local, sv = m.sets_visitante;
  const pts = fivbPoints(sl, sv);
  const pp = parseParciales(m.parciales);
  const localPts = pp?.local ?? 0;
  const visPts = pp?.visitante ?? 0;
  return {
    local: { pj: 1, pg: sl > sv ? 1 : 0, pp: sl < sv ? 1 : 0, sf: sl, sc: sv, psf: localPts, psc: visPts, pts: pts.local },
    visitante: { pj: 1, pg: sv > sl ? 1 : 0, pp: sv < sl ? 1 : 0, sf: sv, sc: sl, psf: visPts, psc: localPts, pts: pts.visitante },
  };
}
