import Image from "next/image";
import Reveal from "@/components/Reveal";
import { getAppConfig } from "@/lib/queries";
import { getClub } from "@/lib/queries-club";

export const revalidate = 300;

export default async function ClubPage() {
  const [club, config] = await Promise.all([getClub(), getAppConfig()]);
  return (
    <article className="max-w-none">
      <Reveal as="section" className="hero-bg relative overflow-hidden rounded-3xl border border-acero/15 p-10 sm:p-16 text-center">
        <div className="court-line" aria-hidden />
        <span className="escudo-wrap inline-block">
          <Image src="/escudo.png" alt="Escudo Miramar" width={104} height={104} className="escudo-float" />
        </span>
        <p className="kicker mt-6">Institucional</p>
        <h1 className="display-xl text-glow-azul text-4xl sm:text-6xl mt-2">{club.nombre}</h1>
        <p className="text-acero mt-2">{club.ciudad}</p>
      </Reveal>

      <Reveal delay={120} as="section" className="glass rounded-2xl p-6 mt-6">
        <p className="text-lg">Temporada {config.temporada}.</p>
      </Reveal>

      <Reveal delay={200} as="section" className="surface rounded-2xl p-6 mt-4">
        <p className="text-acero">Texto institucional a completar por el club.</p>
      </Reveal>
    </article>
  );
}
