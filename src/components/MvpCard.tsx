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
  // Altura uniforme de TODAS las cards (con o sin flyer). Única fuente de verdad:
  // ajustá este valor para subir/bajar el alto de todas a la vez (podés usar
  // responsive, ej: "h-[36rem] sm:h-[40rem]"). El carrusel es flex y estiraría cada
  // card a la más alta; al fijar el alto acá, todas miden igual y no queda hueco
  // abajo de las más bajas.
  const cardH = "h-[40rem]";

  // Si hay flyer (imagen ya diseñada por el club), se muestra entero, sin recortar
  // ni superponer texto: el flyer ya trae nombre/posición/rival horneados.
  if (foto) {
    return (
      <section className={`flyer-navy grid place-items-center overflow-hidden rounded-2xl border border-azul-bright/25 p-3 sm:p-4 ${cardH}`}>
        {/* <img> normal (no next/image) a propósito: la URL la pega el usuario a mano
            (bucket, ruta local, lo que sea). Así cualquier host funciona sin tocar
            next.config y una URL inválida nunca tumba la home.

            Mobile: el flyer llena el ALTO de la card (h-full) → se ve grande y prolijo.
            Desktop (sm+): la card es ancha; forzar el alto agrandaba el flyer enorme y
            lo cortaba (el max-h en % no frena por un quirk de CSS grid). Acá lo limito
            con valores CONCRETOS (max-w-sm = mismo ancho que en mobile, max-h-[36rem])
            → se ve ENTERO, del mismo tamaño chico que mobile, centrado. object-contain
            nunca recorta; overflow-hidden de la section evita cualquier desborde. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={foto} alt={`MVP ${nombre}`} loading="lazy" className="h-full w-auto max-w-full rounded-xl object-contain sm:h-auto sm:max-h-[36rem] sm:max-w-sm" />
      </section>
    );
  }

  return (
    <section className={`flyer-navy relative overflow-hidden rounded-2xl border border-azul-bright/25 ${cardH}`}>
      {/* trazo de pincel diagonal de fondo */}
      <span aria-hidden className="pointer-events-none absolute -right-10 top-0 h-full w-1/2 rotate-6 bg-gradient-to-b from-azul-bright/15 to-transparent blur-2xl" />

      <div className="relative grid h-full gap-0 sm:grid-cols-[1.1fr_1fr]">
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
