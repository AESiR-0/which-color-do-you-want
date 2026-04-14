"use client";

/**
 * Accurate paper fortune teller (cootie catcher) SVG.
 *
 * Top-down view of the folded origami:
 *  - Square outer shape rotated 45° (diamond)
 *  - 4 outer flap triangles (Red, Blue, Yellow, Green)
 *  - 4 inner triangles (white, with subtle shadows for depth)
 *  - Center square
 *  - Diagonal + cross crease lines
 *  - Paper texture via subtle noise filter
 *  - Realistic fold shadows on each flap
 */

interface Props {
  size?: number;
  animate?: boolean;
  /** highlight one flap */
  activeColor?: string | null;
}

// Center of the SVG canvas
const CX = 200;
const CY = 200;
const R = 170; // half-width of the outer diamond

// The 4 outer corners of the diamond
const TOP    = [CX,       CY - R  ] as [number, number];
const RIGHT  = [CX + R,   CY      ] as [number, number];
const BOTTOM = [CX,       CY + R  ] as [number, number];
const LEFT   = [CX - R,   CY      ] as [number, number];
const CENTER = [CX,       CY      ] as [number, number];

// Inner square corners (midpoints between outer corners, pulled toward center by ~40%)
const INNER_R = R * 0.46;
const ITOP    = [CX,           CY - INNER_R] as [number, number];
const IRIGHT  = [CX + INNER_R, CY          ] as [number, number];
const IBOTTOM = [CX,           CY + INNER_R] as [number, number];
const ILEFT   = [CX - INNER_R, CY          ] as [number, number];

function pt([x, y]: [number, number]) {
  return `${x},${y}`;
}

// Each flap = outer corner + two adjacent inner corners
const FLAPS = [
  {
    name: "Red",
    color: "#FF3B30",
    textColor: "#fff",
    // top flap: TOP → IRIGHT → ILEFT
    points: [TOP, IRIGHT, ILEFT],
    labelPos: [CX, CY - R * 0.62] as [number, number],
    shadowDir: [0, -1] as [number, number],
  },
  {
    name: "Blue",
    color: "#007AFF",
    textColor: "#fff",
    // right flap: RIGHT → IBOTTOM → ITOP
    points: [RIGHT, IBOTTOM, ITOP],
    labelPos: [CX + R * 0.62, CY] as [number, number],
    shadowDir: [1, 0] as [number, number],
  },
  {
    name: "Yellow",
    color: "#FFD60A",
    textColor: "#1a1a00",
    // bottom flap: BOTTOM → ILEFT → IRIGHT
    points: [BOTTOM, ILEFT, IRIGHT],
    labelPos: [CX, CY + R * 0.62] as [number, number],
    shadowDir: [0, 1] as [number, number],
  },
  {
    name: "Green",
    color: "#30D158",
    textColor: "#fff",
    // left flap: LEFT → ITOP → IBOTTOM
    points: [LEFT, ITOP, IBOTTOM],
    labelPos: [CX - R * 0.62, CY] as [number, number],
    shadowDir: [-1, 0] as [number, number],
  },
];

// Inner white triangles (between inner corners, meeting at center)
const INNER_TRIS = [
  { points: [ITOP, IRIGHT, CENTER] },
  { points: [IRIGHT, IBOTTOM, CENTER] },
  { points: [IBOTTOM, ILEFT, CENTER] },
  { points: [ILEFT, ITOP, CENTER] },
];

