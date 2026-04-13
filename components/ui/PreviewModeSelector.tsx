"use client";

import { usePaletteStore, type PreviewMode } from "@/store/palette";

const MODES: { value: PreviewMode; label: string; icon: string }[] = [
  { value: "light-ui", label: "Light UI", icon: "☀" },
  { value: "dark-ui", label: "Dark UI", icon: "🌙" },
  { value: "dashboard", label: "Dashboard", icon: "⊞" },
  { value: "landing", label: "Landing", icon: "◎" },
];

export default function PreviewModeSelector() {
  const { previewMode, setPreviewMode } = usePaletteStore();

  return (
    <div className="flex gap-1 bg-white/5 rounded-xl p-1">
      {MODES.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => setPreviewMode(value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            previewMode === value
              ? "bg-white text-black shadow-sm"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          <span>{icon}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
