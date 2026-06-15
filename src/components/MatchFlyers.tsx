"use client";

import { useRef, useState } from "react";
import MvpCard from "@/components/MvpCard";
import FlyerImageCard from "@/components/FlyerImageCard";

/** MVP + Resultado del partido como dos flyers del MISMO tamaño.
 *  Desktop (sm+): lado a lado (grid 2 col). Mobile: carrusel swipe + dots.
 *  Si falta uno de los dos, muestra el otro solo (sin carrusel). */
export default function MatchFlyers({
  mvp,
  resultadoFoto,
  rival,
}: {
  mvp: { nombre: string; posicion: string | null; num: number | null; foto: string | null } | null;
  resultadoFoto: string | null;
  rival?: string | null;
}) {
  const slides: { key: string; node: React.ReactNode }[] = [];
  if (mvp?.nombre) {
    slides.push({ key: "mvp", node: <MvpCard nombre={mvp.nombre} posicion={mvp.posicion} num={mvp.num} foto={mvp.foto} /> });
  }
  if (resultadoFoto) {
    slides.push({ key: "res", node: <FlyerImageCard src={resultadoFoto} alt={rival ? `Resultado vs ${rival}` : "Resultado del partido"} /> });
  }

  const trackRef = useRef<HTMLDivElement>(null);
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [active, setActive] = useState(0);

  // Sincroniza el dot activo con el scroll YA FRENADO (debounce). Si lo hiciéramos a
  // mitad del scroll programático de un dot, leería una posición intermedia y pelearía
  // con la animación. Sólo aplica en mobile (en desktop es grid, sin scroll).
  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      const kids = Array.from(track.children) as HTMLElement[];
      if (!kids.length) return;
      const nearest = kids.reduce(
        (best, c, i) =>
          Math.abs(c.offsetLeft - track.scrollLeft) < Math.abs(kids[best].offsetLeft - track.scrollLeft) ? i : best,
        0,
      );
      setActive(nearest);
    }, 120);
  }

  function goTo(i: number) {
    const track = trackRef.current;
    const child = track?.children[i] as HTMLElement | undefined;
    if (track && child) track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    setActive(i);
  }

  if (slides.length === 0) return null;
  const many = slides.length > 1;
  const cols = many ? "sm:grid-cols-2" : "sm:grid-cols-1";

  return (
    <section aria-label="MVP y resultado del partido">
      <div
        ref={trackRef}
        onScroll={many ? onScroll : undefined}
        className={`no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory sm:grid ${cols} sm:overflow-visible`}
      >
        {slides.map((s) => (
          <div key={s.key} className="snap-center shrink-0 w-full sm:w-auto">
            {s.node}
          </div>
        ))}
      </div>

      {/* dots: sólo mobile (en desktop ya están lado a lado) y sólo si hay 2 */}
      {many && (
        <div className="flex justify-center gap-2 mt-4 sm:hidden">
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver flyer ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-azul-bright" : "w-2 bg-acero/40"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
