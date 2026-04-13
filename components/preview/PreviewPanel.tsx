"use client";
import { usePaletteStore } from "@/store/palette";
import LightUIPreview from "./LightUIPreview";
import DarkUIPreview from "./DarkUIPreview";
import DashboardPreview from "./DashboardPreview";
import LandingPreview from "./LandingPreview";

export default function PreviewPanel() {
  const { previewMode } = usePaletteStore();
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 min-h-[340px] w-full transition-all duration-500">
      {previewMode === "light-ui" && <LightUIPreview />}
      {previewMode === "dark-ui" && <DarkUIPreview />}
      {previewMode === "dashboard" && <DashboardPreview />}
      {previewMode === "landing" && <LandingPreview />}
    </div>
  );
}
