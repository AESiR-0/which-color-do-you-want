"use client";

import { useState } from "react";
import { usePaletteStore } from "@/store/palette";
import { exportPalette, downloadPalette, type ExportFormat } from "@/lib/export";

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: "css", label: "CSS Vars" },
  { value: "tailwind", label: "Tailwind" },
  { value: "prompt", label: "AI Prompt" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
];

export default function ExportPanel() {
  const { palette, identity } = usePaletteStore();
  const [format, setFormat] = useState<ExportFormat>("tailwind");
  const [copied, setCopied] = useState(false);

  const preview = exportPalette(palette, format, identity);

  const copy = async () => {
    await navigator.clipboard.writeText(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-white text-sm">Direct Export</h3>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Skip hours of design decisions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="text-xs px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10"
          >
            {copied ? "Copied!" : "Copy Code"}
          </button>
          <button
            onClick={() => downloadPalette(palette, format, identity)}
            className="text-xs px-4 py-2 rounded-lg bg-white text-black font-black hover:bg-white/90 transition-all shadow-lg"
          >
            Download
          </button>
        </div>
      </div>

      {/* Format tabs */}
      <div className="flex gap-1 mb-4 bg-white/5 rounded-xl p-1 border border-white/5 overflow-x-auto no-scrollbar">
        {FORMATS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFormat(value)}
            className={`flex-1 whitespace-nowrap text-[10px] py-2 px-4 rounded-lg transition-all font-black uppercase tracking-widest ${
              format === value ? "bg-white text-black shadow" : "text-white/30 hover:text-white/60"
            }`}
          >
            {label}
            {value === "prompt" && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
          </button>
        ))}
      </div>

      {/* Code preview */}
      <div className="relative group">
        <pre className="text-[11px] text-white/50 bg-black/40 rounded-xl p-5 overflow-x-auto font-mono leading-relaxed max-h-64 overflow-y-auto border border-white/5 custom-scrollbar">
          {preview}
        </pre>
        {format === "prompt" && (
          <div className="absolute top-4 right-4 text-[9px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
            AI Ready
          </div>
        )}
      </div>
    </div>
  );
}
