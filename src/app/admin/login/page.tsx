"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="font-display text-2xl font-bold mb-6">Panel · Ingresar</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-acero mb-1" htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-navy border border-acero/30 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-acero mb-1" htmlFor="password">Contraseña</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-navy border border-acero/30 px-3 py-2" />
        </div>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-azul px-4 py-2 font-medium hover:bg-azul-bright transition-colors disabled:opacity-60">
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
