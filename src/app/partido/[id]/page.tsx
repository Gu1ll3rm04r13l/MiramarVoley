import { notFound } from "next/navigation";
import MatchReport from "@/components/MatchReport";
import MatchFlyers from "@/components/MatchFlyers";
import { esMiramar } from "@/lib/format";
import { getMatchById, getReportByMatchId, getReportPlayers } from "@/lib/queries";

export const revalidate = 300;

export default async function PartidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await getMatchById(id);
  if (!match) notFound();
  const report = await getReportByMatchId(id);
  if (!report) {
    return (
      <div className="space-y-8">
        <h1 className="font-display text-3xl font-bold">{match.local} {match.sets_local}–{match.sets_visitante} {match.visitante}</h1>
        {(match.mvp_nombre || match.resultado_foto) && (
          <MatchFlyers
            mvp={match.mvp_nombre ? { nombre: match.mvp_nombre, posicion: match.mvp_posicion, num: match.mvp_num, foto: match.mvp_foto } : null}
            resultadoFoto={match.resultado_foto}
            rival={esMiramar(match.local) ? match.visitante : match.local}
          />
        )}
        <p className="text-acero">Sin reporte cargado para este partido.</p>
      </div>
    );
  }
  const players = await getReportPlayers(report.id);
  return <MatchReport match={match} report={report} players={players} />;
}
