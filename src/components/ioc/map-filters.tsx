"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  MapPin,
  Layers,
  Camera,
  Building2,
  Map,
  ShoppingBag,
  TreePine,
  Landmark,
  X,
} from "lucide-react";

interface MapFiltersProps {
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
  // PLANMalaysia (ArcGIS) layer group
  onPlanMalaysiaChange?: (enabled: boolean) => void;
  planMalaysiaEnabled?: boolean;
  onAsetMPSepangChange?: (enabled: boolean) => void;
  asetMPSepangEnabled?: boolean;
}

interface FilterItem {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
  enabled: boolean;
  onChange?: (enabled: boolean) => void;
  accent: string;
}

type CategoryKey =
  | "infrastructure"
  | "facilities"
  | "boundaries"
  | "markets"
  | "assets"
  | "planMalaysia"
  | "others";

const CATEGORY_META: Record<
  CategoryKey,
  { label: string; icon: React.ReactNode; accent: string }
> = {
  infrastructure: { label: "Infrastructure", icon: <Building2 className="h-4 w-4" />, accent: "from-blue-500 to-cyan-500" },
  facilities:     { label: "Facilities",     icon: <Camera className="h-4 w-4" />,    accent: "from-purple-500 to-pink-500" },
  boundaries:     { label: "Boundaries",     icon: <Map className="h-4 w-4" />,        accent: "from-emerald-500 to-teal-500" },
  markets:        { label: "Markets",        icon: <ShoppingBag className="h-4 w-4" />, accent: "from-orange-500 to-amber-500" },
  assets:         { label: "Assets",         icon: <TreePine className="h-4 w-4" />,   accent: "from-lime-500 to-green-500" },
  planMalaysia:   { label: "PLAN Malaysia",  icon: <Landmark className="h-4 w-4" />,   accent: "from-sky-500 to-blue-500" },
  others:         { label: "Others",         icon: <Landmark className="h-4 w-4" />,   accent: "from-rose-500 to-red-500" },
};

