"use client";

import { usePaletteStore, type PreviewMode } from "@/store/palette";

const MODES: { value: PreviewMode; label: string }[] = [
  { value: "landing", label: "Landing" },
  { value: "light-ui", label: "Light UI" },
  { value: "dark-ui", label: "Dark UI" },
  { value: "dashboard", label: "Dashboard" },
];

export default function PreviewModeSelector() {
  const { previewMode, setPreviewMode } = usePaletteStore();

  return (
    <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
      {MODES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setPreviewMode(value)}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all whitespace-nowrap ${
            previewMode === value
              ? "bg-white text-black shadow"
              : "text-white/30 hover:text-white/60"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
