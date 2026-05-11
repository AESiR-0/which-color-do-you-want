"use client";

import { useState, type ReactNode } from "react";
import { useLayoutStore, type PanelId, type DockZone } from "@/store/layout";

interface Props {
  id: PanelId;
  children: ReactNode;
}

const ZONE_OPTIONS: { value: DockZone; label: string }[] = [
  { value: "left", label: "← Left" },
  { value: "right", label: "→ Right" },
  { value: "top", label: "↑ Top" },
  { value: "bottom", label: "↓ Bottom" },
];

export default function Panel({ id, children }: Props) {
  const { panels, togglePanel, movePanel, reorderPanel } = useLayoutStore();
  const panel = panels.find((p) => p.id === id);
  const [showMenu, setShowMenu] = useState(false);

  if (!panel) return null;

  const zoneItems = panels.filter((p) => p.zone === panel.zone).sort((a, b) => a.order - b.order);
  const idx = zoneItems.findIndex((p) => p.id === id);
  const canMoveUp = idx > 0;
  const canMoveDown = idx < zoneItems.length - 1;

  return (
    <div className="border-b border-white/5 last:border-0">
      {/* Header */}
      <div
        className="flex items-center gap-1 px-3 py-2 cursor-pointer select-none hover:bg-white/3 transition-colors group"
        onClick={() => togglePanel(id)}
      >
        <svg
          className={`w-2.5 h-2.5 text-white/25 transition-transform flex-shrink-0 ${
            panel.collapsed ? "" : "rotate-90"
          }`}
          viewBox="0 0 8 8"
          fill="currentColor"
        >
          <path d="M2 1l4 3-4 3z" />
        </svg>
        <span className="text-[9px] text-white/40 font-black uppercase tracking-[0.18em] flex-1 truncate">
          {panel.label}
        </span>

        {/* Context menu trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-white/50 transition-all p-0.5"
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Context menu */}
      {showMenu && (
        <div
          className="mx-2 mb-2 bg-zinc-800 border border-white/10 rounded-lg shadow-xl overflow-hidden"
          onMouseLeave={() => setShowMenu(false)}
        >
          {canMoveUp && (
            <button
              onClick={() => { reorderPanel(id, "up"); setShowMenu(false); }}
              className="w-full text-left px-3 py-1.5 text-[10px] text-white/50 hover:bg-white/5 hover:text-white/80"
            >
              ↑ Move Up
            </button>
          )}
          {canMoveDown && (
            <button
              onClick={() => { reorderPanel(id, "down"); setShowMenu(false); }}
              className="w-full text-left px-3 py-1.5 text-[10px] text-white/50 hover:bg-white/5 hover:text-white/80"
            >
              ↓ Move Down
            </button>
          )}
          <div className="border-t border-white/5 my-0.5" />
          <p className="px-3 py-1 text-[8px] text-white/20 uppercase tracking-widest">Move to</p>
          {ZONE_OPTIONS.filter((z) => z.value !== panel.zone).map((z) => (
            <button
              key={z.value}
              onClick={() => { movePanel(id, z.value); setShowMenu(false); }}
              className="w-full text-left px-3 py-1.5 text-[10px] text-white/50 hover:bg-white/5 hover:text-white/80"
            >
              {z.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {!panel.collapsed && (
        <div className="px-3 pb-3 pt-0.5">
          {children}
        </div>
      )}
    </div>
  );
}
