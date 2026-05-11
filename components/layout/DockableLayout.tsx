"use client";

import { useRef, useCallback, useState, type ReactNode } from "react";
import { useLayoutStore, type DockZone, type PanelId } from "@/store/layout";
import Panel from "./Panel";

interface PanelMapping {
  id: PanelId;
  component: ReactNode;
}

interface Props {
  panelMap: PanelMapping[];
  centerContent: ReactNode;
  header: ReactNode;
}

/* ── Resize Handle ── */
function ResizeHandle({
  direction,
  onResize,
}: {
  direction: "horizontal" | "vertical";
  onResize: (delta: number) => void;
}) {
  const dragging = useRef(false);
  const startPos = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startPos.current = direction === "horizontal" ? e.clientX : e.clientY;

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const current = direction === "horizontal" ? ev.clientX : ev.clientY;
        const delta = current - startPos.current;
        startPos.current = current;
        onResize(delta);
      };

      const onMouseUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [direction, onResize]
  );

  return (
    <div
      onMouseDown={onMouseDown}
      className={`flex-shrink-0 group ${
        direction === "horizontal"
          ? "w-[5px] cursor-col-resize hover:bg-white/10 active:bg-white/15"
          : "h-[5px] cursor-row-resize hover:bg-white/10 active:bg-white/15"
      } transition-colors relative z-10`}
    >
      <div
        className={`absolute ${
          direction === "horizontal"
            ? "w-[1px] h-full left-[2px] bg-white/5 group-hover:bg-white/15"
            : "h-[1px] w-full top-[2px] bg-white/5 group-hover:bg-white/15"
        } transition-colors`}
      />
    </div>
  );
}

/* ── Zone collapse toggle ── */
function ZoneToggle({
  zone,
  collapsed,
  onClick,
}: {
  zone: DockZone;
  collapsed: boolean;
  onClick: () => void;
}) {
  const arrows: Record<DockZone, [string, string]> = {
    left: ["«", "»"],
    right: ["»", "«"],
    top: ["▲", "▼"],
    bottom: ["▼", "▲"],
  };
  const [collapseIcon, expandIcon] = arrows[zone];

  return (
    <button
      onClick={onClick}
      className="text-[10px] text-white/20 hover:text-white/50 hover:bg-white/5 rounded px-1.5 py-0.5 transition-all"
      title={`${collapsed ? "Expand" : "Collapse"} ${zone} panel`}
    >
      {collapsed ? expandIcon : collapseIcon}
    </button>
  );
}

