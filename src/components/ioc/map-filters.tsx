"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Filter,
  MapPin,
  Layers,
  Camera,
  Building2,
  Map,
  ShoppingBag,
  TreePine,
  Landmark,
} from "lucide-react";

interface MapFiltersProps {
  onLandmarksChange?: (enabled: boolean) => void;
  landmarksEnabled?: boolean;
  onBlokPerancanganChange?: (enabled: boolean) => void;
  blokPerancanganEnabled?: boolean;
  onBridgeChange?: (enabled: boolean) => void;
  bridgeEnabled?: boolean;
  onCCTVChange?: (enabled: boolean) => void;
  cctvEnabled?: boolean;
  onChartingKmChange?: (enabled: boolean) => void;
  chartingKmEnabled?: boolean;
  onConstructedSlopeChange?: (enabled: boolean) => void;
  constructedSlopeEnabled?: boolean;
  onDrainageChange?: (enabled: boolean) => void;
  drainageEnabled?: boolean;
  onEarthWorkChange?: (enabled: boolean) => void;
  earthWorkEnabled?: boolean;
  onFeederPillarChange?: (enabled: boolean) => void;
  feederPillarEnabled?: boolean;
  onFlexiblePostChange?: (enabled: boolean) => void;
  flexiblePostEnabled?: boolean;
  onGtmixChange?: (enabled: boolean) => void;
  gtmixEnabled?: boolean;
  onSempadanTamanChange?: (enabled: boolean) => void;
  sempadanTamanEnabled?: boolean;
  onGtnhSemasaChange?: (enabled: boolean) => void;
  gtnhSemasaEnabled?: boolean;
  onJalanChange?: (enabled: boolean) => void;
  jalanEnabled?: boolean;
  onJalanKejuruteraanChange?: (enabled: boolean) => void;
  jalanKejuruteraanEnabled?: boolean;
  onKomitedKmChange?: (enabled: boolean) => void;
  komitedKmEnabled?: boolean;
  onLocationMapAsetChange?: (enabled: boolean) => void;
  locationMapAsetEnabled?: boolean;
  onLocationMapAsetItemChange?: (enabled: boolean) => void;
  locationMapAsetItemEnabled?: boolean;
  onLokasiBanjirChange?: (enabled: boolean) => void;
  lokasiBanjirEnabled?: boolean;
  onNdcdb20Change?: (enabled: boolean) => void;
  ndcdb20Enabled?: boolean;
  onNdcdb23Change?: (enabled: boolean) => void;
  ndcdb23Enabled?: boolean;
  onPasarAwamChange?: (enabled: boolean) => void;
  pasarAwamEnabled?: boolean;
  onPasarMalamChange?: (enabled: boolean) => void;
  pasarMalamEnabled?: boolean;
  onPasarSariChange?: (enabled: boolean) => void;
  pasarSariEnabled?: boolean;
  onPasarTaniChange?: (enabled: boolean) => void;
  pasarTaniEnabled?: boolean;
  onRoadHumpChange?: (enabled: boolean) => void;
  roadHumpEnabled?: boolean;
  onRoadMarkingLinearChange?: (enabled: boolean) => void;
  roadMarkingLinearEnabled?: boolean;
  onRoadMarkingPointChange?: (enabled: boolean) => void;
  roadMarkingPointEnabled?: boolean;
  onRoadMedianChange?: (enabled: boolean) => void;
  roadMedianEnabled?: boolean;
  onRoadShoulderChange?: (enabled: boolean) => void;
  roadShoulderEnabled?: boolean;
  onSampahHaramChange?: (enabled: boolean) => void;
  sampahHaramEnabled?: boolean;
  onSempadanDaerahChange?: (enabled: boolean) => void;
  sempadanDaerahEnabled?: boolean;
  onSignboardChange?: (enabled: boolean) => void;
  signboardEnabled?: boolean;
  onSportFacilityChange?: (enabled: boolean) => void;
  sportFacilityEnabled?: boolean;
  onStreetLightingChange?: (enabled: boolean) => void;
  streetLightingEnabled?: boolean;
  onLoranetStreetlightChange?: (enabled: boolean) => void;
  loranetStreetlightEnabled?: boolean;
  onTamanPerumahanChange?: (enabled: boolean) => void;
  tamanPerumahanEnabled?: boolean;
  onTrafficLightChange?: (enabled: boolean) => void;
  trafficLightEnabled?: boolean;
  onWartaKawasanLapangChange?: (enabled: boolean) => void;
  wartaKawasanLapangEnabled?: boolean;
  onZonAhliMajlisChange?: (enabled: boolean) => void;
  zonAhliMajlisEnabled?: boolean;
}

