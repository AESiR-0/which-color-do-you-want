import { create } from "zustand";

export type PanelId =
  | "palette"
  | "taste-harmony"
  | "fonts"
  | "mockups"
  | "export"
  | "ai-input"
  | "contrast";

export type DockZone = "left" | "right" | "top" | "bottom";

export interface PanelConfig {
  id: PanelId;
  label: string;
  zone: DockZone;
  collapsed: boolean;
  order: number;
  width?: number;  // for left/right panels
  height?: number; // for top/bottom panels
}

interface LayoutState {
  panels: PanelConfig[];
  leftWidth: number;
  rightWidth: number;
  topHeight: number;
  bottomHeight: number;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  topCollapsed: boolean;
  bottomCollapsed: boolean;

  toggleZone: (zone: DockZone) => void;
  togglePanel: (id: PanelId) => void;
  movePanel: (id: PanelId, zone: DockZone) => void;
  reorderPanel: (id: PanelId, direction: "up" | "down") => void;
  setZoneSize: (zone: DockZone, size: number) => void;
  resetLayout: () => void;
}

const DEFAULT_PANELS: PanelConfig[] = [
  { id: "palette", label: "Color Palette", zone: "left", collapsed: false, order: 0 },
  { id: "taste-harmony", label: "Taste & Harmony", zone: "left", collapsed: false, order: 1 },
  { id: "contrast", label: "Contrast (WCAG)", zone: "left", collapsed: false, order: 2 },
  { id: "fonts", label: "Font Pairing", zone: "right", collapsed: false, order: 0 },
  { id: "mockups", label: "Mockup Previews", zone: "right", collapsed: false, order: 1 },
  { id: "ai-input", label: "AI / HTML Input", zone: "right", collapsed: false, order: 2 },
  { id: "export", label: "Export", zone: "bottom", collapsed: false, order: 0 },
];

const STORAGE_KEY = "wcydyw-layout-v2";

function loadState(): Partial<LayoutState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state: LayoutState) {
  if (typeof window === "undefined") return;
  const { panels, leftWidth, rightWidth, topHeight, bottomHeight, leftCollapsed, rightCollapsed, topCollapsed, bottomCollapsed } = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    panels, leftWidth, rightWidth, topHeight, bottomHeight, leftCollapsed, rightCollapsed, topCollapsed, bottomCollapsed,
  }));
}

const saved = loadState();

export const useLayoutStore = create<LayoutState>((set, get) => ({
  panels: saved?.panels ?? DEFAULT_PANELS,
  leftWidth: saved?.leftWidth ?? 340,
  rightWidth: saved?.rightWidth ?? 340,
  topHeight: saved?.topHeight ?? 200,
  bottomHeight: saved?.bottomHeight ?? 260,
  leftCollapsed: saved?.leftCollapsed ?? false,
  rightCollapsed: saved?.rightCollapsed ?? false,
  topCollapsed: saved?.topCollapsed ?? true,
  bottomCollapsed: saved?.bottomCollapsed ?? false,

  toggleZone(zone) {
    const key = `${zone}Collapsed` as keyof LayoutState;
    set((s) => {
      const next = { ...s, [key]: !s[key as keyof typeof s] };
      saveState(next as any);
      return next;
    });
  },

  togglePanel(id) {
    set((s) => {
      const panels = s.panels.map((p) =>
        p.id === id ? { ...p, collapsed: !p.collapsed } : p
      );
      const next = { ...s, panels };
      saveState(next as any);
      return next;
    });
  },

  movePanel(id, zone) {
    set((s) => {
      const maxOrder = Math.max(...s.panels.filter((p) => p.zone === zone).map((p) => p.order), -1);
      const panels = s.panels.map((p) =>
        p.id === id ? { ...p, zone, order: maxOrder + 1 } : p
      );
      const next = { ...s, panels };
      saveState(next as any);
      return next;
    });
  },

  reorderPanel(id, direction) {
    set((s) => {
      const panel = s.panels.find((p) => p.id === id);
      if (!panel) return s;
      const zoneItems = s.panels.filter((p) => p.zone === panel.zone).sort((a, b) => a.order - b.order);
      const idx = zoneItems.findIndex((p) => p.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= zoneItems.length) return s;

      const swapPanel = zoneItems[swapIdx];
      const panels = s.panels.map((p) => {
        if (p.id === id) return { ...p, order: swapPanel.order };
        if (p.id === swapPanel.id) return { ...p, order: panel.order };
        return p;
      });
      const next = { ...s, panels };
      saveState(next as any);
      return next;
    });
  },

  setZoneSize(zone, size) {
    const key = zone === "left" ? "leftWidth" : zone === "right" ? "rightWidth" : zone === "top" ? "topHeight" : "bottomHeight";
    set((s) => {
      const next = { ...s, [key]: size };
      saveState(next as any);
      return next;
    });
  },

  resetLayout() {
    const next = {
      panels: DEFAULT_PANELS,
      leftWidth: 340,
      rightWidth: 340,
      topHeight: 200,
      bottomHeight: 260,
      leftCollapsed: false,
      rightCollapsed: false,
      topCollapsed: true,
      bottomCollapsed: false,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    set(next);
  },
}));
