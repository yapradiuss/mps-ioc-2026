"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, RefreshCw, Video, AlertCircle, Grid3x3, LayoutGrid, Square, ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { API_BASE_URL } from "@/lib/api";

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

// Interface for snapshot metadata from backend
interface SnapshotMetadata {
  lastUpdated: number;
  devices: Array<{
    deviceId: string;
    timestamp: number;
    success: boolean;
    imageUrl: string;
  }>;
}

// Types
interface HLSDevice {
  name: string;
  hlsUrl: string;
  site: string;
}

interface CCTVFeed {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  streamUrl?: string;
  snapshotUrl?: string;
  hlsUrl?: string;
  lastUpdate: string;
  hid: string;
  isHLS?: boolean;
}

type GridSize = "2x2" | "3x3" | "4x4" | "full";

// HLS devices
const hlsDevices: HLSDevice[] = [
  { name: "192.168.0.12", hlsUrl: "http://127.0.0.1:8080/memfs/de5c8d30-58e3-423f-b4f7-da8e597babe1.m3u8", site: "MPS IOC CCTV" },
  { name: "192.168.0.13", hlsUrl: "http://127.0.0.1:8080/memfs/9fa73373-8833-4d33-8eb9-54054bfd3987.m3u8", site: "MPS IOC CCTV" },
  { name: "192.168.0.14", hlsUrl: "http://127.0.0.1:8080/memfs/fcf54593-b775-4fe2-a7ff-7dbe0aa58de8.m3u8", site: "MPS IOC CCTV" },
  { name: "192.168.0.15", hlsUrl: "http://127.0.0.1:8080/memfs/e6cda9f9-f166-40f9-ab55-f50f13686030.m3u8", site: "MPS IOC CCTV" },
  { name: "192.168.0.16", hlsUrl: "http://127.0.0.1:8080/memfs/9bea2e13-ab9b-413e-a854-27a3d962d69c.m3u8", site: "MPS IOC CCTV" },
  { name: "192.168.0.17", hlsUrl: "http://127.0.0.1:8080/memfs/bbeb988c-00d9-40a0-a2c4-32bb15fbf686.m3u8", site: "MPS IOC CCTV" },
];

