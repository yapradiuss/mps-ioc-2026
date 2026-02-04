"use client";

import { useState, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Receipt, TrendingUp, Maximize2, DollarSign, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
const TAX_ANALYTICS_DB_DATA_URL = "/api/db-data/maklumat_akaun_analytics";

// Register Chart.js components
ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement);

interface TaxAnalyticsProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  disableInternalPositioning?: boolean;
}

// Tax categories
type TaxCategory = 
  | "current_income"
  | "current_arrears"
  | "current_penalty"
  | "penalty_arrears"
  | "current_warrant"
  | "warrant_arrears"
  | "other_charges"
  | "total_amount_due";

interface TaxData {
  category: TaxCategory;
  label: string;
  shortLabel: string;
  amount: number;
  count: number;
}

const CATEGORY_COLORS: Record<TaxCategory, string> = {
  current_income: "#10b981",
  current_arrears: "#ef4444",
  current_penalty: "#f59e0b",
  penalty_arrears: "#f97316",
  current_warrant: "#6366f1",
  warrant_arrears: "#8b5cf6",
  other_charges: "#06b6d4",
  total_amount_due: "#ec4899",
};

const CATEGORY_ICONS: Record<TaxCategory, string> = {
  current_income: "💰",
  current_arrears: "⚠️",
  current_penalty: "📋",
  penalty_arrears: "🔴",
  current_warrant: "⚖️",
  warrant_arrears: "🚨",
  other_charges: "📄",
  total_amount_due: "📊",
};

