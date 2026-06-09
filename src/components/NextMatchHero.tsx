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
    <section className="relative overflow-hidden rounded-2xl border border-acero/20 grad-hero p-6 sm:p-12 text-center">
      {/* Lineas de luz sutiles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 26px, #ffffff 26px, #ffffff 27px)",
        }}
      />
      <div className="relative">
        <Reveal>
          <Image
            src="/escudo.png"
            alt="Escudo Miramar"
            width={104}
            height={104}
            className="escudo-glow mx-auto ring-2 ring-acero/40"
            priority
          />
        </Reveal>
        <Reveal delay={80} as="h1" className="font-display text-3xl sm:text-5xl font-bold mt-5 tracking-wide">
          MIRAMAR CLUB DE VOLEY
        </Reveal>
        <Reveal delay={160} as="p" className="text-azul-bright font-medium mt-2">
          {objetivo}
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 mt-9 text-left">
          <Reveal delay={240} className="glass rounded-xl p-5 transition-shadow duration-300 hover:glow-soft">
            <p className="text-xs uppercase tracking-wide text-acero mb-2">Próximo partido</p>
            {next ? (
              <>
                <p className="font-display text-xl font-bold">
                  {next.local} vs {next.visitante}
                </p>
                <p className="text-sm text-acero mt-1">
                  {next.jornada} · {next.fecha}
                  {next.hora ? ` · ${next.hora.slice(0, 5)}` : ""}
                </p>
                <Link href="/fixture" className="text-sm text-azul-bright mt-3 inline-block hover:underline">
                  Ver fixture →
                </Link>
              </>
            ) : (
              <p className="text-acero">Sin partidos programados.</p>
            )}
          </Reveal>

          <Reveal delay={320} className="glass rounded-xl p-5 transition-shadow duration-300 hover:glow-soft">
            <p className="text-xs uppercase tracking-wide text-acero mb-2">Posición (Ascenso)</p>
            {posicion != null ? (
              <p className="font-display text-4xl font-bold">
                <Counter value={posicion} suffix="°" />
              </p>
            ) : (
              <p className="font-display text-4xl font-bold">—</p>
            )}
            <Link href="/tabla" className="text-sm text-azul-bright mt-3 inline-block hover:underline">
              Ver tabla →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
