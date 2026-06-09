"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/tabla", label: "Tabla" },
  { href: "/fixture", label: "Fixture" },
  { href: "/plantel", label: "Plantel" },
  { href: "/club", label: "Club" },
  { href: "/playoffs", label: "Playoffs" },
  { href: "/galeria", label: "Galería" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-acero/20 shadow-lg shadow-black/20">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <Image
            src="/escudo.png"
            alt="Escudo Miramar"
            width={28}
            height={28}
            className="rounded-full transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-display font-bold tracking-wide text-hueso hidden sm:inline">
            MIRAMAR VOLEY
          </span>
        </Link>
        <ul className="flex items-center gap-1 sm:gap-3 ml-auto overflow-x-auto no-scrollbar text-sm">
          {NAV.slice(1).map((n) => {
            const active = pathname === n.href;
            return (
              <li key={n.href} className="shrink-0">
                <Link
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-2 py-1 rounded transition-colors after:absolute after:left-2 after:right-2 after:-bottom-0.5 after:h-px after:bg-azul-bright after:origin-left after:transition-transform after:duration-300 ${
                    active
                      ? "text-hueso after:scale-x-100"
                      : "text-acero hover:text-hueso after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
