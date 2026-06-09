import StatBar from "@/components/StatBar";
import type { Match, MatchReport as Report, ReportPlayer } from "@/lib/types";

type SetScore = { set: number; local: number; visitante: number };
type Fund = { ataque: number | null; recepcion: number | null; saque: number | null; bloqueo: number | null; defensa: number | null; contraataque: number | null };
type Destacado = { jugador: string; num: number | null; rating?: number | null; saque?: number | null } | null;
type Destacados = { mejorRendimiento: Destacado; menorRendimiento: Destacado; mejorSacador: Destacado };

export default function MatchReport({ match, report, players }: { match: Match; report: Report; players: ReportPlayer[] }) {
  const sets = (report.resultado_por_set ?? []) as unknown as SetScore[];
  const f = (report.fundamentos ?? {}) as unknown as Fund;
  const d = (report.destacados ?? {}) as unknown as Partial<Destacados>;
  return (
    <article className="space-y-8">
      <header>
        <p className="text-sm text-acero">{report.torneo} · {report.categoria} · {report.fecha}</p>
        <h1 className="font-display text-3xl font-bold mt-1">{match.local} {match.sets_local}–{match.sets_visitante} {match.visitante}</h1>
        <div className="flex flex-wrap gap-2 mt-3">
          {sets.map((s) => (
            <span key={s.set} className="rounded bg-navy px-3 py-1 text-sm tabular-nums">{s.local}-{s.visitante}</span>
          ))}
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {([["MVP", d.mejorRendimiento], ["Menor", d.menorRendimiento], ["Mejor sacador", d.mejorSacador]] as const).map(([label, dd]) => (
          <div key={label} className="rounded-lg bg-navy/50 p-4">
            <p className="text-xs uppercase tracking-wide text-acero">{label}</p>
            {dd ? (
              <>
                <p className="font-medium mt-1">#{dd.num} {dd.jugador}</p>
                <p className="text-sm text-azul-bright">{"rating" in dd && dd.rating != null ? `Rating ${dd.rating}` : ""}{"saque" in dd && dd.saque != null ? `Saque ${dd.saque}` : ""}</p>
              </>
            ) : <p className="text-acero mt-1">—</p>}
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold mb-3">Rendimiento por fundamento</h2>
        <div className="space-y-2">
          <StatBar label="Ataque" value={f.ataque} />
          <StatBar label="Recepción" value={f.recepcion} />
          <StatBar label="Saque" value={f.saque} />
          <StatBar label="Bloqueo" value={f.bloqueo} />
          <StatBar label="Defensa" value={f.defensa} />
          <StatBar label="Contraataque" value={f.contraataque} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold mb-3">Rendimiento por jugador</h2>
        <div className="overflow-x-auto rounded-lg border border-acero/20">
          <table className="w-full text-sm">
            <thead className="bg-navy text-acero text-left">
              <tr>
                {["#", "Jugador", "Saq", "Rec", "Ata", "Bloq", "Def", "C.Ata", "Err", "+/-", "Rating"].map((h) => (
                  <th key={h} className="px-2 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id} className="border-t border-acero/10">
                  <td className="px-2 py-1.5 tabular-nums">{p.num}</td>
                  <td className="px-2 py-1.5 whitespace-nowrap">{p.nombre}</td>
                  {[p.saq, p.rec, p.ata, p.bloq, p.def, p.cata, p.err].map((v, i) => (
                    <td key={i} className="px-2 py-1.5 text-center tabular-nums">{v ?? "—"}</td>
                  ))}
                  <td className="px-2 py-1.5 text-center tabular-nums">{p.mas_menos != null && p.mas_menos > 0 ? `+${p.mas_menos}` : p.mas_menos ?? "—"}</td>
                  <td className="px-2 py-1.5 text-center tabular-nums font-bold">{p.rating ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
