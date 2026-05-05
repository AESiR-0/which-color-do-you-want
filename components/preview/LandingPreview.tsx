"use client";

import { usePaletteStore } from "@/store/palette";

export default function LandingPreview() {
  const { palette, identity } = usePaletteStore();
  const get = (role: string) => palette.find((c) => c.role === role)?.hex ?? "#fff";

  const bg = get("background");
  const primary = get("primary");
  const secondary = get("secondary");
  const accent = get("accent");
  const text = get("text");
  const surface = get("surface");

  const fontUrl = `https://fonts.googleapis.com/css2?family=${identity.typography.heading.replace(/ /g, "+")}&family=${identity.typography.body.replace(/ /g, "+")}:wght@400;700&display=swap`;

  return (
    <div 
      className="relative transition-all duration-500 overflow-hidden" 
      style={{ 
        backgroundColor: bg, 
        minHeight: 480,
        fontFamily: identity.typography.body,
        borderRadius: identity.borderRadius
      }}
    >
      <style>{`
        @import url('${fontUrl}');
        .preview-heading { font-family: '${identity.typography.heading}', sans-serif; }
        .preview-body { font-family: '${identity.typography.body}', sans-serif; }
      `}</style>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-lg font-black preview-heading" style={{ color: text }}>
          {identity.label.split(" ")[0]}<span style={{ color: primary }}>.</span>
        </div>
        <div className="flex gap-6 text-xs font-bold uppercase tracking-widest preview-body" style={{ color: text + "88" }}>
          <span>Product</span>
          <span>Story</span>
          <span>Pricing</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="px-10 py-16 text-center max-w-2xl mx-auto">
        <span
          className="text-[10px] font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-[0.2em] preview-body"
          style={{ 
            backgroundColor: primary + "15", 
            color: primary,
            border: `1px solid ${primary}33`
          }}
        >
          {identity.vibe.replace(/-/g, " ")}
        </span>
        
        <h1 
          className="text-5xl md:text-6xl font-black mb-6 leading-[0.95] tracking-tight preview-heading" 
          style={{ color: text }}
        >
          The shift <br /> 
          <span style={{ color: primary }}>you need.</span>
        </h1>
        
        <p className="text-lg mb-10 opacity-70 leading-relaxed preview-body" style={{ color: text }}>
          Generate production-ready design systems in seconds. 
          Stop showing hex codes. Start showing <span className="font-bold">taste.</span>
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            className="px-8 py-4 text-sm font-black transition-all active:scale-95 preview-body" 
            style={{ 
              backgroundColor: primary, 
              color: bg,
              borderRadius: identity.borderRadius,
              boxShadow: identity.shadow,
              border: `${identity.borderWidth} solid ${text}`
            }}
          >
            Get Started
          </button>
          <button
            className="px-8 py-4 text-sm font-bold border transition-all hover:bg-white/5 preview-body"
            style={{ 
              borderColor: text + "22", 
              color: text,
              borderRadius: identity.borderRadius
            }}
          >
            See Showcase
          </button>
        </div>
      </div>

      {/* Insight Overlay */}
      <div className="absolute bottom-6 right-6 max-w-[240px] p-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Micro-Insight</span>
        </div>
        <p className="text-[11px] leading-relaxed text-white/80 italic preview-body">
          "{identity.insight}"
        </p>
      </div>

      {/* Background Decorative Elements */}
      <div 
        className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ backgroundColor: primary }}
      />
      <div 
        className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}
