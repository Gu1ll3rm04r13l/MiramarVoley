import Link from "next/link";
import type { Match } from "@/lib/types";

const ESTADO_LABEL: Record<string, string> = {
  jugado: "Jugado",
  pendiente_resultado: "Pendiente",
  proximo: "Próximo",
};

export default function MatchCard({ match, hasReport }: { match: Match; hasReport?: boolean }) {
  const played = match.estado === "jugado";
  const next = match.estado === "proximo";
  const body = (
    <div
      className={`group h-full rounded-lg p-4 transition-all duration-300 hover:-translate-y-0.5 ${
        next
          ? "glass border border-azul/40 hover:glow-soft"
          : "surface hover:border-azul/50"
      }`}
    >
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
      {played && hasReport && (
        <p className="mt-2 text-xs text-azul-bright group-hover:translate-x-0.5 transition-transform">
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
