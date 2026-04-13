"use client";
import { Palette, contrastRatio, wcagPass } from "@/lib/colorEngine";

interface Props {
  palette: Palette;
}

export default function UIPreview({ palette }: Props) {
  const { primary, secondary, accent, background, text } = palette;

  const textVsBg = contrastRatio(text.hex, background.hex);
  const primaryVsBg = contrastRatio("#ffffff", primary.hex);

  return (
    <div
      className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col"
      style={{ background: background.hex, color: text.hex, minHeight: 520 }}
    >
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ borderColor: `${text.hex}18`, background: `${primary.hex}12` }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg" style={{ background: primary.hex }} />
          <span className="font-bold text-sm" style={{ color: primary.hex }}>
            Colorly
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-medium opacity-70">
          {["Features", "Pricing", "Docs"].map((i) => (
            <span key={i} className="cursor-pointer hover:opacity-100" style={{ color: text.hex }}>
              {i}
            </span>
          ))}
        </div>
        <button
          className="text-xs font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: primary.hex, color: "#fff" }}
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <div className="px-6 pt-8 pb-6">
        <div
          className="inline-block text-[10px] font-semibold px-3 py-1 rounded-full mb-3 tracking-widest uppercase"
          style={{ background: `${accent.hex}25`, color: accent.hex }}
        >
          New release
        </div>
        <h1 className="text-2xl font-bold leading-tight mb-2" style={{ color: text.hex }}>
          Design systems
          <br />
          <span style={{ color: primary.hex }}>that actually work.</span>
        </h1>
        <p className="text-xs leading-relaxed mb-4 max-w-xs opacity-70" style={{ color: text.hex }}>
          Build consistent, accessible, and beautiful color systems with intelligent generation and real-time previews.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="text-xs font-semibold px-4 py-2 rounded-lg transition-all"
            style={{ background: primary.hex, color: "#fff" }}
          >
            Start Free
          </button>
          <button
            className="text-xs font-semibold px-4 py-2 rounded-lg border transition-all"
            style={{
              border: `1.5px solid ${secondary.hex}`,
              color: secondary.hex,
              background: "transparent",
            }}
          >
            View Demo
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="px-6 pb-6 grid grid-cols-2 gap-3">
        {[
          { title: "Analytics", desc: "Track your design metrics in real time.", icon: "📊" },
          { title: "Tokens", desc: "Export CSS, Tailwind & JSON instantly.", icon: "🎨" },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-xl p-4 border"
            style={{
              background: `${primary.hex}08`,
              borderColor: `${primary.hex}20`,
            }}
          >
            <div className="text-lg mb-1">{card.icon}</div>
            <div className="text-xs font-bold mb-1" style={{ color: text.hex }}>
              {card.title}
            </div>
            <div className="text-[10px] opacity-60 leading-relaxed" style={{ color: text.hex }}>
              {card.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Badge strip */}
      <div className="mt-auto px-6 py-3 flex items-center gap-2 flex-wrap border-t" style={{ borderColor: `${text.hex}12` }}>
        {[
          { label: "Text / BG", ratio: textVsBg, pass: wcagPass(textVsBg) },
          { label: "Btn / BG", ratio: primaryVsBg, pass: wcagPass(primaryVsBg) },
        ].map(({ label, ratio, pass }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full"
            style={{
              background: pass ? "#dcfce7" : "#fef2f2",
              color: pass ? "#16a34a" : "#dc2626",
            }}
          >
            <span>{pass ? "✓" : "✗"}</span>
            <span>{label}</span>
            <span className="opacity-70">{ratio.toFixed(1)}:1</span>
          </div>
        ))}
        <div
          className="ml-auto text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: `${accent.hex}22`, color: accent.hex }}
        >
          WCAG AA
        </div>
      </div>
    </div>
  );
}
