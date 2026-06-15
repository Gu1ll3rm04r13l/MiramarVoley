import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Miramar Club de Voley",
  description: "Vóley masculino · Temporada 2026 · Camino al Top 8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${archivo.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        {/* Marca js-ready antes de hidratar (habilita el sistema reveal sin flash).
            next/script beforeInteractive evita el warning de <script> crudo en el árbol React. */}
        <Script id="js-ready" strategy="beforeInteractive">
          {`document.documentElement.classList.add('js-ready')`}
        </Script>
        <Header />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
