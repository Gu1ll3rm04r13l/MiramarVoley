import NextMatchHero from "@/components/NextMatchHero";
import NextMatchFlyer from "@/components/NextMatchFlyer";
import Reveal from "@/components/Reveal";
import { getMiramarMatches, getStandings } from "@/lib/queries";
import { getClub } from "@/lib/queries-club";
import { pickNextMatch, isMiramar } from "@/lib/format";

export const revalidate = 300;

export default async function Home() {
  const [matches, ascenso, club] = await Promise.all([
    getMiramarMatches(), getStandings("ascenso"), getClub(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const next = pickNextMatch(matches, today);
  const nombreEnTablas = club.nombre_en_tablas ?? "MIRAMAR V";
  const mine = ascenso.find((r) => isMiramar(r.equipo, nombreEnTablas));
  return (
    <div className="space-y-10">
      <NextMatchHero next={next} posicion={mine?.pos ?? null} totalEquipos={ascenso.length} />
      {next && (
        <Reveal>
          <NextMatchFlyer match={next} />
        </Reveal>
      )}
    </div>
  );
}
