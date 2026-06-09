/** Ease-out cubic. Recibe progreso 0..1, devuelve 0..1. */
export function easeOutCubic(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - c, 3);
}

/** Interpola de `from` a `to` segun progreso 0..1, redondeado a entero. */
export function lerpValue(from: number, to: number, progress: number): number {
  return Math.round(from + (to - from) * easeOutCubic(progress));
}
