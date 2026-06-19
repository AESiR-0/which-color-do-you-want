"use client";
import { usePaletteStore } from "@/store/palette";

export default function DarkUIPreview() {
  const { palette, identity } = usePaletteStore();
  const get = (role: string) => palette.find((c) => c.role === role)?.hex ?? "#000";
  const primary = get("primary"), secondary = get("secondary"), accent = get("accent");
  const bg = get("text"); // Inverted for dark mode
  const text = get("background"); // Inverted for dark mode
  const surface = "rgba(255, 255, 255, 0.05)"; // Semi-transparent overlay for surface card

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

      <div className="flex items-center justify-between mb-6 preview-body">
        <div 
          className="w-8 h-8 transition-all duration-300" 
          style={{ 
            backgroundColor: primary,
            borderRadius: identity.borderRadius,
            border: `${identity.borderWidth} solid ${text}`
          }} 
        />
        <div className="flex gap-2">
          {["⊞", "⊟", "≡"].map((icon, i) => (
            <button 
              key={i} 
              className="w-8 h-8 bg-white/5 text-white/30 text-xs flex items-center justify-center transition-all duration-300"
              style={{ borderRadius: identity.borderRadius === "0px" ? "0px" : "8px" }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div 
          className="p-4 transition-all duration-300" 
          style={{ 
            background: `linear-gradient(135deg, ${primary}, ${secondary})`,
            borderRadius: identity.borderRadius,
            border: `${identity.borderWidth} solid ${text}`,
            boxShadow: identity.shadow
          }}
        >
          <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider mb-1 preview-body">Total balance</p>
          <p className="text-white font-black text-2xl preview-heading">$48,291</p>
          <div className="mt-3 h-1 rounded-full bg-white/20">
            <div className="h-1 rounded-full bg-white/70" style={{ width: "68%" }} />
          </div>
        </div>
        <div 
          className="p-4 border transition-all duration-300" 
          style={{ 
            backgroundColor: surface, 
            borderColor: "rgba(255,255,255,0.08)",
            borderRadius: identity.borderRadius,
            boxShadow: identity.shadow
          }}
        >
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider mb-1 preview-body">Portfolio</p>
          <div className="flex flex-col gap-2 mt-2 preview-body">
            {[["BTC", "61%", accent], ["ETH", "24%", secondary], ["SOL", "15%", primary]].map(([name, pct, color]) => (
              <div key={name as string} className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 transition-all duration-300" 
                  style={{ 
                    backgroundColor: color as string,
                    borderRadius: identity.borderRadius === "0px" ? "0px" : "50%"
                  }} 
                />
                <span className="text-white/60 text-xs flex-1">{name}</span>
                <span className="text-white/80 text-xs font-mono">{pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4 preview-body">
        <button 
          className="flex-1 py-2 text-xs font-bold transition-all duration-300 active:scale-95" 
          style={{ 
            backgroundColor: primary, 
            color: bg,
            borderRadius: identity.borderRadius,
            border: `${identity.borderWidth} solid ${text}`,
            boxShadow: identity.shadow
          }}
        >
          Send
        </button>
        <button 
          className="flex-1 py-2 text-xs font-bold bg-white/5 text-white/60 border transition-all duration-300 active:scale-95"
          style={{ 
            borderColor: "rgba(255,255,255,0.08)",
            borderRadius: identity.borderRadius
          }}
        >
          Receive
        </button>
      </div>
    </div>
  );
}
