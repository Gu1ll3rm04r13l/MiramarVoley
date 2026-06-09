import Reveal from "@/components/Reveal";
import PageHeading from "@/components/PageHeading";
import { getStandings } from "@/lib/queries";
import { getClub } from "@/lib/queries-club";
import { esMiramar } from "@/lib/format";

export const revalidate = 300;

type Copa = {
  nombre: string;
  accent: string;
  rango: string;
  seeds: number[];
  semis: [number, number][];
  tercerPuesto: boolean;
};

const COPAS: Copa[] = [
  { nombre: "Copa de Oro", accent: "#e3c16b", rango: "1° a 4°", seeds: [1, 2, 3, 4], semis: [[1, 4], [2, 3]], tercerPuesto: true },
  { nombre: "Copa de Plata", accent: "#cdd3da", rango: "5° a 8°", seeds: [5, 6, 7, 8], semis: [[5, 8], [6, 7]], tercerPuesto: false },
  { nombre: "Copa de Bronce", accent: "#cd8e5e", rango: "9° a 12°", seeds: [9, 10, 11, 12], semis: [[9, 12], [10, 11]], tercerPuesto: false },
];

const FASES = [
  { fase: "Semifinales (todas las copas)", ventana: "25/6 al 1/7" },
  { fase: "Finales y 3er puesto de Oro", ventana: "2/7 al 12/7" },
  { fase: "Repechaje 2° Ascenso vs 7° Top 8", ventana: "13/7 al 19/7" },
];

export default async function PlayoffsPage() {
  const [ascenso, nombreEnTablas] = await Promise.all([
    getStandings("ascenso"),
    getClub().then((c) => c.nombre_en_tablas ?? "MIRAMAR V"),
  ]);
  const porPos = new Map(ascenso.map((s) => [s.pos, s.equipo]));
  const equipoDe = (pos: number) => porPos.get(pos) ?? null;
  const seedLabel = (pos: number) => {
    const eq = equipoDe(pos);
    return { pos, equipo: eq, mv: esMiramar(eq) };
  };

  return (
    <>
      <PageHeading kicker="Definición · 1° Ascenso" title="Playoffs" />

      {/* Cómo se definen + ventanas de fechas */}
      <Reveal>
        <div className="rounded-2xl glass p-5 sm:p-6">
          <p className="text-sm text-acero">
            Según la posición final en la tabla, los 12 equipos se reparten en tres copas. La clasificación abajo usa la{" "}
            <span className="text-hueso">tabla actual</span> y puede cambiar hasta el cierre de la fase regular.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {FASES.map((f) => (
              <div key={f.fase} className="rounded-xl surface p-4">
                <p className="kicker !text-azul-bright !tracking-[0.15em]">{f.ventana}</p>
                <p className="mt-1.5 font-display font-bold text-sm leading-snug">{f.fase}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-acero">
            <span className="text-azul-bright">●</span> Todos los partidos se juegan en cancha del mejor posicionado en la tabla.
          </p>
        </div>
      </Reveal>

      {/* Copas */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {COPAS.map((copa, ci) => (
          <Reveal key={copa.nombre} delay={ci * 90}>
            <article
              className="relative h-full overflow-hidden rounded-2xl surface p-5"
              style={{ borderTop: `3px solid ${copa.accent}` }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-40 w-40 rounded-full blur-3xl opacity-20"
                style={{ background: copa.accent }}
              />
              <header className="flex items-baseline justify-between">
                <h2 className="font-display text-xl font-bold" style={{ color: copa.accent }}>{copa.nombre}</h2>
                <span className="text-xs text-acero">{copa.rango}</span>
              </header>

              {/* Sembrado */}
              <ol className="mt-4 space-y-1.5">
                {copa.seeds.map((pos) => {
                  const s = seedLabel(pos);
                  return (
                    <li
                      key={pos}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                        s.mv ? "bg-azul/20 border border-azul/40" : "bg-navy/40"
                      }`}
                    >
                      <span className="font-display font-bold tabular-nums w-7 text-center" style={{ color: copa.accent }}>{pos}°</span>
                      <span className={`truncate font-medium ${s.mv ? "text-glow-mv" : "text-hueso/90"}`}>
                        {s.equipo ?? "Por definir"}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {/* Llave: semifinales → final */}
              <div className="mt-5">
                <p className="kicker !text-acero !tracking-[0.18em] mb-2">Llave</p>
                <div className="space-y-2">
                  {copa.semis.map(([a, b], i) => {
                    const sa = seedLabel(a);
                    const sb = seedLabel(b);
                    return (
                      <div key={i} className="rounded-lg border border-acero/15 px-3 py-2 text-sm">
                        <span className="text-acero text-xs">Semi {i + 1}: </span>
                        <span className={sa.mv ? "text-glow-mv font-bold" : ""}>{a}°</span>
                        <span className="text-acero"> vs </span>
                        <span className={sb.mv ? "text-glow-mv font-bold" : ""}>{b}°</span>
                      </div>
                    );
                  })}
                  <div className="rounded-lg px-3 py-2 text-sm font-display font-bold" style={{ background: `${copa.accent}1a`, color: copa.accent }}>
                    Final{copa.tercerPuesto ? " · 3er puesto" : ""}
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </>
  );
}
