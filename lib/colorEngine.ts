export type ColorRole = "primary" | "secondary" | "accent" | "background" | "text";
export type ColorRule = "analogous" | "complementary" | "monochrome";
export type ContrastLevel = "low" | "medium" | "high";

export interface HSLColor {
  h: number;
  s: number;
  l: number;
  hex: string;
}

export interface Palette {
  primary: HSLColor;
  secondary: HSLColor;
  accent: HSLColor;
  background: HSLColor;
  text: HSLColor;
}

export interface SavedPalette {
  id: string;
  name?: string;
  createdAt: number;
  palette: Palette;
  meta: {
    rule: ColorRule;
    contrast: ContrastLevel;
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  const sl = s / 100;
  const ll = l / 100;
  const a = sl * Math.min(ll, 1 - ll);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function makeColor(h: number, s: number, l: number): HSLColor {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));
  return { h, s, l, hex: hslToHex(h, s, l) };
}

function contrastParams(contrast: ContrastLevel) {
  if (contrast === "low") return { bgL: 85, textL: 30, satMod: 0.6 };
  if (contrast === "high") return { bgL: 97, textL: 10, satMod: 1.0 };
  return { bgL: 92, textL: 18, satMod: 0.8 };
}

export function generatePalette(opts: {
  baseHue: number;
  rule: ColorRule;
  contrast: ContrastLevel;
}): Palette {
  const { baseHue, rule, contrast } = opts;
  const p = contrastParams(contrast);

  let primary: HSLColor,
    secondary: HSLColor,
    accent: HSLColor,
    background: HSLColor,
    text: HSLColor;

  if (rule === "analogous") {
    primary = makeColor(baseHue, 65 * p.satMod, 48);
    secondary = makeColor(baseHue + 30, 55 * p.satMod, 55);
    accent = makeColor(baseHue - 30, 75 * p.satMod, 45);
    background = makeColor(baseHue + 15, 20 * p.satMod, p.bgL);
    text = makeColor(baseHue, 25, p.textL);
  } else if (rule === "complementary") {
    primary = makeColor(baseHue, 70 * p.satMod, 48);
    secondary = makeColor(baseHue + 180, 60 * p.satMod, 52);
    accent = makeColor(baseHue + 90, 80 * p.satMod, 50);
    background = makeColor(baseHue, 15 * p.satMod, p.bgL);
    text = makeColor(baseHue + 180, 20, p.textL);
  } else {
    // monochrome
    primary = makeColor(baseHue, 60 * p.satMod, 45);
    secondary = makeColor(baseHue, 45 * p.satMod, 60);
    accent = makeColor(baseHue, 80 * p.satMod, 38);
    background = makeColor(baseHue, 15 * p.satMod, p.bgL);
    text = makeColor(baseHue, 30, p.textL);
  }

  return { primary, secondary, accent, background, text };
}

// WCAG relative luminance
export function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function wcagPass(ratio: number, level: "AA" | "AAA" = "AA"): boolean {
  return level === "AA" ? ratio >= 4.5 : ratio >= 7;
}

export const PRESETS: Record<string, { baseHue: number; rule: ColorRule; contrast: ContrastLevel; label: string }> = {
  "analogous-calm": { baseHue: 200, rule: "analogous", contrast: "low", label: "Analogous Calm" },
  "complementary-contrast": { baseHue: 220, rule: "complementary", contrast: "high", label: "Complementary High Contrast" },
  "monochrome-minimal": { baseHue: 240, rule: "monochrome", contrast: "medium", label: "Monochrome Minimal" },
  "saas-blue": { baseHue: 215, rule: "analogous", contrast: "high", label: "SaaS Blue" },
  "fintech-green": { baseHue: 145, rule: "complementary", contrast: "high", label: "Fintech Green" },
  "luxury-dark": { baseHue: 270, rule: "monochrome", contrast: "high", label: "Luxury Dark" },
  "playful-pastel": { baseHue: 320, rule: "analogous", contrast: "low", label: "Playful Pastel" },
};

export const PALETTE_STORAGE_KEY = "color-palettes";

export function loadSavedPalettes(): SavedPalette[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PALETTE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePaletteToStorage(entry: SavedPalette): void {
  const all = loadSavedPalettes();
  const updated = [entry, ...all].slice(0, 50);
  localStorage.setItem(PALETTE_STORAGE_KEY, JSON.stringify(updated));
}

export function deletePaletteFromStorage(id: string): void {
  const all = loadSavedPalettes().filter((p) => p.id !== id);
  localStorage.setItem(PALETTE_STORAGE_KEY, JSON.stringify(all));
}

export function encodePalette(palette: Palette): string {
  return btoa(JSON.stringify(palette));
}

export function decodePalette(encoded: string): Palette | null {
  try {
    return JSON.parse(atob(encoded)) as Palette;
  } catch {
    return null;
  }
}

export function generateMarkdown(palette: Palette, meta: { rule: ColorRule; contrast: ContrastLevel }): string {
  const roles = Object.entries(palette) as [ColorRole, HSLColor][];
  const usageSuggestions: Record<ColorRole, string> = {
    primary: "CTAs, primary buttons, key interactive elements",
    secondary: "Secondary buttons, supporting UI elements",
    accent: "Highlights, badges, notifications, hover states",
    background: "Base UI surface, page background",
    text: "Body copy, headings, labels",
  };

  return `# Color Palette

Generated with Color System Explorer

## Metadata

- Rule: ${meta.rule}
- Contrast: ${meta.contrast}
- Generated: ${new Date().toISOString()}

## Roles

${roles.map(([role, c]) => `- **${role.charAt(0).toUpperCase() + role.slice(1)}**: ${c.hex}`).join("\n")}

## HSL Values

${roles.map(([role, c]) => `- **${role}**: hsl(${c.h}, ${c.s}%, ${c.l}%)`).join("\n")}

## Usage Suggestions

${roles.map(([role]) => `- **${role}** → ${usageSuggestions[role]}`).join("\n")}

## CSS Variables

\`\`\`css
:root {
${roles.map(([role, c]) => `  --color-${role}: ${c.hex};`).join("\n")}
}
\`\`\`

## Tailwind Config

\`\`\`js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
${roles.map(([role, c]) => `        ${role}: "${c.hex}",`).join("\n")}
      }
    }
  }
}
\`\`\`

## JSON Tokens

\`\`\`json
{
${roles.map(([role, c]) => `  "${role}": { "value": "${c.hex}", "h": ${c.h}, "s": ${c.s}, "l": ${c.l} }`).join(",\n")}
}
\`\`\`
`;
}