// CCTV devices
const cctvDevices = [
  { name: "MPSp- Industrial Park", hid: "c8155800002f", site: "MPS CCTV Sites" },
  { name: "MPSp-Depo BBST 1", hid: "c81558000137", site: "MPS CCTV Sites" },
  { name: "MPSp-Depo BBST 2", hid: "c81558000086", site: "MPS CCTV Sites" },
  { name: "MPSp-Depo Putra Perdana 1", hid: "c8155800004c", site: "MPS CCTV Sites" },
  { name: "MPSp-Depo Putra Perdana 2", hid: "c81559000094", site: "MPS CCTV Sites" },
  { name: "MPSp-JPS 1", hid: "c81558000035", site: "MPS CCTV Sites" },
  { name: "MPSp-Kapal Korek 1", hid: "c815580000d1", site: "MPS CCTV Sites" },
  { name: "MPSp-Kapal Korek 2", hid: "c81558000139", site: "MPS CCTV Sites" },
  { name: "MPSp-KG SG Melut", hid: "c81558000084", site: "MPS CCTV Sites" },
  { name: "MPSp-Rambutan Kg. Sg. Buah Dua", hid: "c81558000031", site: "MPS CCTV Sites" },
  { name: "MPSp-Sg Pelek", hid: "c815580000ac", site: "MPS CCTV Sites" },
  { name: "MPSp-Taman Ixora", hid: "c81558000051", site: "MPS CCTV Sites" },
  { name: "MPSp-Tepi Lombong Batu Satu", hid: "c815580000d9", site: "MPS CCTV Sites" },
  { name: "MPSp-Tmn Dahlia 1", hid: "c81558000180", site: "MPS CCTV Sites" },
  { name: "MPSp-Tmn Seri Delima", hid: "c8155800016c", site: "MPS CCTV Sites" },
  { name: "MPSp06-C01 APEC Bomba", hid: "c81559000091", site: "MPS CCTV Sites" },
  { name: "MPSp06-C02 Hospital Cyberjaya", hid: "c81558000122", site: "MPS CCTV Sites" },
  { name: "MPSp06-C03 Persiaran Semarak Api", hid: "c8155900008e", site: "MPS CCTV Sites" },
  { name: "MPSp06-C04 Radius Cyberjaya", hid: "c8155900008f", site: "MPS CCTV Sites" },
  { name: "MPSp06-C05 Setia Eco Glades", hid: "c815580001e1", site: "MPS CCTV Sites" },
  { name: "MPSp06-C06 Stesen MRT Cyberjaya", hid: "c81559000093", site: "MPS CCTV Sites" },
  { name: "MPSp06-C07 Medan Seroja", hid: "c815050004f6", site: "MPS CCTV Sites" },
  { name: "MPSp06-C08 Perhentian Bas Seroja", hid: "c815050004f9", site: "MPS CCTV Sites" },
  { name: "MPSp06-C09 Psr Mlm Seroja", hid: "c815050004f5", site: "MPS CCTV Sites" },
  { name: "MPSp06-C10 Simpang Seroja", hid: "c815050004de", site: "MPS CCTV Sites" },
  // Site Below (Taman Tasek 1–3, Traffik Light MDEC/Dell/TM) – grouped under MPS CCTV Sites
  { name: "Taman Tasek 1", hid: "c8155800024a", site: "MPS CCTV Sites" },
  { name: "Taman Tasek 2", hid: "c81558000249", site: "MPS CCTV Sites" },
  { name: "Taman Tasek 3", hid: "c8155800024d", site: "MPS CCTV Sites" },
  { name: "Traffik Light MDEC", hid: "c8155800024c", site: "MPS CCTV Sites" },
  { name: "Traffik Light Dell", hid: "c8155800024e", site: "MPS CCTV Sites" },
  { name: "Traffik Light TM", hid: "c8155800024f", site: "MPS CCTV Sites" },
];

const cctvSites = [
  { id: "mps-cctv-sites", name: "MPS CCTV Sites", deviceIds: cctvDevices.filter(d => d.site === "MPS CCTV Sites").map(d => d.hid), isHLS: false },
  { id: "mps-ioc-cctv", name: "MPS IOC CCTV", deviceIds: hlsDevices.map((_, i) => `hls-${i}`), isHLS: true },
];

// Optimized HLS Video Player with memoization
const HLSVideoPlayer = ({ src, name }: { src: string; name: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstanceRef = useRef<any>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const srcRef = useRef(src);

  useEffect(() => {
    srcRef.current = src;
  }, [src]);

  const initHLS = useCallback(async () => {
    const video = videoRef.current;
    if (!video || srcRef.current !== src) return;

    // Cleanup previous instance
    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.destroy();
      hlsInstanceRef.current = null;
    }

    try {
      const Hls = (await import('hls.js')).default;

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
        });
        
        hlsInstanceRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (srcRef.current === src) {
            setIsLoading(false);
            setError(false);
            video.play().catch(() => {});
          }
        });

        hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
          if (data.fatal && srcRef.current === src) {
            setError(true);
            setIsLoading(false);
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              setTimeout(() => {
                if (srcRef.current === src && hlsInstanceRef.current) {
                  hls.loadSource(src);
                }
              }, 3000);
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          if (srcRef.current === src) {
            setIsLoading(false);
            setError(false);
            video.play().catch(() => {});
          }
        });
        video.addEventListener('error', () => {
          if (srcRef.current === src) {
            setError(true);
            setIsLoading(false);
          }
        });
      } else {
        setError(true);
        setIsLoading(false);
      }
    } catch (err) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          video.play().catch(() => {});
        });
        video.addEventListener('error', () => {
          setError(true);
          setIsLoading(false);
        });
      } else {
        setError(true);
        setIsLoading(false);
      }
    }
  }, [src]);

  useEffect(() => {
    initHLS();
    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [initHLS]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-800/90">
        <div className="text-center p-2">
          <AlertCircle className="h-6 w-6 mx-auto mb-1 text-red-400" />
          <p className="text-[10px] text-white/90">Stream Error</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/90 z-10">
          <div className="text-center p-2">
            <RefreshCw className="h-6 w-6 mx-auto mb-1 text-white/90 animate-spin" />
            <p className="text-[10px] text-white/90">Connecting...</p>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        autoPlay
      />
    </div>
  );
};

