import Image from "next/image";

/** Tarjeta "Jugador del partido" con la identidad del flyer (panel navy, escudo,
 *  título en display, nombre en itálica, posición y número con íconos). */
export default function MvpCard({
  nombre,
  posicion,
  num,
  foto,
}: {
  nombre: string;
  posicion: string | null;
  num: number | null;
  foto: string | null;
}) {
  return (
    <section className="flyer-navy relative overflow-hidden rounded-2xl border border-azul-bright/25">
      {/* trazo de pincel diagonal de fondo */}
      <span aria-hidden className="pointer-events-none absolute -right-10 top-0 h-full w-1/2 rotate-6 bg-gradient-to-b from-azul-bright/15 to-transparent blur-2xl" />

      <div className="relative grid gap-0 sm:grid-cols-[1.1fr_1fr]">
        {/* Panel de info */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Image src="/escudo.png" alt="Escudo Miramar" width={48} height={48} className="rounded-full" />
            <span className="kicker !text-azul-bright">Miramar Club de Vóley</span>
          </div>

          <h2 className="flyer-title text-3xl sm:text-4xl mt-5 text-hueso">
            Jugador <span className="text-azul-bright">del partido</span>
          </h2>
          <div className="brush mt-3 w-40" />

          <p className="flyer-name text-4xl sm:text-5xl mt-5 text-hueso">{nombre}</p>

          <dl className="mt-6 space-y-3">
            {posicion && (
              <div className="info-pill">
                <span className="info-ico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
                </span>
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-acero">Posición</dt>
                  <dd className="font-display font-bold text-hueso">{posicion}</dd>
                </div>
              </div>
            )}
            {num != null && (
              <div className="info-pill">
                <span className="info-ico font-display font-bold text-azul-bright">#</span>
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-acero">Número</dt>
                  <dd className="font-display font-bold text-hueso">#{num}</dd>
                </div>
              </div>
            )}
          </dl>
        </div>

        {/* Foto del jugador (o escudo decorativo si no hay) */}
        <div className="relative min-h-[16rem] sm:min-h-full">
          {foto ? (
            <Image src={foto} alt={nombre} fill sizes="(min-width:640px) 40vw, 100vw" className="object-cover object-top" />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <Image src="/escudo.png" alt="" width={160} height={160} className="rounded-full opacity-25" />
            </div>
          )}
          <span aria-hidden className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a1f39] to-transparent hidden sm:block" />
        </div>
      </div>
    </section>
  );
}
