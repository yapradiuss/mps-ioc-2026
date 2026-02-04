"use client";

import { useState, useEffect, useRef } from "react";
import { Users, TrendingUp, Maximize2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Dummy data: last 7 days human counts per location (no API)
const DUMMY_LOCATIONS: Location[] = [
  { id: "C01", name: "C01 - IOC Tengah" },
  { id: "C02", name: "C02 - IOC Pintu Depan" },
  { id: "C03", name: "C03 - IOC Kiri" },
  { id: "C04", name: "C04 - IOC Belakang" },
  { id: "C05", name: "C05 - IOC Luar" },
  { id: "C06", name: "C06 - IOC Server" },
];

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function buildDummyHumanChartData(): ChartDataPoint[] {
  const dates = getLast7Days();
  const locationIds = DUMMY_LOCATIONS.map((l) => l.id);
  return dates.map((date) => {
    const row: ChartDataPoint = { date };
    locationIds.forEach((id, i) => {
      row[id] = 80 + Math.floor(Math.random() * 120) + (i + 1) * 15;
    });
    return row;
  });
}

interface HumanCountingProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  disableInternalPositioning?: boolean;
}

// Chart rows: date + dynamic location ids (e.g. C01-C06 or DB-driven ids)
interface ChartDataPoint {
  date: string;
  [locationId: string]: string | number;
}

interface Location {
  id: string;
  name: string;
}

// Generate colors for locations dynamically
const generateColor = (index: number): string => {
  const colors = [
    "#ef4444", // Red
    "#3b82f6", // Blue
    "#22c55e", // Green
    "#f59e0b", // Amber
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#84cc16", // Lime
    "#6366f1", // Indigo
  ];
  return colors[index % colors.length];
};

