"use client";

import { useEffect, useState, useRef } from "react";

const COLORS = [
  { name: "Red", bg: "#FF3B30", text: "#fff", shadow: "rgba(255,59,48,0.6)" },
  { name: "Blue", bg: "#007AFF", text: "#fff", shadow: "rgba(0,122,255,0.6)" },
  { name: "Yellow", bg: "#FFD60A", text: "#1a1a1a", shadow: "rgba(255,214,10,0.6)" },
  { name: "Green", bg: "#30D158", text: "#fff", shadow: "rgba(48,209,88,0.6)" },
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
  const [burstEmojis, setBurstEmojis] = useState<{ id: number; emoji: string; x: number; y: number; rot: number }[]>([]);
  const [colorFlash, setColorFlash] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const emojiId = useRef(0);

  // Animate the chant word by word
  useEffect(() => {
    if (phase !== "chant") return;
    if (chantIndex < CHANT.length) {
      const delay = chantIndex === 0 ? 300 : chantIndex < 3 ? 280 : 220;
      timerRef.current = setTimeout(() => {
        setChantIndex((i) => i + 1);
      }, delay);
    } else {
      timerRef.current = setTimeout(() => setPhase("pick"), 400);
    }
    return () => clearTimeout(timerRef.current);
  }, [phase, chantIndex]);

  function handlePickColor(color: (typeof COLORS)[0]) {
    setChosenColor(color);
    setPhase("chosen");
    setColorFlash(color.bg);

    // Burst emojis
    const bursts = Array.from({ length: 18 }, (_, i) => ({
      id: emojiId.current++,
      emoji: randomEmoji(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      rot: Math.random() * 720 - 360,
    }));
    setBurstEmojis(bursts);

    setTimeout(() => {
      setPhase("done");
      setTimeout(onDone, 600);
    }, 1800);
  }

  // Floating background orbs
  const orbs = [
    { color: "#FF3B30", size: 220, x: -60, y: -60, delay: 0 },
    { color: "#007AFF", size: 180, x: "70%", y: -40, delay: 0.4 },
    { color: "#FFD60A", size: 150, x: "60%", y: "60%", delay: 0.8 },
    { color: "#30D158", size: 200, x: -30, y: "65%", delay: 1.2 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: colorFlash
          ? colorFlash
          : "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)",
        transition: "background 0.4s ease",
      }}
    >
      {/* Background orbs */}
      {!colorFlash && orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
            opacity: 0.12,
            filter: "blur(60px)",
            animation: `pulse-orb ${3 + i * 0.5}s ease-in-out ${orb.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Emoji burst */}
      {burstEmojis.map((e) => (
        <div
          key={e.id}
          className="absolute text-3xl pointer-events-none"
          style={{
            left: `${e.x}%`,
            top: `${e.y}%`,
            animation: `burst 1.4s ease-out forwards`,
            transform: `rotate(${e.rot}deg)`,
            zIndex: 60,
          }}
        >
          {e.emoji}
        </div>
      ))}

      <div className="relative z-10 text-center px-6 max-w-lg w-full">

        {/* Chant phase */}
        {(phase === "chant" || phase === "pick") && (
          <div className="space-y-6">
            {/* Bouncing dots header */}
            <div className="flex justify-center gap-2 mb-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-white"
                  style={{ animation: `bounce-dot 0.9s ease-in-out ${i * 0.15}s infinite alternate`, opacity: 0.6 }}
                />
              ))}
            </div>

            {/* The chant text */}
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 min-h-[80px] items-center">
              {CHANT.slice(0, chantIndex).map((word, i) => (
                <span
                  key={i}
                  className="font-black text-white"
                  style={{
                    fontSize: word === "What" ? "clamp(2rem,6vw,3.5rem)" : word === "colour" ? "clamp(2.4rem,7vw,4rem)" : "clamp(1.8rem,5vw,3rem)",
                    textShadow: "0 4px 24px rgba(0,0,0,0.5)",
                    animation: `pop-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both`,
                    display: "inline-block",
                    letterSpacing: word === "Tipi" ? "0.05em" : "normal",
                    color: word === "colour" ? "#FFD60A" : "white",
                  }}
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Color picker — fades in after chant */}
            {phase === "pick" && (
              <div
                className="space-y-4"
                style={{ animation: "fade-up 0.5s ease both" }}
              >
                <p className="text-white/50 text-sm tracking-widest uppercase font-medium">
                  pick one ↓
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handlePickColor(color)}
                      onMouseEnter={() => setHoveredColor(color.name)}
                      onMouseLeave={() => setHoveredColor(null)}
                      className="relative font-black text-lg rounded-2xl transition-all duration-200 active:scale-90"
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                        padding: "16px 28px",
                        boxShadow: hoveredColor === color.name
                          ? `0 0 0 4px white, 0 0 40px 10px ${color.shadow}, 0 8px 32px ${color.shadow}`
                          : `0 4px 20px ${color.shadow}`,
                        transform: hoveredColor === color.name ? "translateY(-6px) scale(1.08)" : "none",
                        letterSpacing: "0.03em",
                        minWidth: 100,
                      }}
                    >
                      {/* Wiggle dot */}
                      <span
                        className="absolute -top-2 -right-2 text-xl"
                        style={{ animation: "wiggle 1s ease-in-out infinite" }}
                      >
                        ●
                      </span>
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chosen phase */}
        {phase === "chosen" && chosenColor && (
          <div style={{ animation: "scale-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <div className="text-8xl mb-4" style={{ animation: "spin-bounce 0.6s ease both" }}>🎨</div>
            <h2
              className="font-black text-white mb-2"
              style={{ fontSize: "clamp(2.5rem,8vw,5rem)", textShadow: "0 4px 40px rgba(0,0,0,0.4)" }}
            >
              {chosenColor.name}!
            </h2>
            <p className="text-white/70 text-lg font-medium">
              Go find something {chosenColor.name.toLowerCase()}... 
            </p>
          </div>
        )}

        {/* Done flash */}
        {phase === "done" && (
          <div style={{ animation: "fade-out 0.5s ease both" }}>
            <div className="text-6xl">✨</div>
          </div>
        )}
      </div>

      {/* Paper fortune teller corners */}
      {(phase === "chant" || phase === "pick") && (
        <>
          {[
            { corner: "top-4 left-4", rotate: "rotate-0" },
            { corner: "top-4 right-4", rotate: "rotate-90" },
            { corner: "bottom-4 left-4", rotate: "-rotate-90" },
            { corner: "bottom-4 right-4", rotate: "rotate-180" },
          ].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos.corner} ${pos.rotate} opacity-20 pointer-events-none`}
              style={{ animation: `float-corner ${2 + i * 0.3}s ease-in-out infinite alternate` }}
            >
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <path d="M30 2 L58 30 L30 58 L2 30 Z" fill="white" />
                <path d="M30 2 L30 58 M2 30 L58 30" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
                <path d="M30 2 L58 30 L30 30 Z" fill="rgba(0,0,0,0.1)" />
                <path d="M2 30 L30 58 L30 30 Z" fill="rgba(0,0,0,0.15)" />
              </svg>
            </div>
          ))}
        </>
      )}

      <style>{`
        @keyframes bounce-dot {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.3) rotate(-10deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-15deg) scale(1); }
          50% { transform: rotate(15deg) scale(1.2); }
        }
        @keyframes scale-pop {
          0% { opacity: 0; transform: scale(0.4); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes spin-bounce {
          0% { transform: scale(0) rotate(-180deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes burst {
          0% { opacity: 1; transform: scale(0.5) rotate(0deg) translateY(0); }
          60% { opacity: 1; transform: scale(1.3) rotate(var(--rot, 90deg)) translateY(-40px); }
          100% { opacity: 0; transform: scale(0.8) rotate(var(--rot, 180deg)) translateY(-80px); }
        }
        @keyframes pulse-orb {
          from { transform: scale(1); opacity: 0.10; }
          to { transform: scale(1.3); opacity: 0.18; }
        }
        @keyframes float-corner {
          from { transform: translateY(0) rotate(0deg); }
          to { transform: translateY(-8px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
