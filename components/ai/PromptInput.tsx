"use client";

import { useState, useRef } from "react";
import { usePaletteStore } from "@/store/palette";
import HtmlPreview from "./HtmlPreview";

type Step = "idle" | "optimizing" | "review" | "generating" | "done";

export default function PromptInput() {
  const { palette, identity } = usePaletteStore();
  const [mode, setMode] = useState<"prompt" | "html">("prompt");
  const [prompt, setPrompt] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [htmlInput, setHtmlInput] = useState("");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const paletteMap: Record<string, string> = {};
  palette.forEach((c) => (paletteMap[c.role] = c.hex));

  const identityPayload = {
    heading: identity.typography.heading,
    body: identity.typography.body,
    vibe: identity.vibe,
  };

  // Step 1: Optimize prompt
  const handleOptimize = async () => {
    if (!prompt.trim()) return;
    setStep("optimizing");
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          palette: paletteMap,
          identity: identityPayload,
          mode: "optimize",
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setStep("idle");
      } else {
        setOptimizedPrompt(data.optimizedPrompt);
        setStep("review");
      }
    } catch (err: any) {
      setError(err.message);
      setStep("idle");
    }
  };

  // Step 2: Generate HTML from optimized prompt
  const handleGenerate = async () => {
    const finalPrompt = optimizedPrompt || prompt;
    if (!finalPrompt.trim()) return;
    setStep("generating");
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalPrompt.trim(),
          palette: paletteMap,
          identity: identityPayload,
          mode: "generate",
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setStep("review");
      } else {
        setGeneratedHtml(data.html);
        setStep("done");
      }
    } catch (err: any) {
      setError(err.message);
      setStep("review");
    }
  };

  const handleApplyHtml = () => {
    setGeneratedHtml(htmlInput);
  };

  const handleReset = () => {
    setStep("idle");
    setOptimizedPrompt("");
    setGeneratedHtml("");
    setError("");
  };

  const isLoading = step === "optimizing" || step === "generating";

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
          {/* Step indicator */}
          <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest font-bold">
            <span className={step === "idle" || step === "optimizing" ? "text-white/60" : "text-white/20"}>
              1. Write
            </span>
            <span className="text-white/10">→</span>
            <span className={step === "review" || step === "optimizing" ? "text-white/60" : "text-white/20"}>
              2. Optimize
            </span>
            <span className="text-white/10">→</span>
            <span className={step === "generating" || step === "done" ? "text-white/60" : "text-white/20"}>
              3. Generate
            </span>
          </div>

          {/* Step 1: User prompt input */}
          {(step === "idle" || step === "optimizing") && (
            <>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 'A fintech dashboard with charts and KPI cards' or 'A landing page for a coffee brand'"
                className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none min-h-[60px] custom-scrollbar"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleOptimize();
                }}
                disabled={isLoading}
              />
              <button
                onClick={handleOptimize}
                disabled={isLoading || !prompt.trim()}
                className="w-full py-2 rounded-xl text-xs font-black transition-all disabled:opacity-30 flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98] shadow-lg"
              >
                {step === "optimizing" ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Optimizing prompt...
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                    </svg>
                    Optimize Prompt
                  </>
                )}
              </button>
              <p className="text-[9px] text-white/20 text-center">
                Ctrl+Enter · AI enhances your prompt before generating
              </p>
            </>
          )}

          {/* Step 2: Review optimized prompt */}
          {(step === "review" || step === "generating") && (
            <>
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 bg-indigo-500/10 border-b border-white/5">
                  <span className="text-[8px] text-indigo-400 uppercase tracking-widest font-black">
                    Optimized Prompt
                  </span>
                  <button
                    onClick={handleReset}
                    className="text-[8px] text-white/30 hover:text-white/60 transition-colors"
                  >
                    Start over
                  </button>
                </div>
                <textarea
                  value={optimizedPrompt}
                  onChange={(e) => setOptimizedPrompt(e.target.value)}
                  className="w-full text-[11px] bg-transparent px-3 py-2.5 text-white/80 focus:outline-none resize-none min-h-[70px] custom-scrollbar"
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              {/* Original prompt reference */}
              <div className="bg-white/3 rounded-lg px-3 py-2 border border-white/5">
                <span className="text-[7px] text-white/15 uppercase tracking-widest font-bold block mb-1">
                  Original
                </span>
                <p className="text-[10px] text-white/30 leading-relaxed">{prompt}</p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading || !optimizedPrompt.trim()}
                className="w-full py-2 rounded-xl text-xs font-black transition-all disabled:opacity-30 flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 active:scale-[0.98] shadow-lg"
              >
                {step === "generating" ? (
                  <>
                    <span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Generating HTML...
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
            </>
          )}

          {/* Step 3: Done - show result */}
          {step === "done" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-green-400 font-black uppercase tracking-widest">
                  ✓ Generated
                </span>
                <button
                  onClick={handleReset}
                  className="text-[9px] text-white/30 hover:text-white/60 ml-auto transition-colors"
                >
                  New prompt
                </button>
                <button
                  onClick={() => setStep("review")}
                  className="text-[9px] text-white/30 hover:text-white/60 transition-colors"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* HTML paste mode */
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
            Tailwind supported · Use <code className="text-white/30">var(--color-primary)</code> etc.
          </p>
        </div>
      )}

      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Inline preview */}
      {generatedHtml && (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
          <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
            <span className="text-[8px] text-white/25 uppercase tracking-widest font-black">Preview</span>
            <button
              onClick={() => { setGeneratedHtml(""); if (step === "done") handleReset(); }}
              className="text-[9px] text-white/30 hover:text-white/60 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="h-[200px]">
            <HtmlPreview html={generatedHtml} palette={paletteMap} identity={identity} />
          </div>
        </div>
      )}
    </div>
  );
}
