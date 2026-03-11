"use client";

import { useEffect, useRef, useCallback, ReactNode } from "react";
import type { GridStack } from "gridstack";

const COLUMNS = 12;
const ROW_HEIGHT = 60;
const HEADER_OFFSET = 74;

function pxToGrid(
  px: { x: number; y: number; width: number; height: number },
  containerWidth: number
) {
  const colWidth = containerWidth / COLUMNS;
  return {
    x: Math.round(px.x / colWidth),
    y: Math.round((px.y - HEADER_OFFSET) / ROW_HEIGHT),
    w: Math.max(1, Math.round(px.width / colWidth)),
    h: Math.max(1, Math.round(px.height / ROW_HEIGHT)),
  };
}

function gridToPx(
  g: { x: number; y: number; w: number; h: number },
  containerWidth: number
) {
  const colWidth = containerWidth / COLUMNS;
  return {
    x: g.x * colWidth,
    y: HEADER_OFFSET + g.y * ROW_HEIGHT,
    width: g.w * colWidth,
    height: g.h * ROW_HEIGHT,
  };
}

export interface GridStackWidgetProps {
  children: ReactNode;
  widgetId: string;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
}

export function GridStackWidget({
  children,
  widgetId,
  initialPosition,
  initialSize,
  onPositionChange,
  onSizeChange,
}: GridStackWidgetProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInstanceRef = useRef<GridStack | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const onPositionChangeRef = useRef(onPositionChange);
  const onSizeChangeRef = useRef(onSizeChange);
  onPositionChangeRef.current = onPositionChange;
  onSizeChangeRef.current = onSizeChange;

  const syncFromGrid = useCallback(() => {
    const grid = gridInstanceRef.current;
    const container = gridRef.current;
    if (!grid || !container) return;
    const nodes = grid.getGridItems();
    if (nodes.length === 0) return;
    const node = grid.getGridItems()[0].gridstackNode;
    if (!node) return;
    const containerWidth = container.offsetWidth;
    const pos = gridToPx(
      {
        x: node.x ?? 0,
        y: node.y ?? 0,
        w: node.w ?? 4,
        h: node.h ?? 10,
      },
      containerWidth
    );
    onPositionChangeRef.current?.({ x: pos.x, y: pos.y });
    onSizeChangeRef.current?.({ width: pos.width, height: pos.height });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !gridRef.current || !itemRef.current)
      return;

    import("gridstack").then(({ GridStack }) => {
      const container = gridRef.current;
      if (!container || !itemRef.current) return;

      const containerWidth = container.offsetWidth;
      const gridOpts = {
        column: COLUMNS,
        cellHeight: ROW_HEIGHT,
        margin: 4,
        float: true,
        animate: true,
        draggable: { handle: "[data-drag-handle]" },
        resizable: { handles: "e, se, s, sw, w" },
        acceptWidgets: false,
      };

      const grid = GridStack.init(gridOpts, container);
      gridInstanceRef.current = grid;

      const px = {
        x: initialPosition.x,
        y: initialPosition.y,
        width: initialSize.width,
        height: initialSize.height,
      };
      const g = pxToGrid(px, containerWidth);

      grid.makeWidget(itemRef.current, {
        x: g.x,
        y: g.y,
        w: g.w,
        h: g.h,
        minW: 2,
        minH: 4,
        id: widgetId,
      });

      grid.on("dragstop resizestop", () => {
        syncFromGrid();
      });
    });

    return () => {
      const grid = gridInstanceRef.current;
      if (grid) {
        grid.destroy(false);
        gridInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="absolute inset-0 z-[90] pointer-events-none"
      style={{ top: HEADER_OFFSET }}
    >
      <div
        ref={gridRef}
        className="grid-stack pointer-events-auto h-full w-full"
        style={{ minHeight: "100%" }}
      >
        <div ref={itemRef}>
          <div className="grid-stack-item-content overflow-hidden rounded-lg h-full flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
