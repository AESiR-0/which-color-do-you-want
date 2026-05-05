"use client";
import { useRef, useState } from "react";
import { usePaletteStore } from "@/store/palette";
import { toBlob } from "html-to-image";
import LightUIPreview from "./LightUIPreview";
import DarkUIPreview from "./DarkUIPreview";
import DashboardPreview from "./DashboardPreview";
import LandingPreview from "./LandingPreview";

export default function PreviewPanel() {
  const { previewMode } = usePaletteStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);

  const copyAsImage = async () => {
    if (!previewRef.current) return;
    setCapturing(true);
    try {
      const blob = await toBlob(previewRef.current, {
        cacheBust: true,
        backgroundColor: "transparent",
      });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        alert("Image copied to clipboard!");
      }
    } catch (err) {
      console.error("Failed to copy image", err);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="relative group">
      <div 
        ref={previewRef}
        className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 min-h-[340px] w-full transition-all duration-500 shadow-2xl"
      >
        {previewMode === "light-ui" && <LightUIPreview />}
        {previewMode === "dark-ui" && <DarkUIPreview />}
        {previewMode === "dashboard" && <DashboardPreview />}
        {previewMode === "landing" && <LandingPreview />}
      </div>

      <button
        onClick={copyAsImage}
        disabled={capturing}
        className="absolute top-4 right-4 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl text-xs font-bold text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 shadow-xl"
      >
        {capturing ? (
          <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        )}
        {capturing ? "Capturing..." : "Copy as Image"}
      </button>
    </div>
  );
}
