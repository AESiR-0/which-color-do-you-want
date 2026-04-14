"use client";

import { useEffect, useState, useRef } from "react";
import FortuneTellerSVG from "./FortuneTellerSVG";

const COLORS = [
  { name: "Red",    bg: "#FF3B30", text: "#fff",     shadow: "rgba(255,59,48,0.6)"   },
  { name: "Blue",   bg: "#007AFF", text: "#fff",     shadow: "rgba(0,122,255,0.6)"   },
  { name: "Yellow", bg: "#FFD60A", text: "#1a1a1a",  shadow: "rgba(255,214,10,0.6)"  },
  { name: "Green",  bg: "#30D158", text: "#fff",     shadow: "rgba(48,209,88,0.6)"   },
];

const CHANT = ["Tipi", "Tipi", "Top...", "What", "colour", "do", "you", "want?"];
const EMOJIS = ["🎨", "🌈", "✨", "🎯", "🎪", "🎠", "🌟", "💫", "🎉", "🎊"];

function randomEmoji() {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

interface Props {
  onDone: () => void;
}

export default function TipiLoader({ onDone }: Props) {
  const [phase, setPhase] = useState<"chant" | "pick" | "chosen" | "done">("chant");
  const [chantIndex, setChantIndex] = useState(0);
  const [chosenColor, setChosenColor] = useState<(typeof COLORS)[0] | null>(null);
  const [burstEmojis, setBurstEmojis] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);
  const [colorFlash, setColorFlash] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [fortuneOpen, setFortuneOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const emojiId = useRef(0);

  // Chant animation — word by word
  useEffect(() => {
    if (phase !== "chant") return;
    if (chantIndex < CHANT.length) {
      const delay = chantIndex === 0 ? 500 : chantIndex < 3 ? 300 : 230;
      timerRef.current = setTimeout(() => setChantIndex((i) => i + 1), delay);
    } else {
      timerRef.current = setTimeout(() => {
        setPhase("pick");
        setFortuneOpen(true);
      }, 450);
    }
    return () => clearTimeout(timerRef.current);
  }, [phase, chantIndex]);

  function handlePickColor(color: (typeof COLORS)[0]) {
    setChosenColor(color);
    setPhase("chosen");
    setColorFlash(color.bg);
    const bursts = Array.from({ length: 20 }, () => ({
      id: emojiId.current++,
      emoji: randomEmoji(),
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setBurstEmojis(bursts);
    setTimeout(() => { setPhase("done"); setTimeout(onDone, 500); }, 2000);
  }

  const orbs = [
    { color: "#FF3B30", size: 260, left: "-5%",  top: "-5%",  delay: 0   },
    { color: "#007AFF", size: 200, left: "68%",  top: "-5%",  delay: 0.5 },
    { color: "#FFD60A", size: 180, left: "60%",  top: "62%",  delay: 0.9 },
    { color: "#30D158", size: 220, left: "-5%",  top: "62%",  delay: 1.3 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: colorFlash
          ? colorFlash
          : "linear-gradient(145deg, #0d0d16 0%, #12121e 50%, #0d0d16 100%)",
        transition: "background 0.45s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* ── Ambient colour orbs ── */}
      {!colorFlash && orbs.map((orb, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size, height: orb.size,
            left: orb.left, top: orb.top,
            background: orb.color,
            opacity: 0.11,
            filter: "blur(70px)",
            animation: `orb-pulse ${3.2 + i * 0.4}s ease-in-out ${orb.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* ── Emoji burst ── */}
      {burstEmojis.map((e) => (
        <div key={e.id} className="absolute text-3xl pointer-events-none"
          style={{ left: `${e.x}%`, top: `${e.y}%`, animation: "burst-fly 1.5s ease-out forwards", zIndex: 60 }}>
          {e.emoji}
        </div>
      ))}

      {/* ── Main fortune teller SVG — centre stage ── */}
      {(phase === "chant" || phase === "pick") && (
        <div
          className="absolute"
          style={{
            animation: fortuneOpen
              ? "fortune-open 0.7s cubic-bezier(0.34,1.56,0.64,1) both"
              : "fortune-idle 0.6s ease both",
            zIndex: 5,
          }}
        >
          <FortuneTellerSVG
            size={340}
            animate={false}
            activeColor={hoveredColor}
          />
        </div>
      )}

      {/* ── Content overlay ── */}
      <div className="relative z-10 flex flex-col items-center w-full px-6 max-w-lg" style={{ gap: 0 }}>

        {/* Chant words */}
        {(phase === "chant" || phase === "pick") && (
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0 min-h-[72px] mt-[260px]">
            {CHANT.slice(0, chantIndex).map((word, i) => (
              <span key={i} className="font-black inline-block"
                style={{
                  fontSize:
                    word === "colour" ? "clamp(2rem,7vw,3.5rem)" :
                    word === "What"   ? "clamp(1.8rem,6vw,3rem)" :
                    "clamp(1.6rem,5vw,2.6rem)",
                  color: word === "colour" ? "#FFD60A" : "rgba(255,255,255,0.95)",
                  textShadow: "0 3px 20px rgba(0,0,0,0.6)",
                  animation: "word-pop 0.28s cubic-bezier(0.34,1.56,0.64,1) both",
                  letterSpacing: word === "Tipi" ? "0.06em" : "normal",
                }}
              >
                {word}
              </span>
            ))}
          </div>
        )}

        {/* Pick prompt + colour buttons */}
        {phase === "pick" && (
          <div className="mt-5 flex flex-col items-center gap-4" style={{ animation: "fade-rise 0.45s ease both" }}>
            <p className="text-white/40 text-xs tracking-[0.25em] uppercase font-semibold">
              pick a colour
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              {COLORS.map((color) => {
                const hovered = hoveredColor === color.name;
                return (
                  <button key={color.name}
                    onClick={() => handlePickColor(color)}
                    onMouseEnter={() => setHoveredColor(color.name)}
                    onMouseLeave={() => setHoveredColor(null)}
                    className="relative font-black text-base rounded-2xl active:scale-90 transition-all duration-200"
                    style={{
                      backgroundColor: color.bg,
                      color: color.text,
                      padding: "13px 26px",
                      minWidth: 90,
                      boxShadow: hovered
                        ? `0 0 0 3px white, 0 0 36px 8px ${color.shadow}, 0 6px 24px ${color.shadow}`
                        : `0 3px 16px ${color.shadow}`,
                      transform: hovered ? "translateY(-5px) scale(1.07)" : "none",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span className="absolute -top-1.5 -right-1.5 text-lg leading-none"
                      style={{ animation: "dot-wiggle 1.1s ease-in-out infinite" }}>
                      ●
                    </span>
                    {color.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Chosen reveal */}
        {phase === "chosen" && chosenColor && (
          <div className="flex flex-col items-center gap-3" style={{ animation: "scale-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <div className="text-7xl" style={{ animation: "spin-in 0.55s ease both" }}>🎨</div>
            <h2 className="font-black text-white" style={{ fontSize: "clamp(3rem,10vw,5.5rem)", textShadow: "0 4px 40px rgba(0,0,0,0.3)" }}>
              {chosenColor.name}!
            </h2>
            <p className="text-white/65 text-lg font-medium">
              Go find something <strong>{chosenColor.name.toLowerCase()}</strong>…
            </p>
          </div>
        )}

        {phase === "done" && (
          <div className="text-5xl" style={{ animation: "fade-out 0.5s ease both" }}>✨</div>
        )}
      </div>

      {/* ── Bouncing dots (during chant) ── */}
      {phase === "chant" && (
        <div className="absolute top-8 flex gap-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/40"
              style={{ animation: `dot-bounce 0.9s ease-in-out ${i * 0.14}s infinite alternate` }} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes orb-pulse {
          from { transform: scale(1); opacity: 0.09; }
          to   { transform: scale(1.35); opacity: 0.17; }
        }
        @keyframes word-pop {
          0%   { opacity: 0; transform: scale(0.3) rotate(-8deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes fade-rise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dot-bounce {
          from { transform: translateY(0); }
          to   { transform: translateY(-10px); }
        }
        @keyframes dot-wiggle {
          0%,100% { transform: rotate(-18deg) scale(1); }
          50%     { transform: rotate(18deg) scale(1.3); }
        }
        @keyframes scale-pop {
          0%   { opacity: 0; transform: scale(0.3); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes spin-in {
          0%   { transform: scale(0) rotate(-200deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes fade-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes burst-fly {
          0%   { opacity: 1; transform: scale(0.5) translateY(0); }
          60%  { opacity: 0.9; transform: scale(1.4) translateY(-50px); }
          100% { opacity: 0; transform: scale(0.7) translateY(-90px); }
        }
        @keyframes fortune-idle {
          from { opacity: 0; transform: scale(0.85) rotate(-5deg); }
          to   { opacity: 0.25; transform: scale(1) rotate(0deg); }
        }
        @keyframes fortune-open {
          0%   { opacity: 0.25; transform: scale(0.85) rotate(-5deg); }
          60%  { transform: scale(1.06) rotate(4deg); opacity: 0.9; }
          100% { transform: scale(1) rotate(0deg); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
