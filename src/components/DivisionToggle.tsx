"use client";

export default function DivisionToggle({
  value, onChange,
}: { value: "ascenso" | "top8"; onChange: (v: "ascenso" | "top8") => void }) {
  const opt = (v: "ascenso" | "top8", label: string) => (
    <button
      type="button"
      onClick={() => onChange(v)}
      aria-pressed={value === v}
      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
        value === v ? "bg-azul text-hueso shadow-sm" : "text-acero hover:text-hueso"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex gap-1 p-1 rounded-lg bg-panel border border-acero/10" role="group" aria-label="División">
      {opt("ascenso", "Ascenso")}
      {opt("top8", "Top 8")}
    </div>
  );
}
