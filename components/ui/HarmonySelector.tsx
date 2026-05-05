"use client";

import { usePaletteStore } from "@/store/palette";
import { type HarmonyMode } from "@/lib/color-engine";

const MODES: { value: HarmonyMode; label: string; description: string }[] = [
  { value: "analogous", label: "Analogous", description: "Adjacent hues" },
  { value: "complementary", label: "Complement", description: "Opposite hues" },
  { value: "triadic", label: "Triadic", description: "3 equidistant" },
  { value: "split-complementary", label: "Split Comp", description: "Split opposite" },
  { value: "tetradic", label: "Tetradic", description: "4 hues" },
  { value: "monochromatic", label: "Mono", description: "Single hue" },
];

export default function HarmonySelector() {
  const { harmonyMode, setHarmonyMode } = usePaletteStore();

  return (
    <div className="flex flex-wrap gap-1.5">
      {MODES.map(({ value, label, description }) => (
        <button
          key={value}
          onClick={() => setHarmonyMode(value)}
          title={description}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border whitespace-nowrap ${
            harmonyMode === value
              ? "bg-white text-black border-white shadow-lg scale-[1.03]"
              : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 bg-white/5"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
