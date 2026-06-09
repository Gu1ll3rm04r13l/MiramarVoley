import Image from "next/image";
import Link from "next/link";
import type { Match } from "@/lib/types";

export default function NextMatchHero({
  objetivo, next, posicion,
}: { objetivo: string; next: Match | null; posicion: number | null }) {
  return (
    <section className="rounded-2xl border border-acero/20 bg-gradient-to-b from-navy to-negro p-6 sm:p-10 text-center">
      <Image src="/escudo.png" alt="Escudo Miramar" width={96} height={96} className="mx-auto rounded-full ring-2 ring-acero/40" />
      <h1 className="font-display text-3xl sm:text-5xl font-bold mt-4 tracking-wide">MIRAMAR CLUB DE VOLEY</h1>
      <p className="text-azul-bright font-medium mt-2">{objetivo}</p>
      <div className="grid gap-4 sm:grid-cols-2 mt-8 text-left">
        <div className="rounded-xl bg-navy/60 p-4">
          <p className="text-xs uppercase tracking-wide text-acero mb-2">Próximo partido</p>
          {next ? (
            <>
              <p className="font-display text-xl font-bold">{next.local} vs {next.visitante}</p>
              <p className="text-sm text-acero mt-1">{next.jornada} · {next.fecha}{next.hora ? ` · ${next.hora.slice(0, 5)}` : ""}</p>
              <Link href="/fixture" className="text-sm text-azul-bright mt-2 inline-block">Ver fixture →</Link>
            </>
          ) : <p className="text-acero">Sin partidos programados.</p>}
        </div>
        <div className="rounded-xl bg-navy/60 p-4">
          <p className="text-xs uppercase tracking-wide text-acero mb-2">Posición (Ascenso)</p>
          <p className="font-display text-4xl font-bold">{posicion ? `${posicion}°` : "—"}</p>
          <Link href="/tabla" className="text-sm text-azul-bright mt-2 inline-block">Ver tabla →</Link>
        </div>
      </div>
    </section>
  );
}
