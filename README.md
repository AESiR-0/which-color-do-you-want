# which-color-do-you-want

A premium, interaction-first color palette generator built with Next.js.

## Features

- **Harmony modes** — Analogous, Complementary, Triadic, Split-Complementary, Tetradic, Monochromatic
- **6 color roles** — Primary, Secondary, Accent, Background, Surface, Text
- **Advanced locking** — Lock full color, or lock just Hue / Saturation / Lightness
- **HSL sliders** — Fine-tune each color with real-time preview
- **WCAG contrast checker** — Auto-computed AA/AAA badges
- **4 preview modes** — Light UI, Dark UI, Dashboard, Landing Page
- **Export** — CSS Variables, Tailwind config, SCSS, JSON, Markdown
- **Session history** — Last 20 palettes with one-click restore
- **Keyboard shortcuts** — `R` to regenerate, `Escape` to deselect

## Stack

- Next.js 15 (App Router)
- React 19
- TailwindCSS v4
- Zustand

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
/app                  → Next.js App Router pages
/components
  /palette            → ColorCard, PaletteGrid, ContrastBadge
  /preview            → LightUI, DarkUI, Dashboard, Landing previews
  /export             → ExportPanel
  /ui                 → HarmonySelector, PreviewModeSelector, HistoryDrawer
/lib
  /color-engine       → HSL ↔ HEX, harmony generation, locking logic
  /contrast           → WCAG contrast ratio calculation
  /export.ts          → CSS/Tailwind/SCSS/JSON/Markdown serializers
/store
  /palette.ts         → Zustand store
```

## Design Principles

- Minimal but premium
- Interaction-first — everything updates in real-time
- No pure random HEX — all colors are role-aware and harmony-based
- Zero backend required
