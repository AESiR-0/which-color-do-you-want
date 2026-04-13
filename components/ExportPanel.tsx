"use client";
import { useState } from "react";
import { Palette, ColorRule, ContrastLevel, generateMarkdown } from "@/lib/colorEngine";

interface Props {
  palette: Palette;
  meta: { rule: ColorRule; contrast: ContrastLevel };
}

type ExportFormat = "css" | "tailwind" | "json" | "markdown";

export default function ExportPanel({ palette, meta }: Props) {
  const [format, setFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);

  const roles = Object.entries(palette) as [string, { hex: string; h: number; s: number; l: number }][];

  const outputs: Record<ExportFormat, string> = {
    css: `:root {\n${roles.map(([r, c]) => `  --color-${r}: ${c.hex};`).join("\n")}\n}`,
    tailwind: `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${roles.map(([r, c]) => `        ${r}: "${c.hex}",`).join("\n")}\n      }\n    }\n  }\n}`,
    json: `{\n${roles.map(([r, c]) => `  "${r}": { "value": "${c.hex}", "h": ${c.h}, "s": ${c.s}, "l": ${c.l} }`).join(",\n")}\n}`,
    markdown: generateMarkdown(palette, meta),
  };

  const copy = async () => {
    await navigator.clipboard.writeText(outputs[format]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([outputs.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "color-palette.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { key: ExportFormat; label: string }[] = [
    { key: "css", label: "CSS" },
    { key: "tailwind", label: "Tailwind" },
    { key: "json", label: "JSON" },
    { key: "markdown", label: "Markdown" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFormat(t.key)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-md transition-all"
              style={{
                background: format === t.key ? "#1e293b" : "transparent",
                color: format === t.key ? "#fff" : "#64748b",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {format === "markdown" && (
            <button
              onClick={downloadMarkdown}
              className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-slate-600"
            >
              ↓ Download .md
            </button>
          )}
          <button
            onClick={copy}
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: copied ? "#dcfce7" : "#f1f5f9",
              color: copied ? "#16a34a" : "#374151",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="p-4 text-[11px] font-mono text-slate-700 overflow-auto max-h-52 leading-relaxed bg-slate-50">
        {outputs[format]}
      </pre>
    </div>
  );
}
