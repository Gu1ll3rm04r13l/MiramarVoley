import type { ReportDraft, ReportPlayerDraft } from "@/lib/types";
import { emptyDraft } from "@/lib/report-draft";

const MONTHS: Record<string, string> = {
  enero: "01", febrero: "02", marzo: "03", abril: "04", mayo: "05", junio: "06",
  julio: "07", agosto: "08", septiembre: "09", setiembre: "09", octubre: "10", noviembre: "11", diciembre: "12",
};

export function parseSpanishDate(s: string): string | null {
  const m = s.toLowerCase().match(/(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})/i);
  if (!m) return null;
  const day = m[1].padStart(2, "0");
  const month = MONTHS[m[2]];
  if (!month) return null;
  return `${m[3]}-${month}-${day}`;
}

// Value that follows a label, on the same line ("Label: value" / "Label value")
// or on the next non-empty line.
function valueAfter(lines: string[], label: string): string | null {
  // Escape regex special chars in label so literal parens etc. match literally.
  const esc = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^${esc}[:\\s]*`, "i");
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i].trim())) {
      const inline = lines[i].trim().replace(re, "").trim();
      if (inline) return inline;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim()) return lines[j].trim();
      }
    }
  }
  return null;
}

function num(s: string | null): number | null {
  if (s == null) return null;
  const m = s.match(/-?\d+(?:[.,]\d+)?/);
  if (!m) return null;
  const n = Number(m[0].replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function cell(tok: string): number | null {
  if (tok === "-" || tok === "") return null;
  const n = Number(tok);
  return Number.isFinite(n) ? n : null;
}

// Allow rows whose last stat token is a dash (null rating).
const PLAYER_RE = /^\d+\s+\D.*\s[-+]?[\d-]+\s*$/;

function parsePlayerRow(line: string): ReportPlayerDraft | null {
  const toks = line.trim().split(/\s+/);
  if (toks.length < 11) return null;
  const num0 = parseInt(toks[0], 10);
  if (!Number.isFinite(num0)) return null;
  const stats = toks.slice(-9);
  const nombre = toks.slice(1, toks.length - 9).join(" ");
  if (!nombre) return null;
  const [saq, rec, ata, bloq, def, cata, err, mm, rating] = stats.map(cell);
  return { num: num0, nombre, saq, rec, ata, bloq, def, cata, err, mas_menos: mm, rating };
}

function parseDestacado(lines: string[], label: string): { num: number | null; nombre: string; value: number | null } | null {
  const line = lines.find((l) => l.trim().toUpperCase().startsWith(label));
  if (!line) return null;
  const m = line.match(/#(\d+)\s+(.+?)\s+(?:Rating|Saque)\s*:\s*(\d+)/i);
  if (!m) return null;
  return { num: parseInt(m[1], 10), nombre: m[2].trim(), value: parseInt(m[3], 10) };
}

export function parseSetpoint(lines: string[]): ReportDraft {
  const draft = emptyDraft();
  const L = lines.map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => l.length > 0);

  // Sets
  const sets = valueAfter(L, "Resultado (Sets)");
  if (sets) {
    const m = sets.match(/(\d+)\s*-\s*(\d+)/);
    if (m) { draft.sets_local = Number(m[1]); draft.sets_visitante = Number(m[2]); }
  }

  draft.duracion_min = num(valueAfter(L, "Duración"));
  draft.categoria = valueAfter(L, "Categoría");
  draft.torneo = valueAfter(L, "Torneo");
  draft.fecha = parseSpanishDate(valueAfter(L, "Fecha") ?? "");
  draft.efectividad = num(valueAfter(L, "Efectividad"));

  // Teams: split by the two team anchors.
  const localIdx = L.findIndex((l) => /^Equipo Local/i.test(l));
  const visIdx = L.findIndex((l) => /^Equipo Visitante/i.test(l));
  const slice = (from: number, to: number) => (from < 0 ? [] : L.slice(from, to < 0 ? undefined : to));
  const localBlock = slice(localIdx, visIdx);
  const visBlock = slice(visIdx, -1);
  const teamName = (block: string[], idxLabel: RegExp) => {
    const i = block.findIndex((l) => idxLabel.test(l));
    return i >= 0 && block[i + 1] ? block[i + 1] : null;
  };
  const localName = teamName(localBlock, /^Equipo Local/i);
  const visName = teamName(visBlock, /^Equipo Visitante/i);
  draft.equipo_local = localName;
  draft.equipo_visitante = visName;
  const localPts = num(valueAfter(localBlock, "Puntos totales"));
  const localErr = num(valueAfter(localBlock, "Errores"));
  const visPts = num(valueAfter(visBlock, "Puntos totales"));
  const visErr = num(valueAfter(visBlock, "Errores"));

  // Own = the Miramar side.
  const localIsOwn = (localName ?? "").toUpperCase().includes("MIRAMAR");
  draft.equipo_puntos = localIsOwn ? localPts : visPts;
  draft.equipo_errores = localIsOwn ? localErr : visErr;
  draft.rival_nombre = localIsOwn ? visName : localName;
  draft.rival_puntos = localIsOwn ? visPts : localPts;
  draft.rival_errores = localIsOwn ? visErr : localErr;

  // Fundamentos
  draft.fundamentos = {
    ataque: num(valueAfter(L, "Ataque")),
    recepcion: num(valueAfter(L, "Recepción")),
    saque: num(valueAfter(L, "Saque")),
    bloqueo: num(valueAfter(L, "Bloqueo")),
    defensa: num(valueAfter(L, "Defensa")),
    contraataque: num(valueAfter(L, "Contraataque")),
  };

  // Destacados
  const mejor = parseDestacado(L, "MEJOR RENDIMIENTO");
  const menor = parseDestacado(L, "MENOR RENDIMIENTO");
  const sacador = parseDestacado(L, "MEJOR SACADOR");
  draft.destacados = {
    mejorRendimiento: mejor ? { jugador: mejor.nombre, num: mejor.num, rating: mejor.value } : null,
    menorRendimiento: menor ? { jugador: menor.nombre, num: menor.num, rating: menor.value } : null,
    mejorSacador: sacador ? { jugador: sacador.nombre, num: sacador.num, saque: sacador.value } : null,
  };

  // Players: rows after the "Rendimiento por Jugador" header.
  const headerIdx = L.findIndex((l) => /Rendimiento por Jugador/i.test(l));
  if (headerIdx >= 0) {
    for (let i = headerIdx + 1; i < L.length; i++) {
      const line = L[i];
      if (/^#?\s*Jugador/i.test(line)) continue; // column header
      if (!PLAYER_RE.test(line)) {
        if (draft.jugadores.length) break; // stop once the block ends
        continue;
      }
      const row = parsePlayerRow(line);
      if (row) draft.jugadores.push(row);
    }
  }

  return draft;
}
