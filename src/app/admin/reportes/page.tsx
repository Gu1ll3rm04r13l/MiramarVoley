import ReportForm from "@/components/admin/ReportForm";
import { getMiramarMatches, getReportByMatchId, getReportPlayers } from "@/lib/queries";
import type { MatchReport, ReportPlayer } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminReportes() {
  const matches = await getMiramarMatches();
  const existingByMatch: Record<string, { report: MatchReport; players: ReportPlayer[] }> = {};
  for (const m of matches) {
    const report = await getReportByMatchId(m.id);
    if (report) {
      existingByMatch[m.id] = { report, players: await getReportPlayers(report.id) };
    }
  }
  return (
    <>
      <h1 className="font-display text-2xl font-bold mb-5">Reporte SetPoint</h1>
      <ReportForm matches={matches} existingByMatch={existingByMatch} />
    </>
  );
}
