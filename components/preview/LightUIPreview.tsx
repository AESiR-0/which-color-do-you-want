"use client";
import { usePaletteStore } from "@/store/palette";

export default function LightUIPreview() {
  const { palette, identity } = usePaletteStore();
  const get = (role: string) => palette.find((c) => c.role === role)?.hex ?? "#fff";
  const bg = get("background"), surface = get("surface"), primary = get("primary");
  const secondary = get("secondary"), accent = get("accent"), text = get("text");

  const fontUrl = `https://fonts.googleapis.com/css2?family=${identity.typography.heading.replace(/ /g, "+")}&family=${identity.typography.body.replace(/ /g, "+")}:wght@400;700&display=swap`;

  return (
    <div 
      className="p-6 transition-all duration-300 relative overflow-hidden" 
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

      <div className="flex items-center justify-between mb-8 px-2 preview-body">
        <div className="flex items-center gap-2">
          <div 
            className="w-7 h-7 transition-all duration-300" 
            style={{ 
              backgroundColor: primary, 
              borderRadius: identity.borderRadius,
              border: `${identity.borderWidth} solid ${text}`
            }} 
          />
          <span className="font-black text-sm preview-heading animate-in fade-in" style={{ color: text }}>Acme</span>
        </div>
        <div className="flex items-center gap-4">
          {["Home", "Docs", "Pricing"].map((l) => (
            <span key={l} className="text-xs font-bold" style={{ color: text, opacity: 0.6 }}>{l}</span>
          ))}
          <button 
            className="text-xs px-3 py-1.5 font-bold transition-all duration-300 active:scale-95" 
            style={{ 
              backgroundColor: primary, 
              color: bg,
              borderRadius: identity.borderRadius,
              border: `${identity.borderWidth} solid ${text}`,
              boxShadow: identity.shadow
            }}
          >
            Sign in
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{ title: "Revenue", value: "$12,400", sub: "+8.2%" }, { title: "Users", value: "4,291", sub: "+3.1%" }, { title: "Uptime", value: "99.9%", sub: "Last 30d" }].map((card, i) => (
          <div 
            key={i} 
            className="p-4 transition-all duration-300" 
            style={{ 
              backgroundColor: surface,
              borderRadius: identity.borderRadius,
              border: `${identity.borderWidth} solid ${text}15`,
              boxShadow: identity.shadow
            }}
          >
            <p className="text-[10px] uppercase font-bold tracking-wider mb-1 preview-body" style={{ color: text, opacity: 0.5 }}>{card.title}</p>
            <p className="font-black text-lg preview-heading" style={{ color: text }}>{card.value}</p>
            <span 
              className="text-[9px] font-bold px-1.5 py-0.5 inline-block mt-1 preview-body" 
              style={{ 
                backgroundColor: accent + "18", 
                color: accent,
                borderRadius: identity.borderRadius === "0px" ? "0px" : "4px"
              }}
            >
              {card.sub}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-6 preview-body">
        <button 
          className="px-4 py-2 text-xs font-bold transition-all duration-300 active:scale-95" 
          style={{ 
            backgroundColor: primary, 
            color: bg,
            borderRadius: identity.borderRadius,
            border: `${identity.borderWidth} solid ${text}`,
            boxShadow: identity.shadow
          }}
        >
          Primary
        </button>
        <button 
          className="px-4 py-2 text-xs font-bold transition-all duration-300 active:scale-95" 
          style={{ 
            backgroundColor: secondary, 
            color: text,
            borderRadius: identity.borderRadius,
            border: `${identity.borderWidth} solid ${text}33`,
            boxShadow: identity.shadow
          }}
        >
          Secondary
        </button>
        <button 
          className="px-4 py-2 text-xs font-bold transition-all duration-300 active:scale-95 bg-transparent" 
          style={{ 
            borderColor: primary, 
            color: primary, 
            borderRadius: identity.borderRadius,
            border: `1.5px solid ${primary}`
          }}
        >
          Outline
        </button>
      </div>
    </div>
  );
}
