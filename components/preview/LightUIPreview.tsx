"use client";
import { usePaletteStore } from "@/store/palette";

export default function LightUIPreview() {
  const { palette } = usePaletteStore();
  const get = (role: string) => palette.find((c) => c.role === role)?.hex ?? "#fff";
  const bg = get("background"), surface = get("surface"), primary = get("primary");
  const secondary = get("secondary"), accent = get("accent"), text = get("text");

  return (
    <div className="p-6 transition-all duration-300" style={{ backgroundColor: bg, minHeight: 340 }}>
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg" style={{ backgroundColor: primary }} />
          <span className="font-bold text-sm" style={{ color: text }}>Acme</span>
        </div>
        <div className="flex items-center gap-4">
          {["Home", "Docs", "Pricing"].map((l) => (
            <span key={l} className="text-xs" style={{ color: text, opacity: 0.6 }}>{l}</span>
          ))}
          <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: primary, color: "#fff" }}>Sign in</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{ title: "Revenue", value: "$12,400", sub: "+8.2%" }, { title: "Users", value: "4,291", sub: "+3.1%" }, { title: "Uptime", value: "99.9%", sub: "Last 30d" }].map((card, i) => (
          <div key={i} className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: surface }}>
            <p className="text-xs mb-1" style={{ color: text, opacity: 0.5 }}>{card.title}</p>
            <p className="font-bold text-lg" style={{ color: text }}>{card.value}</p>
            <span className="text-xs font-medium px-1.5 py-0.5 rounded-md" style={{ backgroundColor: accent + "22", color: accent }}>{card.sub}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: primary, color: "#fff" }}>Primary</button>
        <button className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: secondary, color: "#fff" }}>Secondary</button>
        <button className="px-4 py-2 rounded-lg text-xs font-semibold border" style={{ borderColor: primary, color: primary, backgroundColor: "transparent" }}>Outline</button>
      </div>
    </div>
  );
}
