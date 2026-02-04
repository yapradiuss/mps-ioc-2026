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
import { ScrollArea } from "@/components/ui/scroll-area";
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
        position: 'right' as const,
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
      <Card className={`bg-background/10 backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col ${disableInternalPositioning ? "flex-1 min-h-0" : "h-full"}`}>
        <CardHeader 
          data-drag-handle
          className="pb-3 cursor-grab active:cursor-grabbing border-b border-white/10 select-none flex-shrink-0"
          onMouseDown={disableInternalPositioning ? undefined : handleMouseDown}
          style={{ cursor: disableInternalPositioning ? "default" : "grab" }}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-white font-semibold flex items-center gap-2 text-lg">
              <Receipt className="text-blue-400 h-5 w-5" />
              Compound Analytics (2025)
            </CardTitle>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-1 min-h-0 overflow-hidden flex flex-col">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-white/70 text-sm">Loading compound data...</p>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-400 text-sm mb-2">Error loading data</p>
                <p className="text-white/50 text-xs">{error}</p>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          {!isLoading && !error && ekompaunData.length > 0 && (
            <ScrollArea className="flex-1 min-h-0">
              <div className="space-y-4 pr-4">
                {/* Overall Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg p-4 border border-blue-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/70">Total Records</span>
                      <FileText className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {totalRecords.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      Year 2025
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-4 border border-green-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/70">Jenis Kompaun</span>
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {summary?.jenis_kompaun_count || ekompaunData.length}
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      Categories
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg p-4 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/70">Year</span>
                      <Calendar className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {summary?.year || 2025}
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      Filter period
                    </div>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/90 mb-3 text-center">
                    Distribution by Jenis Kompaun
                  </h3>
                  <div className="h-80">
                    <Pie data={pieChartData} options={chartOptions} />
                  </div>
                </div>

                {/* Jenis Kompaun Breakdown Cards */}
                <div>
                  <h3 className="text-sm font-semibold text-white/90 mb-3">Jenis Kompaun Breakdown</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {ekompaunData.map((item, index) => {
                      const percentage = totalRecords > 0 ? ((item.total / totalRecords) * 100) : 0;
                      const color = getColorForJenisKompaun(item.jenis_kompaun, index);
                      return (
                        <div
                          key={item.jenis_kompaun}
                          className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                          style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-white">{item.jenis_kompaun}</div>
                            </div>
                            <Badge 
                              className="text-xs"
                              style={{ 
                                backgroundColor: color + '20',
                                color: color,
                                borderColor: color + '50'
                              }}
                            >
                              {item.total}
                            </Badge>
                          </div>
                          <div className="text-xl font-bold text-white mb-1">
                            {item.total.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: color,
                                }}
                              />
                            </div>
                            <span className="text-xs text-white/60 w-12 text-right">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          {/* Empty State */}
          {!isLoading && !error && ekompaunData.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="h-8 w-8 text-white/40 mx-auto mb-2" />
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

