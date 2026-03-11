"use client";

import { ReactNode } from "react";
import { GridStackWidget } from "@/components/ioc/gridstack-widget";

export interface StreetlightGridStackWidgetProps {
  children: ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  widgetId?: string;
}

/** @deprecated Use GridStackWidget with widgetId="streetlight" instead. */
export function StreetlightGridStackWidget(props: StreetlightGridStackWidgetProps) {
  return (
    <GridStackWidget
      {...props}
      widgetId={props.widgetId ?? "streetlight"}
    />
  );
}
