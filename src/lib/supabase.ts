import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Stateless anon client for public Server Component / ISR reads.
export const supabase = createClient<Database>(url, anonKey, {
  auth: { persistSession: false },
});
