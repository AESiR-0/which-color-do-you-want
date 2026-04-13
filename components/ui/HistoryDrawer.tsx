"use client";

import { useState } from "react";
import { usePaletteStore } from "@/store/palette";

export default function HistoryDrawer() {
  const { history, restoreHistory } = usePaletteStore();
  const [open, setOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs px-3 py-1.5 rounded-xl bg-white/8 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/15 transition-all"
      >
        History ({history.length})
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-30 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-3 w-72 max-h-80 overflow-y-auto">
          <p className="text-xs text-white/40 mb-2 px-1">Recent palettes</p>
          {history.map((entry) => (
            <button
              key={entry.id}
              onClick={() => { restoreHistory(entry.id); setOpen(false); }}
              className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors mb-1"
            >
              <div className="flex gap-0.5">
                {entry.palette.slice(0, 5).map((c) => (
                  <div key={c.role} className="w-5 h-5 rounded" style={{ backgroundColor: c.hex }} />
                ))}
              </div>
              <span className="text-xs text-white/40 ml-auto">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
