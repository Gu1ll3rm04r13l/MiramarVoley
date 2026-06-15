/** Tarjeta de imagen-flyer (panel navy, imagen ENTERA sin recortar).
 *  Fuente ÚNICA del tamaño de los flyers (MVP y Resultado) para que SIEMPRE
 *  midan igual. Mobile: la imagen llena el ALTO de la card. Desktop (sm+): la card
 *  es ancha → tamaño CONCRETO (max-w-sm / max-h-[36rem]) centrado, porque el max-h
 *  en % no frena por un quirk de CSS grid. object-contain nunca recorta. */

// Alto uniforme de TODAS las cards de flyer. Ajustá acá para subir/bajar todas a la vez.
export const FLYER_CARD_H = "h-[40rem]";

export default function FlyerImageCard({ src, alt }: { src: string; alt: string }) {
  return (
    <section className={`flyer-navy grid place-items-center overflow-hidden rounded-2xl border border-azul-bright/25 p-3 sm:p-4 ${FLYER_CARD_H}`}>
      {/* <img> normal (no next/image) a propósito: la URL la pega el usuario a mano
          (bucket, ruta local, lo que sea). Así cualquier host funciona sin tocar
          next.config y una URL inválida nunca tumba la página. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="h-full w-auto max-w-full rounded-xl object-contain sm:h-auto sm:max-h-[36rem] sm:max-w-sm" />
    </section>
  );
}
