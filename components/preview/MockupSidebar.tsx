"use client";

import { useState } from "react";
import { usePaletteStore } from "@/store/palette";

type MockupType = "logo" | "tshirt" | "mug" | "hoodie" | "card" | "tote";

const MOCKUP_OPTIONS: { value: MockupType; label: string; icon: string }[] = [
  { value: "logo", label: "Logo", icon: "◉" },
  { value: "card", label: "Card", icon: "▮" },
  { value: "tshirt", label: "T-Shirt", icon: "⊤" },
  { value: "hoodie", label: "Hoodie", icon: "⊓" },
  { value: "mug", label: "Mug", icon: "☕" },
  { value: "tote", label: "Tote", icon: "⊡" },
];

function LogoMockup({ primary, secondary, accent, bg, text }: Record<string, string>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Light bg */}
      <div className="rounded-xl p-4 flex flex-col items-center justify-center gap-2 border border-white/10" style={{ backgroundColor: "#fff" }}>
        <svg width="36" height="36" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill={primary} />
          <circle cx="24" cy="24" r="12" fill={secondary} opacity="0.6" />
          <circle cx="24" cy="24" r="5" fill={accent} />
        </svg>
        <div className="text-center">
          <div className="text-[8px] font-black tracking-widest" style={{ color: primary }}>BRANDNAME</div>
          <div className="text-[6px] tracking-widest opacity-50" style={{ color: text }}>TAGLINE HERE</div>
        </div>
      </div>

      {/* Dark bg */}
      <div className="rounded-xl p-4 flex flex-col items-center justify-center gap-2 border border-white/10" style={{ backgroundColor: "#111" }}>
        <svg width="36" height="36" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill={primary} />
          <circle cx="24" cy="24" r="12" fill={secondary} opacity="0.6" />
          <circle cx="24" cy="24" r="5" fill={accent} />
        </svg>
        <div className="text-center">
          <div className="text-[8px] font-black tracking-widest" style={{ color: primary }}>BRANDNAME</div>
          <div className="text-[6px] tracking-widest text-white/40">TAGLINE HERE</div>
        </div>
      </div>

      {/* Brand color bg */}
      <div className="rounded-xl p-4 flex flex-col items-center justify-center gap-2 border border-white/10" style={{ backgroundColor: primary }}>
        <svg width="36" height="36" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="#fff" opacity="0.9" />
          <circle cx="24" cy="24" r="12" fill={secondary} opacity="0.6" />
          <circle cx="24" cy="24" r="5" fill={accent} />
        </svg>
        <div className="text-center">
          <div className="text-[8px] font-black tracking-widest text-white">BRANDNAME</div>
          <div className="text-[6px] tracking-widest text-white/50">TAGLINE HERE</div>
        </div>
      </div>

      {/* Monochrome */}
      <div className="rounded-xl p-4 flex flex-col items-center justify-center gap-2 border border-white/10" style={{ backgroundColor: bg }}>
        <svg width="36" height="36" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill={text} opacity="0.8" />
          <circle cx="24" cy="24" r="12" fill={text} opacity="0.3" />
          <circle cx="24" cy="24" r="5" fill={text} opacity="0.6" />
        </svg>
        <div className="text-center">
          <div className="text-[8px] font-black tracking-widest" style={{ color: text }}>BRANDNAME</div>
          <div className="text-[6px] tracking-widest" style={{ color: text, opacity: 0.4 }}>TAGLINE HERE</div>
        </div>
      </div>
    </div>
  );
}

function TshirtMockup({ primary, secondary, accent }: Record<string, string>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { shirtColor: "#fff", logoColor: primary, label: "White" },
        { shirtColor: "#1a1a1a", logoColor: primary, label: "Black" },
        { shirtColor: primary, logoColor: "#fff", label: "Brand" },
        { shirtColor: secondary, logoColor: accent, label: "Alt" },
      ].map(({ shirtColor, logoColor, label }) => (
        <div key={label} className="rounded-xl border border-white/10 p-3 flex flex-col items-center gap-1.5" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
          <svg width="64" height="70" viewBox="0 0 100 110">
            {/* T-shirt shape */}
            <path d="M25,0 L0,20 L15,25 L15,110 L85,110 L85,25 L100,20 L75,0 L65,10 C60,15 40,15 35,10 Z"
              fill={shirtColor} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Logo on chest */}
            <circle cx="50" cy="50" r="12" fill={logoColor} opacity="0.9" />
            <circle cx="50" cy="50" r="7" fill={logoColor === "#fff" ? shirtColor : "#fff"} opacity="0.4" />
          </svg>
          <span className="text-[7px] text-white/30 uppercase tracking-widest font-bold">{label}</span>
        </div>
      ))}
    </div>
  );
}