export default function FortuneTellerSVG({ size = 400, animate = false, activeColor = null }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={animate ? { animation: "fortune-spin 8s linear infinite" } : undefined}
    >
      <defs>
        {/* Paper texture filter */}
        <filter id="paper" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="textured" />
          <feComposite in="textured" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Drop shadow for flaps */}
        <filter id="flap-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(0,0,0,0.35)" />
        </filter>

        {/* Subtle inner shadow for depth */}
        <filter id="inner-shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="rgba(0,0,0,0.2)" />
        </filter>

        {/* Glow for active flap */}
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Clip to diamond */}
        <clipPath id="diamond-clip">
          <polygon points={`${pt(TOP)} ${pt(RIGHT)} ${pt(BOTTOM)} ${pt(LEFT)}`} />
        </clipPath>

        {/* Fold crease gradient for each flap */}
        {FLAPS.map((flap, i) => (
          <linearGradient
            key={i}
            id={`flap-grad-${i}`}
            x1={flap.points[0][0]}
            y1={flap.points[0][1]}
            x2={CX}
            y2={CY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={flap.color} stopOpacity="1" />
            <stop offset="100%" stopColor={flap.color} stopOpacity="0.75" />
          </linearGradient>
        ))}

        {/* Inner triangle gradient (paper white with depth) */}
        <radialGradient id="inner-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8e8e8" />
        </radialGradient>

        {/* Center square gradient */}
        <radialGradient id="center-grad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#d0d0d0" />
        </radialGradient>
      </defs>

      {/* ── Outer shadow under whole thing ── */}
      <polygon
        points={`${pt(TOP)} ${pt(RIGHT)} ${pt(BOTTOM)} ${pt(LEFT)}`}
        fill="rgba(0,0,0,0.18)"
        transform="translate(4,8)"
        style={{ filter: "blur(12px)" }}
      />

      {/* ── 4 outer colored flaps ── */}
      {FLAPS.map((flap, i) => {
        const isActive = activeColor === flap.name;
        return (
          <g key={i} filter={isActive ? "url(#glow)" : "url(#flap-shadow)"}>
            <polygon
              points={flap.points.map(pt).join(" ")}
              fill={`url(#flap-grad-${i})`}
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="0.8"
              style={
                isActive
                  ? { transform: `translate(${flap.shadowDir[0] * 6}px, ${flap.shadowDir[1] * 6}px)`, transition: "transform 0.3s" }
                  : undefined
              }
            />
            {/* Paper grain overlay on flap */}
            <polygon
              points={flap.points.map(pt).join(" ")}
              fill="white"
              opacity="0.06"
              style={{ filter: "url(#paper)" }}
            />
            {/* Fold edge highlight (inner crease line) */}
            <line
              x1={flap.points[1][0]} y1={flap.points[1][1]}
              x2={flap.points[2][0]} y2={flap.points[2][1]}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.5"
            />
            {/* Color label */}
            <text
              x={flap.labelPos[0]}
              y={flap.labelPos[1]}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={flap.textColor}
              fontSize="18"
              fontWeight="800"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="1"
              style={{ textTransform: "uppercase" }}
              opacity="0.92"
              transform={
                flap.name === "Blue"
                  ? `rotate(90, ${flap.labelPos[0]}, ${flap.labelPos[1]})`
                  : flap.name === "Green"
                  ? `rotate(-90, ${flap.labelPos[0]}, ${flap.labelPos[1]})`
                  : undefined
              }
            >
              {flap.name}
            </text>
          </g>
        );
      })}

      {/* ── 4 inner white triangles ── */}
      {INNER_TRIS.map((tri, i) => (
        <g key={i} filter="url(#inner-shadow)">
          <polygon
            points={tri.points.map(pt).join(" ")}
            fill="url(#inner-grad)"
            stroke="rgba(0,0,0,0.10)"
            strokeWidth="0.8"
          />
          {/* Subtle fold shadow on each inner triangle — darker toward center */}
          <polygon
            points={tri.points.map(pt).join(" ")}
            fill={`rgba(0,0,0,${0.04 + i * 0.01})`}
          />
        </g>
      ))}

      {/* ── Center square ── */}
      <polygon
        points={`${pt(ITOP)} ${pt(IRIGHT)} ${pt(IBOTTOM)} ${pt(ILEFT)}`}
        fill="url(#center-grad)"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1"
      />

      {/* ── Crease lines (the fold lines across the full diamond) ── */}
      {/* Diagonal creases */}
      <line x1={TOP[0]} y1={TOP[1]} x2={BOTTOM[0]} y2={BOTTOM[1]}
        stroke="rgba(0,0,0,0.13)" strokeWidth="1" strokeDasharray="none" />
      <line x1={LEFT[0]} y1={LEFT[1]} x2={RIGHT[0]} y2={RIGHT[1]}
        stroke="rgba(0,0,0,0.13)" strokeWidth="1" />
      {/* Inner square outline = fold lines */}
      <polygon
        points={`${pt(ITOP)} ${pt(IRIGHT)} ${pt(IBOTTOM)} ${pt(ILEFT)}`}
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
      />
      {/* Corner-to-inner crease lines */}
      {([
        [TOP, ITOP], [RIGHT, IRIGHT], [BOTTOM, IBOTTOM], [LEFT, ILEFT]
      ] as [[number,number],[number,number]][]).map(([a, b], i) => (
        <line key={i}
          x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
          stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4,3" />
      ))}

      {/* ── Outer diamond border ── */}
      <polygon
        points={`${pt(TOP)} ${pt(RIGHT)} ${pt(BOTTOM)} ${pt(LEFT)}`}
        fill="none"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
