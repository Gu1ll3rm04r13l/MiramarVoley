import StatBar from "@/components/StatBar";
import MvpCard from "@/components/MvpCard";
import { esMiramar } from "@/lib/format";
import type { Match, MatchReport as Report, ReportPlayer } from "@/lib/types";

type SetScore = { set: number; local: number; visitante: number };
type Fund = { ataque: number | null; recepcion: number | null; saque: number | null; bloqueo: number | null; defensa: number | null; contraataque: number | null };
type Destacado = { jugador: string; num: number | null; rating?: number | null; saque?: number | null } | null;
type Destacados = { mejorRendimiento: Destacado; menorRendimiento: Destacado; mejorSacador: Destacado };

export default function MatchReport({ match, report, players }: { match: Match; report: Report; players: ReportPlayer[] }) {
  const sets = (report.resultado_por_set ?? []) as unknown as SetScore[];
  const f = (report.fundamentos ?? {}) as unknown as Fund;
  const d = (report.destacados ?? {}) as unknown as Partial<Destacados>;
  const localMV = esMiramar(match.local);
  const visMV = esMiramar(match.visitante);

  return (
    <article className="space-y-8">
      {/* ---- Banda de marcador (signature broadcast) ---- */}
      <header className="overflow-hidden rounded-2xl surface card-shadow">
        <div className="border-b border-acero/10 px-5 py-2.5 text-xs text-acero">
          {report.torneo} · {report.categoria} · <span className="tabular-nums">{report.fecha}</span>
        </div>
        <div className="relative flyer-navy px-5 py-7 sm:px-8 sm:py-9">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className={`font-display font-black uppercase leading-none text-xl sm:text-3xl ${localMV ? "text-glow-mv" : "text-hueso/85"}`}>
              {match.local}
            </span>
            <span className="num-display text-5xl sm:text-6xl text-azul-bright leading-none">{match.sets_local}</span>
            <span className="num-display text-3xl sm:text-4xl text-acero leading-none">–</span>
            <span className="num-display text-5xl sm:text-6xl text-azul-bright leading-none">{match.sets_visitante}</span>
            <span className={`font-display font-black uppercase leading-none text-xl sm:text-3xl ${visMV ? "text-glow-mv" : "text-hueso/85"}`}>
              {match.visitante}
            </span>
          </div>
          {sets.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {sets.map((s) => (
                <span key={s.set} className="rounded-md border border-azul-bright/25 bg-black/20 px-2.5 py-1 text-sm tabular-nums">
                  {s.local}-{s.visitante}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {match.mvp_nombre && (
        <MvpCard
          nombre={match.mvp_nombre}
          posicion={match.mvp_posicion}
          num={match.mvp_num}
          foto={match.mvp_foto}
        />
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        {([["Mejor rendimiento", d.mejorRendimiento], ["Menor", d.menorRendimiento], ["Mejor sacador", d.mejorSacador]] as const).map(([label, dd]) => (
          <div key={label} className="rounded-xl surface p-4">
            <p className="kicker !text-acero !tracking-[0.18em] !text-[0.65rem]">{label}</p>
            {dd ? (
              <>
                <p className="font-display font-bold mt-2">
                  <span className="text-azul-bright tabular-nums">#{dd.num}</span> {dd.jugador}
                </p>
                <p className="text-sm text-acero mt-0.5 tabular-nums">{"rating" in dd && dd.rating != null ? `Rating ${dd.rating}` : ""}{"saque" in dd && dd.saque != null ? `Saque ${dd.saque}` : ""}</p>
              </>
            ) : <p className="text-acero mt-2">—</p>}
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold mb-4">Rendimiento por fundamento</h2>
        <div className="rounded-xl surface p-5 space-y-1">
          <StatBar label="Ataque" value={f.ataque} />
          <StatBar label="Recepción" value={f.recepcion} />
          <StatBar label="Saque" value={f.saque} />
          <StatBar label="Bloqueo" value={f.bloqueo} />
          <StatBar label="Defensa" value={f.defensa} />
          <StatBar label="Contraataque" value={f.contraataque} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold mb-4">Rendimiento por jugador</h2>
        <div className="overflow-hidden rounded-xl surface card-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="panel-2 text-left text-acero">
                  {["#", "Jugador", "Saq", "Rec", "Ata", "Bloq", "Def", "C.Ata", "Err", "+/-", "Rating"].map((h) => (
                    <th key={h} className="font-display font-bold uppercase tracking-wider text-[0.7rem] px-2 py-3 whitespace-nowrap first:pl-4 last:pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.id} className="border-t border-acero/10 hover:bg-panel-2 transition-colors">
                    <td className="px-2 py-2 pl-4 num-display text-azul-bright text-base">{p.num}</td>
                    <td className="px-2 py-2 whitespace-nowrap font-medium">{p.nombre}</td>
                    {[p.saq, p.rec, p.ata, p.bloq, p.def, p.cata, p.err].map((v, i) => (
                      <td key={i} className="px-2 py-2 text-center tabular-nums text-acero">{v ?? "—"}</td>
                    ))}
                    <td className="px-2 py-2 text-center tabular-nums">{p.mas_menos != null && p.mas_menos > 0 ? `+${p.mas_menos}` : p.mas_menos ?? "—"}</td>
                    <td className="px-2 py-2 pr-4 text-center num-display">{p.rating ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </article>
  );
}
