import Reveal from "@/components/Reveal";

export const revalidate = 300;

export default function GaleriaPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold mb-5">Galería</h1>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Reveal key={i} delay={Math.min(i, 6) * 60}>
            <div className="group relative aspect-square overflow-hidden rounded-lg surface">
              <span className="absolute inset-0 shimmer opacity-30" aria-hidden />
              <div className="relative h-full grid place-items-center text-acero text-sm transition-transform duration-500 group-hover:scale-105">
                Foto {i + 1}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="text-xs text-acero mt-4">Galería en preparación.</p>
    </>
  );
}
