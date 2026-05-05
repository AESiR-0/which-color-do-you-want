"use client";

import { usePaletteStore } from "@/store/palette";
import { TASTE_IDENTITIES, type TasteIdentityId, type Typography } from "@/lib/taste-engine";

const FONT_PAIRINGS: { label: string; pairing: Typography }[] = [
  { label: "Inter + Inter", pairing: { heading: "Inter", body: "Inter" } },
  { label: "Playfair + Inter", pairing: { heading: "Playfair Display", body: "Inter" } },
  { label: "Space + Inter", pairing: { heading: "Space Grotesk", body: "Inter" } },
  { label: "Outfit + Inter", pairing: { heading: "Outfit", body: "Inter" } },
  { label: "Archivo + Inter", pairing: { heading: "Archivo Black", body: "Inter" } },
  { label: "Plus Jakarta + Inter", pairing: { heading: "Plus Jakarta Sans", body: "Inter" } },
  { label: "DM Serif + DM Sans", pairing: { heading: "DM Serif Display", body: "DM Sans" } },
  { label: "Fraunces + Lato", pairing: { heading: "Fraunces", body: "Lato" } },
];

export default function FontSelector() {
  const { identity, setIdentity } = usePaletteStore();

  const setCurrent = (pairing: Typography) => {
    setIdentity({ ...identity, typography: pairing });
  };

  const isActive = (p: Typography) =>
    p.heading === identity.typography.heading && p.body === identity.typography.body;

  return (
    <div className="flex gap-1.5 flex-wrap">
      {FONT_PAIRINGS.map(({ label, pairing }) => (
        <button
          key={label}
          onClick={() => setCurrent(pairing)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border whitespace-nowrap
            ${isActive(pairing)
              ? "bg-white text-black border-white shadow-lg scale-[1.03]"
              : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 bg-white/5"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
