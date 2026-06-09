export const revalidate = 300;

export default function GaleriaPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold mb-5">Galería</h1>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-lg bg-navy/50 grid place-items-center text-acero text-sm">Foto {i + 1}</div>
        ))}
      </div>
    </>
  );
}
