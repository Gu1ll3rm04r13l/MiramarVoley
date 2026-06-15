import NextMatchHero from "@/components/NextMatchHero";
import NextMatchFlyer from "@/components/NextMatchFlyer";
import Reveal from "@/components/Reveal";
import { getMiramarMatches, getStandings } from "@/lib/queries";
import { getClub } from "@/lib/queries-club";
import { pickNextMatch, isMiramar, rivalDeMiramar } from "@/lib/format";
import MvpCarousel, { type MvpSlide } from "@/components/MvpCarousel";

export const revalidate = 300;

export default async function Home() {
  const [matches, ascenso, club] = await Promise.all([
    getMiramarMatches(), getStandings("ascenso"), getClub(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const next = pickNextMatch(matches, today);
  const nombreEnTablas = club.nombre_en_tablas ?? "MIRAMAR V";
  const mine = ascenso.find((r) => isMiramar(r.equipo, nombreEnTablas));
  const mvpSlides: MvpSlide[] = matches
    .filter((m) => m.mvp_nombre)
    .sort((a, b) => (b.fecha ?? "").localeCompare(a.fecha ?? ""))
    .map((m) => ({
      id: m.id,
      nombre: m.mvp_nombre!,
      posicion: m.mvp_posicion,
      num: m.mvp_num,
      foto: m.mvp_foto,
      rival: rivalDeMiramar(m),
      fecha: m.fecha,
    }));
  return (
    <div className="space-y-10">
      <NextMatchHero next={next} posicion={mine?.pos ?? null} totalEquipos={ascenso.length} />
      {next && (
        <Reveal>
          <NextMatchFlyer match={next} />
        </Reveal>
      )}
      {mvpSlides.length > 0 && (
        <Reveal>
          <MvpCarousel slides={mvpSlides} />
        </Reveal>
      )}
    </div>
  );
}
