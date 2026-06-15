import Link from "next/link";
import { esMiramar } from "@/lib/format";
import type { Match } from "@/lib/types";

const ESTADO_LABEL: Record<string, string> = {
  jugado: "Jugado",
  pendiente_resultado: "Pendiente",
  proximo: "Próximo",
};

function TeamName({ name, align }: { name: string; align: "left" | "right" }) {
  const mv = esMiramar(name);
  return (
    <span
      className={`block truncate font-display font-bold ${align === "right" ? "text-right" : "text-left"} ${
        mv ? "text-glow-mv" : "text-hueso/90"
      }`}
    >
      {name}
    </span>
  );
}

export default function MatchCard({ match, hasReport }: { match: Match; hasReport?: boolean }) {
  const played = match.estado === "jugado";
  const next = match.estado === "proximo";
  const body = (
    <div
      className={`group h-full rounded-lg p-4 transition-all duration-300 hover:-translate-y-0.5 ${
        next ? "glass border border-azul/40 hover:glow-soft" : "surface hover:border-azul/50"
      }`}
    >
      <div className="flex items-center justify-between text-xs text-acero mb-3">
        <span>{match.jornada}</span>
        <span className="tabular-nums">
          {match.fecha}
          {match.hora ? ` · ${match.hora.slice(0, 5)}` : ""}
        </span>
      </div>

      {/* Grid fijo: equipo local | centro | equipo visitante.
          Las columnas laterales son 1fr (ancho parejo, recortan nombres largos),
          el centro es auto → todo queda alineado sin importar los nombres. */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <TeamName name={match.local} align="right" />

        <div className="grid place-items-center px-1 min-w-[3.25rem]">
          {played ? (
            <span className="font-display text-xl font-bold tabular-nums leading-none">
              {match.sets_local}<span className="text-acero">–</span>{match.sets_visitante}
            </span>
          ) : (
            <span className="text-[0.7rem] rounded-full px-2 py-0.5 bg-panel-2 border border-azul/40 text-hueso whitespace-nowrap">
              {ESTADO_LABEL[match.estado ?? ""] ?? "vs"}
            </span>
          )}
        </div>

        <TeamName name={match.visitante} align="left" />
      </div>

      {match.nota && <p className="mt-3 text-xs text-acero text-center">{match.nota}</p>}
      {played && hasReport && (
        <p className="mt-3 text-xs text-azul-bright group-hover:translate-x-0.5 transition-transform">
          Ver reporte →
        </p>
      )}
    </div>
  );
  return played && hasReport ? (
    <Link href={`/partido/${match.id}`} aria-label={`Detalle ${match.local} vs ${match.visitante}`}>
      {body}
    </Link>
  ) : (
    body
  );
}
