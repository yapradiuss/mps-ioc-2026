"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Activity, Radio, LayoutDashboard, LogOut } from "lucide-react";
import { getCurrentUser, type User as UserType } from "@/lib/auth";
import { logActivity } from "@/lib/audit-logger";
import { 
  loadPreferences, 
  savePreferences, 
  type MapFilterPreference, 
  type WidgetPreference 
} from "@/lib/ioc-preferences";
import { DraggableWidget } from "@/components/ioc/draggable-widget";
import MapFilters from "@/components/ioc/map-filters";
import ExampleWidget from "@/components/ioc/widgets/example-widget";
import WeatherWidget from "@/components/ioc/widgets/weather-widget";
import StreetlightStatus from "@/components/ioc/widgets/streetlight-status";
import CCTVStatus from "@/components/ioc/widgets/cctv-status";
import AIBoxDetection from "@/components/ioc/widgets/aibox-detection";
import CompoundChart from "@/components/ioc/widgets/compound-chart";
import TaxAnalytics from "@/components/ioc/widgets/tax-analytics";
import VehicleCounting from "@/components/ioc/widgets/vehicle-counting";
import HumanCounting from "@/components/ioc/widgets/human-counting";
import { getActiveNewsTickerItems } from "@/lib/news-ticker-storage";
import { API_BASE_URL } from "@/lib/api";

// Dynamically import GoogleMap with no SSR
const GoogleMap = dynamic(() => import("@/components/ioc/google-map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-muted">
      <div className="text-center">
        <Radio className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading Map...</p>
      </div>
    </div>
  ),
});

// Default map filter state
const DEFAULT_MAP_FILTERS = {
  landmarks: false,
  blokPerancangan: false,
  bridge: false,
  cctv: false,
  chartingKm: false,
  constructedSlope: false,
  drainage: false,
  earthWork: false,
  feederPillar: false,
  flexiblePost: false,
  gtmix: false,
  sempadanTaman: false,
  gtnhSemasa: false,
  jalan: false,
  jalanKejuruteraan: false,
  komitedKm: false,
  locationMapAset: false,
  locationMapAsetItem: false,
  lokasiBanjir: false,
  ndcdb20: false,
  ndcdb23: false,
  pasarAwam: false,
  pasarMalam: false,
  pasarSari: false,
  pasarTani: false,
  roadHump: false,
  roadMarkingLinear: false,
  roadMarkingPoint: false,
  roadMedian: false,
  roadShoulder: false,
  sampahHaram: false,
  sempadanDaerah: false,
  signboard: false,
  sportFacility: false,
  streetLighting: false,
  loranetStreetlight: false,
  tamanPerumahan: false,
  trafficLight: false,
  wartaKawasanLapang: false,
  zonAhliMajlis: false,
} as const;

// Default widget visibility
const DEFAULT_WIDGET_VISIBILITY = {
  streetlight: true,
  cctv: true,
  compound: true,
  tax: true,
  aibox: true,
  vehicleCounting: true,
  humanCounting: true,
  example: false,
} as const;

// Helper to get initial widget positions
const getInitialWidgetPositions = () => {
  if (typeof window === 'undefined') {
    const minY = 74;
    return {
      weather: { x: 0, y: minY + 10 },
      streetlight: { x: 20, y: minY + 30 },
      cctv: { x: 20, y: minY + 180 },
      aibox: { x: 20, y: minY + 330 },
      compound: { x: 20, y: minY + 480 },
      tax: { x: 20, y: minY + 630 },
      vehicleCounting: { x: 20, y: minY + 780 },
      humanCounting: { x: 20, y: minY + 930 },
    };
  }
  const centerX = window.innerWidth / 2;
  const minY = 74;
  return {
    weather: { x: centerX - 150, y: minY + 10 },
    streetlight: { x: 20, y: minY + 30 },
    cctv: { x: 20, y: minY + 180 },
    aibox: { x: window.innerWidth - 350, y: minY + 30 },
    compound: { x: window.innerWidth - 350, y: minY + 230 },
    tax: { x: window.innerWidth - 350, y: minY + 430 },
    vehicleCounting: { x: window.innerWidth - 650, y: minY + 630 },
    humanCounting: { x: window.innerWidth - 650, y: minY + 780 },
  };
};

