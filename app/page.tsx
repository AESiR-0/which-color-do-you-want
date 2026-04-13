"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  Palette,
  ColorRole,
  ColorRule,
  ContrastLevel,
  HSLColor,
  generatePalette,
  makeColor,
  hslToHex,
  PRESETS,
  SavedPalette,
  loadSavedPalettes,
  savePaletteToStorage,
  encodePalette,
  decodePalette,
} from "@/lib/colorEngine";
import ColorSwatch from "@/components/ColorSwatch";
import UIPreview from "@/components/UIPreview";
import ExportPanel from "@/components/ExportPanel";
import SavedPalettes from "@/components/SavedPalettes";

const ROLES: ColorRole[] = ["primary", "secondary", "accent", "background", "text"];

type LockState = Record<ColorRole, boolean>;

function ColorApp() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [baseHue, setBaseHue] = useState(215);
  const [rule, setRule] = useState<ColorRule>("analogous");
  const [contrast, setContrast] = useState<ContrastLevel>("high");
  const [palette, setPalette] = useState<Palette>(() =>
    generatePalette({ baseHue: 215, rule: "analogous", contrast: "high" })
  );
  const [locks, setLocks] = useState<LockState>({
    primary: false,
    secondary: false,
    accent: false,
    background: false,
    text: false,
  });
  const [expandedRole, setExpandedRole] = useState<ColorRole | null>(null);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [activeTab, setActiveTab] = useState<"swatches" | "saved" | "export">("swatches");
  const [saveMsg, setSaveMsg] = useState("");
  const [shareMsg, setShareMsg] = useState("");

  // Load from URL on mount
  useEffect(() => {
    const p = searchParams.get("p");
    if (p) {
      const decoded = decodePalette(p);
      if (decoded) setPalette(decoded);
    }
    setSavedPalettes(loadSavedPalettes());
  }, []);

  const regenerate = useCallback(
    (newHue = baseHue, newRule = rule, newContrast = contrast) => {
      const fresh = generatePalette({ baseHue: newHue, rule: newRule, contrast: newContrast });
      setPalette((prev) => {
        const merged = { ...fresh };
        ROLES.forEach((r) => {
          if (locks[r]) merged[r] = prev[r];
        });
        return merged;
      });
    },
    [baseHue, rule, contrast, locks]
  );

  const handleRandomize = () => {
    const newHue = Math.floor(Math.random() * 360);
    setBaseHue(newHue);
    regenerate(newHue);
  };

  const handleColorChange = (role: ColorRole, partial: Partial<HSLColor>) => {
    setPalette((prev) => {
      const current = prev[role];
      const updated = { ...current, ...partial };
      // Recompute hex if h/s/l changed but not hex
      if ("h" in partial || "s" in partial || "l" in partial) {
        updated.hex = hslToHex(
          "h" in partial ? (partial.h as number) : current.h,
          "s" in partial ? (partial.s as number) : current.s,
          "l" in partial ? (partial.l as number) : current.l
        );
      }
      return { ...prev, [role]: updated };
    });
  };

  const handlePreset = (key: string) => {
    const preset = PRESETS[key];
    if (!preset) return;
    setBaseHue(preset.baseHue);
    setRule(preset.rule);
    setContrast(preset.contrast);
    const p = generatePalette({
      baseHue: preset.baseHue,
      rule: preset.rule,
      contrast: preset.contrast,
    });
    setPalette(p);
  };

  const handleSave = () => {
    const entry: SavedPalette = {
      id: uuidv4(),
      createdAt: Date.now(),
      palette,
      meta: { rule, contrast },
    };
    savePaletteToStorage(entry);
    setSavedPalettes(loadSavedPalettes());
    setSaveMsg("Saved!");
    setTimeout(() => setSaveMsg(""), 1500);
  };

  const handleShare = () => {
    const encoded = encodePalette(palette);
    const url = `${window.location.origin}/?p=${encoded}`;
    navigator.clipboard.writeText(url);
    setShareMsg("URL copied!");
    setTimeout(() => setShareMsg(""), 1800);
    router.push(`/?p=${encoded}`, { scroll: false });
  };

  const handleRestore = (sp: SavedPalette) => {
    setPalette(sp.palette);
    setRule(sp.meta.rule);
    setContrast(sp.meta.contrast);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f8fafc" }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
            C
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 leading-none">Color System Explorer</div>
            <div className="text-[10px] text-slate-400 leading-none mt-0.5">Design system color tool</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all"
          >
            {shareMsg || "Share URL"}
          </button>
          <button
            onClick={handleSave}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-all"
          >
            {saveMsg || "Save"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
          {/* Generation Controls */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700">Generation</span>
              <button
                onClick={handleRandomize}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg text-white transition-all"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                ⟳ Randomize
              </button>
            </div>

            {/* Base Hue */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-slate-500">Base Hue</span>
                <span className="text-[10px] font-mono text-slate-400">{baseHue}°</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={baseHue}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, hsl(0,80%,50%), hsl(60,80%,50%), hsl(120,80%,50%), hsl(180,80%,50%), hsl(240,80%,50%), hsl(300,80%,50%), hsl(360,80%,50%))`,
                  }}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setBaseHue(v);
                    regenerate(v);
                  }}
                />
              </div>
            </div>

            {/* Rule */}
            <div className="mb-3">
              <span className="text-[10px] font-medium text-slate-500 block mb-1.5">Rule</span>
              <div className="grid grid-cols-3 gap-1">
                {(["analogous", "complementary", "monochrome"] as ColorRule[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRule(r);
                      regenerate(baseHue, r);
                    }}
                    className="text-[10px] font-medium py-1.5 px-1 rounded-lg capitalize transition-all"
                    style={{
                      background: rule === r ? "#1e293b" : "#f1f5f9",
                      color: rule === r ? "#fff" : "#475569",
                    }}
                  >
                    {r === "complementary" ? "Compl." : r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast */}
            <div>
              <span className="text-[10px] font-medium text-slate-500 block mb-1.5">Contrast</span>
              <div className="grid grid-cols-3 gap-1">
                {(["low", "medium", "high"] as ContrastLevel[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setContrast(c);
                      regenerate(baseHue, rule, c);
                    }}
                    className="text-[10px] font-medium py-1.5 rounded-lg capitalize transition-all"
                    style={{
                      background: contrast === c ? "#1e293b" : "#f1f5f9",
                      color: contrast === c ? "#fff" : "#475569",
                    }}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="p-4 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-700 block mb-2">Presets</span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handlePreset(key)}
                  className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-400 bg-slate-50 text-slate-600 hover:text-slate-800 transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs: Swatches / Saved / Export */}
          <div className="flex border-b border-slate-100">
            {(["swatches", "saved", "export"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="flex-1 text-[11px] font-medium py-2.5 capitalize transition-all"
                style={{
                  borderBottom: activeTab === t ? "2px solid #1e293b" : "2px solid transparent",
                  color: activeTab === t ? "#1e293b" : "#94a3b8",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === "swatches" && (
              <>
                {ROLES.map((role) => (
                  <ColorSwatch
                    key={role}
                    role={role}
                    color={palette[role]}
                    locked={locks[role]}
                    onToggleLock={() =>
                      setLocks((prev) => ({ ...prev, [role]: !prev[role] }))
                    }
                    onColorChange={(partial) => handleColorChange(role, partial)}
                    expanded={expandedRole === role}
                    onToggleExpand={() =>
                      setExpandedRole((prev) => (prev === role ? null : role))
                    }
                  />
                ))}
              </>
            )}

            {activeTab === "saved" && (
              <SavedPalettes
                palettes={savedPalettes}
                onRestore={handleRestore}
                onRefresh={() => setSavedPalettes(loadSavedPalettes())}
              />
            )}

            {activeTab === "export" && (
              <ExportPanel palette={palette} meta={{ rule, contrast }} />
            )}
          </div>
        </aside>

        {/* Right Panel - Preview */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-5">
            {/* Palette Strip */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-700">Active Palette</span>
                <span className="text-[10px] font-medium text-slate-400 capitalize">{rule} · {contrast} contrast</span>
              </div>
              <div className="flex rounded-xl overflow-hidden h-14 border border-slate-100">
                {ROLES.map((role) => (
                  <div
                    key={role}
                    className="flex-1 flex items-end pb-1 justify-center group relative cursor-pointer"
                    style={{ background: palette[role].hex }}
                    title={`${role}: ${palette[role].hex}`}
                  >
                    {locks[role] && (
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex mt-1.5">
                {ROLES.map((role) => (
                  <div key={role} className="flex-1 text-center">
                    <div className="text-[9px] font-mono text-slate-400">{palette[role].hex}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* UI Preview */}
            <UIPreview palette={palette} />

            {/* Export (inline on right too) */}
            <ExportPanel palette={palette} meta={{ rule, contrast }} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">Loading...</div>}>
      <ColorApp />
    </Suspense>
  );
}
