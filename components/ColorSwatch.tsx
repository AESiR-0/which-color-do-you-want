"use client";
import { HSLColor } from "@/lib/colorEngine";

interface Props {
  role: string;
  color: HSLColor;
  locked: boolean;
  onToggleLock: () => void;
  onColorChange: (partial: Partial<HSLColor>) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

export default function ColorSwatch({
  role,
  color,
  locked,
  onToggleLock,
  onColorChange,
  expanded,
  onToggleExpand,
}: Props) {
  const label = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div
      className="rounded-xl overflow-hidden border border-slate-200 mb-2 shadow-sm"
      style={{ background: "#fff" }}
    >
      {/* Top swatch bar */}
      <div
        className="h-12 cursor-pointer flex items-center justify-between px-3"
        style={{ background: color.hex }}
        onClick={onToggleExpand}
      >
        <span
          className="text-xs font-semibold tracking-wide uppercase"
          style={{
            color: color.l > 55 ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.85)",
          }}
        >
          {label}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{
              background: locked ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.2)",
            }}
            title={locked ? "Unlock" : "Lock"}
          >
            {locked ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
            )}
          </button>
          <span
            className="text-xs font-mono"
            style={{
              color: color.l > 55 ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)",
            }}
          >
            {color.hex.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Expanded controls */}
      {expanded && (
        <div className="p-3 bg-slate-50 space-y-2">
          {(["h", "s", "l"] as const).map((key) => {
            const labels = { h: "Hue", s: "Saturation", l: "Lightness" };
            const maxes = { h: 360, s: 100, l: 100 };
            const trackColor =
              key === "h"
                ? `linear-gradient(to right, hsl(0,80%,50%), hsl(60,80%,50%), hsl(120,80%,50%), hsl(180,80%,50%), hsl(240,80%,50%), hsl(300,80%,50%), hsl(360,80%,50%))`
                : key === "s"
                ? `linear-gradient(to right, hsl(${color.h},0%,${color.l}%), hsl(${color.h},100%,${color.l}%))`
                : `linear-gradient(to right, hsl(${color.h},${color.s}%,0%), hsl(${color.h},${color.s}%,50%), hsl(${color.h},${color.s}%,100%))`;

            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-slate-500 w-16">{labels[key]}</span>
                <input
                  type="range"
                  min={0}
                  max={maxes[key]}
                  value={color[key]}
                  disabled={locked}
                  style={{ background: trackColor, flex: 1 }}
                  onChange={(e) => onColorChange({ [key]: Number(e.target.value) })}
                  className="disabled:opacity-40"
                />
                <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{color[key]}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] font-medium text-slate-500 w-16">HEX</span>
            <input
              type="text"
              value={color.hex.toUpperCase()}
              disabled={locked}
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
                  const { h, s, l } = require("@/lib/colorEngine").hexToHsl(v);
                  onColorChange({ h, s, l, hex: v.toLowerCase() });
                }
              }}
              className="flex-1 text-[11px] font-mono border border-slate-200 rounded px-2 py-1 bg-white disabled:opacity-40"
              placeholder="#000000"
            />
          </div>
        </div>
      )}
    </div>
  );
}
