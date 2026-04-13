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
    <div className="flex flex-wrap gap-2">
      {MODES.map(({ value, label, description }) => (
        <button
          key={value}
          onClick={() => setHarmonyMode(value)}
          title={description}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
            harmonyMode === value
              ? "bg-white text-black shadow-sm scale-105"
              : "bg-white/8 text-white/50 hover:bg-white/15 hover:text-white/80 border border-white/10"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
