import { getAppConfig } from "@/lib/queries";
import { getClub } from "@/lib/queries-club";

export const revalidate = 300;

export default async function ClubPage() {
  const [club, config] = await Promise.all([getClub(), getAppConfig()]);
  return (
    <article className="prose-invert max-w-none">
      <h1 className="font-display text-3xl font-bold mb-4">{club.nombre}</h1>
      <p className="text-acero">{club.ciudad}</p>
      <p className="mt-4">Temporada {config.temporada}. Objetivo: <span className="text-azul-bright">{config.objetivo}</span>.</p>
      <p className="mt-4 text-acero">Texto institucional a completar por el club.</p>
    </article>
  );
}
