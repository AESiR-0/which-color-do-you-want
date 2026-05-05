"use client";

import { useEffect, useCallback, useState } from "react";
import { usePaletteStore } from "@/store/palette";
import PaletteGrid from "@/components/palette/PaletteGrid";
import ContrastBadge from "@/components/palette/ContrastBadge";
import PreviewPanel from "@/components/preview/PreviewPanel";
import ExportPanel from "@/components/export/ExportPanel";
import HarmonySelector from "@/components/ui/HarmonySelector";
import PreviewModeSelector from "@/components/ui/PreviewModeSelector";
import HistoryDrawer from "@/components/ui/HistoryDrawer";
import TipiLoader from "@/components/ui/TipiLoader";
import TasteSelector from "@/components/ui/TasteSelector";
import FontSelector from "@/components/ui/FontSelector";

export default function Home() {
  const { generate, setSelectedRole } = usePaletteStore();
  const [loading, setLoading] = useState(true);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "r" || e.key === "R") generate();
      if (e.key === "Escape") setSelectedRole(null);
    },
    [generate, setSelectedRole]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return <TipiLoader onDone={() => setLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white" style={{ animation: "fade-in-app 0.6s ease both" }}>
      {/* ── Top bar ──────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-sm font-black tracking-tight text-white leading-none">
                which<span className="text-white/25">-</span>color
                <span className="text-white/25">-</span>do
                <span className="text-white/25">-</span>you
                <span className="text-white/25">-</span>want
              </h1>
              <p className="text-white/30 text-[9px] uppercase tracking-[0.22em] font-bold mt-0.5 leading-none">
                Design taste, instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/8 text-white/20 text-[9px] font-mono font-bold">
              R
            </kbd>
            <span className="hidden sm:inline text-white/15 text-[9px] mr-1">regenerate</span>
            <HistoryDrawer />
            <button
              onClick={generate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-black hover:bg-white/90 active:scale-95 transition-all shadow-lg"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M1 7A6 6 0 1 0 7 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M1 1v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Generate
            </button>
          </div>
        </div>
      </header>

      {/* ── Main layout ──────────────────────────── */}
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 py-8">

        {/* ── Controls Row: Taste + Harmony + Fonts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6 mb-8">
          <div>
            <SectionLabel>Taste Identity</SectionLabel>
            <TasteSelector />
          </div>
          <div>
            <SectionLabel>Color Harmony</SectionLabel>
            <HarmonySelector />
          </div>
          <div>
            <SectionLabel>Font Pairing</SectionLabel>
            <FontSelector />
          </div>
        </div>

        {/* ── Palette + Contrast ── */}
        <div className="mb-8">
          <SectionLabel>Color Palette</SectionLabel>
          <PaletteGrid />
        </div>

        <div className="mb-10">
          <SectionLabel>Contrast (WCAG)</SectionLabel>
          <ContrastBadge />
        </div>

        {/* ── Full-width Preview ── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 gap-4 flex-wrap">
            <SectionLabel className="mb-0">Live Preview</SectionLabel>
            <PreviewModeSelector />
          </div>
          {/* Full width — no max-w cap */}
          <div className="w-full">
            <PreviewPanel />
          </div>
        </div>

        {/* ── Export Panel ── */}
        <div className="mt-10">
          <ExportPanel />
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-white/10 text-[10px] uppercase tracking-[0.25em] font-bold mt-16 mb-4">
          Design taste · Instantly
        </p>
      </div>

      <style>{`
        @keyframes fade-in-app {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[9px] text-white/25 mb-2.5 uppercase tracking-[0.25em] font-black ${className}`}>
      {children}
    </p>
  );
}