export default function LiveCCTVFeedPage() {
  const [feeds, setFeeds] = useState<CCTVFeed[]>([]);
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [gridSize, setGridSize] = useState<GridSize>("full");
  const [showCameraSelector, setShowCameraSelector] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSite, setSelectedSite] = useState<string>("mps-cctv-sites");
  const [snapshotMetadata, setSnapshotMetadata] = useState<SnapshotMetadata | null>(null);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cachedFeedsRef = useRef<CCTVFeed[]>([]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Memoized helpers
  const isHLSSite = useMemo(() => {
    const site = cctvSites.find(s => s.id === selectedSite);
    return site?.isHLS ?? false;
  }, [selectedSite]);

  const getDevicesForSite = useCallback((siteId: string) => {
    const site = cctvSites.find(s => s.id === siteId);
    if (!site) return cctvDevices;
    if (site.isHLS) return [];
    return cctvDevices.filter(device => site.deviceIds.includes(device.hid));
  }, []);

  // Fetch snapshot metadata from backend
  const fetchMetadata = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cctv-snapshots/metadata`);
      if (response.ok) {
        const data = await response.json();
        setSnapshotMetadata(data);
        return data as SnapshotMetadata;
      }
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    }
    return null;
  }, []);

  // Initialize feeds with static URLs
  useEffect(() => {
    const initializeFeeds = async () => {
      const site = cctvSites.find(s => s.id === selectedSite);
      
      if (site?.isHLS) {
        const initialFeeds: CCTVFeed[] = hlsDevices.map((device, index) => ({
          id: `hls-${index}`,
          name: device.name,
          location: device.name,
          status: "online" as const,
          hid: `hls-${index}`,
          hlsUrl: device.hlsUrl,
          isHLS: true,
          lastUpdate: "Live Stream",
        }));
        setFeeds(initialFeeds);
        cachedFeedsRef.current = initialFeeds;
        setSelectedFeeds(initialFeeds.map(f => f.id));
        setCurrentPage(1);
        setIsLoading(false);
      } else {
        // Fetch metadata to get timestamps
        const metadata = await fetchMetadata();
        const siteDevices = getDevicesForSite(selectedSite);
        
        const initialFeeds: CCTVFeed[] = siteDevices.map((device) => {
          const deviceMeta = metadata?.devices.find(d => d.deviceId === device.hid);
          const hasSnapshot = deviceMeta?.success ?? false;
          const timestamp = deviceMeta?.timestamp || Date.now();
          
          return {
            id: device.hid,
            name: device.name,
            location: device.name,
            status: hasSnapshot ? "online" as const : "offline" as const,
            hid: device.hid,
            // Use static URL with cache-busting timestamp
            snapshotUrl: hasSnapshot ? `${API_BASE_URL}/cctv-snapshots/${device.hid}.jpg?t=${timestamp}` : undefined,
            lastUpdate: hasSnapshot ? new Date(timestamp).toLocaleTimeString() : "Never",
            isHLS: false,
          };
        });
        setFeeds(initialFeeds);
        cachedFeedsRef.current = initialFeeds;
        setSelectedFeeds(initialFeeds.map(f => f.id));
        setCurrentPage(1);
        setIsLoading(false);
      }
    };

    initializeFeeds();
  }, [selectedSite, getDevicesForSite, fetchMetadata]);

  // Refresh snapshots by fetching new metadata and updating URLs
  const refreshSnapshots = useCallback(async (showLoading = false) => {
    if (isHLSSite) return;

    try {
      if (showLoading) {
        setIsLoading(true);
      }

      // Fetch fresh metadata from backend
      const metadata = await fetchMetadata();
      
      if (metadata) {
        setFeeds(prevFeeds => {
          return prevFeeds.map(feed => {
            if (feed.isHLS) return feed;
            
            const deviceMeta = metadata.devices.find(d => d.deviceId === feed.hid);
            const hasSnapshot = deviceMeta?.success ?? false;
            const timestamp = deviceMeta?.timestamp || Date.now();
            
            return {
              ...feed,
              status: hasSnapshot ? "online" as const : "offline" as const,
              snapshotUrl: hasSnapshot ? `${API_BASE_URL}/cctv-snapshots/${feed.hid}.jpg?t=${timestamp}` : undefined,
              lastUpdate: hasSnapshot ? new Date(timestamp).toLocaleTimeString() : "Never",
            };
          });
        });
        
        setLastRefresh(Date.now());
      }
    } catch (error) {
      console.error('Failed to refresh snapshots:', error);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, [isHLSSite, fetchMetadata]);

  // Trigger manual refresh on backend (fetch new images from CCTV API)
  const triggerBackendRefresh = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Trigger backend to fetch fresh snapshots
      await fetch(`${API_BASE_URL}/api/cctv-snapshots/refresh`, {
        method: 'POST',
      });
      
      // Wait a bit for backend to process, then refresh our view
      setTimeout(() => {
        refreshSnapshots(false);
        setIsLoading(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to trigger backend refresh:', error);
      setIsLoading(false);
    }
  }, [refreshSnapshots]);

  // Auto-refresh interval - check for new snapshots every 10 minutes
  useEffect(() => {
    if (!isHLSSite && autoRefresh && feeds.length > 0) {
      refreshIntervalRef.current = setInterval(() => {
        refreshSnapshots(false);
      }, REFRESH_INTERVAL);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, feeds.length, isHLSSite, refreshSnapshots]);

  // Memoized filtered feeds
  const filteredFeeds = useMemo(() => {
    return feeds.filter((feed) =>
      feed.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      feed.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [feeds, debouncedSearchQuery]);

  // Memoized stats
  const stats = useMemo(() => {
    const onlineCount = feeds.filter((f) => f.status === "online").length;
    const offlineCount = feeds.filter((f) => f.status === "offline").length;
    const maintenanceCount = feeds.filter((f) => f.status === "maintenance").length;
    return { onlineCount, offlineCount, maintenanceCount };
  }, [feeds]);

  const getStatusBadge = useCallback((status: CCTVFeed["status"]) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Online</Badge>;
      case "offline":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Offline</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Maintenance</Badge>;
    }
  }, []);

  const handleFeedSelect = useCallback((feed: CCTVFeed) => {
    setSelectedFeeds((prev) =>
      prev.includes(feed.id)
        ? prev.filter((id) => id !== feed.id)
        : [...prev, feed.id].slice(0, getMaxFeedsForGrid(gridSize))
    );
  }, [gridSize]);

  const getMaxFeedsForGrid = useCallback((size: GridSize): number => {
    switch (size) {
      case "2x2": return 4;
      case "3x3": return 9;
      case "4x4": return 16;
      case "full": return feeds.length;
    }
  }, [feeds.length]);

  const getGridColumns = useCallback((size: GridSize): string => {
    switch (size) {
      case "2x2": return "grid-cols-2";
      case "3x3": return "grid-cols-3";
      case "4x4": return "grid-cols-4";
      case "full":
        if (feeds.length <= 2) return "grid-cols-2";
        if (feeds.length <= 4) return "grid-cols-2";
        if (feeds.length <= 6) return "grid-cols-3";
        if (feeds.length <= 9) return "grid-cols-3";
        const cols = Math.ceil(Math.sqrt(feeds.length));
        const colMap: { [key: number]: string } = {
          1: "grid-cols-2", 2: "grid-cols-2", 3: "grid-cols-3",
          4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6",
        };
        return colMap[Math.min(cols, 6)] || "grid-cols-5";
    }
  }, [feeds.length]);

  const selectedFeedsData = useMemo(() => {
    return feeds.filter((feed) => selectedFeeds.includes(feed.id));
  }, [feeds, selectedFeeds]);

  // Memoized pagination
  const pagination = useMemo(() => {
    const maxFeedsPerPage = getMaxFeedsForGrid(gridSize);
    const totalPages = Math.max(1, Math.ceil(selectedFeedsData.length / maxFeedsPerPage));
    const startIndex = (currentPage - 1) * maxFeedsPerPage;
    const endIndex = startIndex + maxFeedsPerPage;
    const currentPageFeeds = selectedFeedsData.slice(startIndex, endIndex);
    return { maxFeedsPerPage, totalPages, startIndex, endIndex, currentPageFeeds };
  }, [selectedFeedsData, gridSize, currentPage, getMaxFeedsForGrid]);

  useEffect(() => {
    setCurrentPage(1);
  }, [gridSize]);

  useEffect(() => {
    if (currentPage > pagination.totalPages && pagination.totalPages > 0) {
      setCurrentPage(1);
    }
  }, [pagination.totalPages, currentPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live CCTV Feed</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Monitor live camera feeds from all security cameras
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={selectedSite} onValueChange={setSelectedSite}>
            <TabsList className="grid w-full grid-cols-2">
              {cctvSites.map((site) => (
                <TabsTrigger key={site.id} value={site.id} className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  {site.name}
                  <Badge variant="secondary" className="ml-2">
                    {site.deviceIds.length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {showCameraSelector && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cameras</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feeds.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Online</CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.onlineCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offline</CardTitle>
              <div className="h-4 w-4 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.offlineCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <div className="h-4 w-4 rounded-full bg-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.maintenanceCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Grid Size:</span>
                  {(["2x2", "3x3", "4x4", "full"] as GridSize[]).map((size) => (
                    <Button
                      key={size}
                      variant={gridSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setGridSize(size);
                        if (selectedFeeds.length === 0) {
                          setSelectedFeeds(feeds.map(f => f.id));
                        }
                      }}
                    >
                      {size === "2x2" && <Square className="h-4 w-4 mr-1" />}
                      {size === "3x3" && <Grid3x3 className="h-4 w-4 mr-1" />}
                      {(size === "4x4" || size === "full") && <LayoutGrid className="h-4 w-4 mr-1" />}
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={autoRefresh ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                  Auto
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refreshSnapshots(true)}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedFeeds.length} cameras • {pagination.maxFeedsPerPage} per page • Page {currentPage}/{pagination.totalPages}
                </span>
                <Sheet open={showCameraSelector} onOpenChange={setShowCameraSelector}>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Select Cameras
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Select Cameras</SheetTitle>
                      <SheetDescription>
                        Select up to {getMaxFeedsForGrid(gridSize)} cameras for {gridSize} grid view
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div className="relative">
                        <Input
                          placeholder="Search cameras..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                        <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {filteredFeeds.map((feed) => {
                          const isSelected = selectedFeeds.includes(feed.id);
                          const canSelect = selectedFeeds.length < getMaxFeedsForGrid(gridSize) || isSelected;
                          return (
                            <div
                              key={feed.id}
                              onClick={() => canSelect && handleFeedSelect(feed)}
                              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-primary/10 border-primary"
                                  : "bg-slate-100 dark:bg-slate-800/50 border-border hover:bg-slate-200 dark:hover:bg-slate-700/50"
                              } ${!canSelect ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => canSelect && handleFeedSelect(feed)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <Video className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-sm">{feed.name}</span>
                                </div>
                                {getStatusBadge(feed.status)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                <div>{feed.location}</div>
                                <div className="mt-1">Last update: {feed.lastUpdate}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-visible">
          <CardContent className="p-0 flex flex-col overflow-visible">
            {isLoading && feeds.length === 0 ? (
              <div className="flex items-center justify-center h-[calc(100vh-300px)] bg-slate-800/90 rounded-lg">
                <div className="text-center">
                  <RefreshCw className="h-16 w-16 mx-auto mb-4 text-white/90 animate-spin" />
                  <p className="text-white/90 font-medium">Loading cameras...</p>
                </div>
              </div>
            ) : selectedFeeds.length > 0 ? (
              <>
                <div
                  className={`grid ${getGridColumns(gridSize)} gap-2 w-full p-4 flex-1`}
                  style={{ minHeight: "calc(100vh - 350px)" }}
                >
                  {pagination.currentPageFeeds.map((feed) => (
                    <div
                      key={feed.id}
                      className="relative bg-black rounded-lg overflow-hidden group"
                      style={{ aspectRatio: "16/9" }}
                    >
                      {feed.isHLS && feed.hlsUrl ? (
                        <>
                          <HLSVideoPlayer src={feed.hlsUrl} name={feed.name} />
                          <div className="absolute top-1 left-1 bg-red-500/80 text-white px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
                            <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                            LIVE
                          </div>
                        </>
                      ) : feed.status === "online" && feed.snapshotUrl ? (
                        <>
                          <img
                            src={feed.snapshotUrl}
                            alt={feed.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden flex items-center justify-center h-full bg-slate-800/90 absolute inset-0">
                            <div className="text-center p-2 flex flex-col items-center gap-2">
                              <RefreshCw className="h-8 w-8 text-white/90 animate-spin" />
                              <p className="text-[10px] text-white/90">Checking feed...</p>
                            </div>
                          </div>
                          <div className="absolute top-1 left-1 bg-red-500/80 text-white px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
                            <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                            LIVE
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full bg-slate-800/90">
                          <div className="text-center p-2 flex flex-col items-center gap-2">
                            <RefreshCw className="h-8 w-8 text-white/90 animate-spin" />
                            <p className="text-[9px] text-white/70">Checking feed...</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent text-white p-1.5">
                        <p className="text-[10px] font-medium truncate">{feed.name}</p>
                        <p className="text-[9px] text-white/70 truncate">{feed.isHLS ? 'Live Stream' : `Updated: ${feed.lastUpdate}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t-2 border-primary/20 bg-slate-800/90 w-full shadow-lg relative z-20">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="min-w-[110px] h-10"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1 flex-wrap">
                        {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                          let pageNum: number;
                          if (pagination.totalPages <= 7) {
                            pageNum = i + 1;
                          } else if (currentPage <= 4) {
                            pageNum = i + 1;
                          } else if (currentPage >= pagination.totalPages - 3) {
                            pageNum = pagination.totalPages - 6 + i;
                          } else {
                            pageNum = currentPage - 3 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="default"
                              onClick={() => setCurrentPage(pageNum)}
                              className="min-w-[44px] h-10"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                        disabled={currentPage === pagination.totalPages}
                        className="min-w-[110px] h-10"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <div className="text-sm font-medium text-white/90 whitespace-nowrap ml-4">
                      Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{pagination.totalPages}</span> ({selectedFeedsData.length} cameras)
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-300px)] bg-slate-800/90 rounded-lg">
                <div className="text-center">
                  <LayoutGrid className="h-16 w-16 mx-auto mb-4 text-white/90" />
                  <p className="text-white/90 font-medium">No cameras selected</p>
                  <p className="text-sm text-white/70 mt-2">
                    Click "Select Cameras" to choose cameras for grid view
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