interface FilterItem {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
  enabled: boolean;
  onChange?: (enabled: boolean) => void;
  color?: string;
}

export default function MapFilters(props: MapFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("infrastructure");

  // Define filter items organized by category - using props directly
  const filterCategories = {
    infrastructure: [
      { id: "bridge", label: "Bridge", icon: "/icon/bridge.png", enabled: props.bridgeEnabled ?? false, onChange: props.onBridgeChange, color: "bg-amber-500" },
      { id: "drainage", label: "Drainage", icon: "/icon/drainage.png", enabled: props.drainageEnabled ?? false, onChange: props.onDrainageChange, color: "bg-blue-500" },
      { id: "earthWork", label: "Earth Work", icon: "/icon/earthwork.png", enabled: props.earthWorkEnabled ?? false, onChange: props.onEarthWorkChange, color: "bg-orange-500" },
      { id: "constructedSlope", label: "Constructed Slope", icon: "/icon/constructionslope.png", enabled: props.constructedSlopeEnabled ?? false, onChange: props.onConstructedSlopeChange, color: "bg-green-500" },
      { id: "jalan", label: "Jalan", enabled: props.jalanEnabled ?? false, onChange: props.onJalanChange, color: "bg-indigo-500" },
      { id: "jalanKejuruteraan", label: "Jalan Kejuruteraan", enabled: props.jalanKejuruteraanEnabled ?? false, onChange: props.onJalanKejuruteraanChange, color: "bg-pink-500" },
      { id: "roadHump", label: "Road Hump", icon: "/icon/roadhump.png", enabled: props.roadHumpEnabled ?? false, onChange: props.onRoadHumpChange, color: "bg-yellow-500" },
      { id: "roadMarkingLinear", label: "Road Marking Linear", icon: "/icon/road-marking.png", enabled: props.roadMarkingLinearEnabled ?? false, onChange: props.onRoadMarkingLinearChange, color: "bg-orange-500" },
      { id: "roadMarkingPoint", label: "Road Marking Point", icon: "/icon/road-marking-point.png", enabled: props.roadMarkingPointEnabled ?? false, onChange: props.onRoadMarkingPointChange, color: "bg-orange-500" },
      { id: "roadMedian", label: "Road Median", icon: "/icon/roadmedian.webp", enabled: props.roadMedianEnabled ?? false, onChange: props.onRoadMedianChange, color: "bg-teal-500" },
      { id: "roadShoulder", label: "Road Shoulder", icon: "/icon/roadshoulder.png", enabled: props.roadShoulderEnabled ?? false, onChange: props.onRoadShoulderChange, color: "bg-slate-500" },
      { id: "feederPillar", label: "Feeder Pillar", icon: "/icon/feeder-pillar.jpg", enabled: props.feederPillarEnabled ?? false, onChange: props.onFeederPillarChange, color: "bg-yellow-500" },
      { id: "flexiblePost", label: "Flexible Post", icon: "/icon/flexiblepost.png", enabled: props.flexiblePostEnabled ?? false, onChange: props.onFlexiblePostChange, color: "bg-orange-500" },
      { id: "signboard", label: "Signboard", icon: "/icon/signboard.png", enabled: props.signboardEnabled ?? false, onChange: props.onSignboardChange, color: "bg-purple-600" },
    ],
    facilities: [
      { id: "cctv", label: "CCTV", icon: <Camera className="h-4 w-4" />, enabled: props.cctvEnabled ?? false, onChange: props.onCCTVChange, color: "bg-purple-500" },
      { id: "trafficLight", label: "Traffic Light", icon: "/icon/traffic-light.png", enabled: props.trafficLightEnabled ?? false, onChange: props.onTrafficLightChange, color: "bg-red-600" },
      { id: "streetLighting", label: "Street Lighting", icon: "/icon/street-light-mps.png", enabled: props.streetLightingEnabled ?? false, onChange: props.onStreetLightingChange, color: "bg-yellow-500" },
      { id: "loranetStreetlight", label: "Loranet Streetlight", icon: "/icon/loranetstreetlight.png", enabled: props.loranetStreetlightEnabled ?? false, onChange: props.onLoranetStreetlightChange, color: "bg-yellow-500" },
      { id: "sportFacility", label: "Sport Facility", icon: "/icon/sport.png", enabled: props.sportFacilityEnabled ?? false, onChange: props.onSportFacilityChange, color: "bg-orange-600" },
    ],
    boundaries: [
      { id: "blokPerancangan", label: "Blok Perancangan", icon: <Layers className="h-4 w-4" />, enabled: props.blokPerancanganEnabled ?? false, onChange: props.onBlokPerancanganChange, color: "bg-blue-500" },
      { id: "sempadanTaman", label: "Sempadan Taman", icon: "/icon/tamanborder.png", enabled: props.sempadanTamanEnabled ?? false, onChange: props.onSempadanTamanChange, color: "bg-green-500" },
      { id: "sempadanDaerah", label: "Sempadan Daerah", icon: "/icon/daerah.png", enabled: props.sempadanDaerahEnabled ?? false, onChange: props.onSempadanDaerahChange, color: "bg-blue-600" },
      { id: "tamanPerumahan", label: "Taman Perumahan", icon: "/icon/tamanperumahan.png", enabled: props.tamanPerumahanEnabled ?? false, onChange: props.onTamanPerumahanChange, color: "bg-green-600" },
      { id: "zonAhliMajlis", label: "Zon Ahli Majlis", icon: "/icon/zoning.png", enabled: props.zonAhliMajlisEnabled ?? false, onChange: props.onZonAhliMajlisChange, color: "bg-purple-600" },
    ],
    markets: [
      { id: "pasarAwam", label: "Pasar Awam", icon: "/icon/pasar.png", enabled: props.pasarAwamEnabled ?? false, onChange: props.onPasarAwamChange, color: "bg-violet-500" },
      { id: "pasarMalam", label: "Pasar Malam", icon: "/icon/pasar.png", enabled: props.pasarMalamEnabled ?? false, onChange: props.onPasarMalamChange, color: "bg-violet-500" },
      { id: "pasarSari", label: "Pasar Sari", icon: "/icon/pasar.png", enabled: props.pasarSariEnabled ?? false, onChange: props.onPasarSariChange, color: "bg-violet-500" },
      { id: "pasarTani", label: "Pasar Tani", icon: "/icon/pasar.png", enabled: props.pasarTaniEnabled ?? false, onChange: props.onPasarTaniChange, color: "bg-violet-500" },
    ],
    assets: [
      { id: "locationMapAset", label: "Location Map Aset", icon: "/icon/tree.png", enabled: props.locationMapAsetEnabled ?? false, onChange: props.onLocationMapAsetChange, color: "bg-green-500" },
      { id: "locationMapAsetItem", label: "Location Map Aset Item", icon: "/icon/tree.png", enabled: props.locationMapAsetItemEnabled ?? false, onChange: props.onLocationMapAsetItemChange, color: "bg-green-500" },
      { id: "chartingKm", label: "Charting KM", icon: "/icon/chartingkm.png", enabled: props.chartingKmEnabled ?? false, onChange: props.onChartingKmChange, color: "bg-indigo-500" },
      { id: "komitedKm", label: "Komited KM", enabled: props.komitedKmEnabled ?? false, onChange: props.onKomitedKmChange, color: "bg-amber-500" },
      { id: "gtmix", label: "GTMix", enabled: props.gtmixEnabled ?? false, onChange: props.onGtmixChange, color: "bg-red-500" },
      { id: "gtnhSemasa", label: "GTNH Semasa", enabled: props.gtnhSemasaEnabled ?? false, onChange: props.onGtnhSemasaChange, color: "bg-blue-500" },
      { id: "ndcdb20", label: "NDCDB20", icon: "/icon/ndcdb20.png", enabled: props.ndcdb20Enabled ?? false, onChange: props.onNdcdb20Change, color: "bg-cyan-500" },
      { id: "ndcdb23", label: "NDCDB23", icon: "/icon/ndcdb23.png", enabled: props.ndcdb23Enabled ?? false, onChange: props.onNdcdb23Change, color: "bg-cyan-600" },
      { id: "wartaKawasanLapang", label: "Warta Kawasan Lapang", icon: "/icon/land.png", enabled: props.wartaKawasanLapangEnabled ?? false, onChange: props.onWartaKawasanLapangChange, color: "bg-lime-600" },
    ],
    others: [
      { id: "landmarks", label: "Landmarks", icon: <MapPin className="h-4 w-4" />, enabled: props.landmarksEnabled ?? false, onChange: props.onLandmarksChange, color: "bg-green-500" },
      { id: "lokasiBanjir", label: "Lokasi Banjir", icon: "/icon/flood.png", enabled: props.lokasiBanjirEnabled ?? false, onChange: props.onLokasiBanjirChange, color: "bg-blue-500" },
      { id: "sampahHaram", label: "Sampah Haram", icon: "/icon/illegaldumping.jpeg", enabled: props.sampahHaramEnabled ?? false, onChange: props.onSampahHaramChange, color: "bg-red-600" },
    ],
  };

  // Flatten all filters for count
  const allFilters = Object.values(filterCategories).flat();

  // Count active filters
  const activeFilterCount = allFilters.filter(f => f.enabled).length;

  // Render filter item
  const renderFilterItem = (item: FilterItem) => {
    const handleToggle = () => {
      if (item.onChange) {
        item.onChange(!item.enabled);
      }
    };

    return (
      <div
        key={item.id}
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group"
        onClick={handleToggle}
      >
        <Checkbox
          checked={item.enabled}
          onCheckedChange={(checked) => {
            if (item.onChange) {
              item.onChange(checked === true);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0"
        />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {item.icon && (
            <div className="shrink-0">
              {typeof item.icon === 'string' ? (
                <Image src={item.icon} alt={item.label} width={16} height={16} className="h-4 w-4 object-contain" />
              ) : (
                <div className="h-4 w-4 flex items-center justify-center text-muted-foreground">
                  {item.icon}
                </div>
              )}
            </div>
          )}
          <span className="text-sm font-medium text-foreground truncate">{item.label}</span>
        </div>
        {item.enabled && item.color && (
          <div className={`h-2 w-2 rounded-full ${item.color} shrink-0`} />
        )}
      </div>
    );
  };

  return (
    <div className="fixed top-20 left-4 z-[90]">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="lg"
            className="bg-background/90 backdrop-blur-md border border-white/20 shadow-lg hover:bg-background/95 text-foreground"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="font-medium">Map Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col bg-background/50 backdrop-blur-xl border-r border-white/20 shadow-2xl">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-semibold">Map Filters</SheetTitle>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <div className="px-6 pt-4 border-b">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="infrastructure" className="text-xs">
                  <Building2 className="h-3 w-3 mr-1" />
                  Infrastructure
                </TabsTrigger>
                <TabsTrigger value="facilities" className="text-xs">
                  <Camera className="h-3 w-3 mr-1" />
                  Facilities
                </TabsTrigger>
                <TabsTrigger value="boundaries" className="text-xs">
                  <Map className="h-3 w-3 mr-1" />
                  Boundaries
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-3 mt-2">
                <TabsTrigger value="markets" className="text-xs">
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  Markets
                </TabsTrigger>
                <TabsTrigger value="assets" className="text-xs">
                  <TreePine className="h-3 w-3 mr-1" />
                  Assets
                </TabsTrigger>
                <TabsTrigger value="others" className="text-xs">
                  <Landmark className="h-3 w-3 mr-1" />
                  Others
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-6 py-4">
              <TabsContent value="infrastructure" className="mt-0 space-y-1">
                {filterCategories.infrastructure.map(renderFilterItem)}
              </TabsContent>
              <TabsContent value="facilities" className="mt-0 space-y-1">
                {filterCategories.facilities.map(renderFilterItem)}
              </TabsContent>
              <TabsContent value="boundaries" className="mt-0 space-y-1">
                {filterCategories.boundaries.map(renderFilterItem)}
              </TabsContent>
              <TabsContent value="markets" className="mt-0 space-y-1">
                {filterCategories.markets.map(renderFilterItem)}
              </TabsContent>
              <TabsContent value="assets" className="mt-0 space-y-1">
                {filterCategories.assets.map(renderFilterItem)}
              </TabsContent>
              <TabsContent value="others" className="mt-0 space-y-1">
                {filterCategories.others.map(renderFilterItem)}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
}
