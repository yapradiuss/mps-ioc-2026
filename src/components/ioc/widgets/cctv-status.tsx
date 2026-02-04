"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, CameraOff, MapPin, Video, CheckCircle2, Maximize2, Thermometer, Droplets, RefreshCw, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CCTV {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  signal: number;
  storage: number;
  lastUpdate: string;
  resolution?: string;
  temperature: number;
  humidity: number;
  hid?: string; // Device ID from API
}

interface CCTVStatusProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  disableInternalPositioning?: boolean; // When true, widget is wrapped in DraggableWidget
}

// CCTV device list with names and device IDs
const cctvDevices = [
  { name: "MPSp- Industrial Park", hid: "c8155800002f" },
  { name: "MPSp-Depo BBST 1", hid: "c81558000137" },
  { name: "MPSp-Depo BBST 2", hid: "c81558000086" },
  { name: "MPSp-Depo Putra Perdana 1", hid: "c8155800004c" },
  { name: "MPSp-Depo Putra Perdana 2", hid: "c81559000094" },
  { name: "MPSp-JPS 1", hid: "c81558000035" },
  { name: "MPSp-Kapal Korek 1", hid: "c815580000d1" },
  { name: "MPSp-Kapal Korek 2", hid: "c81558000139" },
  { name: "MPSp-KG SG Melut", hid: "c81558000084" },
  { name: "MPSp-Rambutan Kg. Sg. Buah Dua", hid: "c81558000031" },
  { name: "MPSp-Sg Pelek", hid: "c815580000ac" },
  { name: "MPSp-Taman Ixora", hid: "c81558000051" },
  { name: "MPSp-Tepi Lombong Batu Satu", hid: "c815580000d9" },
  { name: "MPSp-Tmn Dahlia 1", hid: "c81558000180" },
  { name: "MPSp-Tmn Seri Delima", hid: "c8155800016c" },
  { name: "MPSp06-C01 APEC Bomba", hid: "c81559000091" },
  { name: "MPSp06-C02 Hospital Cyberjaya", hid: "c81558000122" },
  { name: "MPSp06-C03 Persiaran Semarak Api", hid: "c8155900008e" },
  { name: "MPSp06-C04 Radius Cyberjaya", hid: "c8155900008f" },
  { name: "MPSp06-C05 Setia Eco Glades", hid: "c815580001e1" },
  { name: "MPSp06-C06 Stesen MRT Cyberjaya", hid: "c81559000093" },
  { name: "MPSp06-C07 Medan Seroja", hid: "c815050004f6" },
  { name: "MPSp06-C08 Perhentian Bas Seroja", hid: "c815050004f9" },
  { name: "MPSp06-C09 Psr Mlm Seroja", hid: "c815050004f5" },
  { name: "MPSp06-C10 Simpang Seroja", hid: "c815050004de" },
  // Site Below (test CCTV_API_TOKEN vs CCTV_API_TOKEN_15 in backend .env)
  { name: "Taman Tasek 1", hid: "c8155800024a" },
  { name: "Taman Tasek 2", hid: "c81558000249" },
  { name: "Taman Tasek 3", hid: "c8155800024d" },
  { name: "Traffik Light MDEC", hid: "c8155800024c" },
  { name: "Traffik Light Dell", hid: "c8155800024e" },
  { name: "Traffik Light TM", hid: "c8155800024f" },
];

// Helper function to map status number to online/offline
// Status 2 = online, other values = offline
const mapStatus = (status: number): "online" | "offline" => {
  return status === 2 ? "online" : "offline";
};

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

// Mock data - fallback if API fails (using real device names)
const mockCCTVs: CCTV[] = cctvDevices.map((device, index) => ({
  id: device.hid,
  name: device.name,
  location: device.name, // Use actual device name as location
  status: "offline" as const,
  signal: 0,
  storage: 0,
  lastUpdate: new Date().toISOString(),
  temperature: 0,
  humidity: 0,
  hid: device.hid,
}));

