import Image from "next/image";
import Link from "next/link";
import { esMiramar } from "@/lib/format";
import type { Match } from "@/lib/types";

function fechaLarga(iso: string | null): string {
  if (!iso) return "A confirmar";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function TeamRow({ name }: { name: string }) {
  const mv = esMiramar(name);
  return (
    <p className={`flyer-name text-2xl sm:text-3xl ${mv ? "text-glow-mv" : "text-hueso"}`}>{name}</p>
  );
}

/** "Próximo partido" con la identidad del flyer: azul royal, escudo, VS,
 *  fecha / hora / sede con íconos. */
export default function NextMatchFlyer({ match }: { match: Match }) {
  const miramarLocal = esMiramar(match.local);
  const sede = miramarLocal ? "Polideportivo de Miramar" : `Cancha de ${match.local}`;

  return (
    <section className="flyer-blue relative overflow-hidden rounded-3xl border border-azul-bright/25 px-6 py-10 sm:px-10 sm:py-12">
      {/* trazos de pincel decorativos */}
      <span aria-hidden className="pointer-events-none absolute right-[-6rem] top-[-4rem] h-72 w-72 rounded-full bg-azul-bright/20 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute left-[-5rem] bottom-[-5rem] h-64 w-64 rounded-full bg-[#0a4f93]/40 blur-3xl" />

      <div className="relative">
        <p className="kicker !text-azul-bright/90">Liga Mar y Sierra · Ascenso</p>
        <h2 className="flyer-title text-4xl sm:text-6xl mt-2 text-hueso">Próximo partido</h2>
        <div className="brush mt-3 w-48" />

        <div className="mt-8 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
          <Image src="/escudo.png" alt="Escudo Miramar" width={120} height={120} className="rounded-full drop-shadow-[0_0_24px_#0686cd66]" />

          <div className="space-y-2">
            <TeamRow name={match.local} />
            <p className="font-display text-sm font-bold tracking-[0.3em] text-azul-bright/80">VS</p>
            <TeamRow name={match.visitante} />
          </div>
        </div>

        <dl className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="info-pill">
            <span className="info-ico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            </span>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-hueso/50">Fecha</dt>
              <dd className="font-display font-bold text-hueso">{fechaLarga(match.fecha)}</dd>
            </div>
          </div>

          <div className="info-pill">
            <span className="info-ico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            </span>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-hueso/50">Horario</dt>
              <dd className="font-display font-bold text-hueso">{match.hora ? `${match.hora.slice(0, 5)} hs` : "A confirmar"}</dd>
            </div>
          </div>

          <div className="info-pill">
            <span className="info-ico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
            </span>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-hueso/50">Sede</dt>
              <dd className="font-display font-bold text-hueso">{sede}</dd>
            </div>
          </div>
        </dl>

        <div className="mt-8">
          <Link href="/fixture" className="btn-primary px-5 py-2.5 text-sm">Ver todo el fixture</Link>
        </div>
      </div>
    </section>
  );
}
