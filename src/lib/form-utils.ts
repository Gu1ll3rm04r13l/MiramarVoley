// '' or '-' -> null; otherwise a finite number (or null if NaN).
export function toNum(s: string): number | null {
  const t = s.trim();
  if (t === "" || t === "-") return null;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
export function numStr(v: number | null): string {
  return v == null ? "" : String(v);
}
