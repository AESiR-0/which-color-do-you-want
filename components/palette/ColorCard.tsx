"use client";

import { useState, useRef, useEffect } from "react";
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
  const lockMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showLockMenu) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (lockMenuRef.current && !lockMenuRef.current.contains(e.target as Node)) {
        setShowLockMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showLockMenu]);

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
        <div className="relative" ref={lockMenuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowLockMenu(!showLockMenu); }}
            className="w-6 h-6 rounded-full border transition-all flex items-center justify-center hover:bg-white/10"
            style={{ borderColor: textColor + "33", color: textColor, opacity: color.locked || color.lockMode ? 1 : 0.4 }}
            title="Lock options"
          >
            {color.locked ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            ) : color.lockMode ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
              </svg>
            )}
          </button>

          {/* Lock menu */}
          {showLockMenu && (
            <div
              className="absolute top-8 right-0 z-30 bg-zinc-900/95 backdrop-blur-xl rounded-xl p-1.5 flex flex-col gap-0.5 shadow-2xl border border-white/10 min-w-24"
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
        </div>
      </div>

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

            // Dynamic gradients for tracks
            const trackGradient =
              key === "h"
                ? `linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))`
                : key === "s"
                ? `linear-gradient(to right, hsl(${color.hsl.h},0%,${color.hsl.l}%), hsl(${color.hsl.h},100%,${color.hsl.l}%))`
                : `linear-gradient(to right, #000, hsl(${color.hsl.h},${color.hsl.s}%,50%), #fff)`;

            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-[9px] font-black w-4" style={{ color: textColor, opacity: 0.5 }}>{labels[key]}</span>
                <input
                  type="range"
                  min={0}
                  max={max}
                  value={color.hsl[key]}
                  onChange={(e) => updateColorHsl(color.role, { [key]: Number(e.target.value) })}
                  className="flex-1 color-slider cursor-pointer"
                  style={{ background: trackGradient }}
                />
                <span className="text-[9px] font-mono w-7 text-right" style={{ color: textColor, opacity: 0.5 }}>{color.hsl[key]}</span>
              </div>
            );
          })}
          
          {/* Hex Input & Native Color Picker Swatch */}
          <div className="relative flex items-center mt-1">
            <input
              type="text"
              key={color.hex}
              defaultValue={color.hex}
              onBlur={(e) => updateColorHex(color.role, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") updateColorHex(color.role, (e.target as HTMLInputElement).value); }}
              className="w-full text-[10px] font-mono bg-black/20 rounded-lg pl-8 pr-2 py-1.5 focus:outline-none focus:bg-black/30 border border-white/5"
              style={{ color: textColor }}
              onClick={(e) => e.stopPropagation()}
            />
            <div 
              className="absolute left-2 w-4 h-4 rounded overflow-hidden border border-black/20 cursor-pointer flex items-center justify-center shadow-sm"
              title="Open color picker"
            >
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateColorHex(color.role, e.target.value)}
                className="absolute scale-[2.5] cursor-pointer w-full h-full border-none p-0 bg-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
