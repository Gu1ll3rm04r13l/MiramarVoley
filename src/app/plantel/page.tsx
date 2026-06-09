import PlantelGrid from "@/components/PlantelGrid";
import PageHeading from "@/components/PageHeading";
import { getPlayers, getAppConfig, getAllReportPlayers } from "@/lib/queries";

export const revalidate = 300;

export default async function PlantelPage() {
  const [players, config, reportPlayers] = await Promise.all([
    getPlayers(), getAppConfig(), getAllReportPlayers(),
  ]);
  // buena_fe already ordered last via `orden`; keep DB order.
  // Ocultar entradas sin posición real (p. ej. "Pablo Medina").
  const visibles = players.filter((p) => p.nombre !== "Pablo Medina");
  return (
    <>
      <PageHeading kicker="El equipo" title="Plantel" />
      <PlantelGrid players={visibles} usarNuevo={config.usar_numero_nuevo ?? false} reportPlayers={reportPlayers} />
    </>
  );
}
