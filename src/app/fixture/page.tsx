import FixtureList from "@/components/FixtureList";
import { getMiramarMatches } from "@/lib/queries";
import { supabase } from "@/lib/supabase";

export const revalidate = 300;

export default async function FixturePage() {
  const matches = await getMiramarMatches();
  const { data: reports } = await supabase.from("match_reports").select("match_id");
  const reportMatchIds = (reports ?? []).map((r) => r.match_id).filter((x): x is string => !!x);
  return (
    <>
      <h1 className="font-display text-3xl font-bold mb-5">Fixture y resultados</h1>
      <FixtureList matches={matches} reportMatchIds={reportMatchIds} />
    </>
  );
}
