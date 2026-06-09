import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  // /admin/login renders without the nav chrome.
  if (!user) {
    return <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>;
  }
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row gap-6">
      <AdminNav />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
