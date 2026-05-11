# which-color-do-you-want — Major Upgrade

## Features to Add

### 1. AI Prompt + HTML/JSX Input
- Text prompt → AI generates HTML preview (via Groq API, model: openai/gpt-oss-120b)
- User pastes HTML/JSX → renders with palette colors applied
- Tailwind CSS support in pasted/generated HTML
- API route at /api/generate for Groq calls

### 2. Mockup Previews Sidebar
- Device frames: phone, tablet, laptop showing the active preview
- Thumbnail cards of all preview modes side-by-side
- Lives in a collapsible sidebar panel

### 3. Font Selector — Gooey Combobox with 100s of fonts
- Replace current 8-option button list with searchable combobox
- Load Google Fonts catalog (popular subset ~200+)
- Preview font in the dropdown itself

### 4. Customizable Layout (VS Code / Premiere Pro style)
- Collapsible panels at fixed positions: left, right, top, bottom, center
- Default layout:
  - LEFT sidebar (collapsible): Color Palette + Taste/Harmony
  - RIGHT sidebar (collapsible): Font Selector + Mockup Previews
  - BOTTOM/TOP bar (collapsible): Export buttons
  - CENTER: Live Preview (main area)
- Panels can be reordered within their dock zone
- State persisted via localStorage

### 5. Layout state persistence
- All panel positions, collapsed states, sizes → localStorage
- Restore on page load

## Tech
- Groq API: https://api.groq.com/openai/v1, model: openai/gpt-oss-120b
- API key stored in .env.local
- Next.js API route for server-side Groq calls
- Tailwind CDN in iframe for user HTML rendering

## File Plan
- `.env.local` — GROQ_API_KEY
- `app/api/generate/route.ts` — Groq API proxy
- `store/layout.ts` — Layout/panel state store with localStorage persistence
- `components/layout/DockableLayout.tsx` — Main layout shell
- `components/layout/Panel.tsx` — Collapsible panel wrapper
- `components/ai/PromptInput.tsx` — AI prompt + HTML paste input
- `components/ai/HtmlPreview.tsx` — Renders HTML in sandboxed iframe with palette
- `components/preview/MockupSidebar.tsx` — Device frames + thumbnails
- `components/ui/FontCombobox.tsx` — Searchable font selector with 200+ fonts
- Update `app/page.tsx` — New layout
- Update `store/palette.ts` — Add AI-generated preview state
