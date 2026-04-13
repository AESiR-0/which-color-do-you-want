"use client";

import { useState, useRef } from "react";
import { usePaletteStore } from "@/store/palette";
import { getReadableTextColor } from "@/lib/contrast";
import { type PaletteColor } from "@/lib/color-engine";

const LOCK_MODES: { value: PaletteColor["lockMode"]; label: string }[] = [
  { value: "full", label: "Lock All" },
  { value: "hue", label: "Lock Hue" },
  { value: "saturation", label: "Lock Sat" },
  { value: "lightness", label: "Lock Lit" },
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
      className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer select-none shadow-lg ${isSelected ? "ring-2 ring-white/60 scale-[1.02]" : "hover:scale-[1.01]"}`}
      style={{ backgroundColor: color.hex }}
      onClick={() => setSelectedRole(isSelected ? null : color.role)}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2" style={{ color: textColor }}>
        <span className="text-xs font-semibold uppercase tracking-widest opacity-70">{color.role}</span>
        <button
          onClick={(e) => { e.stopPropagation(); setShowLockMenu(!showLockMenu); }}
          className="text-xs px-2 py-0.5 rounded-full border transition-all duration-150"
          style={{ borderColor: textColor + "44", color: textColor, opacity: color.locked || color.lockMode ? 1 : 0.5 }}
        >
          {color.locked ? "🔒" : color.lockMode ? "🔓" : "○"}
        </button>
      </div>

      {showLockMenu && (
        <div className="absolute top-10 right-4 z-20 bg-black/90 rounded-xl p-2 flex flex-col gap-1 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <button className="text-xs text-white/60 px-3 py-1 hover:bg-white/10 rounded-lg text-left" onClick={() => { toggleLock(color.role); setShowLockMenu(false); }}>
            {color.locked ? "Unlock" : "Lock All"}
          </button>
          {LOCK_MODES.filter((m) => m.value !== "full").map((m) => (
            <button key={m.value}
              className={`text-xs px-3 py-1 rounded-lg text-left transition-colors ${color.lockMode === m.value ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10"}`}
              onClick={() => { setLockMode(color.role, color.lockMode === m.value ? null : m.value); setShowLockMenu(false); }}>
              {m.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-[120px] flex items-end px-4 pb-4 pt-2">
        <div className="w-full">
          <button className="font-mono text-xl font-bold tracking-tight mb-1 block transition-all duration-150 hover:opacity-80"
            style={{ color: textColor }} onClick={(e) => { e.stopPropagation(); copy(color.hex); }}>
            {copying ? "Copied!" : color.hex.toUpperCase()}
          </button>
          <p className="text-xs opacity-50" style={{ color: textColor }}>
            hsl({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
          </p>
        </div>
      </div>

      {isSelected && (
        <div className="px-4 pb-4 space-y-2 border-t border-white/10 pt-3" onClick={(e) => e.stopPropagation()}>
          {(["h", "s", "l"] as const).map((key) => {
            const max = key === "h" ? 360 : 100;
            const labels = { h: "Hue", s: "Sat", l: "Light" };
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs w-10" style={{ color: textColor, opacity: 0.6 }}>{labels[key]}</span>
                <input type="range" min={0} max={max} value={color.hsl[key]}
                  onChange={(e) => updateColorHsl(color.role, { [key]: Number(e.target.value) })}
                  className="flex-1 h-1 rounded-full" />
                <span className="text-xs w-8 text-right" style={{ color: textColor, opacity: 0.6 }}>{color.hsl[key]}</span>
              </div>
            );
          })}
          <input type="text" defaultValue={color.hex}
            onBlur={(e) => updateColorHex(color.role, e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") updateColorHex(color.role, (e.target as HTMLInputElement).value); }}
            className="w-full text-xs font-mono bg-black/20 rounded-lg px-2 py-1 mt-1 focus:outline-none"
            style={{ color: textColor }} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
