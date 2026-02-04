"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Boxes, MapPin, CheckCircle2, XCircle, AlertCircle, Maximize2, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIBox {
  id: string;
  name: string;
  location: string;
  status: "active" | "inactive" | "error";
  detections: number;
  lastDetection: string;
  confidence?: number;
  latestImage?: string;
}

interface AIBoxDetectionProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  disableInternalPositioning?: boolean;
}

// Mock data - replace with API call later
const mockAIBoxes: AIBox[] = [
  {
    id: "AIBOX-001",
    name: "Main Gate AI Box",
    location: "Gate A",
    status: "active",
    detections: 156,
    lastDetection: "2 min ago",
    confidence: 95,
  },
  {
    id: "AIBOX-002",
    name: "Parking Lot AI Box",
    location: "Parking Zone 1",
    status: "active",
    detections: 89,
    lastDetection: "1 min ago",
    confidence: 92,
  },
  {
    id: "AIBOX-003",
    name: "Perimeter AI Box",
    location: "Zone B",
    status: "inactive",
    detections: 0,
    lastDetection: "15 min ago",
    confidence: 0,
  },
  {
    id: "AIBOX-004",
    name: "Entrance AI Box",
    location: "Main Entrance",
    status: "active",
    detections: 203,
    lastDetection: "30 sec ago",
    confidence: 88,
    latestImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
  },
  {
    id: "AIBOX-005",
    name: "Security Post AI Box",
    location: "Security Post 1",
    status: "error",
    detections: 12,
    lastDetection: "5 min ago",
    confidence: 45,
  },
  {
    id: "AIBOX-006",
    name: "Data Center AI Box",
    location: "Data Center",
    status: "active",
    detections: 78,
    lastDetection: "1 min ago",
    confidence: 98,
  },
];

