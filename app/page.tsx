"use client";

import { useEffect, useCallback } from "react";
import { usePaletteStore } from "@/store/palette";
import PaletteGrid from "@/components/palette/PaletteGrid";
import ContrastBadge from "@/components/palette/ContrastBadge";
import PreviewPanel from "@/components/preview/PreviewPanel";
import ExportPanel from "@/components/export/ExportPanel";
import HarmonySelector from "@/components/ui/HarmonySelector";
import PreviewModeSelector from "@/components/ui/PreviewModeSelector";
import HistoryDrawer from "@/components/ui/HistoryDrawer";

export default function Home() {
  const { generate, selectedRole, setSelectedRole } = usePaletteStore();

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

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 sm:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            which<span className="text-white/30">-</span>color<span className="text-white/30">-</span>do<span className="text-white/30">-</span>you<span className="text-white/30">-</span>want
          </h1>
          <p className="text-white/30 text-xs mt-0.5">Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/60">R</kbd> to regenerate</p>
        </div>
        <div className="flex items-center gap-3">
          <HistoryDrawer />
          <button
            onClick={generate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 active:scale-95 transition-all shadow-lg"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7A6 6 0 1 0 7 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M1 1v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Generate
          </button>
        </div>
      </div>

      {/* Harmony modes */}
      <div className="mb-6">
        <p className="text-xs text-white/30 mb-2 uppercase tracking-widest">Harmony</p>
        <HarmonySelector />
      </div>

      {/* Palette grid */}
      <div className="mb-6">
        <PaletteGrid />
      </div>

      {/* Contrast badges */}
      <div className="mb-8">
        <p className="text-xs text-white/30 mb-2 uppercase tracking-widest">Contrast (WCAG)</p>
        <ContrastBadge />
      </div>

      {/* Preview */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <p className="text-xs text-white/30 uppercase tracking-widest">Preview</p>
          <PreviewModeSelector />
        </div>
        <PreviewPanel />
      </div>

      {/* Export */}
      <div className="mt-8">
        <ExportPanel />
      </div>

      {/* Footer */}
      <p className="text-center text-white/15 text-xs mt-12">
        Built with Next.js · Colors stay in session
      </p>
    </main>
  );
}
