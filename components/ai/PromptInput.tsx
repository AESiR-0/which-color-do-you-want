"use client";

import { useState, useRef } from "react";
import { usePaletteStore } from "@/store/palette";
import HtmlPreview from "./HtmlPreview";

export default function PromptInput() {
  const { palette, identity } = usePaletteStore();
  const [mode, setMode] = useState<"prompt" | "html">("prompt");
  const [prompt, setPrompt] = useState("");
  const [htmlInput, setHtmlInput] = useState("");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const paletteMap: Record<string, string> = {};
  palette.forEach((c) => (paletteMap[c.role] = c.hex));

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          palette: paletteMap,
          identity: {
            heading: identity.typography.heading,
            body: identity.typography.body,
            vibe: identity.vibe,
          },
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setGeneratedHtml(data.html);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyHtml = () => {
    setGeneratedHtml(htmlInput);
  };

  const activeHtml = generatedHtml;

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
        <button
          onClick={() => setMode("prompt")}
          className={`flex-1 text-[9px] py-1.5 rounded-md font-black uppercase tracking-widest transition-all ${
            mode === "prompt" ? "bg-white text-black shadow" : "text-white/30 hover:text-white/60"
          }`}
        >
          AI Prompt
        </button>
        <button
          onClick={() => setMode("html")}
          className={`flex-1 text-[9px] py-1.5 rounded-md font-black uppercase tracking-widest transition-all ${
            mode === "html" ? "bg-white text-black shadow" : "text-white/30 hover:text-white/60"
          }`}
        >
          Paste HTML
        </button>
      </div>

      {mode === "prompt" ? (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 'A fintech dashboard with charts and KPI cards' or 'A landing page for a coffee brand'"
            className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none min-h-[60px] custom-scrollbar"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-2 rounded-xl text-xs font-black transition-all disabled:opacity-30 flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 active:scale-[0.98] shadow-lg"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                Generate Preview
              </>
            )}
          </button>
          <p className="text-[9px] text-white/20 text-center">
            Ctrl+Enter to generate · Uses your palette + fonts
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder={'<div class="p-8 bg-[var(--color-background)]">\n  <h1 class="text-3xl font-bold" style="color: var(--color-primary)">\n    Hello World\n  </h1>\n</div>'}
            className="w-full text-[11px] bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 placeholder:text-white/15 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none min-h-[80px] font-mono custom-scrollbar"
            rows={5}
          />
          <button
            onClick={handleApplyHtml}
            disabled={!htmlInput.trim()}
            className="w-full py-2 rounded-xl text-xs font-black transition-all disabled:opacity-30 bg-white/10 text-white border border-white/10 hover:bg-white/20 active:scale-[0.98]"
          >
            Apply HTML
          </button>
          <p className="text-[9px] text-white/20">
            Tailwind supported · Use <code className="text-white/30">var(--color-primary)</code> etc. for palette
          </p>
        </div>
      )}

      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Inline mini preview */}
      {activeHtml && (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
          <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
            <span className="text-[8px] text-white/25 uppercase tracking-widest font-black">Preview</span>
            <button
              onClick={() => setGeneratedHtml("")}
              className="text-[9px] text-white/30 hover:text-white/60 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="h-[200px]">
            <HtmlPreview html={activeHtml} palette={paletteMap} identity={identity} />
          </div>
        </div>
      )}
    </div>
  );
}
