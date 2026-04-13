export type ColorRole = "primary" | "secondary" | "accent" | "background" | "surface" | "text";

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface PaletteColor {
  role: ColorRole;
  hsl: HSL;
  hex: string;
  locked: boolean;
  lockMode: "full" | "hue" | "saturation" | "lightness" | null;
}

export type HarmonyMode =
  | "analogous"
  | "complementary"
  | "triadic"
  | "split-complementary"
  | "tetradic"
  | "monochromatic";

// ─── Conversion ──────────────────────────────────────────────────────────────

export function hslToHex({ h, s, l }: HSL): string {
  const sN = s / 100;
  const lN = l / 100;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lN - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function hexToHsl(hex: string): HSL {
  let r = 0, g = 0, b = 0;
  const clean = hex.replace("#", "");
  if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16) / 255;
    g = parseInt(clean.slice(2, 4), 16) / 255;
    b = parseInt(clean.slice(4, 6), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: HSL): [number, number, number] {
  const hex = hslToHex({ h, s, l });
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// ─── Random HSL ──────────────────────────────────────────────────────────────

function rand(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

// ─── Harmony offsets ─────────────────────────────────────────────────────────

function harmonyHues(baseH: number, mode: HarmonyMode): number[] {
  switch (mode) {
    case "analogous":
      return [baseH, (baseH + 30) % 360, (baseH - 30 + 360) % 360, (baseH + 15) % 360, (baseH - 15 + 360) % 360, (baseH + 200) % 360];
    case "complementary":
      return [baseH, (baseH + 180) % 360, baseH, (baseH + 180) % 360, baseH, (baseH + 180) % 360];
    case "triadic":
      return [baseH, (baseH + 120) % 360, (baseH + 240) % 360, baseH, (baseH + 120) % 360, (baseH + 240) % 360];
    case "split-complementary":
      return [baseH, (baseH + 150) % 360, (baseH + 210) % 360, baseH, (baseH + 150) % 360, (baseH + 210) % 360];
    case "tetradic":
      return [baseH, (baseH + 90) % 360, (baseH + 180) % 360, (baseH + 270) % 360, baseH, (baseH + 90) % 360];
    case "monochromatic":
      return [baseH, baseH, baseH, baseH, baseH, baseH];
  }
}

// ─── Role defaults ───────────────────────────────────────────────────────────

const ROLE_DEFAULTS: Record<ColorRole, { s: [number, number]; l: [number, number] }> = {
  primary:    { s: [60, 90], l: [40, 60] },
  secondary:  { s: [40, 70], l: [45, 65] },
  accent:     { s: [70, 100], l: [50, 65] },
  background: { s: [5, 20], l: [92, 98] },
  surface:    { s: [5, 15], l: [85, 95] },
  text:       { s: [10, 30], l: [8, 20] },
};

// ─── Generator ───────────────────────────────────────────────────────────────

export function generatePalette(
  mode: HarmonyMode,
  existing?: PaletteColor[]
): PaletteColor[] {
  const roles: ColorRole[] = ["primary", "secondary", "accent", "background", "surface", "text"];
  const baseH = rand(0, 359);
  const hues = harmonyHues(baseH, mode);

  return roles.map((role, i) => {
    const existing_color = existing?.find((c) => c.role === role);

    if (existing_color?.locked) {
      return existing_color;
    }

    const lockMode = existing_color?.lockMode ?? null;
    const prevHsl = existing_color?.hsl;
    const def = ROLE_DEFAULTS[role];

    let h = hues[i];
    let s = rand(def.s[0], def.s[1]);
    let l = rand(def.l[0], def.l[1]);

    if (lockMode === "hue" && prevHsl) { h = prevHsl.h; }
    if (lockMode === "saturation" && prevHsl) { s = prevHsl.s; }
    if (lockMode === "lightness" && prevHsl) { l = prevHsl.l; }

    const hsl: HSL = { h, s, l };
    return {
      role,
      hsl,
      hex: hslToHex(hsl),
      locked: false,
      lockMode,
    };
  });
}

// ─── Adjust single color ─────────────────────────────────────────────────────

export function adjustColor(color: PaletteColor, hsl: Partial<HSL>): PaletteColor {
  const newHsl = { ...color.hsl, ...hsl };
  return { ...color, hsl: newHsl, hex: hslToHex(newHsl) };
}
