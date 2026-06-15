import type { Standing } from "@/lib/types";
import { normalizeClub } from "@/lib/format";

export function parseParciales(s: string | null | undefined): { local: number; visitante: number } | null {
  if (!s) return null;
  const sets = s.split("/").map((x) => x.trim()).filter(Boolean);
  let local = 0, visitante = 0, count = 0;
  for (const set of sets) {
    const m = set.match(/^(\d+)\s*-\s*(\d+)$/);
    if (!m) continue;
    local += Number(m[1]);
    visitante += Number(m[2]);
    count++;
  }
  return count > 0 ? { local, visitante } : null;
}
