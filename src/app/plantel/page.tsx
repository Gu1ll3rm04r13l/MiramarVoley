import PlantelGrid from "@/components/PlantelGrid";
import { getPlayers, getAppConfig, getAllReportPlayers } from "@/lib/queries";

export const revalidate = 300;

export default async function PlantelPage() {
  const [players, config, reportPlayers] = await Promise.all([
    getPlayers(), getAppConfig(), getAllReportPlayers(),
  ]);
  // buena_fe already ordered last via `orden`; keep DB order.
  return (
    <>
      <h1 className="font-display text-3xl font-bold mb-5">Plantel</h1>
      <PlantelGrid players={players} usarNuevo={config.usar_numero_nuevo ?? false} reportPlayers={reportPlayers} />
    </>
  );
}
