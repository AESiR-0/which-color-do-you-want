"use client";

import { usePaletteStore } from "@/store/palette";
import { TASTE_IDENTITIES, type TasteIdentityId } from "@/lib/taste-engine";

const ICONS: Record<TasteIdentityId, string> = {
  "brutalist-saas": "⬛",
  "luxury-editorial": "◇",
  "ai-startup": "◉",
  "neo-banking": "▣",
  "streetwear-bold": "★",
};

export default function TasteSelector() {
  const { identity: current, setIdentity } = usePaletteStore();

  return (
    <div className="flex gap-1.5 flex-wrap">
      {(Object.values(TASTE_IDENTITIES)).map((data) => {
        const isActive = current.id === data.id;
        return (
          <button
            key={data.id}
            onClick={() => setIdentity(data)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border whitespace-nowrap
              ${isActive
                ? "bg-white text-black border-white shadow-lg scale-[1.03]"
                : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 bg-white/5"
              }
            `}
          >
            <span className="text-[9px]">{ICONS[data.id]}</span>
            {data.label}
          </button>
        );
      })}
    </div>
  );
}
