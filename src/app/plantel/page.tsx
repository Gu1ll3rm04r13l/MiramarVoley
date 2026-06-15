import PlantelGrid from "@/components/PlantelGrid";
import PageHeading from "@/components/PageHeading";
import { getPlayers, getAppConfig, getAllReportPlayers } from "@/lib/queries";

export const revalidate = 300;

export default async function PlantelPage() {
  const [players, config, reportPlayers] = await Promise.all([
    getPlayers(), getAppConfig(), getAllReportPlayers(),
  ]);
  // buena_fe already ordered last via `orden`; keep DB order.
  // Ocultar entradas sin posición real ("Pablo Medina") y jugadores inactivos ("Elio Contreras").
  const ocultos = new Set(["Pablo Medina", "Elio Contreras"]);
  const visibles = players.filter((p) => !ocultos.has(p.nombre));
  return (
    <>
      <PageHeading kicker="El equipo" title="Plantel" />
      <PlantelGrid players={visibles} usarNuevo={config.usar_numero_nuevo ?? false} reportPlayers={reportPlayers} />
    </>
  );
}
