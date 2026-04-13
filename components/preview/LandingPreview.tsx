"use client";

import { usePaletteStore } from "@/store/palette";

export default function LandingPreview() {
  const { palette } = usePaletteStore();
  const get = (role: string) => palette.find((c) => c.role === role)?.hex ?? "#fff";

  const bg = get("background");
  const primary = get("primary");
  const secondary = get("secondary");
  const accent = get("accent");
  const text = get("text");
  const surface = get("surface");

  return (
    <div className="transition-all duration-300 text-center" style={{ backgroundColor: bg, minHeight: 340 }}>
      {/* Hero */}
      <div className="px-8 py-10">
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block"
          style={{ backgroundColor: accent + "22", color: accent }}
        >
          New — v2.0 is here
        </span>
        <h1 className="text-3xl font-extrabold mb-2 leading-tight" style={{ color: text }}>
          Design without<br />
          <span style={{ color: primary }}>limits.</span>
        </h1>
        <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: text, opacity: 0.5 }}>
          The creative platform for modern teams. Ship faster, look better.
        </p>
        <div className="flex justify-center gap-3">
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg" style={{ backgroundColor: primary }}>
            Get started free
          </button>
          <button
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border"
            style={{ borderColor: text + "22", color: text }}
          >
            See demo
          </button>
        </div>
      </div>
      {/* Feature pills */}
      <div className="flex justify-center gap-2 pb-6 flex-wrap px-4">
        {["Fast", "Accessible", "Customizable", "Open Source"].map((f) => (
          <span
            key={f}
            className="px-3 py-1 rounded-full text-xs border"
            style={{ borderColor: secondary + "44", color: secondary }}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
