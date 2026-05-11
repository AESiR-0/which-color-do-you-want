# Task: Draggable layout + Branding mockups + 2-step AI

## 1. Draggable Panels (DnD)
- Use HTML5 drag-and-drop API (no extra deps)
- Panels get drag handles (grip icon)
- Can drag panels between left/right/top/bottom zones
- Can reorder within a zone by dragging
- Drop zones highlight on dragover
- Persist new positions to localStorage

## 2. Branding Mockups (toggleable sidebar)
Replace device-frame mockups with branding mockups:
- Logo on white/dark backgrounds (circle + wordmark)
- T-shirt mockup (SVG outline + palette fill)
- Mug mockup (SVG)
- Hoodie mockup (SVG)
- Business card mockup (front/back)
- Tote bag mockup (SVG)
All rendered as pure SVG/CSS using palette colors. Toggleable sidebar.

## 3. 2-Step AI Prompt Optimization
- Step 1: Send user prompt to Groq → "optimize this prompt for generating HTML UI"
- Step 2: Use optimized prompt to generate the actual HTML
- Show both prompts (original + optimized) so user can edit
- Same model for both steps

## Files to modify:
- `components/layout/DockableLayout.tsx` — add drop zones
- `components/layout/Panel.tsx` — add drag handle + draggable
- `store/layout.ts` — update movePanel for DnD
- `components/preview/MockupSidebar.tsx` — complete rewrite with branding mockups
- `components/ai/PromptInput.tsx` — 2-step flow
- `app/api/generate/route.ts` — add optimize endpoint or merge
- `app/page.tsx` — minor updates
