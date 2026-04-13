"use client";
import { SavedPalette, deletePaletteFromStorage } from "@/lib/colorEngine";

interface Props {
  palettes: SavedPalette[];
  onRestore: (p: SavedPalette) => void;
  onRefresh: () => void;
}

export default function SavedPalettes({ palettes, onRestore, onRefresh }: Props) {
  if (palettes.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-xs">
        No saved palettes yet.<br />Hit Save to store the current one.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
      {palettes.map((sp) => {
        const colors = Object.values(sp.palette);
        return (
          <div
            key={sp.id}
            className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-all bg-white group"
          >
            {/* Swatch strip */}
            <div className="flex rounded-lg overflow-hidden h-8 w-20 flex-shrink-0 border border-slate-100">
              {colors.map((c, i) => (
                <div key={i} style={{ background: c.hex, flex: 1 }} />
              ))}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-slate-700 truncate">
                {sp.name || `Palette #${sp.id.slice(0, 4)}`}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">
                {sp.meta.rule} · {sp.meta.contrast} contrast
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onRestore(sp)}
                className="text-[10px] font-medium px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-all"
              >
                Restore
              </button>
              <button
                onClick={() => {
                  deletePaletteFromStorage(sp.id);
                  onRefresh();
                }}
                className="text-[10px] font-medium px-2 py-1 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 transition-all"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