function MugMockup({ primary, secondary, accent, bg }: Record<string, string>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { mugColor: "#fff", labelColor: primary, bandColor: secondary, label: "White" },
        { mugColor: "#222", labelColor: primary, bandColor: accent, label: "Black" },
        { mugColor: primary, labelColor: "#fff", bandColor: secondary, label: "Brand" },
        { mugColor: bg, labelColor: primary, bandColor: accent, label: "Custom" },
      ].map(({ mugColor, labelColor, bandColor, label }) => (
        <div key={label} className="rounded-xl border border-white/10 p-3 flex flex-col items-center gap-1.5" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
          <svg width="56" height="60" viewBox="0 0 80 85">
            {/* Mug body */}
            <rect x="10" y="8" width="45" height="60" rx="4" fill={mugColor} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Handle */}
            <path d="M55,25 C70,25 70,55 55,55" fill="none" stroke={mugColor} strokeWidth="6" />
            <path d="M55,25 C68,25 68,55 55,55" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Band */}
            <rect x="10" y="30" width="45" height="8" fill={bandColor} opacity="0.7" />
            {/* Logo text */}
            <circle cx="32" cy="45" r="8" fill={labelColor} opacity="0.8" />
            {/* Rim */}
            <rect x="10" y="5" width="45" height="5" rx="2" fill={mugColor} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          </svg>
          <span className="text-[7px] text-white/30 uppercase tracking-widest font-bold">{label}</span>
        </div>
      ))}
    </div>
  );
}

function HoodieMockup({ primary, secondary, accent }: Record<string, string>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { color: "#2a2a2a", logoColor: primary, label: "Charcoal" },
        { color: "#fff", logoColor: primary, label: "White" },
        { color: primary, logoColor: "#fff", label: "Brand" },
        { color: secondary, logoColor: accent, label: "Alt" },
      ].map(({ color, logoColor, label }) => (
        <div key={label} className="rounded-xl border border-white/10 p-3 flex flex-col items-center gap-1.5" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
          <svg width="64" height="70" viewBox="0 0 100 110">
            {/* Hood */}
            <path d="M30,15 C30,0 70,0 70,15" fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Body */}
            <path d="M15,25 L10,45 L20,45 L20,110 L80,110 L80,45 L90,45 L85,25 L70,15 C60,22 40,22 30,15 Z"
              fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Pocket */}
            <rect x="30" y="70" width="40" height="18" rx="3" fill="rgba(0,0,0,0.08)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            {/* Drawstrings */}
            <line x1="42" y1="20" x2="42" y2="38" stroke={logoColor} strokeWidth="1" opacity="0.3" />
            <line x1="58" y1="20" x2="58" y2="38" stroke={logoColor} strokeWidth="1" opacity="0.3" />
            {/* Logo */}
            <circle cx="50" cy="50" r="10" fill={logoColor} opacity="0.85" />
          </svg>
          <span className="text-[7px] text-white/30 uppercase tracking-widest font-bold">{label}</span>
        </div>
      ))}
    </div>
  );
}

