import { create } from "zustand";
import {
  generatePalette,
  adjustColor,
  hexToHsl,
  hslToHex,
  type PaletteColor,
  type HarmonyMode,
  type HSL,
  type ColorRole,
} from "@/lib/color-engine";
import { TASTE_IDENTITIES, getRandomIdentity, type DesignIdentity } from "@/lib/taste-engine";

export type PreviewMode = "light-ui" | "dark-ui" | "dashboard" | "landing";

export interface HistoryEntry {
  id: string;
  palette: PaletteColor[];
  identity: DesignIdentity;
  timestamp: number;
}

interface PaletteState {
  palette: PaletteColor[];
  harmonyMode: HarmonyMode;
  previewMode: PreviewMode;
  identity: DesignIdentity;
  history: HistoryEntry[];
  selectedRole: ColorRole | null;

  // Actions
  generate: () => void;
  setHarmonyMode: (mode: HarmonyMode) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setIdentity: (identity: DesignIdentity) => void;
  toggleLock: (role: ColorRole) => void;
  setLockMode: (role: ColorRole, lockMode: PaletteColor["lockMode"]) => void;
  updateColorHex: (role: ColorRole, hex: string) => void;
  updateColorHsl: (role: ColorRole, hsl: Partial<HSL>) => void;
  restoreHistory: (id: string) => void;
  setSelectedRole: (role: ColorRole | null) => void;
}

function makeHistoryEntry(palette: PaletteColor[], identity: DesignIdentity): HistoryEntry {
  return {
    id: Math.random().toString(36).slice(2),
    palette: JSON.parse(JSON.stringify(palette)),
    identity,
    timestamp: Date.now(),
  };
}

const initialIdentity = TASTE_IDENTITIES["brutalist-saas"];

export const usePaletteStore = create<PaletteState>((set, get) => ({
  palette: generatePalette("analogous"),
  harmonyMode: "analogous",
  previewMode: "landing",
  identity: initialIdentity,
  history: [],
  selectedRole: null,

  generate() {
    const { palette, harmonyMode, history, identity: currentIdentity } = get();
    const newPalette = generatePalette(harmonyMode, palette);
    const entry = makeHistoryEntry(palette, currentIdentity);
    
    // Sometimes change identity on full generate if not locked
    const newIdentity = getRandomIdentity();

    set({
      palette: newPalette,
      identity: newIdentity,
      history: [entry, ...history].slice(0, 20),
    });
  },

  setHarmonyMode(mode) {
    set({ harmonyMode: mode });
    const { palette, history, identity } = get();
    const newPalette = generatePalette(mode, palette);
    const entry = makeHistoryEntry(palette, identity);
    set({
      palette: newPalette,
      history: [entry, ...history].slice(0, 20),
    });
  },

  setPreviewMode(mode) {
    set({ previewMode: mode });
  },

  setIdentity(identity) {
    set({ identity });
  },

  toggleLock(role) {
    set((s) => ({
      palette: s.palette.map((c) =>
        c.role === role ? { ...c, locked: !c.locked, lockMode: !c.locked ? "full" : null } : c
      ),
    }));
  },

  setLockMode(role, lockMode) {
    set((s) => ({
      palette: s.palette.map((c) =>
        c.role === role ? { ...c, lockMode, locked: lockMode === "full" } : c
      ),
    }));
  },

  updateColorHex(role, hex) {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    const hsl = hexToHsl(hex);
    set((s) => ({
      palette: s.palette.map((c) =>
        c.role === role ? { ...c, hex, hsl } : c
      ),
    }));
  },

  updateColorHsl(role, partial) {
    set((s) => ({
      palette: s.palette.map((c) => {
        if (c.role !== role) return c;
        return adjustColor(c, partial);
      }),
    }));
  },

  restoreHistory(id) {
    const { history, palette, identity } = get();
    const entry = history.find((h) => h.id === id);
    if (!entry) return;
    const current = makeHistoryEntry(palette, identity);
    set({
      palette: entry.palette,
      identity: entry.identity,
      history: [current, ...history.filter((h) => h.id !== id)].slice(0, 20),
    });
  },

  setSelectedRole(role) {
    set({ selectedRole: role });
  },
}));
