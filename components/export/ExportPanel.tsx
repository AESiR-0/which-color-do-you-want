"use client";

import { useState } from "react";
import { usePaletteStore } from "@/store/palette";
import { exportPalette, downloadPalette, type ExportFormat } from "@/lib/export";

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: "css", label: "CSS Vars" },
  { value: "tailwind", label: "Tailwind" },
  { value: "scss", label: "SCSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
];

export default function ExportPanel() {
  const { palette } = usePaletteStore();
  const [format, setFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);

  const preview = exportPalette(palette, format);

  const copy = async () => {
    await navigator.clipboard.writeText(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white/80 text-sm">Export</h3>
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={() => downloadPalette(palette, format)}
            className="text-xs px-3 py-1.5 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition-colors"
          >
            Download
          </button>
        </div>
      </div>

      {/* Format tabs */}
      <div className="flex gap-1 mb-4 bg-white/5 rounded-xl p-1">
        {FORMATS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFormat(value)}
            className={`flex-1 text-xs py-1.5 rounded-lg transition-all font-medium ${
              format === value ? "bg-white text-black shadow" : "text-white/40 hover:text-white/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Code preview */}
      <pre className="text-xs text-white/60 bg-black/30 rounded-xl p-4 overflow-x-auto font-mono leading-relaxed max-h-40 overflow-y-auto">
        {preview}
      </pre>
    </div>
  );
}
