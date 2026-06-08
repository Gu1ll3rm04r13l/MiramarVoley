export default function Footer() {
  return (
    <footer className="border-t border-acero/20 bg-navy/60 mt-10">
      <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-acero flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Miramar Club de Voley</span>
        <a href="https://instagram.com/voleyclubmiramar" target="_blank" rel="noopener noreferrer"
           className="text-azul-bright hover:text-hueso transition-colors">@voleyclubmiramar</a>
      </div>
    </footer>
  );
}
