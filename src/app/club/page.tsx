import Image from "next/image";
import Reveal from "@/components/Reveal";
import { getAppConfig } from "@/lib/queries";
import { getClub } from "@/lib/queries-club";

export const revalidate = 300;

export default async function ClubPage() {
  const [club, config] = await Promise.all([getClub(), getAppConfig()]);
  return (
    <article className="max-w-none">
      <Reveal as="section" className="relative overflow-hidden rounded-2xl grad-hero border border-acero/20 p-8 sm:p-12 text-center">
        <Image src="/escudo.png" alt="Escudo Miramar" width={88} height={88} className="escudo-glow mx-auto ring-2 ring-acero/40" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-5">{club.nombre}</h1>
        <p className="text-acero mt-1">{club.ciudad}</p>
      </Reveal>

      <Reveal delay={120} as="section" className="glass rounded-xl p-6 mt-6">
        <p className="text-lg">
          Temporada {config.temporada}. Objetivo:{" "}
          <span className="text-azul-bright font-medium">{config.objetivo}</span>.
        </p>
      </Reveal>

      <Reveal delay={200} as="section" className="surface rounded-xl p-6 mt-4">
        <p className="text-acero">Texto institucional a completar por el club.</p>
      </Reveal>
    </article>
  );
}
