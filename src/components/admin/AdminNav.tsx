"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

const LINKS = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/partidos", label: "Resultados" },
  { href: "/admin/reportes", label: "Reportes" },
  { href: "/admin/tabla", label: "Tabla" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  async function signOut() {
    await createSupabaseBrowser().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <nav className="sm:w-48 shrink-0 sm:border-r border-acero/20 sm:pr-4">
      <ul className="flex sm:flex-col gap-1 overflow-x-auto">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <li key={l.href}>
              <Link href={l.href}
                className={`block px-3 py-2 rounded-lg text-sm whitespace-nowrap ${active ? "bg-azul text-hueso" : "text-acero hover:text-hueso hover:bg-navy"}`}>
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={signOut} className="mt-4 text-sm text-acero hover:text-hueso">Salir</button>
    </nav>
  );
}