/* ── Drop Zone indicator ── */
function DropZoneIndicator({
  zone,
  active,
  onDrop,
}: {
  zone: DockZone;
  active: boolean;
  onDrop: (panelId: PanelId, zone: DockZone) => void;
}) {
  const [over, setOver] = useState(false);

  if (!active) return null;

  return (
    <div
      className={`absolute inset-0 z-40 pointer-events-auto rounded-lg border-2 border-dashed transition-all duration-150 ${
        over
          ? "border-white/40 bg-white/10 backdrop-blur-sm"
          : "border-white/15 bg-white/5"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const panelId = e.dataTransfer.getData("panel-id") as PanelId;
        if (panelId) onDrop(panelId, zone);
      }}
    >
      {over && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] text-white/50 font-black uppercase tracking-widest bg-black/40 px-3 py-1 rounded-lg">
            Drop here
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Main Layout ── */
export default function DockableLayout({ panelMap, centerContent, header }: Props) {
  const {
    panels,
    leftWidth,
    rightWidth,
    bottomHeight,
    leftCollapsed,
    rightCollapsed,
    bottomCollapsed,
    toggleZone,
    setZoneSize,
    movePanel,
    reorderPanel,
  } = useLayoutStore();

  const [draggingPanel, setDraggingPanel] = useState<PanelId | null>(null);

  const getPanelsForZone = (zone: DockZone) =>
    panels
      .filter((p) => p.zone === zone)
      .sort((a, b) => a.order - b.order);

  const handleDragStart = (panelId: PanelId) => {
    setDraggingPanel(panelId);
  };

  const handleDragEnd = () => {
    setDraggingPanel(null);
  };

  const handleDrop = (panelId: PanelId, zone: DockZone) => {
    movePanel(panelId, zone);
    setDraggingPanel(null);
  };

  const handleReorderDrop = (draggedId: PanelId, targetId: PanelId) => {
    const dragged = panels.find((p) => p.id === draggedId);
    const target = panels.find((p) => p.id === targetId);
    if (!dragged || !target) return;

    if (dragged.zone !== target.zone) {
      // Move to target's zone at target's position
      movePanel(draggedId, target.zone);
    }
    // Reorder to target position
    reorderPanel(draggedId, target.order);
    setDraggingPanel(null);
  };

  const renderZone = (zone: DockZone) => {
    const zonePanels = getPanelsForZone(zone);
    if (zonePanels.length === 0) return null;

    return zonePanels.map((panel) => {
      const mapping = panelMap.find((m) => m.id === panel.id);
      if (!mapping) return null;
      return (
        <Panel
          key={panel.id}
          id={panel.id}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onReorderDrop={handleReorderDrop}
          isDragging={draggingPanel === panel.id}
          isAnyDragging={draggingPanel !== null}
        >
          {mapping.component}
        </Panel>
      );
    });
  };

  const leftPanels = getPanelsForZone("left");
  const rightPanels = getPanelsForZone("right");
  const topPanels = getPanelsForZone("top");
  const bottomPanels = getPanelsForZone("bottom");

  const isDragging = draggingPanel !== null;

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
      {header}

      {/* Top zone (if panels moved here) */}
      {topPanels.length > 0 && (
        <div className="relative border-b border-white/5 overflow-y-auto custom-scrollbar" style={{ maxHeight: 300 }}>
          <DropZoneIndicator zone="top" active={isDragging} onDrop={handleDrop} />
          {renderZone("top")}
        </div>
      )}

      {/* Main area: left | center | right */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left sidebar */}
        {leftPanels.length > 0 && (
          <>
            <div
              className={`relative flex flex-col overflow-hidden transition-all duration-200 border-r border-white/5 bg-zinc-950 ${
                leftCollapsed ? "w-0" : ""
              }`}
              style={{ width: leftCollapsed ? 0 : leftWidth, minWidth: leftCollapsed ? 0 : 220 }}
            >
              <DropZoneIndicator zone="left" active={isDragging} onDrop={handleDrop} />
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 flex-shrink-0">
                <span className="text-[8px] text-white/15 uppercase tracking-[0.25em] font-black">
                  Left Panel
                </span>
                <ZoneToggle zone="left" collapsed={false} onClick={() => toggleZone("left")} />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {renderZone("left")}
              </div>
            </div>
            {!leftCollapsed && (
              <ResizeHandle
                direction="horizontal"
                onResize={(delta) => setZoneSize("left", Math.max(220, leftWidth + delta))}
              />
            )}
          </>
        )}

        {/* Collapsed left tab */}
        {leftCollapsed && leftPanels.length > 0 && (
          <div className="w-6 flex flex-col items-center pt-2 border-r border-white/5 flex-shrink-0 bg-zinc-950">
            <ZoneToggle zone="left" collapsed={true} onClick={() => toggleZone("left")} />
          </div>
        )}

        {/* Center */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Center drop zone when dragging */}
          {isDragging && topPanels.length === 0 && (
            <div
              className="absolute top-0 left-0 right-0 h-8 z-40 flex items-center justify-center"
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
              onDrop={(e) => {
                e.preventDefault();
                const panelId = e.dataTransfer.getData("panel-id") as PanelId;
                if (panelId) handleDrop(panelId, "top");
              }}
            >
              <span className="text-[8px] text-white/30 font-bold uppercase tracking-widest bg-white/5 border border-dashed border-white/15 px-3 py-1 rounded">
                Drop to top zone
              </span>
            </div>
          )}

          <div className="flex-1 overflow-auto custom-scrollbar">
            {centerContent}
          </div>

          {/* Bottom zone */}
          {bottomPanels.length > 0 && (
            <>
              {!bottomCollapsed && (
                <ResizeHandle
                  direction="vertical"
                  onResize={(delta) => setZoneSize("bottom", Math.max(100, bottomHeight - delta))}
                />
              )}
              <div
                className={`relative border-t border-white/5 bg-zinc-950 transition-all duration-200 overflow-hidden ${
                  bottomCollapsed ? "h-0" : ""
                }`}
                style={{ height: bottomCollapsed ? 0 : bottomHeight }}
              >
                <DropZoneIndicator zone="bottom" active={isDragging} onDrop={handleDrop} />
                <div className="flex items-center justify-between px-3 py-1 border-b border-white/5 flex-shrink-0">
                  <span className="text-[8px] text-white/15 uppercase tracking-[0.25em] font-black">
                    Bottom Panel
                  </span>
                  <ZoneToggle zone="bottom" collapsed={false} onClick={() => toggleZone("bottom")} />
                </div>
                <div className="h-full overflow-y-auto custom-scrollbar pb-8">
                  {renderZone("bottom")}
                </div>
              </div>
              {bottomCollapsed && (
                <div className="h-6 flex items-center justify-center border-t border-white/5 bg-zinc-950 flex-shrink-0">
                  <ZoneToggle zone="bottom" collapsed={true} onClick={() => toggleZone("bottom")} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Collapsed right tab */}
        {rightCollapsed && rightPanels.length > 0 && (
          <div className="w-6 flex flex-col items-center pt-2 border-l border-white/5 flex-shrink-0 bg-zinc-950">
            <ZoneToggle zone="right" collapsed={true} onClick={() => toggleZone("right")} />
          </div>
        )}

        {/* Right sidebar */}
        {rightPanels.length > 0 && (
          <>
            {!rightCollapsed && (
              <ResizeHandle
                direction="horizontal"
                onResize={(delta) => setZoneSize("right", Math.max(220, rightWidth - delta))}
              />
            )}
            <div
              className={`relative flex flex-col overflow-hidden transition-all duration-200 border-l border-white/5 bg-zinc-950 ${
                rightCollapsed ? "w-0" : ""
              }`}
              style={{ width: rightCollapsed ? 0 : rightWidth, minWidth: rightCollapsed ? 0 : 220 }}
            >
              <DropZoneIndicator zone="right" active={isDragging} onDrop={handleDrop} />
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 flex-shrink-0">
                <span className="text-[8px] text-white/15 uppercase tracking-[0.25em] font-black">
                  Right Panel
                </span>
                <ZoneToggle zone="right" collapsed={false} onClick={() => toggleZone("right")} />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {renderZone("right")}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
