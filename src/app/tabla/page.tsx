import StandingsTable from "@/components/StandingsTable";
import PageHeading from "@/components/PageHeading";
import { getStandings, getDivisions } from "@/lib/queries";
import { getClub } from "@/lib/queries-club";

export const revalidate = 300;

export default async function TablaPage() {
  const [ascenso, top8, divisions, nombreEnTablas] = await Promise.all([
    getStandings("ascenso"),
    getStandings("top8"),
    getDivisions(),
    getClub().then((c) => c.nombre_en_tablas ?? "MIRAMAR V"),
  ]);
  const actualizado = (id: string) => divisions.find((d) => d.id === id)?.actualizado ?? null;
  return (
    <>
      <PageHeading kicker="Clasificación" title="Tabla de posiciones" />
      <StandingsTable
        ascenso={ascenso} top8={top8} nombreEnTablas={nombreEnTablas}
        actualizadoAscenso={actualizado("ascenso")} actualizadoTop8={actualizado("top8")}
      />
    </>
  );
}
