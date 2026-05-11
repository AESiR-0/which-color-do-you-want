"use client";
import { usePaletteStore } from "@/store/palette";
import { contrastRatio, wcagLevel } from "@/lib/contrast";

const LEVEL_STYLE: Record<string, { text: string; bg: string; bar: string }> = {
  AAA:       { text: "text-emerald-400", bg: "bg-emerald-500/10", bar: "bg-emerald-500" },
  AA:        { text: "text-green-400",   bg: "bg-green-500/10",   bar: "bg-green-500"   },
  "AA Large":{ text: "text-amber-400",   bg: "bg-amber-500/10",   bar: "bg-amber-500"   },
  Fail:      { text: "text-red-400",     bg: "bg-red-500/10",     bar: "bg-red-500"     },
};

export default function ContrastBadge() {
  const { palette } = usePaletteStore();
  const primary = palette.find((c) => c.role === "primary");
  const bg      = palette.find((c) => c.role === "background");
  const text    = palette.find((c) => c.role === "text");
  const surface = palette.find((c) => c.role === "surface");
  if (!primary || !bg || !text) return null;

  const pairs = [
    { label: "Text/BG",      ratio: contrastRatio(text.hsl, bg.hsl) },
    { label: "Primary/BG",   ratio: contrastRatio(primary.hsl, bg.hsl) },
    { label: "Text/Surface", ratio: surface ? contrastRatio(text.hsl, surface.hsl) : 0 },
    { label: "Primary/Text", ratio: contrastRatio(primary.hsl, text.hsl) },
  ].filter(p => p.ratio > 0);

  return (
    <div className="grid grid-cols-2 gap-2">
      {pairs.map(({ label, ratio }) => {
        const level = wcagLevel(ratio);
        const styles = LEVEL_STYLE[level];
        const pct = Math.min((ratio / 21) * 100, 100);
        return (
          <div key={label} className="rounded-lg border border-white/8 bg-white/[0.03] p-2 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[8px] text-white/30 font-black uppercase tracking-widest">{label}</span>
              <span className={`text-[8px] font-black px-1 py-0.5 rounded ${styles.bg} ${styles.text}`}>{level}</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-mono text-white font-bold text-xs leading-none">{ratio.toFixed(1)}</span>
              <span className="text-white/25 text-[9px] font-bold mb-px">:1</span>
            </div>
            <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${styles.bar}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
