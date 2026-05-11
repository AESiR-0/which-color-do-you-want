"use client";

import { useState, useRef, type ReactNode } from "react";
import { useLayoutStore, type PanelId, type DockZone } from "@/store/layout";

interface Props {
  id: PanelId;
  children: ReactNode;
  onDragStart?: (id: PanelId) => void;
  onDragEnd?: () => void;
  onReorderDrop?: (draggedId: PanelId, targetId: PanelId) => void;
  isDragging?: boolean;
  isAnyDragging?: boolean;
}

export default function Panel({
  id,
  children,
  onDragStart,
  onDragEnd,
  onReorderDrop,
  isDragging,
  isAnyDragging,
}: Props) {
  const { panels, togglePanel } = useLayoutStore();
  const panel = panels.find((p) => p.id === id);
  const [dropAbove, setDropAbove] = useState(false);
  const [dropBelow, setDropBelow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  if (!panel) return null;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("panel-id", id);
    e.dataTransfer.effectAllowed = "move";
    // Set a small drag image
    const el = ref.current;
    if (el) {
      const ghost = el.cloneNode(true) as HTMLElement;
      ghost.style.width = "200px";
      ghost.style.opacity = "0.8";
      ghost.style.position = "absolute";
      ghost.style.top = "-1000px";
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 100, 15);
      setTimeout(() => ghost.remove(), 0);
    }
    onDragStart?.(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isAnyDragging || isDragging) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const midY = rect.top + rect.height / 2;
      if (e.clientY < midY) {
        setDropAbove(true);
        setDropBelow(false);
      } else {
        setDropAbove(false);
        setDropBelow(true);
      }
    }
  };

  const handleDragLeave = () => {
    setDropAbove(false);
    setDropBelow(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropAbove(false);
    setDropBelow(false);
    const draggedId = e.dataTransfer.getData("panel-id") as PanelId;
    if (draggedId && draggedId !== id) {
      onReorderDrop?.(draggedId, id);
    }
  };

  return (
    <div
      ref={ref}
      className={`border-b border-white/5 last:border-0 transition-all duration-150 ${
        isDragging ? "opacity-30 scale-[0.98]" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop indicator above */}
      {dropAbove && (
        <div className="h-[2px] bg-white/40 mx-2 rounded-full" />
      )}

      {/* Header */}
      <div className="flex items-center gap-1 px-1 py-2 select-none group">
        {/* Drag handle */}
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={() => {
            setDropAbove(false);
            setDropBelow(false);
            onDragEnd?.();
          }}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/5 transition-colors"
          title="Drag to reorder or move to another zone"
        >
          <svg width="8" height="12" viewBox="0 0 8 12" className="text-white/15 group-hover:text-white/35 transition-colors">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
            <circle cx="6" cy="2" r="1" fill="currentColor" />
            <circle cx="2" cy="6" r="1" fill="currentColor" />
            <circle cx="6" cy="6" r="1" fill="currentColor" />
            <circle cx="2" cy="10" r="1" fill="currentColor" />
            <circle cx="6" cy="10" r="1" fill="currentColor" />
          </svg>
        </div>

        {/* Collapse toggle + label */}
        <div
          className="flex items-center gap-1 flex-1 cursor-pointer hover:bg-white/3 rounded px-1 py-0.5 transition-colors"
          onClick={() => togglePanel(id)}
        >
          <svg
            className={`w-2.5 h-2.5 text-white/25 transition-transform flex-shrink-0 ${
              panel.collapsed ? "" : "rotate-90"
            }`}
            viewBox="0 0 8 8"
            fill="currentColor"
          >
            <path d="M2 1l4 3-4 3z" />
          </svg>
          <span className="text-[9px] text-white/40 font-black uppercase tracking-[0.18em] flex-1 truncate">
            {panel.label}
          </span>
        </div>
      </div>

      {/* Content */}
      {!panel.collapsed && (
        <div className="px-3 pb-3 pt-0.5">
          {children}
        </div>
      )}

      {/* Drop indicator below */}
      {dropBelow && (
        <div className="h-[2px] bg-white/40 mx-2 rounded-full" />
      )}
    </div>
  );
}
