"use client";
import { usePaletteStore } from "@/store/palette";

export default function DashboardPreview() {
  const { palette, identity } = usePaletteStore();
  const get = (role: string) => palette.find((c) => c.role === role)?.hex ?? "#fff";
  const bg = get("background"), surface = get("surface"), primary = get("primary");
  const secondary = get("secondary"), accent = get("accent"), text = get("text");
  const bars = [40, 65, 55, 80, 70, 90, 60];

  const fontUrl = `https://fonts.googleapis.com/css2?family=${identity.typography.heading.replace(/ /g, "+")}&family=${identity.typography.body.replace(/ /g, "+")}:wght@400;700&display=swap`;

  return (
    <div 
      className="flex transition-all duration-300 relative overflow-hidden" 
      style={{ 
        backgroundColor: bg, 
        minHeight: 340,
        fontFamily: identity.typography.body,
      }}
    >
      <style>{`
        @import url('${fontUrl}');
        .preview-heading { font-family: '${identity.typography.heading}', sans-serif; }
        .preview-body { font-family: '${identity.typography.body}', sans-serif; }
      `}</style>

      {/* Sidebar */}
      <div 
        className="w-40 p-4 flex flex-col gap-1 border-r transition-all duration-300 preview-body" 
        style={{ 
          backgroundColor: surface, 
          borderColor: text + "11",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div 
            className="w-5 h-5 transition-all duration-300" 
            style={{ 
              backgroundColor: primary,
              borderRadius: identity.borderRadius === "0px" ? "0px" : "4px",
              border: `${identity.borderWidth} solid ${text}`
            }} 
          />
          <span className="font-black text-xs preview-heading" style={{ color: text }}>Dashboard</span>
        </div>
        {["Overview", "Analytics", "Reports", "Settings"].map((item, i) => (
          <div 
            key={item} 
            className="px-2.5 py-1.5 text-[10px] font-bold cursor-pointer transition-all duration-300"
            style={{ 
              backgroundColor: i === 0 ? primary + "15" : "transparent", 
              color: i === 0 ? primary : text, 
              opacity: i === 0 ? 1 : 0.5,
              borderRadius: identity.borderRadius === "0px" ? "0px" : "6px",
              border: i === 0 ? `${identity.borderWidth} solid ${primary}33` : "none"
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider mb-3 preview-heading" style={{ color: text }}>Weekly Overview</p>
          <div 
            className="p-3 mb-3 transition-all duration-300" 
            style={{ 
              backgroundColor: surface,
              borderRadius: identity.borderRadius,
              border: `${identity.borderWidth} solid ${text}11`,
              boxShadow: identity.shadow
            }}
          >
            <div className="flex items-end gap-2 h-16">
              {bars.map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 transition-all duration-500"
                  style={{ 
                    height: `${h}%`, 
                    backgroundColor: i === 5 ? primary : secondary + "55",
                    borderRadius: identity.borderRadius === "0px" ? "0px" : "4px 4px 0 0",
                    border: `${identity.borderWidth} solid ${text}08`
                  }} 
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 preview-body">
          {[{ label: "Visitors", value: "14.2k", color: primary }, { label: "Revenue", value: "$9.4k", color: accent }, { label: "Conv.", value: "3.8%", color: secondary }].map(({ label, value, color }) => (
            <div 
              key={label} 
              className="p-3 transition-all duration-300" 
              style={{ 
                backgroundColor: surface,
                borderRadius: identity.borderRadius,
                border: `${identity.borderWidth} solid ${text}11`,
                boxShadow: identity.shadow
              }}
            >
              <div 
                className="w-5 h-1.5 mb-1.5 transition-all duration-300" 
                style={{ 
                  backgroundColor: color,
                  borderRadius: identity.borderRadius === "0px" ? "0px" : "1px"
                }} 
              />
              <p className="font-black text-sm preview-heading leading-tight" style={{ color: text }}>{value}</p>
              <p className="text-[9px] uppercase tracking-wider font-bold" style={{ color: text, opacity: 0.4 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
