import Link from "next/link";
import type { Match } from "@/lib/types";

const ESTADO_LABEL: Record<string, string> = {
  jugado: "Jugado",
  pendiente_resultado: "Pendiente",
  proximo: "Próximo",
};

export default function MatchCard({ match, hasReport }: { match: Match; hasReport?: boolean }) {
  const played = match.estado === "jugado";
  const body = (
    <div className="rounded-lg border border-acero/20 bg-navy/40 p-4 hover:border-azul/50 transition-colors">
      <div className="flex items-center justify-between text-xs text-acero mb-2">
        <span>{match.jornada}</span>
        <span>{match.fecha}{match.hora ? ` · ${match.hora.slice(0, 5)}` : ""}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium truncate">{match.local}</span>
        {played ? (
          <span className="font-display text-xl font-bold tabular-nums px-2">
            {match.sets_local}–{match.sets_visitante}
          </span>
        ) : (
          <span className="text-xs rounded-full px-2 py-0.5 bg-azul/30 text-hueso shrink-0">
            {ESTADO_LABEL[match.estado ?? ""] ?? ""}
          </span>
        )}
        <span className="font-medium truncate text-right">{match.visitante}</span>
      </div>
      {match.nota && <p className="mt-2 text-xs text-acero">{match.nota}</p>}
      {played && hasReport && <p className="mt-2 text-xs text-azul-bright">Ver reporte →</p>}
    </div>
  );
  return played ? <Link href={`/partido/${match.id}`} aria-label={`Detalle ${match.local} vs ${match.visitante}`}>{body}</Link> : body;
}