export default function CCTVStatus({ 
  initialPosition = { x: 500, y: 200 },
  initialSize = { width: 380, height: 600 },
  disableInternalPositioning = false
}: CCTVStatusProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [cctvs, setCctvs] = useState<CCTV[]>(mockCCTVs);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Frontend cache to avoid redundant API calls
  const cacheRef = useRef<Map<string, { data: CCTV; timestamp: number }>>(new Map());
  const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

  const MIN_WIDTH = 300;
  const MAX_WIDTH = 800;
  const MIN_HEIGHT = 400;
  const MAX_HEIGHT = 900;

  useEffect(() => {
    if (disableInternalPositioning && initialSize && (initialSize.width !== size.width || initialSize.height !== size.height)) {
      setSize(initialSize);
    }
  }, [disableInternalPositioning, initialSize?.width, initialSize?.height]);

  // Fetch CCTV status from API with batch loading and frontend caching
  const fetchCCTVStatus = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const camonoffBatchUrl = 'http://localhost:3001/api/camonoff/batch';
      const modbusBatchUrl = 'http://localhost:3001/api/modbus/batch';
      const now = Date.now();
      
      // Check if we can use cached data for all devices
      const deviceIds = cctvDevices.map(d => d.hid);
      const allCached = !forceRefresh && deviceIds.every(id => {
        const cached = cacheRef.current.get(id);
        return cached && (now - cached.timestamp) < CACHE_TTL;
      });
      
      if (allCached) {
        console.log('[FRONTEND CACHE HIT] All devices cached');
        const cachedResults = deviceIds.map(id => cacheRef.current.get(id)!.data);
        setCctvs(cachedResults);
        setIsLoading(false);
        return;
      }
      
      console.log('[BATCH FETCHING] Loading all devices in batches...');
      
      // Fetch all devices in batch (2 API calls instead of 50+)
      const [statusResponse, sensorResponse] = await Promise.allSettled([
        fetch(camonoffBatchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deviceIds }),
        }),
        fetch(modbusBatchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deviceIds }),
        }),
      ]);
      
      // Create maps for quick lookup
      const statusMap = new Map<string, any>();
      const sensorMap = new Map<string, any>();
      
      // Process status batch response
      if (statusResponse.status === 'fulfilled' && statusResponse.value.ok) {
        const statusData = await statusResponse.value.json();
        if (statusData.success && statusData.data) {
          statusData.data.forEach((item: any) => {
            if (item.success && item.data) {
              statusMap.set(item.hid, item.data);
            }
          });
        }
      }
      
      // Process sensor batch response
      if (sensorResponse.status === 'fulfilled' && sensorResponse.value.ok) {
        const sensorData = await sensorResponse.value.json();
        if (sensorData.success && sensorData.data) {
          sensorData.data.forEach((item: any) => {
            if (item.success && item.data) {
              sensorMap.set(item.devId, item.data);
            }
          });
        }
      }
      
      // Build CCTV data from batch results
      const cctvResults = cctvDevices.map((device) => {
        const statusData = statusMap.get(device.hid);
        const sensorData = sensorMap.get(device.hid);
        
        const status = statusData?.status || 0;
        const temperature = sensorData?.temperature?.value || 0;
        const humidity = sensorData?.humidity?.value || 0;
        
        const cctvData: CCTV = {
          id: device.hid,
          name: device.name,
          location: device.name, // Use actual device name as location (no dummy locations)
          status: mapStatus(status),
          signal: status === 2 ? 95 : 0,
          storage: 0,
          lastUpdate: new Date().toISOString(),
          temperature,
          humidity,
          hid: device.hid,
        };
        
        // Store in frontend cache
        cacheRef.current.set(device.hid, {
          data: cctvData,
          timestamp: now,
        });
        
        return cctvData;
      });
      
      setCctvs(cctvResults);
      setLastRefresh(new Date());
      console.log(`[SUCCESS] Loaded ${cctvResults.length} devices in batch`);
    } catch (err: any) {
      console.error('Error fetching CCTV status:', err);
      setError(err.message || 'Failed to fetch CCTV status');
      
      // Fallback to cached data if available
      const deviceIds = cctvDevices.map(d => d.hid);
      const cachedResults = deviceIds
        .map(id => cacheRef.current.get(id))
        .filter((c): c is { data: CCTV; timestamp: number } => c !== undefined)
        .map(c => c.data);
      
      if (cachedResults.length > 0) {
        console.log(`[FALLBACK] Using ${cachedResults.length} cached devices`);
        setCctvs(cachedResults);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and set up auto-refresh
  useEffect(() => {
    fetchCCTVStatus();
    
    // Auto-refresh every 15 minutes (900000 ms)
    const interval = setInterval(() => {
      fetchCCTVStatus(true); // Force refresh after 15 minutes
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const onlineCount = cctvs.filter(c => c.status === "online").length;
  const offlineCount = cctvs.filter(c => c.status === "offline").length;

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

  const getStatusIcon = (status: CCTV["status"]) => {
    switch (status) {
      case "online":
        return <Camera className="h-4 w-4 text-green-400" />;
      case "offline":
        return <CameraOff className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusBadge = (status: CCTV["status"]) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Online</Badge>;
      case "offline":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Offline</Badge>;
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
          className="pb-3 border-b border-white/10 select-none flex-shrink-0"
          onMouseDown={disableInternalPositioning ? undefined : handleMouseDown}
          style={{ cursor: disableInternalPositioning ? "default" : "grab" }}
        >
          <div className="flex items-center justify-between">
            <CardTitle className={`text-white font-semibold flex items-center gap-2 ${isCompact ? "text-sm" : "text-lg"}`}>
              <Video className={`text-red-400 ${isCompact ? "h-4 w-4" : "h-5 w-5"}`} />
              {!isCompact && "CCTV Status"}
              {isCompact && "CCTV"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchCCTVStatus(true)}
                disabled={isLoading}
                className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                title="Refresh (force)"
              >
                <RefreshCw className={`h-3 w-3 text-white/70 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <div className="flex items-center gap-1 text-xs text-white/70">
                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-green-400'} ${!isLoading ? 'animate-pulse' : ''}`}></span>
                {isLoading ? 'Loading...' : 'Live'}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-1 min-h-0 overflow-hidden flex flex-col">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-2 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-xs text-red-400">{error}</span>
            </div>
          )}

          {/* Summary Stats */}
          <div className={`grid gap-2 mb-4 ${isCompact ? "grid-cols-2" : "grid-cols-2"}`}>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className={`flex items-center justify-center gap-1 mb-1 ${isCompact ? "flex-col" : ""}`}>
                <CheckCircle2 className={`text-green-400 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                <span className={`font-bold text-white ${isCompact ? "text-lg" : "text-2xl"}`}>{onlineCount}</span>
              </div>
              <p className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>Online</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className={`flex items-center justify-center gap-1 mb-1 ${isCompact ? "flex-col" : ""}`}>
                <CameraOff className={`text-red-400 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                <span className={`font-bold text-white ${isCompact ? "text-lg" : "text-2xl"}`}>{offlineCount}</span>
              </div>
              <p className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>Offline</p>
            </div>
          </div>

          {/* CCTV List */}
          <div className={`space-y-2 overflow-y-auto flex-1 ${isWide ? "grid grid-cols-2 gap-2" : ""}`}>
            {isLoading && cctvs.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 text-white/50 animate-spin" />
                <span className="ml-2 text-sm text-white/70">Loading CCTV status...</span>
              </div>
            ) : cctvs.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <AlertCircle className="h-6 w-6 text-white/50" />
                <span className="ml-2 text-sm text-white/70">No CCTV devices found</span>
              </div>
            ) : (
              cctvs.map((cctv) => (
              <div
                key={cctv.id}
                className={`bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors ${isWide ? "p-2" : "p-3"}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getStatusIcon(cctv.status)}
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium text-white truncate flex items-center gap-1 ${isCompact ? "text-xs" : "text-sm"}`}>
                        <MapPin className="h-3 w-3 flex-shrink-0 text-white/60" />
                        <span className="truncate">{cctv.location}</span>
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(cctv.status)}
                </div>
                
                {/* Temperature and Humidity */}
                {cctv.status === "online" && (
                  <div className={`flex items-center gap-3 ${isCompact ? "gap-2" : ""}`}>
                    <div className="flex items-center gap-1.5 flex-1">
                      <Thermometer className={`flex-shrink-0 ${isCompact ? "h-3 w-3" : "h-3.5 w-3.5"} ${
                        cctv.temperature > 30 
                          ? "text-red-400" 
                          : cctv.temperature > 25 
                          ? "text-yellow-400" 
                          : "text-green-400"
                      }`} />
                      <span className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>
                        {cctv.temperature > 0 ? `${cctv.temperature}°C` : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-1">
                      <Droplets className={`flex-shrink-0 ${isCompact ? "h-3 w-3" : "h-3.5 w-3.5"} ${
                        cctv.humidity > 70 
                          ? "text-blue-400" 
                          : cctv.humidity > 50 
                          ? "text-green-400" 
                          : "text-yellow-400"
                      }`} />
                      <span className={`text-white/70 ${isCompact ? "text-[10px]" : "text-xs"}`}>
                        {cctv.humidity > 0 ? `${cctv.humidity}%` : "N/A"}
                      </span>
                    </div>
                  </div>
                )}
                {cctv.status === "offline" && (
                  <div className={`flex items-center gap-3 ${isCompact ? "gap-2" : ""}`}>
                    <div className="flex items-center gap-1.5 flex-1">
                      <Thermometer className={`flex-shrink-0 ${isCompact ? "h-3 w-3" : "h-3.5 w-3.5"} text-white/30`} />
                      <span className={`text-white/30 ${isCompact ? "text-[10px]" : "text-xs"}`}>N/A</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-1">
                      <Droplets className={`flex-shrink-0 ${isCompact ? "h-3 w-3" : "h-3.5 w-3.5"} text-white/30`} />
                      <span className={`text-white/30 ${isCompact ? "text-[10px]" : "text-xs"}`}>N/A</span>
                    </div>
                  </div>
                )}
              </div>
              ))
            )}
          </div>
          
          {/* Last Refresh Time */}
          {!isLoading && (
            <div className="mt-2 text-xs text-white/50 text-center">
              Last updated: {formatTimeAgo(lastRefresh)}
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
  );
}