function LayerToggle({
  item,
  accent,
}: {
  item: FilterItem;
  accent: string;
}) {
  return (
    <button
      onClick={() => item.onChange?.(!item.enabled)}
      className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left
        ${item.enabled
          ? "bg-white/10 shadow-sm"
          : "hover:bg-white/5"
        }`}
    >
      {/* Icon badge */}
      <div
        className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200
          ${item.enabled
            ? `bg-gradient-to-br ${accent} shadow-md`
            : "bg-white/10"
          }`}
      >
        {item.icon ? (
          typeof item.icon === "string" ? (
            <Image
              src={item.icon}
              alt={item.label}
              width={16}
              height={16}
              className="h-4 w-4 object-contain"
            />
          ) : (
            <span className={`${item.enabled ? "text-white" : "text-white/50"}`}>
              {item.icon}
            </span>
          )
        ) : (
          <Layers className={`h-3.5 w-3.5 ${item.enabled ? "text-white" : "text-white/40"}`} />
        )}
      </div>

      {/* Label */}
      <span
        className={`flex-1 text-[11px] leading-snug font-medium transition-colors duration-200 pr-2
          ${item.enabled ? "text-white" : "text-white/50 group-hover:text-white/70"}`}
        style={{ wordBreak: "break-word" }}
      >
        {item.label}
      </span>

      {/* Toggle pill */}
      <div
        className={`relative w-9 h-5 rounded-full shrink-0 transition-all duration-300
          ${item.enabled
            ? `bg-gradient-to-r ${accent}`
            : "bg-white/15"
          }`}
      >
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300
            ${item.enabled ? "left-[18px]" : "left-0.5"}`}
        />
      </div>
    </button>
  );
}

export default function MapFilters(props: MapFiltersProps) {
  const [activeTab, setActiveTab] = useState<CategoryKey>("infrastructure");
  const [search, setSearch] = useState("");

  const filterCategories: Record<CategoryKey, FilterItem[]> = useMemo(
    () => ({
    infrastructure: [
      { id: "bridge",             label: "Bridge",               icon: "/icon/bridge.png",             enabled: props.bridgeEnabled ?? false,             onChange: props.onBridgeChange,             accent: "from-amber-500 to-yellow-400" },
      { id: "drainage",           label: "Drainage",             icon: "/icon/drainage.png",           enabled: props.drainageEnabled ?? false,           onChange: props.onDrainageChange,           accent: "from-blue-500 to-cyan-400" },
      { id: "earthWork",          label: "Earth Work",           icon: "/icon/earthwork.png",          enabled: props.earthWorkEnabled ?? false,          onChange: props.onEarthWorkChange,          accent: "from-orange-500 to-amber-400" },
      { id: "constructedSlope",   label: "Constructed Slope",    icon: "/icon/constructionslope.png",  enabled: props.constructedSlopeEnabled ?? false,   onChange: props.onConstructedSlopeChange,   accent: "from-green-500 to-emerald-400" },
      { id: "jalan",              label: "Jalan",                icon: undefined,                      enabled: props.jalanEnabled ?? false,              onChange: props.onJalanChange,              accent: "from-indigo-500 to-blue-400" },
      { id: "jalanKejuruteraan",  label: "Jalan Kejuruteraan",   icon: undefined,                      enabled: props.jalanKejuruteraanEnabled ?? false,  onChange: props.onJalanKejuruteraanChange,  accent: "from-pink-500 to-rose-400" },
      { id: "roadHump",           label: "Road Hump",            icon: "/icon/roadhump.png",           enabled: props.roadHumpEnabled ?? false,           onChange: props.onRoadHumpChange,           accent: "from-yellow-500 to-amber-400" },
      { id: "roadMarkingLinear",  label: "Road Marking Linear",  icon: "/icon/road-marking.png",       enabled: props.roadMarkingLinearEnabled ?? false,  onChange: props.onRoadMarkingLinearChange,  accent: "from-orange-500 to-red-400" },
      { id: "roadMarkingPoint",   label: "Road Marking Point",   icon: "/icon/road-marking-point.png", enabled: props.roadMarkingPointEnabled ?? false,   onChange: props.onRoadMarkingPointChange,   accent: "from-orange-400 to-yellow-400" },
      { id: "roadMedian",         label: "Road Median",          icon: "/icon/roadmedian.webp",        enabled: props.roadMedianEnabled ?? false,         onChange: props.onRoadMedianChange,         accent: "from-teal-500 to-cyan-400" },
      { id: "roadShoulder",       label: "Road Shoulder",        icon: "/icon/roadshoulder.png",       enabled: props.roadShoulderEnabled ?? false,       onChange: props.onRoadShoulderChange,       accent: "from-slate-400 to-gray-400" },
      { id: "feederPillar",       label: "Feeder Pillar",        icon: "/icon/feeder-pillar.jpg",      enabled: props.feederPillarEnabled ?? false,       onChange: props.onFeederPillarChange,       accent: "from-yellow-400 to-orange-400" },
      { id: "flexiblePost",       label: "Flexible Post",        icon: "/icon/flexiblepost.png",       enabled: props.flexiblePostEnabled ?? false,       onChange: props.onFlexiblePostChange,       accent: "from-orange-400 to-amber-400" },
      { id: "signboard",          label: "Signboard",            icon: "/icon/signboard.png",          enabled: props.signboardEnabled ?? false,          onChange: props.onSignboardChange,          accent: "from-purple-500 to-violet-400" },
    ],
    facilities: [
      { id: "cctv",              label: "CCTV",              icon: <Camera className="h-4 w-4" />,  enabled: props.cctvEnabled ?? false,              onChange: props.onCCTVChange,              accent: "from-purple-500 to-pink-400" },
      { id: "trafficLight",      label: "Traffic Light",     icon: "/icon/traffic-light.png",        enabled: props.trafficLightEnabled ?? false,      onChange: props.onTrafficLightChange,      accent: "from-red-500 to-rose-400" },
      { id: "streetLighting",    label: "Street Lighting",   icon: "/icon/street-light-mps.png",     enabled: props.streetLightingEnabled ?? false,    onChange: props.onStreetLightingChange,    accent: "from-yellow-400 to-amber-300" },
      { id: "loranetStreetlight",label: "Loranet Streetlight",icon: "/icon/loranetstreetlight.png",  enabled: props.loranetStreetlightEnabled ?? false,onChange: props.onLoranetStreetlightChange,accent: "from-yellow-500 to-orange-400" },
      { id: "sportFacility",     label: "Sport Facility",    icon: "/icon/sport.png",                enabled: props.sportFacilityEnabled ?? false,     onChange: props.onSportFacilityChange,     accent: "from-orange-500 to-red-400" },
    ],
    boundaries: [
      { id: "blokPerancangan",  label: "Blok Perancangan",  icon: <Layers className="h-4 w-4" />,  enabled: props.blokPerancanganEnabled ?? false,  onChange: props.onBlokPerancanganChange,  accent: "from-blue-500 to-indigo-400" },
      { id: "sempadanTaman",    label: "Sempadan Taman",    icon: "/icon/tamanborder.png",          enabled: props.sempadanTamanEnabled ?? false,    onChange: props.onSempadanTamanChange,    accent: "from-green-500 to-emerald-400" },
      { id: "sempadanDaerah",   label: "Sempadan Daerah",   icon: "/icon/daerah.png",               enabled: props.sempadanDaerahEnabled ?? false,   onChange: props.onSempadanDaerahChange,   accent: "from-blue-600 to-blue-400" },
      { id: "tamanPerumahan",   label: "Taman Perumahan",   icon: "/icon/tamanperumahan.png",       enabled: props.tamanPerumahanEnabled ?? false,   onChange: props.onTamanPerumahanChange,   accent: "from-green-600 to-teal-400" },
      { id: "zonAhliMajlis",    label: "Zon Ahli Majlis",   icon: "/icon/zoning.png",              enabled: props.zonAhliMajlisEnabled ?? false,    onChange: props.onZonAhliMajlisChange,    accent: "from-purple-600 to-violet-400" },
    ],
    markets: [
      { id: "pasarAwam",  label: "Pasar Awam",  icon: "/icon/pasar.png", enabled: props.pasarAwamEnabled ?? false,  onChange: props.onPasarAwamChange,  accent: "from-violet-500 to-purple-400" },
      { id: "pasarMalam", label: "Pasar Malam", icon: "/icon/pasar.png", enabled: props.pasarMalamEnabled ?? false, onChange: props.onPasarMalamChange, accent: "from-violet-600 to-indigo-400" },
      { id: "pasarSari",  label: "Pasar Sari",  icon: "/icon/pasar.png", enabled: props.pasarSariEnabled ?? false,  onChange: props.onPasarSariChange,  accent: "from-violet-400 to-pink-400" },
      { id: "pasarTani",  label: "Pasar Tani",  icon: "/icon/pasar.png", enabled: props.pasarTaniEnabled ?? false,  onChange: props.onPasarTaniChange,  accent: "from-orange-500 to-amber-400" },
    ],
    assets: [
      { id: "locationMapAset",     label: "Location Map Aset",      icon: "/icon/tree.png",         enabled: props.locationMapAsetEnabled ?? false,     onChange: props.onLocationMapAsetChange,     accent: "from-green-500 to-lime-400" },
      { id: "locationMapAsetItem", label: "Location Map Aset Item",  icon: "/icon/tree.png",         enabled: props.locationMapAsetItemEnabled ?? false, onChange: props.onLocationMapAsetItemChange, accent: "from-green-400 to-emerald-400" },
      { id: "chartingKm",          label: "Charting KM",             icon: "/icon/chartingkm.png",   enabled: props.chartingKmEnabled ?? false,          onChange: props.onChartingKmChange,          accent: "from-indigo-500 to-blue-400" },
      { id: "komitedKm",           label: "Komited KM",              icon: undefined,                enabled: props.komitedKmEnabled ?? false,           onChange: props.onKomitedKmChange,           accent: "from-amber-500 to-yellow-400" },
      { id: "gtmix",               label: "GTMix",                   icon: undefined,                enabled: props.gtmixEnabled ?? false,               onChange: props.onGtmixChange,               accent: "from-red-500 to-rose-400" },
      { id: "gtnhSemasa",          label: "GTNH Semasa",             icon: undefined,                enabled: props.gtnhSemasaEnabled ?? false,          onChange: props.onGtnhSemasaChange,          accent: "from-blue-500 to-cyan-400" },
      { id: "ndcdb20",             label: "NDCDB20",                 icon: "/icon/ndcdb20.png",      enabled: props.ndcdb20Enabled ?? false,             onChange: props.onNdcdb20Change,             accent: "from-cyan-500 to-teal-400" },
      { id: "ndcdb23",             label: "NDCDB23",                 icon: "/icon/ndcdb23.png",      enabled: props.ndcdb23Enabled ?? false,             onChange: props.onNdcdb23Change,             accent: "from-cyan-600 to-blue-400" },
      { id: "wartaKawasanLapang",  label: "Warta Kawasan Lapang",    icon: "/icon/land.png",         enabled: props.wartaKawasanLapangEnabled ?? false,  onChange: props.onWartaKawasanLapangChange,  accent: "from-lime-500 to-green-400" },
    ],
    // New PLAN Malaysia category – toggles remote ArcGIS DBIKMS2025 layer(s)
    planMalaysia: [
      {
        id: "planMalaysia",
        label: "DBIKMS 2025 (PLANMalaysia)",
        icon: "/icon/plan-malaysia.png",
        enabled: props.planMalaysiaEnabled ?? false,
        onChange: props.onPlanMalaysiaChange,
        accent: "from-sky-500 to-blue-500",
      },
      {
        id: "asetMPSepang",
        label: "Aset MPSepang (PLANMalaysia)",
        icon: "/icon/plan-malaysia.png",
        enabled: props.asetMPSepangEnabled ?? false,
        onChange: props.onAsetMPSepangChange,
        accent: "from-emerald-500 to-teal-500",
      },
    ],
    others: [
      { id: "lokasiBanjir",label: "Lokasi Banjir", icon: "/icon/flood.png",              enabled: props.lokasiBanjirEnabled ?? false, onChange: props.onLokasiBanjirChange, accent: "from-blue-500 to-cyan-400" },
      { id: "sampahHaram", label: "Sampah Haram",  icon: "/icon/illegaldumping.jpeg",    enabled: props.sampahHaramEnabled ?? false,  onChange: props.onSampahHaramChange,  accent: "from-red-500 to-rose-400" },
    ],
  }),
  [props]
);

  const totalActive = useMemo(
    () => Object.values(filterCategories).flat().filter((f) => f.enabled).length,
    [filterCategories]
  );

  const activeCounts = useMemo(
    () =>
      Object.fromEntries(
        (Object.keys(filterCategories) as CategoryKey[]).map((k) => [
          k,
          filterCategories[k].filter((f) => f.enabled).length,
        ])
      ) as Record<CategoryKey, number>,
    [filterCategories]
  );

  const visibleItems = useMemo(() => {
    const items = filterCategories[activeTab];
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [filterCategories, activeTab, search]);

  const categoryKeys = Object.keys(CATEGORY_META) as CategoryKey[];

  return (
    <div className="w-full h-full flex flex-col gap-0 min-h-0">
      {/* Search bar */}
      <div className="px-3 pt-2 pb-3 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search layers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/8 border border-white/10 rounded-lg pl-8 pr-8 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-sky-400/50 focus:bg-white/12 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Total active badge */}
        {totalActive > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-[10px] text-sky-300 font-medium">
              {totalActive} layer{totalActive !== 1 ? "s" : ""} active
            </span>
          </div>
        )}
      </div>

      {/* Category pills — horizontal scroll */}
      <div className="flex-shrink-0 overflow-x-auto scrollbar-none px-3 pb-3">
        <div className="flex gap-1.5 w-max">
          {categoryKeys.map((key) => {
            const meta = CATEGORY_META[key];
            const count = activeCounts[key];
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setSearch(""); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 border
                  ${isActive
                    ? `bg-gradient-to-r ${meta.accent} text-white border-transparent shadow-md`
                    : "bg-white/6 text-white/50 border-white/10 hover:bg-white/12 hover:text-white/80"
                  }`}
              >
                <span className={isActive ? "text-white" : "text-white/50"}>{meta.icon}</span>
                {meta.label}
                {count > 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold
                      ${isActive ? "bg-white/25 text-white" : "bg-white/15 text-white/70"}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-white/8 flex-shrink-0" />

      {/* Layer list */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-3 py-2 space-y-1">
          {visibleItems.length === 0 ? (
            <div className="py-8 text-center text-white/30 text-xs">
              No layers found
            </div>
          ) : (
            visibleItems.map((item) => (
              <LayerToggle
                key={item.id}
                item={item}
                accent={item.accent}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