// Helper to get initial widget sizes
const getInitialWidgetSizes = () => ({
  weather: { width: 300, height: 200 },
  streetlight: { width: 380, height: 600 },
  cctv: { width: 380, height: 600 },
  aibox: { width: 380, height: 600 },
  compound: { width: 500, height: 600 },
  tax: { width: 600, height: 700 },
  vehicleCounting: { width: 600, height: 500 },
  humanCounting: { width: 600, height: 500 },
});

export default function IOCDashboardPage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mapError, setMapError] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [newsItems, setNewsItems] = useState<string[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  
  // Consolidated state for map filters
  const [mapFilters, setMapFilters] = useState<typeof DEFAULT_MAP_FILTERS>(DEFAULT_MAP_FILTERS);
  
  // Consolidated state for widget visibility
  const [widgetVisibility, setWidgetVisibility] = useState<typeof DEFAULT_WIDGET_VISIBILITY>(DEFAULT_WIDGET_VISIBILITY);
  
  // Widget positions and sizes
  const [widgetPositions, setWidgetPositions] = useState<Record<string, { x: number; y: number }>>(getInitialWidgetPositions);
  const [widgetSizes, setWidgetSizes] = useState<Record<string, { width: number; height: number }>>(getInitialWidgetSizes);
  
  // Debounce timer for preference saves
  const savePreferencesTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load news ticker from localStorage (no API)
  const fetchNewsTicker = useCallback(() => {
    try {
      setIsLoadingNews(true);
      const active = getActiveNewsTickerItems();
      const formattedItems = active
        .map((item) => {
          if (item.title && item.content) return `${item.title} - ${item.content}`;
          return item.title || item.content || "";
        })
        .filter((s: string) => s.length > 0);
      setNewsItems(formattedItems);
    } catch {
      setNewsItems([]);
    } finally {
      setIsLoadingNews(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsTicker();
    const interval = setInterval(fetchNewsTicker, 30000);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "news_ticker_items" || e.key === null) fetchNewsTicker();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, [fetchNewsTicker]);

  // Get user from localStorage (optimized - only check on mount and storage events)
  useEffect(() => {
    const updateUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    };

    updateUser();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === null) {
        updateUser();
      }
    };

    const handleCustomStorageChange = () => {
      updateUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleCustomStorageChange);
    };
  }, []);

  // Load user preferences on mount
  useEffect(() => {
    const preferences = loadPreferences();
    if (preferences) {
      // Apply map filter preferences (type as Record so boolean assignment is valid)
      const newFilters: Record<keyof typeof DEFAULT_MAP_FILTERS, boolean> = { ...DEFAULT_MAP_FILTERS };
      preferences.mapFilters.forEach((filter) => {
        if (filter.id in newFilters) {
          newFilters[filter.id as keyof typeof newFilters] = filter.enabled;
        }
      });
      setMapFilters(newFilters as typeof DEFAULT_MAP_FILTERS);

      // Apply widget preferences (type as Record so boolean assignment is valid)
      const newVisibility: Record<keyof typeof DEFAULT_WIDGET_VISIBILITY, boolean> = { ...DEFAULT_WIDGET_VISIBILITY };
      preferences.widgets.forEach((widget) => {
        if (widget.id in newVisibility) {
          newVisibility[widget.id as keyof typeof newVisibility] = widget.enabled;
        }
        if (widget.position) {
          const minY = 74;
          const validatedPosition = {
            x: widget.position.x,
            y: Math.max(minY, widget.position.y),
          };
          setWidgetPositions((prev) => ({
            ...prev,
            [widget.id]: validatedPosition,
          }));
        }
        if (widget.size) {
          setWidgetSizes((prev) => ({
            ...prev,
            [widget.id]: widget.size,
          } as Record<string, { width: number; height: number }>));
        }
      });
      setWidgetVisibility(newVisibility as typeof DEFAULT_WIDGET_VISIBILITY);
    }
  }, []);

  // Ensure widgets have valid positions
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setWidgetPositions((prev) => {
      const updated = { ...prev };
      const centerX = window.innerWidth / 2;
      const minY = 74;
      
      if (!updated.weather || updated.weather.y < minY) {
        updated.weather = { x: centerX - 150, y: minY + 10 };
      }
      if (widgetVisibility.streetlight && (!updated.streetlight || updated.streetlight.y < minY)) {
        updated.streetlight = { x: 20, y: minY + 30 };
      }
      if (widgetVisibility.cctv && (!updated.cctv || updated.cctv.y < minY)) {
        updated.cctv = { x: 20, y: minY + 180 };
      }
      if (widgetVisibility.aibox && (!updated.aibox || updated.aibox.y < minY)) {
        updated.aibox = { x: window.innerWidth - 350, y: minY + 30 };
      }
      if (widgetVisibility.compound && (!updated.compound || updated.compound.y < minY)) {
        updated.compound = { x: window.innerWidth - 350, y: minY + 230 };
      }
      if (widgetVisibility.tax && (!updated.tax || updated.tax.y < minY)) {
        updated.tax = { x: window.innerWidth - 350, y: minY + 430 };
      }
      
      return updated;
    });
  }, [widgetVisibility]);

  // Memoized user helper functions
  const getUserInitials = useMemo(() => {
    if (!user) return 'IO';
    if (user.full_name) {
      const parts = user.full_name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return user.full_name.substring(0, 2).toUpperCase();
    }
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'IO';
  }, [user]);

  const getUserDisplayName = useMemo(() => {
    if (!user) return 'IOC Operator';
    return user.full_name || user.username || 'IOC Operator';
  }, [user]);

  const getUserEmail = useMemo(() => {
    if (!user) return 'operator@mpsepang.com';
    return user.email || 'operator@mpsepang.com';
  }, [user]);

  // Debounced save preferences
  const saveCurrentPreferences = useCallback(() => {
    if (savePreferencesTimerRef.current) {
      clearTimeout(savePreferencesTimerRef.current);
    }
    
    savePreferencesTimerRef.current = setTimeout(() => {
      const mapFilterPrefs: MapFilterPreference[] = Object.entries(mapFilters).map(([id, enabled]) => ({
        id,
        enabled,
      }));

      const widgetPrefs: WidgetPreference[] = [
        { id: 'weather', enabled: true, position: widgetPositions.weather, size: widgetSizes.weather },
        { id: 'streetlight', enabled: widgetVisibility.streetlight, position: widgetPositions.streetlight, size: widgetSizes.streetlight },
        { id: 'cctv', enabled: widgetVisibility.cctv, position: widgetPositions.cctv, size: widgetSizes.cctv },
        { id: 'aibox', enabled: widgetVisibility.aibox, position: widgetPositions.aibox, size: widgetSizes.aibox },
        { id: 'compound', enabled: widgetVisibility.compound, position: widgetPositions.compound, size: widgetSizes.compound },
        { id: 'tax', enabled: widgetVisibility.tax, position: widgetPositions.tax, size: widgetSizes.tax },
        { id: 'example', enabled: widgetVisibility.example },
      ];

      savePreferences({ mapFilters: mapFilterPrefs, widgets: widgetPrefs });
    }, 500);
  }, [mapFilters, widgetVisibility, widgetPositions, widgetSizes]);

  // Handle map filter change
  const handleMapFilterChange = useCallback((filterId: keyof typeof DEFAULT_MAP_FILTERS, enabled: boolean) => {
    setMapFilters((prev) => ({ ...prev, [filterId]: enabled }));
    saveCurrentPreferences();
  }, [saveCurrentPreferences]);

  // Handle widget visibility change
  const handleWidgetVisibilityChange = useCallback((widgetId: keyof typeof DEFAULT_WIDGET_VISIBILITY, visible: boolean) => {
    setWidgetVisibility((prev) => ({ ...prev, [widgetId]: visible }));
    saveCurrentPreferences();
  }, [saveCurrentPreferences]);

  // Handle widget position change
  const handleWidgetPositionChange = useCallback((widgetId: string, position: { x: number; y: number }) => {
    setWidgetPositions((prev) => ({ ...prev, [widgetId]: position }));
    saveCurrentPreferences();
  }, [saveCurrentPreferences]);

  // Handle widget size change
  const handleWidgetSizeChange = useCallback((widgetId: string, size: { width: number; height: number }) => {
    setWidgetSizes((prev) => ({ ...prev, [widgetId]: size }));
    saveCurrentPreferences();
  }, [saveCurrentPreferences]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token && token !== 'authenticated') {
        try {
          await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          // Silently fail
        }
      }

      if (user) {
        logActivity({
          action: 'LOGOUT',
          category: 'SECURITY',
          resource: 'Authentication',
          description: `User logged out: ${user.username || user.email}`,
          status: 'SUCCESS',
        });
      }

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
      router.push('/login');
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
      router.push('/login');
    }
  }, [user, router]);

  // Helper to convert filter ID to prop name (handles special cases like CCTV)
  const getFilterPropName = useCallback((id: string): string => {
    // Special cases
    if (id === 'cctv') return 'CCTV';
    // Capitalize first letter
    return id.charAt(0).toUpperCase() + id.slice(1);
  }, []);

  // Memoized map filter props - generate all props dynamically
  const mapFilterProps = useMemo(() => {
    const props: Record<string, any> = {};
    const filterIds = Object.keys(DEFAULT_MAP_FILTERS) as Array<keyof typeof DEFAULT_MAP_FILTERS>;
    
    filterIds.forEach((id) => {
      const pascalCase = getFilterPropName(id);
      props[`${id}Enabled`] = mapFilters[id];
      props[`on${pascalCase}Change`] = (enabled: boolean) => handleMapFilterChange(id, enabled);
    });
    
    return props;
  }, [mapFilters, handleMapFilterChange, getFilterPropName]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (savePreferencesTimerRef.current) {
        clearTimeout(savePreferencesTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] w-full bg-background/5 backdrop-blur-2xl border-b border-white/3 shadow-lg">
        <div className="grid grid-cols-3 h-16 items-center px-6">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0 flex items-center justify-center">
              <Image 
                src="/Logo_mpsepang.png" 
                alt="MPSepang Logo" 
                width={40}
                height={40}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl text-white font-bold flex items-center gap-2">
                MPSepang IOC Dashboard
                <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                  <Activity className="h-3 w-3 animate-pulse text-green-500" />
                  <span className="text-xs">Live</span>
                </Badge>
              </h1>
              <p className="text-xs text-white text-muted-foreground">Integrated Operations Center - Real-Time Monitoring</p>
            </div>
          </div>

          {/* Center Section - Time */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-3xl text-white font-bold tabular-nums" suppressHydrationWarning>
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
            <div className="text-xs text-white text-muted-foreground" suppressHydrationWarning>
              {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatars/admin.png" alt={getUserDisplayName} />
                    <AvatarFallback>{getUserInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-[110]" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{getUserDisplayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{getUserEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/admin')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Admin Page</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Map Filters */}
      <MapFilters {...mapFilterProps} />

      {/* Weather Widget */}
      <DraggableWidget
        widgetId="weather"
        initialPosition={widgetPositions.weather}
        initialSize={widgetSizes.weather}
        onPositionChange={(pos) => handleWidgetPositionChange('weather', pos)}
        onSizeChange={(size) => handleWidgetSizeChange('weather', size)}
      >
        <WeatherWidget initialSize={widgetSizes.weather} />
      </DraggableWidget>

      {/* Other Widgets */}
      {widgetVisibility.streetlight && (
        <DraggableWidget
          widgetId="streetlight"
          initialPosition={widgetPositions.streetlight}
          initialSize={widgetSizes.streetlight}
          onPositionChange={(pos) => handleWidgetPositionChange('streetlight', pos)}
          onSizeChange={(size) => handleWidgetSizeChange('streetlight', size)}
        >
          <StreetlightStatus disableInternalPositioning={true} initialSize={widgetSizes.streetlight} />
        </DraggableWidget>
      )}

      {widgetVisibility.cctv && (
        <DraggableWidget
          widgetId="cctv"
          initialPosition={widgetPositions.cctv}
          initialSize={widgetSizes.cctv}
          onPositionChange={(pos) => handleWidgetPositionChange('cctv', pos)}
          onSizeChange={(size) => handleWidgetSizeChange('cctv', size)}
        >
          <CCTVStatus disableInternalPositioning={true} initialSize={widgetSizes.cctv} />
        </DraggableWidget>
      )}

      {widgetVisibility.aibox && (
        <DraggableWidget
          widgetId="aibox"
          initialPosition={widgetPositions.aibox}
          initialSize={widgetSizes.aibox}
          onPositionChange={(pos) => handleWidgetPositionChange('aibox', pos)}
          onSizeChange={(size) => handleWidgetSizeChange('aibox', size)}
        >
          <AIBoxDetection disableInternalPositioning={true} initialSize={widgetSizes.aibox} />
        </DraggableWidget>
      )}

      {widgetVisibility.compound && (
        <DraggableWidget
          widgetId="compound"
          initialPosition={widgetPositions.compound}
          initialSize={widgetSizes.compound}
          onPositionChange={(pos) => handleWidgetPositionChange('compound', pos)}
          onSizeChange={(size) => handleWidgetSizeChange('compound', size)}
        >
          <CompoundChart disableInternalPositioning={true} initialSize={widgetSizes.compound} />
        </DraggableWidget>
      )}

      {widgetVisibility.tax && (
        <DraggableWidget
          widgetId="tax"
          initialPosition={widgetPositions.tax}
          initialSize={widgetSizes.tax}
          onPositionChange={(pos) => handleWidgetPositionChange('tax', pos)}
          onSizeChange={(size) => handleWidgetSizeChange('tax', size)}
        >
          <TaxAnalytics disableInternalPositioning={true} initialSize={widgetSizes.tax} />
        </DraggableWidget>
      )}

      {widgetVisibility.vehicleCounting && (
        <DraggableWidget
          widgetId="vehicleCounting"
          initialPosition={widgetPositions.vehicleCounting}
          initialSize={widgetSizes.vehicleCounting}
          onPositionChange={(pos) => handleWidgetPositionChange('vehicleCounting', pos)}
          onSizeChange={(size) => handleWidgetSizeChange('vehicleCounting', size)}
        >
          <VehicleCounting disableInternalPositioning={true} initialSize={widgetSizes.vehicleCounting} />
        </DraggableWidget>
      )}

      {widgetVisibility.humanCounting && (
        <DraggableWidget
          widgetId="humanCounting"
          initialPosition={widgetPositions.humanCounting}
          initialSize={widgetSizes.humanCounting}
          onPositionChange={(pos) => handleWidgetPositionChange('humanCounting', pos)}
          onSizeChange={(size) => handleWidgetSizeChange('humanCounting', size)}
        >
          <HumanCounting disableInternalPositioning={true} initialSize={widgetSizes.humanCounting} />
        </DraggableWidget>
      )}

      <ExampleWidget
        defaultVisible={widgetVisibility.example}
        onVisibilityChange={(visible) => handleWidgetVisibilityChange('example', visible)}
        streetlightVisible={widgetVisibility.streetlight}
        onStreetlightVisibilityChange={(visible) => handleWidgetVisibilityChange('streetlight', visible)}
        compoundVisible={widgetVisibility.compound}
        onCompoundVisibilityChange={(visible) => handleWidgetVisibilityChange('compound', visible)}
        taxVisible={widgetVisibility.tax}
        onTaxVisibilityChange={(visible) => handleWidgetVisibilityChange('tax', visible)}
        aiboxVisible={widgetVisibility.aibox}
        onAiboxVisibilityChange={(visible) => handleWidgetVisibilityChange('aibox', visible)}
        cctvVisible={widgetVisibility.cctv}
        onCctvVisibilityChange={(visible) => handleWidgetVisibilityChange('cctv', visible)}
        vehicleCountingVisible={widgetVisibility.vehicleCounting}
        onVehicleCountingVisibilityChange={(visible) => handleWidgetVisibilityChange('vehicleCounting', visible)}
        humanCountingVisible={widgetVisibility.humanCounting}
        onHumanCountingVisibilityChange={(visible) => handleWidgetVisibilityChange('humanCounting', visible)}
        onSavePreferences={saveCurrentPreferences}
      />

      {/* Main Content - Google Map */}
      <main className="relative pt-0">
        <div 
          className="w-full bg-muted" 
          style={{ 
            width: '100%',
            height: 'calc(100vh - 40px)',
            minHeight: '600px',
            position: 'relative',
            marginTop: '0'
          }}
        >
          <GoogleMap 
            showLandmarks={mapFilters.landmarks}
            showBlokPerancangan={mapFilters.blokPerancangan}
            showBridge={mapFilters.bridge}
            showCCTV={mapFilters.cctv}
            showChartingKm={mapFilters.chartingKm}
            showConstructedSlope={mapFilters.constructedSlope}
            showDrainage={mapFilters.drainage}
            showEarthWork={mapFilters.earthWork}
            showFeederPillar={mapFilters.feederPillar}
            showFlexiblePost={mapFilters.flexiblePost}
            showGtmix={mapFilters.gtmix}
            showSempadanTaman={mapFilters.sempadanTaman}
            showGtnhSemasa={mapFilters.gtnhSemasa}
            showJalan={mapFilters.jalan}
            showJalanKejuruteraan={mapFilters.jalanKejuruteraan}
            showKomitedKm={mapFilters.komitedKm}
            showLocationMapAset={mapFilters.locationMapAset}
            showLocationMapAsetItem={mapFilters.locationMapAsetItem}
            showLokasiBanjir={mapFilters.lokasiBanjir}
            showNdcdb20={mapFilters.ndcdb20}
            showNdcdb23={mapFilters.ndcdb23}
            showPasarAwam={mapFilters.pasarAwam}
            showPasarMalam={mapFilters.pasarMalam}
            showPasarSari={mapFilters.pasarSari}
            showPasarTani={mapFilters.pasarTani}
            showRoadHump={mapFilters.roadHump}
            showRoadMarkingLinear={mapFilters.roadMarkingLinear}
            showRoadMarkingPoint={mapFilters.roadMarkingPoint}
            showRoadMedian={mapFilters.roadMedian}
            showRoadShoulder={mapFilters.roadShoulder}
            showSampahHaram={mapFilters.sampahHaram}
            showSempadanDaerah={mapFilters.sempadanDaerah}
            showSignboard={mapFilters.signboard}
            showSportFacility={mapFilters.sportFacility}
            showStreetLighting={mapFilters.streetLighting}
            showLoranetStreetlight={mapFilters.loranetStreetlight}
            showTamanPerumahan={mapFilters.tamanPerumahan}
            showTrafficLight={mapFilters.trafficLight}
            showWartaKawasanLapang={mapFilters.wartaKawasanLapang}
            showZonAhliMajlis={mapFilters.zonAhliMajlis}
            onMapLoad={() => {
              setTimeout(() => {
                if (typeof window !== 'undefined' && window.google?.maps) {
                  // Map resize handled by component
                }
              }, 200);
            }}
            onMapError={(error) => setMapError(error)}
          />
        </div>
      </main>

      {/* News Ticker Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-primary-foreground border-t-2 border-primary-foreground/20">
        <div className="flex items-center h-10 overflow-hidden">
          <div className="flex-shrink-0 px-4 py-2 bg-primary-foreground/10 font-bold text-sm flex items-center gap-2 border-r border-primary-foreground/20">
            <Radio className="h-4 w-4 animate-pulse" />
            <span>LIVE UPDATES</span>
          </div>
          <div className="flex-1 overflow-hidden relative">
            {isLoadingNews ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-sm text-primary-foreground/70">Loading news...</span>
              </div>
            ) : newsItems.length > 0 ? (
              <div className="animate-ticker flex gap-12 whitespace-nowrap py-2">
                {[...newsItems, ...newsItems].map((item, index) => (
                  <div key={index} className="inline-flex items-center gap-2">
                    <span className="text-sm font-medium">•</span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-sm text-primary-foreground/70">No news updates at this time</span>
              </div>
            )}
          </div>
        </div>
      </footer>

      {/* Ticker animation styles */}
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 60s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
