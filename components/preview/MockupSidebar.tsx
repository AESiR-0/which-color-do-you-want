"use client";

import { usePaletteStore, type PreviewMode } from "@/store/palette";

const PREVIEW_MODES: { value: PreviewMode; label: string; icon: string }[] = [
  { value: "landing", label: "Landing", icon: "🌐" },
  { value: "light-ui", label: "Light UI", icon: "☀️" },
  { value: "dark-ui", label: "Dark UI", icon: "🌙" },
  { value: "dashboard", label: "Dashboard", icon: "📊" },
];

function DeviceFrame({
  type,
  children,
  label,
  active,
  onClick,
}: {
  type: "phone" | "tablet" | "laptop";
  children: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const dims = {
    phone: { w: "w-[72px]", h: "h-[130px]", radius: "rounded-xl", bezel: "p-[3px]" },
    tablet: { w: "w-[110px]", h: "h-[80px]", radius: "rounded-lg", bezel: "p-[3px]" },
    laptop: { w: "w-full", h: "h-[80px]", radius: "rounded-t-lg", bezel: "p-[2px]" },
  };
  const d = dims[type];

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all ${
        active ? "scale-[1.03]" : "opacity-60 hover:opacity-90"
      }`}
    >
      <div
        className={`${d.w} ${d.h} ${d.radius} ${d.bezel} bg-zinc-700 border-2 overflow-hidden flex-shrink-0 ${
          active ? "border-white/40 shadow-lg shadow-white/5" : "border-zinc-600"
        }`}
      >
        <div className={`w-full h-full ${d.radius} overflow-hidden bg-zinc-900`}>
          {children}
        </div>
      </div>
      {type === "laptop" && (
        <div
          className={`w-[120%] h-[6px] rounded-b-lg -mt-1.5 ${
            active ? "bg-zinc-600" : "bg-zinc-700"
          }`}
        />
      )}
      <span className="text-[8px] text-white/30 font-bold uppercase tracking-widest">
        {label}
      </span>
    </button>
  );
}

function MiniPreview({ mode }: { mode: PreviewMode }) {
  const { palette } = usePaletteStore();
  const get = (role: string) =>
    palette.find((c) => c.role === role)?.hex ?? "#888";
  const bg = get("background");
  const primary = get("primary");
  const secondary = get("secondary");
  const surface = get("surface");
  const text = get("text");

  // Super simplified miniature versions
  if (mode === "dark-ui") {
    return (
      <div className="w-full h-full p-1" style={{ backgroundColor: "#18181b" }}>
        <div className="w-2 h-2 rounded-sm mb-1" style={{ backgroundColor: primary }} />
        <div className="flex gap-0.5 mb-1">
          <div className="flex-1 h-3 rounded-sm" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
          <div className="flex-1 h-3 rounded-sm bg-white/5" />
        </div>
        <div className="flex gap-0.5">
          <div className="flex-1 h-1.5 rounded-sm" style={{ backgroundColor: primary }} />
          <div className="flex-1 h-1.5 rounded-sm bg-white/10" />
        </div>
      </div>
    );
  }

  if (mode === "dashboard") {
    return (
      <div className="w-full h-full flex" style={{ backgroundColor: bg }}>
        <div className="w-3" style={{ backgroundColor: surface }} />
        <div className="flex-1 p-1">
          <div className="flex gap-0.5 items-end h-3 mb-1">
            {[40, 65, 55, 80, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-[1px]" style={{ height: `${h}%`, backgroundColor: i === 3 ? primary : secondary + "66" }} />
            ))}
          </div>
          <div className="flex gap-0.5">
            {[primary, secondary, surface].map((c, i) => (
              <div key={i} className="flex-1 h-2 rounded-[1px]" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "landing") {
    return (
      <div className="w-full h-full p-1 flex flex-col items-center justify-center" style={{ backgroundColor: bg }}>
        <div className="w-4 h-0.5 rounded-full mb-1" style={{ backgroundColor: primary + "33" }} />
        <div className="w-6 h-1 rounded-sm mb-0.5" style={{ backgroundColor: text }} />
        <div className="w-5 h-0.5 rounded-sm mb-1" style={{ backgroundColor: text, opacity: 0.3 }} />
        <div className="flex gap-0.5">
          <div className="w-3 h-1.5 rounded-[2px]" style={{ backgroundColor: primary }} />
          <div className="w-3 h-1.5 rounded-[2px] border" style={{ borderColor: text + "22" }} />
        </div>
      </div>
    );
  }

  // light-ui
  return (
    <div className="w-full h-full p-1" style={{ backgroundColor: bg }}>
      <div className="flex items-center justify-between mb-1">
        <div className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: primary }} />
        <div className="w-3 h-1 rounded-[1px]" style={{ backgroundColor: primary }} />
      </div>
      <div className="flex gap-0.5 mb-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-3 rounded-[1px]" style={{ backgroundColor: surface }} />
        ))}
      </div>
    </div>
  );
}

export default function MockupSidebar() {
  const { previewMode, setPreviewMode } = usePaletteStore();

  return (
    <div className="space-y-4">
      {/* Device frames for current preview */}
      <div>
        <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-black mb-2">
          Device Preview
        </p>
        <div className="flex gap-3 items-end justify-center">
          <DeviceFrame type="phone" label="Mobile" active={true} onClick={() => {}}>
            <MiniPreview mode={previewMode} />
          </DeviceFrame>
          <DeviceFrame type="laptop" label="Desktop" active={true} onClick={() => {}}>
            <MiniPreview mode={previewMode} />
          </DeviceFrame>
        </div>
      </div>

      {/* Thumbnail grid of all modes */}
      <div>
        <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-black mb-2">
          Preview Modes
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PREVIEW_MODES.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setPreviewMode(value)}
              className={`rounded-xl overflow-hidden border transition-all ${
                previewMode === value
                  ? "border-white/30 ring-1 ring-white/10 shadow-lg"
                  : "border-white/8 hover:border-white/15 opacity-70 hover:opacity-100"
              }`}
            >
              <div className="h-[50px] overflow-hidden">
                <MiniPreview mode={value} />
              </div>
              <div className="px-2 py-1.5 bg-white/5 flex items-center gap-1">
                <span className="text-[9px]">{icon}</span>
                <span className="text-[9px] font-bold text-white/50">{label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
