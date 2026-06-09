import ReportForm from "@/components/admin/ReportForm";
import { getMiramarMatches, getReportByMatchId, getReportPlayers } from "@/lib/queries";
import type { MatchReport, ReportPlayer } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminReportes() {
  const matches = await getMiramarMatches();
  // Fetch each match's report (+players) in parallel rather than sequentially.
  const entries = await Promise.all(
    matches.map(async (m) => {
      const report = await getReportByMatchId(m.id);
      if (!report) return null;
      const players = await getReportPlayers(report.id);
      return [m.id, { report, players }] as const;
    }),
  );
  const existingByMatch: Record<string, { report: MatchReport; players: ReportPlayer[] }> =
    Object.fromEntries(entries.filter((e): e is NonNullable<typeof e> => e !== null));
  return (
    <>
      <h1 className="font-display text-2xl font-bold mb-5">Reporte SetPoint</h1>
      <ReportForm matches={matches} existingByMatch={existingByMatch} />
    </>
  );
}
