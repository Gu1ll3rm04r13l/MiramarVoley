"use client";

import { useRef, useState } from "react";
import { parseSetpoint } from "@/lib/setpoint";
import type { ReportDraft } from "@/lib/types";

// Reconstruct text lines from a PDF page's positioned text items.
function itemsToLines(items: { str: string; transform: number[] }[]): string[] {
  const byLine = new Map<number, { x: number; str: string }[]>();
  for (const it of items) {
    if (!it.str.trim()) continue;
    const y = Math.round(it.transform[5]);
    if (!byLine.has(y)) byLine.set(y, []);
    byLine.get(y)!.push({ x: it.transform[4], str: it.str });
  }
  return [...byLine.keys()]
    .sort((a, b) => b - a) // PDF y grows upward → top first
    .map((y) => byLine.get(y)!.sort((a, b) => a.x - b.x).map((p) => p.str).join(" ").replace(/\s+/g, " ").trim());
}

export default function PdfImportButton({ onParsed }: { onParsed: (draft: ReportDraft) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr(null);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const buf = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: buf }).promise;
      const lines: string[] = [];
      for (let p = 1; p <= doc.numPages; p++) {
        const page = await doc.getPage(p);
        const content = await page.getTextContent();
        lines.push(...itemsToLines(content.items as { str: string; transform: number[] }[]));
      }
      onParsed(parseSetpoint(lines));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "No se pudo leer el PDF");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input ref={ref} type="file" accept="application/pdf" onChange={onFile} className="hidden" id="pdf-file" />
      <button type="button" onClick={() => ref.current?.click()} disabled={busy}
        className="rounded bg-navy border border-acero/30 px-4 py-2 text-sm hover:border-azul disabled:opacity-60">
        {busy ? "Leyendo PDF…" : "Importar desde PDF"}
      </button>
      {err && <span className="text-sm text-red-400">{err}</span>}
    </div>
  );
}
