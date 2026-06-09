import StandingsPasteForm from "@/components/admin/StandingsPasteForm";
import { getDivisions, getClubAliases } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminTabla() {
  const [divisions, aliasMap] = await Promise.all([getDivisions(), getClubAliases()]);
  const aliases = Object.fromEntries(aliasMap); // Map -> serializable record for the client
  return (
    <>
      <h1 className="font-display text-2xl font-bold mb-5">Tabla de posiciones</h1>
      <StandingsPasteForm divisions={divisions} aliases={aliases} />
    </>
  );
}
