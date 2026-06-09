import Reveal from "@/components/Reveal";

export default function PageHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Reveal className="mb-8">
      <p className="kicker">{kicker}</p>
      <h1 className="display-xl text-glow-azul text-4xl sm:text-6xl mt-2">{title}</h1>
      <div className="mt-4 h-px w-24 bg-gradient-to-r from-azul-bright to-transparent" />
    </Reveal>
  );
}
