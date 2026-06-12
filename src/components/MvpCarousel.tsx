"use client";

import { useEffect, useRef, useState } from "react";
import MvpCard from "@/components/MvpCard";

export type MvpSlide = {
  id: string;
  nombre: string;
  posicion: string | null;
  num: number | null;
  foto: string | null;
  rival: string;
  fecha: string | null;
};

function fechaCorta(iso: string | null): string {
  if (!iso) return "";
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

/** Carrusel mobile-first de MVPs: swipe (scroll-snap) + flechas desktop + dots + auto-avance. */
export default function MvpCarousel({ slides }: { slides: MvpSlide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // auto-avance cada 5s (off si hay 1 solo slide o prefers-reduced-motion)
  useEffect(() => {
    if (slides.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  // scrollea al slide activo
  useEffect(() => {
    const track = trackRef.current;
    const child = track?.children[active] as HTMLElement | undefined;
    if (track && child) track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }, [active]);

  function go(dir: number) {
    setActive((i) => (i + dir + slides.length) % slides.length);
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  }

  return (
    <section aria-label="MVPs de la temporada">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="kicker">Reconocimientos</p>
          <h2 className="display-xl text-glow-azul text-3xl sm:text-4xl">MVPs de la temporada</h2>
        </div>
        {slides.length > 1 && (
          <div className="hidden sm:flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="MVP anterior" className="btn-ghost h-10 w-10 grid place-items-center rounded-full">‹</button>
            <button type="button" onClick={() => go(1)} aria-label="MVP siguiente" className="btn-ghost h-10 w-10 grid place-items-center rounded-full">›</button>
          </div>
        )}
      </div>

      <div ref={trackRef} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto gap-4">
        {slides.map((s) => (
          <div key={s.id} className="snap-center shrink-0 w-full">
            <p className="kicker !text-azul-bright/90 mb-2">vs {s.rival}{s.fecha ? ` · ${fechaCorta(s.fecha)}` : ""}</p>
            <MvpCard nombre={s.nombre} posicion={s.posicion} num={s.num} foto={s.foto} />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((s, i) => (
            <button key={s.id} type="button" onClick={() => setActive(i)} aria-label={`Ir al MVP ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-azul-bright" : "w-2 bg-acero/40"}`} />
          ))}
        </div>
      )}
    </section>
  );
}
