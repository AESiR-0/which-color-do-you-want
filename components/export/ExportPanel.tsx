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
    <div className="flex gap-3 h-full min-h-0">
      {/* Left: Format tabs + buttons */}
      <div className="flex flex-col gap-2 w-[160px] flex-shrink-0">
        <div className="flex flex-col gap-0.5 bg-white/5 rounded-lg p-1 border border-white/5">
          {FORMATS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFormat(value)}
              className={`text-[9px] py-1.5 px-3 rounded-md transition-all font-black uppercase tracking-widest text-left ${
                format === value ? "bg-white text-black shadow" : "text-white/30 hover:text-white/60"
              }`}
            >
              {label}
              {value === "prompt" && (
                <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={copy}
            className="text-[10px] px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10"
          >
            {copied ? "Copied!" : "Copy Code"}
          </button>
          <button
            onClick={() => downloadPalette(palette, format, identity)}
            className="text-[10px] px-3 py-2 rounded-lg bg-white text-black font-black hover:bg-white/90 transition-all shadow-lg"
          >
            Download
          </button>
        </div>
      </div>

      {/* Right: Code preview */}
      <div className="flex-1 relative min-w-0">
        <pre className="text-[10px] text-white/50 bg-black/40 rounded-xl p-4 overflow-auto font-mono leading-relaxed h-full border border-white/5 custom-scrollbar">
          {preview}
        </pre>
        {format === "prompt" && (
          <div className="absolute top-3 right-3 text-[8px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            AI Ready
          </div>
        )}
      </div>
    </div>
  );
}
