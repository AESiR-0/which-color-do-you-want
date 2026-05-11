"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { usePaletteStore } from "@/store/palette";
import { GOOGLE_FONTS, POPULAR_PAIRINGS, loadGoogleFont, loadFontPair } from "@/lib/fonts";

export default function FontCombobox() {
  const { identity, setIdentity } = usePaletteStore();
  const [headingSearch, setHeadingSearch] = useState("");
  const [bodySearch, setBodySearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<"heading" | "body" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Load current fonts
  useEffect(() => {
    loadFontPair(identity.typography.heading, identity.typography.body);
  }, [identity.typography]);

  const headingResults = useMemo(() => {
    const q = headingSearch.toLowerCase();
    if (!q) return GOOGLE_FONTS.slice(0, 40);
    return GOOGLE_FONTS.filter((f) => f.toLowerCase().includes(q)).slice(0, 40);
  }, [headingSearch]);

  const bodyResults = useMemo(() => {
    const q = bodySearch.toLowerCase();
    if (!q) return GOOGLE_FONTS.slice(0, 40);
    return GOOGLE_FONTS.filter((f) => f.toLowerCase().includes(q)).slice(0, 40);
  }, [bodySearch]);

  const setHeading = (font: string) => {
    loadGoogleFont(font);
    setIdentity({ ...identity, typography: { ...identity.typography, heading: font } });
    setActiveDropdown(null);
    setHeadingSearch("");
  };

  const setBody = (font: string) => {
    loadGoogleFont(font);
    setIdentity({ ...identity, typography: { ...identity.typography, body: font } });
    setActiveDropdown(null);
    setBodySearch("");
  };

  const applyPairing = (heading: string, body: string) => {
    loadFontPair(heading, body);
    setIdentity({ ...identity, typography: { heading, body } });
  };

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Quick pairings */}
      <div className="flex flex-wrap gap-1">
        {POPULAR_PAIRINGS.slice(0, 8).map(({ label, heading, body }) => {
          const isActive =
            heading === identity.typography.heading && body === identity.typography.body;
          return (
            <button
              key={label}
              onClick={() => applyPairing(heading, body)}
              className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all border whitespace-nowrap ${
                isActive
                  ? "bg-white text-black border-white shadow"
                  : "border-white/10 text-white/35 hover:text-white/60 bg-white/5"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Heading font combobox */}
      <div className="relative">
        <label className="text-[8px] text-white/25 uppercase tracking-[0.2em] font-black mb-1 block">
          Heading Font
        </label>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-all"
          onClick={() => setActiveDropdown(activeDropdown === "heading" ? null : "heading")}
        >
          <span
            className="text-sm text-white font-semibold flex-1 truncate"
            style={{ fontFamily: `'${identity.typography.heading}', sans-serif` }}
          >
            {identity.typography.heading}
          </span>
          <svg className="w-3 h-3 text-white/30" viewBox="0 0 12 12" fill="none">
            <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {activeDropdown === "heading" && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-2 border-b border-white/5">
              <input
                type="text"
                placeholder="Search fonts..."
                value={headingSearch}
                onChange={(e) => setHeadingSearch(e.target.value)}
                className="w-full text-xs bg-white/5 rounded-lg px-3 py-2 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/20"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto custom-scrollbar">
              {headingResults.map((font) => {
                loadGoogleFont(font);
                return (
                  <button
                    key={font}
                    onClick={() => setHeading(font)}
                    onMouseEnter={() => loadGoogleFont(font)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
                      font === identity.typography.heading
                        ? "bg-white/10 text-white"
                        : "text-white/60"
                    }`}
                    style={{ fontFamily: `'${font}', sans-serif` }}
                  >
                    {font}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Body font combobox */}
      <div className="relative">
        <label className="text-[8px] text-white/25 uppercase tracking-[0.2em] font-black mb-1 block">
          Body Font
        </label>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-all"
          onClick={() => setActiveDropdown(activeDropdown === "body" ? null : "body")}
        >
          <span
            className="text-sm text-white font-semibold flex-1 truncate"
            style={{ fontFamily: `'${identity.typography.body}', sans-serif` }}
          >
            {identity.typography.body}
          </span>
          <svg className="w-3 h-3 text-white/30" viewBox="0 0 12 12" fill="none">
            <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {activeDropdown === "body" && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-2 border-b border-white/5">
              <input
                type="text"
                placeholder="Search fonts..."
                value={bodySearch}
                onChange={(e) => setBodySearch(e.target.value)}
                className="w-full text-xs bg-white/5 rounded-lg px-3 py-2 text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/20"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto custom-scrollbar">
              {bodyResults.map((font) => {
                loadGoogleFont(font);
                return (
                  <button
                    key={font}
                    onClick={() => setBody(font)}
                    onMouseEnter={() => loadGoogleFont(font)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
                      font === identity.typography.body
                        ? "bg-white/10 text-white"
                        : "text-white/60"
                    }`}
                    style={{ fontFamily: `'${font}', sans-serif` }}
                  >
                    {font}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
        <p
          className="text-lg font-bold text-white mb-1"
          style={{ fontFamily: `'${identity.typography.heading}', sans-serif` }}
        >
          The quick brown fox
        </p>
        <p
          className="text-xs text-white/50"
          style={{ fontFamily: `'${identity.typography.body}', sans-serif` }}
        >
          jumps over the lazy dog — 0123456789
        </p>
      </div>
    </div>
  );
}