export default function AIBoxDetection({ 
  initialPosition,
  initialSize = { width: 380, height: 600 },
  disableInternalPositioning = false
}: AIBoxDetectionProps) {
  const [position, setPosition] = useState(initialPosition || { x: 900, y: 200 });
  const [size, setSize] = useState(initialSize);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (disableInternalPositioning && initialSize && (initialSize.width !== size.width || initialSize.height !== size.height)) {
      setSize(initialSize);
    }
  }, [disableInternalPositioning, initialSize?.width, initialSize?.height]);

  // Set initial position on client side only to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    if (!initialPosition && typeof window !== 'undefined') {
      setPosition({ x: window.innerWidth - 400, y: 200 });
    }
  }, [initialPosition]);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [aiboxes] = useState<AIBox[]>(mockAIBoxes);

  const MIN_WIDTH = 300;
  const MAX_WIDTH = 800;
  const MIN_HEIGHT = 400;
  const MAX_HEIGHT = 900;

  const activeCount = aiboxes.filter(a => a.status === "active").length;
  const inactiveCount = aiboxes.filter(a => a.status === "inactive").length;
  const errorCount = aiboxes.filter(a => a.status === "error").length;
  const totalDetections = aiboxes.reduce((sum, a) => sum + a.detections, 0);
  
  // Get latest image from the most recent active detection
  // Priority: boxes with "30 sec ago" or "1 min ago" are most recent
  const getTimePriority = (timeStr: string): number => {
    if (timeStr.includes("sec")) return 1;
    if (timeStr.includes("1 min")) return 2;
    if (timeStr.includes("2 min")) return 3;
    return 10; // older detections
  };
  
  const latestActiveBox = aiboxes
    .filter(a => a.status === "active" && a.latestImage)
    .sort((a, b) => getTimePriority(a.lastDetection) - getTimePriority(b.lastDetection))[0];
  
  const latestImage = latestActiveBox?.latestImage;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableInternalPositioning) return; // Disable when wrapped
    
    // Only allow dragging from the header
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

        // Constrain to viewport
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

  const getStatusIcon = (status: AIBox["status"]) => {
    switch (status) {
      case "active":
        return <Activity className="h-4 w-4 text-green-400 animate-pulse" />;
      case "inactive":
        return <Box className="h-4 w-4 text-gray-400" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusBadge = (status: AIBox["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">Inactive</Badge>;
      case "error":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Error</Badge>;
    }
  };

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

  // Determine if card is wide enough for 2-column layout
  const isWide = size.width >= 600;
  const isCompact = size.width < 350;

  return (
    <div
      ref={cardRef}
      className={`${disableInternalPositioning ? "relative w-full h-full overflow-hidden" : "fixed"} z-[90] select-none ${!disableInternalPositioning && isDragging ? "cursor-grabbing" : ""} ${!disableInternalPositioning && isResizing ? "cursor-nwse-resize" : ""}`}
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
      <Card className="bg-background/10 backdrop-blur-2xl border border-white/10 shadow-lg h-full flex flex-col">
        <CardHeader 
          data-drag-handle
          className="pb-3 cursor-grab active:cursor-grabbing border-b border-white/10 select-none flex-shrink-0"
          onMouseDown={disableInternalPositioning ? undefined : handleMouseDown}
          style={{ cursor: disableInternalPositioning ? "default" : "grab" }}
        >
          <div className="flex items-center justify-between">
            <CardTitle className={`text-white font-semibold flex items-center gap-2 ${isCompact ? "text-sm" : "text-lg"}`}>
              <Boxes className={`text-blue-400 ${isCompact ? "h-4 w-4" : "h-5 w-5"}`} />
              {!isCompact && "AI Box Detection"}
              {isCompact && "AI Box"}
            </CardTitle>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-1 min-h-0 overflow-hidden flex flex-col">
          {/* Latest Image */}
          {latestImage && (
            <div className="mb-4 rounded-lg overflow-hidden border border-white/10 bg-white/5">
              <div className="relative w-full" style={{ aspectRatio: '16/9', maxHeight: '200px' }}>
                <img
                  src={latestImage}
                  alt="Latest Detection"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                  <Activity className="h-3 w-3 text-green-400 animate-pulse" />
                  <span>Latest Detection</span>
                </div>
                {latestActiveBox && (
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                    {latestActiveBox.location}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Summary Stats */}
          <div className={`grid gap-2 mb-4 ${isCompact ? "grid-cols-2" : "grid-cols-4"}`}>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className={`flex items-center justify-center gap-1 mb-1 ${isCompact ? "flex-col" : ""}`}>
                <CheckCircle2 className={`text-green-400 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                <span className={`font-bold text-white ${isCompact ? "text-lg" : "text-2xl"}`}>{activeCount}</span>
              </div>
              <p className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>Active</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className={`flex items-center justify-center gap-1 mb-1 ${isCompact ? "flex-col" : ""}`}>
                <Box className={`text-gray-400 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                <span className={`font-bold text-white ${isCompact ? "text-lg" : "text-2xl"}`}>{inactiveCount}</span>
              </div>
              <p className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>Inactive</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className={`flex items-center justify-center gap-1 mb-1 ${isCompact ? "flex-col" : ""}`}>
                <AlertCircle className={`text-red-400 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                <span className={`font-bold text-white ${isCompact ? "text-lg" : "text-2xl"}`}>{errorCount}</span>
              </div>
              <p className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>Error</p>
            </div>
            {!isCompact && (
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <span className="text-2xl font-bold text-white">{totalDetections}</span>
                </div>
                <p className="text-xs text-white/70">Total</p>
              </div>
            )}
          </div>

          {/* AI Box List */}
          <div className={`space-y-2 overflow-y-auto flex-1 ${isWide ? "grid grid-cols-2 gap-2" : ""}`}>
            {aiboxes.map((aibox) => (
              <div
                key={aibox.id}
                className={`bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors ${isWide ? "p-2" : "p-3"}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getStatusIcon(aibox.status)}
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium text-white truncate flex items-center gap-1 ${isCompact ? "text-xs" : "text-sm"}`}>
                        <MapPin className="h-3 w-3 flex-shrink-0 text-white/60" />
                        <span className="truncate">{aibox.location}</span>
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(aibox.status)}
                </div>
                
                {/* Detections and Confidence */}
                <div className={`space-y-1.5 ${isCompact ? "mt-1" : "mt-2"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <Activity className={`text-blue-400 flex-shrink-0 ${isCompact ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
                      <span className={`text-white/70 truncate ${isCompact ? "text-[10px]" : "text-xs"}`}>
                        Detections
                      </span>
                      <span className={`text-white flex-shrink-0 font-medium ${isCompact ? "text-[10px]" : "text-xs"}`}>
                        {aibox.detections}
                      </span>
                    </div>
                  </div>
                  {aibox.status === "active" && aibox.confidence && (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <div className="flex-1 bg-white/10 rounded-full h-1.5 min-w-0">
                          <div
                            className={`h-1.5 rounded-full ${
                              aibox.confidence > 80
                                ? "bg-green-400"
                                : aibox.confidence > 60
                                ? "bg-yellow-400"
                                : "bg-red-400"
                            }`}
                            style={{ width: `${aibox.confidence}%` }}
                          />
                        </div>
                        <span className={`text-white/70 flex-shrink-0 ${isCompact ? "text-[10px] min-w-[30px]" : "text-xs min-w-[35px]"}`}>
                          {aibox.confidence}%
                        </span>
                      </div>
                    </div>
                  )}
                  {!isCompact && (
                    <div className="flex items-center justify-end mt-1.5">
                      <span className={`text-white/50 ${isCompact ? "text-[10px]" : "text-xs"}`}>
                        {aibox.lastDetection}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center group"
          onMouseDown={handleResizeStart}
          style={{
            background: "linear-gradient(to top left, transparent 0%, transparent 45%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.1) 100%)",
          }}
        >
          <Maximize2 className="h-3 w-3 text-white/40 group-hover:text-white/70 transition-colors" />
        </div>
      </Card>
    </div>
  );
}

