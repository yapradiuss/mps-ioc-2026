"use client";

import { useState, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FileText, Calendar, AlertCircle, Maximize2, TrendingUp, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const EKOMPAUN_DB_DATA_URL = "/api/db-data/ekompaun_mpsp_summary";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface CompoundChartProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  disableInternalPositioning?: boolean;
}

interface EkompaunData {
  jenis_kompaun: string;
  total: number;
}

interface EkompaunSummary {
  ekompaun_mpsp: EkompaunData[];
  summary: {
    year: number;
    total_records: number;
    jenis_kompaun_count: number;
  };
}

// Color palette for jenis kompaun types
const JENIS_KOMPAUN_COLORS: Record<string, string> = {
  "BYLAW KENDERAAN": "#10b981",
  "BYLAW PELBAGAI": "#3b82f6",
  "BYLAW KAWASAN": "#f59e0b",
  "BYLAW PERNIAGAAN": "#ef4444",
  "BYLAW KESIHATAN": "#8b5cf6",
  "BYLAW BANGUNAN": "#06b6d4",
  "BYLAW LALU LINTAS": "#ec4899",
  "BYLAW ALAM SEKITAR": "#14b8a6",
};

// Generate color for jenis kompaun if not in predefined list
const getColorForJenisKompaun = (jenis: string, index: number): string => {
  if (JENIS_KOMPAUN_COLORS[jenis]) {
    return JENIS_KOMPAUN_COLORS[jenis];
  }
  // Generate colors for unknown types
  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00",
    "#0088fe", "#00c49f", "#ffbb28", "#ff8042", "#8884d8"
  ];
  return colors[index % colors.length];
};

