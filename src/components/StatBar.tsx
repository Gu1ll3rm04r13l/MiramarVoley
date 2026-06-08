export default function StatBar({ label, value }: { label: string; value: number | null }) {
  const pct = value == null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-sm text-acero">{label}</span>
      <div className="flex-1 h-3 rounded bg-navy overflow-hidden">
        <div className="h-full bg-azul-bright" style={{ width: `${pct}%` }} aria-hidden />
      </div>
      <span className="w-10 text-right text-sm tabular-nums">{value == null ? "—" : value}</span>
    </div>
  );
}
