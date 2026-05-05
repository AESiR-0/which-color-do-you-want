"use client";

import { useState } from "react";
import { usePaletteStore } from "@/store/palette";
import { getReadableTextColor } from "@/lib/contrast";
import { type PaletteColor } from "@/lib/color-engine";

const LOCK_MODES: { value: PaletteColor["lockMode"]; label: string }[] = [
  { value: "full",       label: "Lock All" },
  { value: "hue",        label: "Lock Hue" },
  { value: "saturation", label: "Lock Sat" },
  { value: "lightness",  label: "Lock Lit" },
];

interface Props { color: PaletteColor; }

export default function ColorCard({ color }: Props) {
  const { toggleLock, setLockMode, updateColorHex, updateColorHsl, setSelectedRole, selectedRole } = usePaletteStore();
  const [copying, setCopying] = useState(false);
  const [showLockMenu, setShowLockMenu] = useState(false);

  const textColor = getReadableTextColor(color.hsl);
  const isSelected = selectedRole === color.role;

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopying(true);
    setTimeout(() => setCopying(false), 1200);
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden cursor-pointer select-none shadow-xl
        ${isSelected ? "ring-2 ring-white/60 scale-[1.03]" : "hover:scale-[1.02] hover:shadow-2xl"}
        transition-all duration-300`}
      style={{ backgroundColor: color.hex, minHeight: 160 }}
      onClick={() => setSelectedRole(isSelected ? null : color.role)}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-1" style={{ color: textColor }}>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">{color.role}</span>
        <button
          onClick={(e) => { e.stopPropagation(); setShowLockMenu(!showLockMenu); }}
          className="text-[10px] px-2 py-0.5 rounded-full border transition-all"
          style={{ borderColor: textColor + "33", color: textColor, opacity: color.locked || color.lockMode ? 1 : 0.4 }}
        >
          {color.locked ? "🔒" : color.lockMode ? "🔓" : "○"}
        </button>
      </div>

      {/* Lock menu */}
      {showLockMenu && (
        <div
          className="absolute top-10 right-3 z-30 bg-zinc-900/95 backdrop-blur-xl rounded-xl p-1.5 flex flex-col gap-0.5 shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="text-[10px] text-white/60 px-3 py-1.5 hover:bg-white/10 rounded-lg text-left font-bold"
            onClick={() => { toggleLock(color.role); setShowLockMenu(false); }}>
            {color.locked ? "Unlock" : "Lock All"}
          </button>
          {LOCK_MODES.filter((m) => m.value !== "full").map((m) => (
            <button key={m.value}
              className={`text-[10px] px-3 py-1.5 rounded-lg text-left font-bold transition-colors
                ${color.lockMode === m.value ? "bg-white/15 text-white" : "text-white/50 hover:bg-white/10"}`}
              onClick={() => { setLockMode(color.role, color.lockMode === m.value ? null : m.value); setShowLockMenu(false); }}>
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Color info */}
      <div className="flex-1 flex flex-col justify-end px-4 pb-4 pt-2">
        <button
          className="font-mono text-lg font-black tracking-tight mb-0.5 block hover:opacity-70 transition-opacity text-left"
          style={{ color: textColor }}
          onClick={(e) => { e.stopPropagation(); copy(color.hex); }}
        >
          {copying ? "✓ Copied" : color.hex.toUpperCase()}
        </button>
        <p className="text-[10px] opacity-40 font-mono" style={{ color: textColor }}>
          {color.hsl.h}° {color.hsl.s}% {color.hsl.l}%
        </p>
      </div>

      {/* Expanded HSL sliders */}
      {isSelected && (
        <div className="px-4 pb-4 space-y-2 border-t border-black/10 pt-3" onClick={(e) => e.stopPropagation()}>
          {(["h", "s", "l"] as const).map((key) => {
            const max = key === "h" ? 360 : 100;
            const labels = { h: "H", s: "S", l: "L" };
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-[9px] font-black w-4" style={{ color: textColor, opacity: 0.5 }}>{labels[key]}</span>
                <input type="range" min={0} max={max} value={color.hsl[key]}
                  onChange={(e) => updateColorHsl(color.role, { [key]: Number(e.target.value) })}
                  className="flex-1 h-1 rounded-full accent-white cursor-pointer" />
                <span className="text-[9px] font-mono w-7 text-right" style={{ color: textColor, opacity: 0.5 }}>{color.hsl[key]}</span>
              </div>
            );
          })}
          <input
            type="text"
            defaultValue={color.hex}
            onBlur={(e) => updateColorHex(color.role, e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") updateColorHex(color.role, (e.target as HTMLInputElement).value); }}
            className="w-full text-[10px] font-mono bg-black/20 rounded-lg px-2 py-1.5 mt-1 focus:outline-none focus:bg-black/30"
            style={{ color: textColor }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
