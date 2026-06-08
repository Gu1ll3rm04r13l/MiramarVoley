import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type Club = Database["public"]["Tables"]["clubs"]["Row"];

export async function getClub(): Promise<Club> {
  const { data, error } = await supabase.from("clubs").select("*").eq("id", "miramar").single();
  if (error) throw error;
  return data;
}
