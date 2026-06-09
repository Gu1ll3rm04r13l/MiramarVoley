import { notFound } from "next/navigation";
import MatchReport from "@/components/MatchReport";
import { getMatchById, getReportByMatchId, getReportPlayers } from "@/lib/queries";

export const revalidate = 300;

export default async function PartidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await getMatchById(id);
  if (!match) notFound();
  const report = await getReportByMatchId(id);
  if (!report) {
    return (
      <div>
        <h1 className="font-display text-3xl font-bold">{match.local} {match.sets_local}–{match.sets_visitante} {match.visitante}</h1>
        <p className="text-acero mt-3">Sin reporte cargado para este partido.</p>
      </div>
    );
  }
  const players = await getReportPlayers(report.id);
  return <MatchReport match={match} report={report} players={players} />;
}
