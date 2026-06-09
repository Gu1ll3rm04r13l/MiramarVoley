import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import type { Match } from "@/lib/types";

export default function NextMatchHero({
  objetivo,
  next,
  posicion,
}: {
  objetivo: string;
  next: Match | null;
  posicion: number | null;
}) {
  return (
    <section className="hero-bg relative overflow-hidden rounded-3xl border border-acero/15 px-5 py-14 sm:px-10 sm:py-20 min-h-[calc(100svh-7rem)] flex flex-col items-center justify-center text-center">
      <div className="court-line" aria-hidden />

      <Reveal className="escudo-wrap">
        <Image
          src="/escudo.png"
          alt="Escudo Miramar"
          width={132}
          height={132}
          priority
          className="escudo-float"
        />
      </Reveal>

      <Reveal delay={90} as="p" className="kicker mt-7">
        Temporada 2026
      </Reveal>

      <Reveal delay={150} as="h1" className="display-xl text-5xl sm:text-7xl md:text-8xl mt-3">
        <span className="block text-glow-azul">MIRAMAR</span>
        <span className="block text-hueso/90 text-3xl sm:text-5xl md:text-6xl mt-1">CLUB DE VÓLEY</span>
      </Reveal>

      {objetivo && (
        <Reveal delay={220}>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-azul-bright">
            <span className="h-1.5 w-1.5 rounded-full bg-azul-bright shadow-[0_0_8px_#0686cd]" />
            {objetivo}
          </span>
        </Reveal>
      )}

      <Reveal delay={290} className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/fixture" className="btn-primary px-6 py-3 text-sm">Ver fixture</Link>
        <Link href="/tabla" className="btn-ghost px-6 py-3 text-sm">Ver tabla</Link>
      </Reveal>

      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2 mt-12 text-left">
        <Reveal delay={360} className="group relative overflow-hidden rounded-2xl glass p-5 transition-transform duration-300 hover:-translate-y-1">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-azul-bright to-transparent" />
          <p className="kicker !text-acero !tracking-[0.2em] mb-3">Próximo partido</p>
          {next ? (
            <>
              <p className="font-display text-2xl font-bold leading-tight">{next.local} <span className="text-acero font-normal">vs</span> {next.visitante}</p>
              <p className="text-sm text-acero mt-2">
                {next.jornada} · {next.fecha}{next.hora ? ` · ${next.hora.slice(0, 5)}` : ""}
              </p>
            </>
          ) : (
            <p className="text-acero">Sin partidos programados.</p>
          )}
        </Reveal>

        <Reveal delay={430} className="group relative overflow-hidden rounded-2xl glass p-5 transition-transform duration-300 hover:-translate-y-1">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-azul-bright to-transparent" />
          <p className="kicker !text-acero !tracking-[0.2em] mb-3">Posición · Ascenso</p>
          <div className="flex items-end gap-2">
            {posicion != null ? (
              <span className="display-xl text-6xl text-glow-azul leading-none">
                <Counter value={posicion} suffix="°" />
              </span>
            ) : (
              <span className="display-xl text-6xl leading-none">—</span>
            )}
            <span className="text-acero text-sm mb-1.5">en la tabla</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
