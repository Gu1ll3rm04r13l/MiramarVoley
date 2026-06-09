import MatchForm from "@/components/admin/MatchForm";
import { getMatches, getDivisions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminPartidos() {
  const [matches, divisions] = await Promise.all([getMatches(), getDivisions()]);
  return (
    <>
      <h1 className="font-display text-2xl font-bold mb-5">Resultados de partidos</h1>
      <MatchForm matches={matches} divisions={divisions} />
    </>
  );
}