export default function CompoundChart({ 
  initialPosition = { x: 300, y: 200 },
  initialSize = { width: 700, height: 800 },
  disableInternalPositioning = false
}: CompoundChartProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(500);
  const [ekompaunData, setEkompaunData] = useState<EkompaunData[]>([]);
  const [summary, setSummary] = useState<EkompaunSummary['summary'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MIN_WIDTH = 600;
  const MAX_WIDTH = 1000;
  const MIN_HEIGHT = 700;
  const MAX_HEIGHT = 1200;

  useEffect(() => {
    if (disableInternalPositioning && initialSize && (initialSize.width !== size.width || initialSize.height !== size.height)) {
      setSize(initialSize);
    }
  }, [disableInternalPositioning, initialSize?.width, initialSize?.height]);

  // Observe card width for responsive legend position when GridStack resizes
  useEffect(() => {
    if (!disableInternalPositioning || !cardRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0]?.contentRect ?? {};
      if (typeof width === "number" && width > 0) setContainerWidth(width);
    });
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, [disableInternalPositioning]);

  // Fetch ekompaun data from API
  useEffect(() => {
    const fetchEkompaunData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(EKOMPAUN_DB_DATA_URL);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch compound analytics: ${response.status}`);
        }
        
        const result: EkompaunSummary = await response.json();
        
        if (result.ekompaun_mpsp && Array.isArray(result.ekompaun_mpsp)) {
          setEkompaunData(result.ekompaun_mpsp);
          setSummary(result.summary || null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: any) {
        console.error('Error fetching compound analytics:', err);
        setError(err.message || 'Failed to load compound analytics');
        setEkompaunData([]);
        setSummary(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEkompaunData();
    
    // Refresh every 15 minutes (900000 ms)
    const interval = setInterval(fetchEkompaunData, 900000);
    
    return () => clearInterval(interval);
  }, []);

  // Prepare Chart.js data format for pie chart
  const pieChartData = ekompaunData.length > 0 ? {
    labels: ekompaunData.map(item => item.jenis_kompaun),
    datasets: [
      {
        label: "Jenis Kompaun",
        data: ekompaunData.map(item => item.total),
        backgroundColor: ekompaunData.map((item, index) => getColorForJenisKompaun(item.jenis_kompaun, index)),
        borderColor: ekompaunData.map((item, index) => getColorForJenisKompaun(item.jenis_kompaun, index) + '80'),
        borderWidth: 2,
      },
    ],
  } : {
    labels: [],
    datasets: [{
      label: "Jenis Kompaun",
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 2,
    }],
  };

  const totalRecords = summary?.total_records || ekompaunData.reduce((sum, item) => sum + item.total, 0);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: (containerWidth < 400 ? 'bottom' : 'right') as 'top' | 'left' | 'bottom' | 'right',
        labels: {
          color: '#fff',
          padding: 12,
          font: {
            size: 11,
          },
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const dataset = data.datasets[0];
              const total = dataset.data.reduce((a: number, b: number) => a + b, 0);
              return data.labels.map((label: string, i: number) => {
                const value = dataset.data[i];
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return {
                  text: `${label}: ${value} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: i,
                  fontColor: '#fff',
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      },
    },
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableInternalPositioning) return; // Disable when wrapped
    
    if (e.target instanceof HTMLElement && !e.target.closest('[data-drag-handle]')) {
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
    if (disableInternalPositioning) return; // Disable internal drag/resize when wrapped
    
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


  return (
    <div
      ref={cardRef}
      className={`${disableInternalPositioning ? "relative w-full h-full min-h-0 overflow-hidden flex flex-col" : "fixed"} z-[90] select-none ${!disableInternalPositioning && isDragging ? "cursor-grabbing" : ""} ${!disableInternalPositioning && isResizing ? "cursor-nwse-resize" : ""}`}
      style={{
        ...(disableInternalPositioning ? { width: "100%", height: "100%" } : {
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }),
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      <Card className={`rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col ${disableInternalPositioning ? "flex-1 min-h-0" : "h-full"}`}>
        <CardHeader
          data-drag-handle
          className="py-3 px-4 cursor-grab active:cursor-grabbing border-b border-white/10 select-none flex-shrink-0"
          onMouseDown={disableInternalPositioning ? undefined : handleMouseDown}
          style={{ cursor: disableInternalPositioning ? "default" : "grab" }}
        >
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-white font-semibold flex items-center gap-2 text-base truncate">
              <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 shrink-0" />
              <span className="truncate">Compound Analytics (2025)</span>
            </CardTitle>
            <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 flex-1 min-h-0 overflow-hidden flex flex-col">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-1 items-center justify-center min-h-[200px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white mx-auto mb-3" />
                <p className="text-white/70 text-sm">Loading compound data...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex flex-1 items-center justify-center min-h-[200px]">
              <div className="text-center max-w-[240px]">
                <AlertCircle className="h-10 w-10 text-red-400/90 mx-auto mb-3" />
                <p className="text-red-400/90 text-sm font-medium mb-1">Error loading data</p>
                <p className="text-white/50 text-xs leading-relaxed">{error}</p>
              </div>
            </div>
          )}
          
          {/* Main Content - flex layout so chart resizes with card when using GridStack */}
          {!isLoading && !error && ekompaunData.length > 0 && (
            <div className="flex flex-col flex-1 min-h-0 gap-4 overflow-hidden">
                {/* Summary row - compact and aligned */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 flex-shrink-0">
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-white/60 truncate">Total Records</span>
                      <FileText className="h-4 w-4 text-blue-400 shrink-0" />
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-white mt-1 tabular-nums">
                      {totalRecords.toLocaleString()}
                    </p>
                    <p className="text-[10px] sm:text-xs text-white/50 mt-0.5">Year 2025</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-white/60 truncate">Jenis Kompaun</span>
                      <TrendingUp className="h-4 w-4 text-green-400 shrink-0" />
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-white mt-1 tabular-nums">
                      {summary?.jenis_kompaun_count ?? ekompaunData.length}
                    </p>
                    <p className="text-[10px] sm:text-xs text-white/50 mt-0.5">Categories</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-white/60 truncate">Year</span>
                      <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-white mt-1 tabular-nums">
                      {summary?.year ?? 2025}
                    </p>
                    <p className="text-[10px] sm:text-xs text-white/50 mt-0.5">Filter period</p>
                  </div>
                </div>

                {/* Pie chart - takes remaining space, stable height for Chart.js */}
                <div
                  ref={chartWrapperRef}
                  className="flex flex-col flex-1 min-h-[220px] rounded-lg border border-white/10 bg-white/5 overflow-hidden"
                >
                  <h3 className="text-xs sm:text-sm font-medium text-white/90 px-3 py-2 text-center border-b border-white/10 flex-shrink-0">
                    Distribution by Jenis Kompaun
                  </h3>
                  <div className="flex-1 min-h-0 w-full p-2 sm:p-3">
                    <div className="h-full w-full min-h-[180px]">
                      <Pie data={pieChartData} options={chartOptions} />
                    </div>
                  </div>
                </div>

                {/* Breakdown list - fixed max height, scrollable */}
                <div className="flex flex-col flex-shrink-0 min-h-0 max-h-[220px]">
                  <h3 className="text-xs sm:text-sm font-medium text-white/90 mb-2 flex-shrink-0">
                    Jenis Kompaun Breakdown
                  </h3>
                  <div className="overflow-y-auto overflow-x-hidden pr-1 space-y-2 min-h-0 [scrollbar-gutter:stable]">
                    {ekompaunData.map((item, index) => {
                      const percentage = totalRecords > 0 ? (item.total / totalRecords) * 100 : 0;
                      const color = getColorForJenisKompaun(item.jenis_kompaun, index);
                      return (
                        <div
                          key={item.jenis_kompaun}
                          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition-colors"
                          style={{ borderLeftWidth: 3, borderLeftColor: color }}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                              {item.jenis_kompaun}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden min-w-0">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{ width: `${percentage}%`, backgroundColor: color }}
                                />
                              </div>
                              <span className="text-[10px] text-white/60 w-10 text-right shrink-0 tabular-nums">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="shrink-0 text-xs font-semibold tabular-nums"
                            style={{
                              backgroundColor: `${color}20`,
                              color,
                              borderColor: `${color}40`,
                            }}
                          >
                            {item.total.toLocaleString()}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && ekompaunData.length === 0 && (
            <div className="flex flex-1 items-center justify-center min-h-[200px]">
              <div className="text-center">
                <FileText className="h-10 w-10 text-white/40 mx-auto mb-3" />
                <p className="text-white/70 text-sm">No compound data available</p>
              </div>
            </div>
          )}
        </CardContent>
        
        {/* Resize Handle */}
        {!disableInternalPositioning && (
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center group"
            onMouseDown={handleResizeStart}
            style={{
              background: "linear-gradient(to top left, transparent 0%, transparent 45%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.1) 100%)",
            }}
          >
            <Maximize2 className="h-3 w-3 text-white/40 group-hover:text-white/70 transition-colors" />
          </div>
        )}
      </Card>
    </div>
  );
}

