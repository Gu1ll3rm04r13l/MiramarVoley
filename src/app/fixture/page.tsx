import FixtureList from "@/components/FixtureList";
import PageHeading from "@/components/PageHeading";
import { getMiramarMatches } from "@/lib/queries";
import { supabase } from "@/lib/supabase";

export const revalidate = 300;

export default async function FixturePage() {
  const matches = await getMiramarMatches();
  const { data: reports, error: reportsErr } = await supabase.from("match_reports").select("match_id");
  if (reportsErr) console.error("[fixture] match_reports fetch failed:", reportsErr.message);
  const reportMatchIds = (reports ?? []).map((r) => r.match_id).filter((x): x is string => !!x);
  return (
    <>
      <PageHeading kicker="Calendario" title="Fixture y resultados" />
      <FixtureList matches={matches} reportMatchIds={reportMatchIds} />
    </>
  );
}
