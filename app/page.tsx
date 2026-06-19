"use client";

import { useEffect, useCallback, useState } from "react";
import { usePaletteStore } from "@/store/palette";
import { useLayoutStore } from "@/store/layout";
import DockableLayout from "@/components/layout/DockableLayout";
import PaletteGrid from "@/components/palette/PaletteGrid";
import ContrastBadge from "@/components/palette/ContrastBadge";
import PreviewPanel from "@/components/preview/PreviewPanel";
import ExportPanel from "@/components/export/ExportPanel";
import HarmonySelector from "@/components/ui/HarmonySelector";
import PreviewModeSelector from "@/components/ui/PreviewModeSelector";
import HistoryDrawer from "@/components/ui/HistoryDrawer";
import TipiLoader from "@/components/ui/TipiLoader";
import TasteSelector from "@/components/ui/TasteSelector";
import FontCombobox from "@/components/ui/FontCombobox";
import MockupSidebar from "@/components/preview/MockupSidebar";
import PromptInput from "@/components/ai/PromptInput";
import type { PanelId } from "@/store/layout";

export default function Home() {
  const { generate, setSelectedRole } = usePaletteStore();
  const { resetLayout } = useLayoutStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("tipi-loader-seen");
      if (seen === "true") {
        setLoading(false);
      }
    }
  }, []);

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

  // Panel content mapping
  const panelMap: { id: PanelId; component: React.ReactNode }[] = [
    {
      id: "palette",
      component: <PaletteGrid />,
    },
    {
      id: "taste-harmony",
      component: (
        <div className="space-y-4">
          <div>
            <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-black mb-1.5">
              Taste Identity
            </p>
            <TasteSelector />
          </div>
          <div>
            <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-black mb-1.5">
              Color Harmony
            </p>
            <HarmonySelector />
          </div>
        </div>
      ),
    },
    {
      id: "contrast",
      component: <ContrastBadge />,
    },
    {
      id: "fonts",
      component: <FontCombobox />,
    },
    {
      id: "mockups",
      component: <MockupSidebar />,
    },
    {
      id: "ai-input",
      component: <PromptInput />,
    },
    {
      id: "export",
      component: <ExportPanel />,
    },
  ];

  // Header
  const header = (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl flex-shrink-0">
      <div className="px-4 h-12 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xs font-black tracking-tight text-white leading-none">
              which<span className="text-white/25">-</span>color
              <span className="text-white/25">-</span>do
              <span className="text-white/25">-</span>you
              <span className="text-white/25">-</span>want
            </h1>
            <p className="text-white/30 text-[8px] uppercase tracking-[0.22em] font-bold mt-0.5 leading-none">
              Design taste, instantly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 justify-center">
          <PreviewModeSelector />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetLayout}
            className="text-[9px] text-white/20 hover:text-white/50 px-2 py-1 rounded-lg hover:bg-white/5 transition-all"
            title="Reset panel layout"
          >
            Reset Layout
          </button>
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
  );

  // Center content
  const centerContent = (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <PreviewPanel />
      </div>
      <p className="text-center text-white/10 text-[10px] uppercase tracking-[0.25em] font-bold mt-4 mb-2">
        Design taste · Instantly
      </p>
    </div>
  );

  return (
    <div style={{ animation: "fade-in-app 0.6s ease both" }}>
      <DockableLayout
        panelMap={panelMap}
        centerContent={centerContent}
        header={header}
      />
      <style>{`
        @keyframes fade-in-app {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
