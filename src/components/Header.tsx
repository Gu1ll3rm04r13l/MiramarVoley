import Link from "next/link";
import Image from "next/image";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/tabla", label: "Tabla" },
  { href: "/fixture", label: "Fixture" },
  { href: "/plantel", label: "Plantel" },
  { href: "/club", label: "Club" },
  { href: "/galeria", label: "Galería" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-navy/95 backdrop-blur border-b border-acero/20">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/escudo.png" alt="Escudo Miramar" width={28} height={28} className="rounded-full" />
          <span className="font-display font-bold tracking-wide text-hueso hidden sm:inline">MIRAMAR VOLEY</span>
        </Link>
        <ul className="flex items-center gap-1 sm:gap-3 ml-auto overflow-x-auto text-sm">
          {NAV.slice(1).map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="px-2 py-1 rounded hover:bg-azul/30 text-acero hover:text-hueso transition-colors">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
