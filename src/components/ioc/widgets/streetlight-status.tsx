"use client";

import { useState, useRef, useEffect } from "react";
import { Lightbulb, LightbulbOff, MapPin, Zap, AlertCircle, CheckCircle2, Maximize2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Streetlight {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  brightness: number;
  lastUpdate: string;
  device_id?: string;
  device_name?: string;
  device_status?: string;
  status_power?: string;
  dim_value?: number;
  latitude?: string;
  longitude?: string;
}

interface StreetlightStatusProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  disableInternalPositioning?: boolean; // When true, widget is wrapped in DraggableWidget
}

// Helper function to format time ago
const formatTimeAgo = (timestamp: string | Date): string => {
  if (!timestamp) return "N/A";
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

// Dummy streetlight data: 3000 offline (no API)
const DUMMY_OFFLINE_COUNT = 3000;
const DUMMY_STREETLIGHTS: Streetlight[] = Array.from({ length: DUMMY_OFFLINE_COUNT }, (_, i) => {
  const id = `SL-${String(i + 1).padStart(5, "0")}`;
  const zone = ["Zone A", "Zone B", "Zone C", "Jalan Merdeka", "Persiaran Cyber"][i % 5];
  return {
    id,
    name: `Streetlight ${i + 1}`,
    location: `${zone}, Lamp ${(i % 100) + 1}`,
    status: "offline" as const,
    brightness: 0,
    lastUpdate: new Date(Date.now() - (i % 60) * 60000).toISOString(),
    device_id: id,
    device_name: `Streetlight ${i + 1}`,
    device_status: "OFF",
    status_power: "0",
    dim_value: 0,
    latitude: (2.76 + (i % 100) * 0.001).toFixed(6),
    longitude: (101.73 + (i % 100) * 0.001).toFixed(6),
  };
});

export default function StreetlightStatus({ 
  initialPosition = { x: 100, y: 200 },
  initialSize = { width: 380, height: 600 },
  disableInternalPositioning = false
}: StreetlightStatusProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [streetlights, setStreetlights] = useState<Streetlight[]>(DUMMY_STREETLIGHTS);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(() => new Date());

  const MIN_WIDTH = 300;
  const MAX_WIDTH = 800;
  const MIN_HEIGHT = 400;
  const MAX_HEIGHT = 800;

  // When inside DraggableWidget, sync size from parent so content scales with box
  useEffect(() => {
    if (disableInternalPositioning && initialSize && (initialSize.width !== size.width || initialSize.height !== size.height)) {
      setSize(initialSize);
    }
  }, [disableInternalPositioning, initialSize?.width, initialSize?.height]);

  // Dummy data: refresh just updates "last refresh" time
  const refreshDummy = () => {
    setLastRefresh(new Date());
  };

  const onlineCount = streetlights.filter(s => s.status === "online").length;
  const offlineCount = streetlights.filter(s => s.status === "offline").length;
  const maintenanceCount = streetlights.filter(s => s.status === "maintenance").length;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const getStatusIcon = (status: Streetlight["status"]) => {
    switch (status) {
      case "online":
        return <Lightbulb className="h-4 w-4 text-green-400" />;
      case "offline":
        return <LightbulbOff className="h-4 w-4 text-red-400" />;
      case "maintenance":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: Streetlight["status"]) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Online</Badge>;
      case "offline":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Offline</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Maintenance</Badge>;
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

  const REF_WIDTH = 380;
  const REF_HEIGHT = 600;
  const scaleX = size.width / REF_WIDTH;
  const scaleY = size.height / REF_HEIGHT;

  return (
    <div
      ref={cardRef}
      className={`${disableInternalPositioning ? "relative w-full h-full overflow-hidden" : ""} ${!disableInternalPositioning ? "fixed" : ""} z-[90] select-none ${!disableInternalPositioning && isDragging ? "cursor-grabbing" : ""} ${!disableInternalPositioning && isResizing ? "cursor-nwse-resize" : ""}`}
      style={{
        ...(disableInternalPositioning ? { width: "100%", height: "100%" } : {
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: "auto",
          minHeight: `${size.height}px`,
        }),
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {disableInternalPositioning ? (
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
      <Card className="bg-background/10 backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col h-full overflow-hidden">
        <CardHeader 
          data-drag-handle
          className="pb-3 border-b border-white/10 select-none flex-shrink-0"
          onMouseDown={disableInternalPositioning ? undefined : handleMouseDown}
          style={{ cursor: disableInternalPositioning ? "default" : "grab" }}
        >
          <div className="flex items-center justify-between">
            <CardTitle className={`text-white font-semibold flex items-center gap-2 ${isCompact ? "text-sm" : "text-lg"}`}>
              <Zap className={`text-yellow-400 ${isCompact ? "h-4 w-4" : "h-5 w-5"}`} />
              {!isCompact && "Streetlight Status"}
              {isCompact && "Streetlights"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={refreshDummy}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4 text-white/70" />
              </button>
              <div className="flex items-center gap-1 text-xs text-white/70">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Dummy data
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-1 overflow-y-auto max-h-[600px]">
          {/* Summary Stats */}
          <div className={`grid gap-2 mb-4 ${isCompact ? "grid-cols-3" : isWide ? "grid-cols-3" : "grid-cols-3"}`}>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className={`flex items-center justify-center gap-1 mb-1 ${isCompact ? "flex-col" : ""}`}>
                <CheckCircle2 className={`text-green-400 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                <span className={`font-bold text-white ${isCompact ? "text-lg" : "text-2xl"}`}>{onlineCount}</span>
              </div>
              <p className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>Online</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className={`flex items-center justify-center gap-1 mb-1 ${isCompact ? "flex-col" : ""}`}>
                <LightbulbOff className={`text-red-400 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                <span className={`font-bold text-white ${isCompact ? "text-lg" : "text-2xl"}`}>{offlineCount}</span>
              </div>
              <p className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>Offline</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className={`flex items-center justify-center gap-1 mb-1 ${isCompact ? "flex-col" : ""}`}>
                <AlertCircle className={`text-yellow-400 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                <span className={`font-bold text-white ${isCompact ? "text-lg" : "text-2xl"}`}>{maintenanceCount}</span>
              </div>
              <p className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>Maintenance</p>
            </div>
          </div>

          {/* Streetlight List */}
          {streetlights.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-white/70">No streetlight data available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {streetlights.slice(0, isCompact ? 5 : isWide ? 20 : 10).map((streetlight) => (
                <div
                  key={streetlight.id}
                  className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      {getStatusIcon(streetlight.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-medium text-white truncate ${isCompact ? "text-xs" : "text-sm"}`}>
                            {streetlight.name}
                          </p>
                          {getStatusBadge(streetlight.status)}
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-white/60 truncate ${isCompact ? "text-[10px]" : "text-xs"}`}>
                            {streetlight.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-yellow-400" />
                            <p className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>
                              {streetlight.brightness}%
                            </p>
                          </div>
                          {lastRefresh && (
                            <p className={`text-white/50 ${isCompact ? "text-[10px]" : "text-xs"}`}>
                              {formatTimeAgo(lastRefresh)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {streetlights.length > (isCompact ? 5 : isWide ? 20 : 10) && (
                <p className="text-center text-xs text-white/50 pt-2">
                  Showing {isCompact ? 5 : isWide ? 20 : 10} of {streetlights.length} streetlights
                </p>
              )}
            </div>
          )}
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
      ) : (
      <Card className="bg-background/10 backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col">
        <CardHeader 
          data-drag-handle
          className="pb-3 border-b border-white/10 select-none flex-shrink-0"
          onMouseDown={handleMouseDown}
          style={{ cursor: "grab" }}
        >
          <div className="flex items-center justify-between">
            <CardTitle className={`text-white font-semibold flex items-center gap-2 ${isCompact ? "text-sm" : "text-lg"}`}>
              <Zap className={`text-yellow-400 ${isCompact ? "h-4 w-4" : "h-5 w-5"}`} />
              {!isCompact && "Streetlight Status"}
              {isCompact && "Streetlights"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <button onClick={refreshDummy} className="p-1 hover:bg-white/10 rounded transition-colors" title="Refresh">
                <RefreshCw className="h-4 w-4 text-white/70" />
              </button>
              <div className="flex items-center gap-1 text-xs text-white/70">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Dummy data
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-1 overflow-y-auto max-h-[600px]">
          <div className={`grid gap-2 mb-4 ${isCompact ? "grid-cols-3" : "grid-cols-3"}`}>
            <div className="bg-white/5 rounded-lg p-2 text-center"><div className={`flex items-center justify-center gap-1 mb-1 ${isCompact ? "flex-col" : ""}`}><CheckCircle2 className={`text-green-400 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} /><span className={`font-bold text-white ${isCompact ? "text-lg" : "text-2xl"}`}>{onlineCount}</span></div><p className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>Online</p></div>
            <div className="bg-white/5 rounded-lg p-2 text-center"><div className={`flex items-center justify-center gap-1 mb-1 ${isCompact ? "flex-col" : ""}`}><LightbulbOff className={`text-red-400 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} /><span className={`font-bold text-white ${isCompact ? "text-lg" : "text-2xl"}`}>{offlineCount}</span></div><p className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>Offline</p></div>
            <div className="bg-white/5 rounded-lg p-2 text-center"><div className={`flex items-center justify-center gap-1 mb-1 ${isCompact ? "flex-col" : ""}`}><AlertCircle className={`text-yellow-400 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} /><span className={`font-bold text-white ${isCompact ? "text-lg" : "text-2xl"}`}>{maintenanceCount}</span></div><p className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>Maintenance</p></div>
          </div>
          {streetlights.length === 0 ? (
            <div className="flex items-center justify-center py-8"><p className="text-sm text-white/70">No streetlight data available</p></div>
          ) : (
            <div className="space-y-2">
              {streetlights.slice(0, isCompact ? 5 : isWide ? 20 : 10).map((streetlight) => (
                <div key={streetlight.id} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      {getStatusIcon(streetlight.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-medium text-white truncate ${isCompact ? "text-xs" : "text-sm"}`}>{streetlight.name}</p>
                          {getStatusBadge(streetlight.status)}
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-white/60 truncate ${isCompact ? "text-[10px]" : "text-xs"}`}>{streetlight.location}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1"><Zap className="h-3 w-3 text-yellow-400" /><p className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>{streetlight.brightness}%</p></div>
                          {lastRefresh && <p className={`text-white/50 ${isCompact ? "text-[10px]" : "text-xs"}`}>{formatTimeAgo(lastRefresh)}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {streetlights.length > (isCompact ? 5 : isWide ? 20 : 10) && <p className="text-center text-xs text-white/50 pt-2">Showing {isCompact ? 5 : isWide ? 20 : 10} of {streetlights.length} streetlights</p>}
            </div>
          )}
        </CardContent>
        <div className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center group" onMouseDown={handleResizeStart} style={{ background: "linear-gradient(to top left, transparent 0%, transparent 45%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.1) 100%)" }}>
          <Maximize2 className="h-3 w-3 text-white/40 group-hover:text-white/70 transition-colors" />
        </div>
      </Card>
      )}
    </div>
  );
}

