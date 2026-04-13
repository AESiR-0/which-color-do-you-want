"use client";
import { usePaletteStore } from "@/store/palette";

export default function DashboardPreview() {
  const { palette } = usePaletteStore();
  const get = (role: string) => palette.find((c) => c.role === role)?.hex ?? "#fff";
  const bg = get("background"), surface = get("surface"), primary = get("primary");
  const secondary = get("secondary"), accent = get("accent"), text = get("text");
  const bars = [40, 65, 55, 80, 70, 90, 60];

  return (
    <div className="flex transition-all duration-300" style={{ backgroundColor: bg, minHeight: 340 }}>
      <div className="w-44 p-4 flex flex-col gap-1 border-r" style={{ backgroundColor: surface, borderColor: text + "11" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: primary }} />
          <span className="font-bold text-xs" style={{ color: text }}>Dashboard</span>
        </div>
        {["Overview", "Analytics", "Reports", "Settings"].map((item, i) => (
          <div key={item} className="px-3 py-2 rounded-lg text-xs cursor-pointer"
            style={{ backgroundColor: i === 0 ? primary + "22" : "transparent", color: i === 0 ? primary : text, opacity: i === 0 ? 1 : 0.5 }}>
            {item}
          </div>
        ))}
      </div>
      <div className="flex-1 p-4">
        <p className="text-sm font-bold mb-4" style={{ color: text }}>Weekly Overview</p>
        <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: surface }}>
          <div className="flex items-end gap-2 h-20">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md transition-all duration-500"
                style={{ height: `${h}%`, backgroundColor: i === 5 ? primary : secondary + "66" }} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[{ label: "Visitors", value: "14.2k", color: primary }, { label: "Revenue", value: "$9.4k", color: accent }, { label: "Conv.", value: "3.8%", color: secondary }].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl p-3" style={{ backgroundColor: surface }}>
              <div className="w-6 h-1 rounded mb-2" style={{ backgroundColor: color }} />
              <p className="font-bold text-sm" style={{ color: text }}>{value}</p>
              <p className="text-xs" style={{ color: text, opacity: 0.4 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
