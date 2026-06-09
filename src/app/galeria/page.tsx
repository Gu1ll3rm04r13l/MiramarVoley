import Image from "next/image";
import Reveal from "@/components/Reveal";
import PageHeading from "@/components/PageHeading";

export const revalidate = 300;

const FOTOS = [
  { src: "/assets/equipo/equipo-suda.jpeg", alt: "El equipo en la visita a Sudamérica", caption: "Visita a Sudamérica" },
  { src: "/assets/equipo/equipo-quilmes.jpeg", alt: "El equipo en Quilmes", caption: "Visita a Quilmes" },
  { src: "/assets/equipo/equipo-poli.jpeg", alt: "El equipo en el Polideportivo", caption: "Polideportivo de Miramar" },
  { src: "/assets/equipo/equipo-suda-2.jpeg", alt: "El equipo antes del partido en Sudamérica", caption: "Visita a Sudamérica" },
];

export default function GaleriaPage() {
  return (
    <>
      <PageHeading kicker="Momentos" title="Galería" />

      {/* Masonry por columnas: respeta el alto natural de cada foto (retrato/paisaje). */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {FOTOS.map((f, i) => (
          <Reveal key={f.src} delay={Math.min(i, 6) * 70} className="mb-4 block break-inside-avoid">
            <figure className="group relative overflow-hidden rounded-xl surface">
              <Image
                src={f.src}
                alt={f.alt}
                width={1080}
                height={1350}
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {/* Velo + caption que aparece al hover */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-negro/80 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 translate-y-1 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="h-1.5 w-1.5 rounded-full bg-azul-bright shadow-[0_0_8px_#0686cd]" />
                <span className="font-display text-sm font-bold tracking-wide text-hueso">{f.caption}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </>
  );
}
