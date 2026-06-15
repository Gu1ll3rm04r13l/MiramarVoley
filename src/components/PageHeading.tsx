import Reveal from "@/components/Reveal";

export default function PageHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Reveal className="mb-8">
      <div className="flex items-center gap-3">
        <span className="h-5 w-1 rounded-full bg-azul-bright" aria-hidden />
        <p className="kicker">{kicker}</p>
      </div>
      <h1 className="display-xl text-hueso text-4xl sm:text-6xl mt-3">{title}</h1>
      <div className="mt-4 h-px w-full bg-acero/15" />
    </Reveal>
  );
}
