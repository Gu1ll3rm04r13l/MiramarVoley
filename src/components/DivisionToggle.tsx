"use client";

export default function DivisionToggle({
  value, onChange,
}: { value: "ascenso" | "top8"; onChange: (v: "ascenso" | "top8") => void }) {
  const opt = (v: "ascenso" | "top8", label: string) => (
    <button
      type="button"
      onClick={() => onChange(v)}
      aria-pressed={value === v}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        value === v ? "bg-azul text-hueso" : "bg-navy text-acero hover:text-hueso"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex gap-2 p-1 rounded-full bg-navy/60" role="group" aria-label="División">
      {opt("ascenso", "Ascenso")}
      {opt("top8", "Top 8")}
    </div>
  );
}
