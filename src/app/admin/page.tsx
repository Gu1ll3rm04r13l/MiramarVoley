import Link from "next/link";

const CARDS = [
  { href: "/admin/partidos", title: "Resultados", desc: "Cargar/editar sets, parciales y estado de partidos." },
  { href: "/admin/reportes", title: "Reportes SetPoint", desc: "Cabecera + grilla de jugadores. Importá desde PDF." },
  { href: "/admin/tabla", title: "Tabla", desc: "Pegá las filas desde AMV para reemplazar una división." },
];

export default function AdminHome() {
  return (
    <>
      <h1 className="font-display text-2xl font-bold mb-5">Panel de administración</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        {CARDS.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-xl border border-acero/20 bg-navy/40 p-4 hover:border-azul/60 transition-colors">
            <p className="font-display text-lg font-bold">{c.title}</p>
            <p className="text-sm text-acero mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
