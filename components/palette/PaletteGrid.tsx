"use client";
import { usePaletteStore } from "@/store/palette";
import ColorCard from "./ColorCard";

export default function PaletteGrid() {
  const { palette } = usePaletteStore();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
      {palette.map((color) => (
        <ColorCard key={color.role} color={color} />
      ))}
    </div>
  );
}
