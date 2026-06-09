import NextMatchHero from "@/components/NextMatchHero";
import { getMiramarMatches, getStandings, getAppConfig } from "@/lib/queries";
import { getClub } from "@/lib/queries-club";
import { pickNextMatch, isMiramar } from "@/lib/format";

export const revalidate = 300;

export default async function Home() {
  const [matches, ascenso, config, club] = await Promise.all([
    getMiramarMatches(), getStandings("ascenso"), getAppConfig(), getClub(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const next = pickNextMatch(matches, today);
  const nombreEnTablas = club.nombre_en_tablas ?? "MIRAMAR V";
  const mine = ascenso.find((r) => isMiramar(r.equipo, nombreEnTablas));
  return <NextMatchHero objetivo={config.objetivo ?? ""} next={next} posicion={mine?.pos ?? null} />;
}
