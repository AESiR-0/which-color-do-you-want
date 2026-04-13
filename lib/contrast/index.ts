import { hslToRgb, type HSL } from "../color-engine";

function relativeLuminance(r: number, g: number, b: number): number {
  const [rL, gL, bL] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

export function contrastRatio(hsl1: HSL, hsl2: HSL): number {
  const [r1, g1, b1] = hslToRgb(hsl1);
  const [r2, g2, b2] = hslToRgb(hsl2);
  const L1 = relativeLuminance(r1, g1, b1);
  const L2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type ContrastLevel = "AAA" | "AA" | "AA Large" | "Fail";

export function wcagLevel(ratio: number): ContrastLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

export function getReadableTextColor(backgroundHsl: HSL): string {
  const [r, g, b] = hslToRgb(backgroundHsl);
  const L = relativeLuminance(r, g, b);
  return L > 0.179 ? "#111111" : "#ffffff";
}
