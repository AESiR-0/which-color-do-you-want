"use client";
import { usePaletteStore } from "@/store/palette";

export default function DarkUIPreview() {
  const { palette } = usePaletteStore();
  const get = (role: string) => palette.find((c) => c.role === role)?.hex ?? "#000";
  const primary = get("primary"), secondary = get("secondary"), accent = get("accent");

  return (
    <div className="p-6 transition-all duration-300 bg-zinc-900" style={{ minHeight: 340 }}>
      <div className="flex items-center justify-between mb-6">
        <div className="w-8 h-8 rounded-xl" style={{ backgroundColor: primary }} />
        <div className="flex gap-2">
          {["⊞", "⊟", "≡"].map((icon, i) => (
            <button key={i} className="w-8 h-8 rounded-lg bg-white/5 text-white/30 text-xs flex items-center justify-center">{icon}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-2xl p-4" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
          <p className="text-white/70 text-xs mb-1">Total balance</p>
          <p className="text-white font-bold text-2xl">$48,291</p>
          <div className="mt-3 h-1 rounded-full bg-white/20">
            <div className="h-1 rounded-full bg-white/70" style={{ width: "68%" }} />
          </div>
        </div>
        <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
          <p className="text-white/40 text-xs mb-1">Portfolio</p>
          <div className="flex flex-col gap-2 mt-2">
            {[["BTC", "61%", accent], ["ETH", "24%", secondary], ["SOL", "15%", primary]].map(([name, pct, color]) => (
              <div key={name as string} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color as string }} />
                <span className="text-white/60 text-xs flex-1">{name}</span>
                <span className="text-white/80 text-xs font-mono">{pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: primary }}>Send</button>
        <button className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/5 text-white/60 border border-white/10">Receive</button>
      </div>
    </div>
  );
}