function BusinessCardMockup({ primary, secondary, accent, bg, text, surface }: Record<string, string>) {
  return (
    <div className="space-y-2">
      {/* Front */}
      <div className="rounded-xl overflow-hidden border border-white/10">
        <div className="px-4 py-1 bg-white/5">
          <span className="text-[7px] text-white/20 uppercase tracking-widest font-bold">Front</span>
        </div>
        <div className="aspect-[1.75/1] p-4 flex flex-col justify-between" style={{ backgroundColor: "#fff" }}>
          <div className="flex items-start justify-between">
            <svg width="24" height="24" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill={primary} />
              <circle cx="24" cy="24" r="10" fill={secondary} opacity="0.5" />
            </svg>
            <div className="text-right">
              <div className="text-[7px] font-black tracking-widest" style={{ color: primary }}>BRANDNAME</div>
            </div>
          </div>
          <div>
            <div className="text-[9px] font-bold" style={{ color: text }}>Jane Doe</div>
            <div className="text-[7px]" style={{ color: text, opacity: 0.5 }}>Creative Director</div>
            <div className="flex gap-2 mt-1">
              <div className="text-[6px]" style={{ color: primary }}>jane@brand.com</div>
              <div className="text-[6px]" style={{ color: primary }}>+1 234 567 890</div>
            </div>
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="rounded-xl overflow-hidden border border-white/10">
        <div className="px-4 py-1 bg-white/5">
          <span className="text-[7px] text-white/20 uppercase tracking-widest font-bold">Back</span>
        </div>
        <div className="aspect-[1.75/1] flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: primary }}>
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute rounded-full" style={{
                width: 30 + i * 20,
                height: 30 + i * 20,
                border: `1px solid ${accent}`,
                left: `${50 + i * 5}%`,
                top: `${50 - i * 8}%`,
                transform: "translate(-50%, -50%)",
              }} />
            ))}
          </div>
          <svg width="40" height="40" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="#fff" opacity="0.9" />
            <circle cx="24" cy="24" r="12" fill={secondary} opacity="0.5" />
            <circle cx="24" cy="24" r="5" fill={accent} />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ToteBagMockup({ primary, secondary, accent }: Record<string, string>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { bagColor: "#f5f0e8", logoColor: primary, label: "Natural" },
        { bagColor: "#1a1a1a", logoColor: primary, label: "Black" },
        { bagColor: primary, logoColor: "#fff", label: "Brand" },
        { bagColor: "#fff", logoColor: secondary, label: "White" },
      ].map(({ bagColor, logoColor, label }) => (
        <div key={label} className="rounded-xl border border-white/10 p-3 flex flex-col items-center gap-1.5" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
          <svg width="56" height="70" viewBox="0 0 80 100">
            {/* Handles */}
            <path d="M25,5 C25,-5 40,-5 40,5" fill="none" stroke={bagColor === "#1a1a1a" ? "#444" : "#999"} strokeWidth="2" />
            <path d="M40,5 C40,-5 55,-5 55,5" fill="none" stroke={bagColor === "#1a1a1a" ? "#444" : "#999"} strokeWidth="2" />
            {/* Bag body */}
            <rect x="10" y="5" width="60" height="90" rx="3" fill={bagColor} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Logo */}
            <circle cx="40" cy="40" r="14" fill={logoColor} opacity="0.85" />
            <circle cx="40" cy="40" r="8" fill={logoColor === "#fff" ? bagColor : "#fff"} opacity="0.3" />
            {/* Text */}
            <rect x="22" y="62" width="36" height="3" rx="1" fill={logoColor} opacity="0.4" />
            <rect x="28" y="68" width="24" height="2" rx="1" fill={logoColor} opacity="0.2" />
          </svg>
          <span className="text-[7px] text-white/30 uppercase tracking-widest font-bold">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function MockupSidebar() {
  const { palette } = usePaletteStore();
  const [activeMockup, setActiveMockup] = useState<MockupType>("logo");

  const get = (role: string) => palette.find((c) => c.role === role)?.hex ?? "#888";
  const colors = {
    primary: get("primary"),
    secondary: get("secondary"),
    accent: get("accent"),
    bg: get("background"),
    text: get("text"),
    surface: get("surface"),
  };

  const renderMockup = () => {
    switch (activeMockup) {
      case "logo": return <LogoMockup {...colors} />;
      case "tshirt": return <TshirtMockup {...colors} />;
      case "mug": return <MugMockup {...colors} />;
      case "hoodie": return <HoodieMockup {...colors} />;
      case "card": return <BusinessCardMockup {...colors} />;
      case "tote": return <ToteBagMockup {...colors} />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Mockup type selector */}
      <div className="flex flex-wrap gap-1">
        {MOCKUP_OPTIONS.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => setActiveMockup(value)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[9px] font-bold transition-all ${
              activeMockup === value
                ? "bg-white text-black shadow-lg"
                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 border border-white/5"
            }`}
          >
            <span className="text-[10px]">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Active mockup */}
      <div className="animate-in fade-in duration-200">
        {renderMockup()}
      </div>
    </div>
  );
}