export default function HumanCounting({
  initialPosition,
  initialSize = { width: 600, height: 500 },
  disableInternalPositioning = false,
}: HumanCountingProps) {
  const [position, setPosition] = useState(initialPosition || { x: 100, y: 200 });
  const [size, setSize] = useState(initialSize);
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const [chartData, setChartData] = useState<ChartDataPoint[]>(() => buildDummyHumanChartData());
  const [locations] = useState<Location[]>(DUMMY_LOCATIONS);
  const totalCount = chartData.reduce((sum, day) => {
    return sum + DUMMY_LOCATIONS.reduce((s, loc) => s + Number(day[loc.id] ?? 0), 0);
  }, 0);

  const MIN_WIDTH = 400;
  const MAX_WIDTH = 1200;
  const MIN_HEIGHT = 350;
  const MAX_HEIGHT = 900;

  useEffect(() => {
    setIsMounted(true);
    if (!initialPosition && typeof window !== "undefined") {
      setPosition({ x: window.innerWidth - 650, y: 200 });
    }
  }, [initialPosition]);

  // When inside DraggableWidget, sync size from parent so content scales with box
  useEffect(() => {
    if (disableInternalPositioning && initialSize && (initialSize.width !== size.width || initialSize.height !== size.height)) {
      setSize(initialSize);
    }
  }, [disableInternalPositioning, initialSize?.width, initialSize?.height]);

  const refreshDummy = () => setChartData(buildDummyHumanChartData());

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableInternalPositioning) return;

    if (e.target instanceof HTMLElement && !e.target.closest("[data-drag-handle]")) {
      return;
    }

    if (!cardRef.current) return;

    e.preventDefault();
    const rect = cardRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    if (disableInternalPositioning) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, resizeStart.width + deltaX));
        const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, resizeStart.height + deltaY));

        setSize({ width: newWidth, height: newHeight });
      } else if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, size, disableInternalPositioning]);

  const handleResizeStart = (e: React.MouseEvent) => {
    if (disableInternalPositioning) return;
    
    e.preventDefault();
    e.stopPropagation();

    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
    });
    setIsResizing(true);
  };

  // Format date for display (full format)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  // Format date for X-axis (compact format showing month/day)
  const formatDateForAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-2">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => {
            const location = locations.find(loc => loc.id === entry.dataKey);
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-white/70">{location?.name || entry.dataKey}:</span>
                <span className="text-white font-medium">{entry.value.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const REF_WIDTH = 600;
  const REF_HEIGHT = 500;
  const scaleX = size.width / REF_WIDTH;
  const scaleY = size.height / REF_HEIGHT;
  const isCompact = size.width < 500;

  return (
    <div
      ref={cardRef}
      className={`${disableInternalPositioning ? "relative" : "fixed"} z-[90] select-none overflow-hidden ${
        !disableInternalPositioning && isDragging ? "cursor-grabbing" : ""
      } ${!disableInternalPositioning && isResizing ? "cursor-nwse-resize" : ""}`}
      style={{
        ...(disableInternalPositioning
          ? {}
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
            }),
        width: `${size.width}px`,
        height: `${size.height}px`,
        userSelect: "none",
      }}
    >
      {/* Scale wrapper: content is laid out at REF size then scaled to box so it always fits */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: REF_WIDTH,
          height: REF_HEIGHT,
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "0 0",
        }}
      >
      <Card className="bg-background/10 backdrop-blur-2xl border border-white/10 shadow-lg h-full w-full flex flex-col overflow-hidden">
        <CardHeader
          data-drag-handle
          className="pb-3 cursor-grab active:cursor-grabbing border-b border-white/10 select-none flex-shrink-0 px-4 pt-4"
          onMouseDown={disableInternalPositioning ? undefined : handleMouseDown}
          style={{ cursor: disableInternalPositioning ? "default" : "grab" }}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-white font-semibold flex items-center gap-2 text-base">
              <Users className="text-pink-400 h-5 w-5 flex-shrink-0" />
              <span className="truncate">{!isCompact && "Human Counting"}
              {isCompact && "Humans"}</span>
            </CardTitle>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 text-xs">
                Last 7 Days
              </Badge>
              <button
                onClick={refreshDummy}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="h-4 w-4 text-white/70" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-1 overflow-hidden flex flex-col min-h-0 px-4 pb-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4 flex-shrink-0">
            <div className="bg-white/5 rounded-lg p-2 text-center min-w-0">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4 text-pink-400 flex-shrink-0" />
                <span className="font-bold text-white text-lg">{totalCount.toLocaleString()}</span>
              </div>
              <p className="text-xs text-white/70">Total Humans</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center min-w-0">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="font-bold text-white text-lg">{Math.round(totalCount / 7).toLocaleString()}</span>
              </div>
              <p className="text-xs text-white/70">Daily Average</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center min-w-0">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="font-bold text-white text-lg">{locations.length}</span>
              </div>
              <p className="text-xs text-white/70">Locations</p>
            </div>
          </div>

          {/* Line Chart - fills remaining space */}
          <div className="flex-1 min-h-0 flex flex-col">
            {!chartData.length ? (
              <div className="flex flex-col items-center justify-center flex-1 min-h-[200px] text-white/60 gap-2 text-sm">
                <Users className="h-10 w-10 text-pink-400/60" />
                <p>No human data for last 7 days</p>
              </div>
            ) : (
              <div className="w-full flex-1 min-h-0" style={{ minHeight: 200 }}>
                <ResponsiveContainer width="100%" height="100%" key={`human-chart-${size.width}-${size.height}`}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="date"
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tickFormatter={(value) => formatDateForAxis(value)}
                    />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: "10px" }}
                      formatter={(value) => {
                        const location = locations.find(loc => loc.id === value);
                        return (
                          <span style={{ color: "rgba(255,255,255,0.8)" }}>
                            {location?.name || value}
                          </span>
                        );
                      }}
                    />
                    {locations.map((location, index) => (
                      <Line
                        key={location.id}
                        type="monotone"
                        dataKey={location.id}
                        name={location.id}
                        stroke={generateColor(index)}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Resize handle outside scale so it stays grabbable */}
      {!disableInternalPositioning && (
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center group z-10"
          onMouseDown={handleResizeStart}
          style={{
            background:
              "linear-gradient(to top left, transparent 0%, transparent 45%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.1) 100%)",
          }}
        >
          <Maximize2 className="h-3 w-3 text-white/40 group-hover:text-white/70 transition-colors" />
        </div>
      )}
    </div>
  );
}