export default function TaxAnalytics({ 
  initialPosition = { x: 800, y: 200 },
  initialSize = { width: 800, height: 900 },
  disableInternalPositioning = false
}: TaxAnalyticsProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [taxData, setTaxData] = useState<TaxData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MIN_WIDTH = 700;
  const MAX_WIDTH = 1200;
  const MIN_HEIGHT = 800;
  const MAX_HEIGHT = 1200;

  useEffect(() => {
    if (disableInternalPositioning && initialSize && (initialSize.width !== size.width || initialSize.height !== size.height)) {
      setSize(initialSize);
    }
  }, [disableInternalPositioning, initialSize?.width, initialSize?.height]);

  // Fetch tax analytics data from API
  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(TAX_ANALYTICS_DB_DATA_URL);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tax analytics: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          const data = result.data;
          
          // Transform API data to widget format
          const transformedData: TaxData[] = [
            { 
              category: "current_income", 
              label: "Current Income", 
              shortLabel: "Income", 
              amount: data.current_income?.amount || 0, 
              count: data.current_income?.count || 0,
            },
            { 
              category: "current_arrears", 
              label: "Current Arrears", 
              shortLabel: "Arrears", 
              amount: data.current_arrears?.amount || 0, 
              count: data.current_arrears?.count || 0,
            },
            { 
              category: "current_penalty", 
              label: "Current Penalty", 
              shortLabel: "Penalty", 
              amount: data.current_penalty?.amount || 0, 
              count: data.current_penalty?.count || 0,
            },
            { 
              category: "penalty_arrears", 
              label: "Penalty Arrears", 
              shortLabel: "Pen. Arrears", 
              amount: data.penalty_arrears?.amount || 0, 
              count: data.penalty_arrears?.count || 0,
            },
            { 
              category: "current_warrant", 
              label: "Current Warrant", 
              shortLabel: "Warrant", 
              amount: data.current_warrant?.amount || 0, 
              count: data.current_warrant?.count || 0,
            },
            { 
              category: "warrant_arrears", 
              label: "Warrant Arrears", 
              shortLabel: "Warr. Arrears", 
              amount: data.warrant_arrears?.amount || 0, 
              count: data.warrant_arrears?.count || 0,
            },
            { 
              category: "other_charges", 
              label: "Other Charges", 
              shortLabel: "Others", 
              amount: data.other_charges?.amount || 0, 
              count: data.other_charges?.count || 0,
            },
            { 
              category: "total_amount_due", 
              label: "Total Amount Due", 
              shortLabel: "Total", 
              amount: data.total_amount_due?.amount || 0, 
              count: data.total_amount_due?.count || 0,
            },
          ];
          
          setTaxData(transformedData);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: any) {
        console.error('Error fetching tax analytics:', err);
        setError(err.message || 'Failed to load tax analytics');
        setTaxData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaxData();
    
    // Refresh every 15 minutes (900000 ms)
    const interval = setInterval(fetchTaxData, 900000);
    
    return () => clearInterval(interval);
  }, []);

  const totalAmount = taxData.reduce((sum, item) => sum + item.amount, 0);
  const totalItems = taxData.reduce((sum, item) => sum + item.count, 0);
  const totalAmountDue = taxData.find(d => d.category === "total_amount_due")?.amount || 0;

  // Filter out total_amount_due for charts (exclude from breakdown)
  const chartData = taxData.filter(d => d.category !== "total_amount_due");

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableInternalPositioning) return;
    
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

  // Bar chart data
  const barChartData = chartData.length > 0 ? {
    labels: chartData.map(item => item.shortLabel),
    datasets: [
      {
        label: 'Amount (RM)',
        data: chartData.map(item => item.amount),
        backgroundColor: chartData.map(item => CATEGORY_COLORS[item.category]),
        borderColor: chartData.map(item => CATEGORY_COLORS[item.category] + '80'),
        borderWidth: 2,
      },
    ],
  } : {
    labels: [],
    datasets: [{
      label: 'Amount (RM)',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 2,
    }],
  };

  // Doughnut chart data
  const doughnutChartData = chartData.length > 0 ? {
    labels: chartData.map(item => item.shortLabel),
    datasets: [
      {
        data: chartData.map(item => item.amount),
        backgroundColor: chartData.map(item => CATEGORY_COLORS[item.category]),
        borderColor: chartData.map(item => CATEGORY_COLORS[item.category] + '80'),
        borderWidth: 2,
      },
    ],
  } : {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#fff',
          padding: 8,
          font: {
            size: 10,
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
            const value = context.parsed?.y || context.parsed || 0;
            const percentage = totalAmount > 0 ? ((value / totalAmount) * 100).toFixed(1) : 0;
            return `${label}: RM ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
          font: {
            size: 9,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#fff',
          font: {
            size: 9,
          },
          callback: function(value: any) {
            return 'RM ' + (value / 1000).toFixed(0) + 'K';
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#fff',
          padding: 8,
          font: {
            size: 10,
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
            const percentage = totalAmount > 0 ? ((value / totalAmount) * 100).toFixed(1) : 0;
            return `${label}: RM ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      },
    },
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
              <Receipt className="text-green-400 h-5 w-5" />
              Tax Analytics Summary
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
                <p className="text-white/70 text-sm">Loading tax data...</p>
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
          {!isLoading && !error && taxData.length > 0 && (
            <ScrollArea className="flex-1 min-h-0">
              <div className="space-y-4 pr-4">
                {/* Overall Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-4 border border-green-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/70">Total Amount Due</span>
                      <DollarSign className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      RM {totalAmountDue.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      {totalItems.toLocaleString()} accounts
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg p-4 border border-blue-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/70">Total Collections</span>
                      <TrendingUp className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      RM {totalAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      All categories
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg p-4 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/70">Total Accounts</span>
                      <FileText className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {totalItems.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      Active records
                    </div>
                  </div>
                </div>

                {/* Category Summary Cards Grid */}
                <div>
                  <h3 className="text-sm font-semibold text-white/90 mb-3">Category Breakdown</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {chartData.map((item) => {
                      const percentage = totalAmount > 0 ? ((item.amount / totalAmount) * 100) : 0;
                      return (
                        <div
                          key={item.category}
                          className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                          style={{ borderLeftColor: CATEGORY_COLORS[item.category], borderLeftWidth: '4px' }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{CATEGORY_ICONS[item.category]}</span>
                              <div>
                                <div className="text-sm font-semibold text-white">{item.label}</div>
                                <div className="text-xs text-white/60">{item.shortLabel}</div>
                              </div>
                            </div>
                            <Badge 
                              className="text-xs"
                              style={{ 
                                backgroundColor: CATEGORY_COLORS[item.category] + '20',
                                color: CATEGORY_COLORS[item.category],
                                borderColor: CATEGORY_COLORS[item.category] + '50'
                              }}
                            >
                              {item.count}
                            </Badge>
                          </div>
                          <div className="text-xl font-bold text-white mb-1">
                            RM {item.amount.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: CATEGORY_COLORS[item.category],
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

                {/* Charts Section */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Bar Chart */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-white/90 mb-3 text-center">Amount Distribution</h3>
                    <div className="h-64">
                      <Bar data={barChartData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Doughnut Chart */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-white/90 mb-3 text-center">Percentage Breakdown</h3>
                    <div className="h-64">
                      <Doughnut data={doughnutChartData} options={doughnutOptions} />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
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
