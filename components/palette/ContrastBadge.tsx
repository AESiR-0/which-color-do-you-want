"use client";
import { usePaletteStore } from "@/store/palette";
import { contrastRatio, wcagLevel } from "@/lib/contrast";

export default function ContrastBadge() {
  const { palette } = usePaletteStore();
  const primary = palette.find((c) => c.role === "primary");
  const bg = palette.find((c) => c.role === "background");
  const text = palette.find((c) => c.role === "text");
  if (!primary || !bg || !text) return null;

  const pairs = [
    { label: "Text / BG", ratio: contrastRatio(text.hsl, bg.hsl) },
    { label: "Primary / BG", ratio: contrastRatio(primary.hsl, bg.hsl) },
    { label: "Primary / Text", ratio: contrastRatio(primary.hsl, text.hsl) },
  ];
  const levelColor: Record<string, string> = { AAA: "text-emerald-400", AA: "text-green-400", "AA Large": "text-yellow-400", Fail: "text-red-400" };

  return (
    <div className="flex flex-wrap gap-3">
      {pairs.map(({ label, ratio }) => {
        const level = wcagLevel(ratio);
        return (
          <div key={label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm">
            <span className="text-white/40 text-xs">{label}</span>
            <span className="font-mono text-white/70">{ratio.toFixed(1)}:1</span>
            <span className={`text-xs font-semibold ${levelColor[level]}`}>{level}</span>
          </div>
        );
      })}
    </div>
  );
}
