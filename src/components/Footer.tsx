import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-acero/10 bg-panel">
      <div className="max-w-5xl mx-auto px-4 py-7 text-sm text-acero flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          <Image src="/escudo.png" alt="" width={20} height={20} className="rounded-full opacity-80" />
          © {new Date().getFullYear()} Miramar Club de Voley
        </span>
        <a
          href="https://instagram.com/voleyclubmiramar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-azul-bright hover:text-hueso transition-colors"
        >
          @voleyclubmiramar
        </a>
      </div>
    </footer>
  );
}
