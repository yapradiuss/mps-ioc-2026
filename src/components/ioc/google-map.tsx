"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapProps {
  onMapLoad?: () => void;
  onMapError?: (error: string) => void;
  showLandmarks?: boolean;
  showBlokPerancangan?: boolean;
  showBridge?: boolean;
  showCCTV?: boolean;
  showChartingKm?: boolean;
  showConstructedSlope?: boolean;
  showDrainage?: boolean;
  showEarthWork?: boolean;
  showFeederPillar?: boolean;
  showFlexiblePost?: boolean;
  showGtmix?: boolean;
  showSempadanTaman?: boolean;
  showGtnhSemasa?: boolean;
  showJalan?: boolean;
  showJalanKejuruteraan?: boolean;
  showKomitedKm?: boolean;
  showLocationMapAset?: boolean;
  showLocationMapAsetItem?: boolean;
  showLokasiBanjir?: boolean;
  showNdcdb20?: boolean;
  showNdcdb23?: boolean;
  showPasarAwam?: boolean;
  showPasarMalam?: boolean;
  showPasarSari?: boolean;
  showPasarTani?: boolean;
  showRoadHump?: boolean;
  showRoadMarkingLinear?: boolean;
  showRoadMarkingPoint?: boolean;
  showRoadMedian?: boolean;
  showRoadShoulder?: boolean;
  showSampahHaram?: boolean;
  showSempadanDaerah?: boolean;
  showSignboard?: boolean;
  showSportFacility?: boolean;
  showStreetLighting?: boolean;
  showLoranetStreetlight?: boolean;
  showTamanPerumahan?: boolean;
  showTrafficLight?: boolean;
  showWartaKawasanLapang?: boolean;
  showZonAhliMajlis?: boolean;
  apiUrl?: string;
}

interface BlokPerancangan {
  gid: number;
  id: number;
  sem_rt: string;
  nama: string;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry
}

interface Bridge {
  gid: number;
  objectid: number;
  lable_id: string;
  route_name: string;
  park_name: string;
  latitude_s?: number;
  longitude_?: number;
  latitude_e?: number;
  longitude1?: number;
  geom?: any; // GeoJSON geometry (MULTILINESTRING)
}

interface CCTV {
  gid: number;
  objectid: number;
  no_cctv: string;
  lokasi: string;
  pemilik?: string | null;
  tujuan?: string | null;
  status: string;
  catatan?: string | null;
  x?: number;
  y?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (POINT)
}

interface ChartingKm {
  gid: number;
  no_fail_km: string;
  no_fail?: string | null;
  pemaju?: string | null;
  cad_gtnh?: string | null;
  no_ruj_pel?: string | null;
  status?: string | null;
  tahun_moho?: string | null;
  tahun_lulu?: string | null;
  nota?: string | null;
  dikemaskin?: string | null;
  tarikh_kem?: string | null;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
}

interface ConstructedSlope {
  gid: number;
  objectid: number;
  lable_id: string;
  state: string;
  route_name: string;
  park_name: string;
  type?: string | null;
  events?: string | null;
  latitude_s?: number;
  longitude_?: number;
  latitude_e?: number;
  longitude1?: number;
  altitude?: number;
  geom?: any; // GeoJSON geometry (MULTILINESTRING)
}

interface Drainage {
  gid: number;
  objectid: number;
  lable_id: string;
  state: string;
  route_name: string;
  park_name: string;
  type?: string | null;
  location?: string | null;
  events?: string | null;
  latitude_s?: number;
  longitude_?: number;
  latitude_e?: number;
  longitude1?: number;
  altitude?: number;
  geom?: any; // GeoJSON geometry (MULTILINESTRING)
}

interface EarthWork {
  gid: number;
  id?: number | null;
  lot_no?: string | null;
  status?: string | null;
  tetuan?: string | null;
  t_lulus?: string | null;
  no_fail?: string | null;
  tajuk?: string | null;
  keluasan?: string | null;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
}

interface FeederPillar {
  gid: number;
  objectid?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (POINT)
  [key: string]: any; // Allow other fields from the API
}

interface FlexiblePost {
  gid: number;
  objectid?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTILINESTRING M)
  [key: string]: any; // Allow other fields from the API
}

interface Gtmix {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

interface SempadanTaman {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

interface GtnhSemasa {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

interface Jalan {
  gid: number;
  id?: number;
  latitude_s?: number;
  longitude_s?: number;
  latitude_e?: number;
  longitude_e?: number;
  geom?: any; // GeoJSON geometry (MULTILINESTRING)
  [key: string]: any; // Allow other fields from the API
}

interface JalanKejuruteraan {
  gid: number;
  id?: number;
  latitude_s?: number;
  longitude_s?: number;
  latitude_e?: number;
  longitude_e?: number;
  geom?: any; // GeoJSON geometry (MULTILINESTRING ZM)
  [key: string]: any; // Allow other fields from the API
}

interface KomitedKm {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

interface LocationMapAset {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (POINT)
  [key: string]: any; // Allow other fields from the API
}

interface LocationMapAsetItem {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (POINT)
  [key: string]: any; // Allow other fields from the API
}

interface LokasiBanjir {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (POINT)
  [key: string]: any; // Allow other fields from the API
}

interface Ndcdb20 {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

interface Ndcdb23 {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

interface PasarAwam {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

interface PasarMalam {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

interface PasarSari {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

interface PasarTani {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

interface RoadHump {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (POINT)
  [key: string]: any; // Allow other fields from the API
}

interface RoadMarkingLinear {
  gid: number;
  id?: number;
  latitude_s?: number;
  longitude_s?: number;
  latitude_e?: number;
  longitude_e?: number;
  geom?: any; // GeoJSON geometry (MULTILINESTRING)
  [key: string]: any; // Allow other fields from the API
}

interface RoadMarkingPoint {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (POINT)
  [key: string]: any; // Allow other fields from the API
}

interface RoadMedian {
  gid: number;
  id?: number;
  latitude_s?: number;
  longitude_s?: number;
  latitude_e?: number;
  longitude_e?: number;
  geom?: any; // GeoJSON geometry (MULTILINESTRING)
  [key: string]: any; // Allow other fields from the API
}

interface RoadShoulder {
  gid: number;
  id?: number;
  latitude_s?: number;
  longitude_s?: number;
  latitude_e?: number;
  longitude_e?: number;
  geom?: any; // GeoJSON geometry (MULTILINESTRING)
  [key: string]: any; // Allow other fields from the API
}

interface SampahHaram {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (POINT)
  [key: string]: any; // Allow other fields from the API
}

interface SempadanDaerah {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

interface Signboard {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (POINT)
  [key: string]: any; // Allow other fields from the API
}

interface SportFacility {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (POINT)
  [key: string]: any; // Allow other fields from the API
}

interface StreetLighting {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (POINT)
  [key: string]: any; // Allow other fields from the API
}

interface LoranetStreetlight {
  device_id: string;
  device_name: string;
  device_status?: string;
  status_power?: string;
  latitude?: string | number;
  longitude?: string | number;
  geom?: any; // GeoJSON geometry (POINT)
  geom_geojson?: any; // Alternative GeoJSON field name
  light_type?: string;
  dim_value?: number;
  brand?: string;
  model?: string;
  vendor?: string;
  power_source?: string;
  [key: string]: any; // Allow other fields from the API
}

interface TamanPerumahan {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

interface TrafficLight {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (POINT)
  [key: string]: any; // Allow other fields from the API
}

interface WartaKawasanLapang {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

interface ZonAhliMajlis {
  gid: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  geom?: any; // GeoJSON geometry (MULTIPOLYGON)
  [key: string]: any; // Allow other fields from the API
}

export default function GoogleMap({ 
  onMapLoad, 
  onMapError, 
  showLandmarks = false,
  showBlokPerancangan = false,
  showBridge = false,
  showCCTV = false,
  showChartingKm = false,
  showConstructedSlope = false,
  showDrainage = false,
  showEarthWork = false,
  showFeederPillar = false,
  showFlexiblePost = false,
  showGtmix = false,
  showSempadanTaman = false,
  showGtnhSemasa = false,
  showJalan = false,
  showJalanKejuruteraan = false,
  showKomitedKm = false,
  showLocationMapAset = false,
  showLocationMapAsetItem = false,
  showLokasiBanjir = false,
  showNdcdb20 = false,
  showNdcdb23 = false,
  showPasarAwam = false,
  showPasarMalam = false,
  showPasarSari = false,
  showPasarTani = false,
  showRoadHump = false,
  showRoadMarkingLinear = false,
  showRoadMarkingPoint = false,
  showRoadMedian = false,
  showRoadShoulder = false,
  showSampahHaram = false,
  showSempadanDaerah = false,
  showSignboard = false,
  showSportFacility = false,
  showStreetLighting = false,
  showLoranetStreetlight = false,
  showTamanPerumahan = false,
  showTrafficLight = false,
  showWartaKawasanLapang = false,
  showZonAhliMajlis = false,
  apiUrl = 'http://localhost:3001/api/blok_perancangan'
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const resizeHandlerRef = useRef<(() => void) | null>(null);
  const dataLayerRef = useRef<any>(null);
  const bridgeDataLayerRef = useRef<any>(null);
  const chartingKmDataLayerRef = useRef<any>(null);
  const constructedSlopeDataLayerRef = useRef<any>(null);
  const drainageDataLayerRef = useRef<any>(null);
  const earthWorkDataLayerRef = useRef<any>(null);
  const flexiblePostDataLayerRef = useRef<any>(null);
  const gtmixDataLayerRef = useRef<any>(null);
  const sempadanTamanDataLayerRef = useRef<any>(null);
  const sempadanTamanMarkersRef = useRef<any[]>([]);
  const gtnhSemasaDataLayerRef = useRef<any>(null);
  const jalanDataLayerRef = useRef<any>(null);
  const jalanKejuruteraanDataLayerRef = useRef<any>(null);
  const komitedKmDataLayerRef = useRef<any>(null);
  const locationMapAsetMarkersRef = useRef<any[]>([]);
  const locationMapAsetItemMarkersRef = useRef<any[]>([]);
  const lokasiBanjirMarkersRef = useRef<any[]>([]);
  const ndcdb20DataLayerRef = useRef<any>(null);
  const ndcdb20MarkersRef = useRef<any[]>([]);
  const ndcdb23DataLayerRef = useRef<any>(null);
  const ndcdb23MarkersRef = useRef<any[]>([]);
  const pasarAwamDataLayerRef = useRef<any>(null);
  const pasarAwamMarkersRef = useRef<any[]>([]);
  const pasarMalamDataLayerRef = useRef<any>(null);
  const pasarMalamMarkersRef = useRef<any[]>([]);
  const pasarSariDataLayerRef = useRef<any>(null);
  const pasarSariMarkersRef = useRef<any[]>([]);
  const pasarTaniDataLayerRef = useRef<any>(null);
  const pasarTaniMarkersRef = useRef<any[]>([]);
  const roadHumpMarkersRef = useRef<any[]>([]);
  const roadMarkingLinearDataLayerRef = useRef<any>(null);
  const roadMarkingLinearMarkersRef = useRef<any[]>([]);
  const roadMarkingPointMarkersRef = useRef<any[]>([]);
  const roadMedianDataLayerRef = useRef<any>(null);
  const roadMedianMarkersRef = useRef<any[]>([]);
  const roadShoulderDataLayerRef = useRef<any>(null);
  const roadShoulderMarkersRef = useRef<any[]>([]);
  const sampahHaramMarkersRef = useRef<any[]>([]);
  const sempadanDaerahDataLayerRef = useRef<any>(null);
  const sempadanDaerahMarkersRef = useRef<any[]>([]);
  const signboardMarkersRef = useRef<any[]>([]);
  const sportFacilityMarkersRef = useRef<any[]>([]);
  const streetLightingMarkersRef = useRef<any[]>([]);
  const loranetStreetlightMarkersRef = useRef<any[]>([]);
  const tamanPerumahanDataLayerRef = useRef<any>(null);
  const tamanPerumahanMarkersRef = useRef<any[]>([]);
  const trafficLightMarkersRef = useRef<any[]>([]);
  const wartaKawasanLapangDataLayerRef = useRef<any>(null);
  const wartaKawasanLapangMarkersRef = useRef<any[]>([]);
  const zonAhliMajlisDataLayerRef = useRef<any>(null);
  const zonAhliMajlisMarkersRef = useRef<any[]>([]);
  const polygonsRef = useRef<any[]>([]);
  const bridgeMarkersRef = useRef<any[]>([]);
  const cctvMarkersRef = useRef<any[]>([]);
  const chartingKmMarkersRef = useRef<any[]>([]);
  const constructedSlopeMarkersRef = useRef<any[]>([]);
  const drainageMarkersRef = useRef<any[]>([]);
  const earthWorkMarkersRef = useRef<any[]>([]);
  const feederPillarMarkersRef = useRef<any[]>([]);
  const flexiblePostMarkersRef = useRef<any[]>([]);
  const jalanMarkersRef = useRef<any[]>([]);
  const jalanKejuruteraanMarkersRef = useRef<any[]>([]);
  const komitedKmMarkersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blokData, setBlokData] = useState<BlokPerancangan[]>([]);
  const [bridgeData, setBridgeData] = useState<Bridge[]>([]);
  const [cctvData, setCctvData] = useState<CCTV[]>([]);
  const [chartingKmData, setChartingKmData] = useState<ChartingKm[]>([]);
  const [constructedSlopeData, setConstructedSlopeData] = useState<ConstructedSlope[]>([]);
  const [drainageData, setDrainageData] = useState<Drainage[]>([]);
  const [earthWorkData, setEarthWorkData] = useState<EarthWork[]>([]);
  const [feederPillarData, setFeederPillarData] = useState<FeederPillar[]>([]);
  const [flexiblePostData, setFlexiblePostData] = useState<FlexiblePost[]>([]);
  const [gtmixData, setGtmixData] = useState<Gtmix[]>([]);
  const [sempadanTamanData, setSempadanTamanData] = useState<SempadanTaman[]>([]);
  const [gtnhSemasaData, setGtnhSemasaData] = useState<GtnhSemasa[]>([]);
  const [jalanData, setJalanData] = useState<Jalan[]>([]);
  const [jalanKejuruteraanData, setJalanKejuruteraanData] = useState<JalanKejuruteraan[]>([]);
  const [komitedKmData, setKomitedKmData] = useState<KomitedKm[]>([]);
  const [locationMapAsetData, setLocationMapAsetData] = useState<LocationMapAset[]>([]);
  const [locationMapAsetItemData, setLocationMapAsetItemData] = useState<LocationMapAsetItem[]>([]);
  const [lokasiBanjirData, setLokasiBanjirData] = useState<LokasiBanjir[]>([]);
  const [ndcdb20Data, setNdcdb20Data] = useState<Ndcdb20[]>([]);
  const [ndcdb23Data, setNdcdb23Data] = useState<Ndcdb23[]>([]);
  const [pasarAwamData, setPasarAwamData] = useState<PasarAwam[]>([]);
  const [pasarMalamData, setPasarMalamData] = useState<PasarMalam[]>([]);
  const [pasarSariData, setPasarSariData] = useState<PasarSari[]>([]);
  const [pasarTaniData, setPasarTaniData] = useState<PasarTani[]>([]);
  const [roadHumpData, setRoadHumpData] = useState<RoadHump[]>([]);
  const [roadMarkingLinearData, setRoadMarkingLinearData] = useState<RoadMarkingLinear[]>([]);
  const [roadMarkingPointData, setRoadMarkingPointData] = useState<RoadMarkingPoint[]>([]);
  const [roadMedianData, setRoadMedianData] = useState<RoadMedian[]>([]);
  const [roadShoulderData, setRoadShoulderData] = useState<RoadShoulder[]>([]);
  const [sampahHaramData, setSampahHaramData] = useState<SampahHaram[]>([]);
  const [sempadanDaerahData, setSempadanDaerahData] = useState<SempadanDaerah[]>([]);
  const [signboardData, setSignboardData] = useState<Signboard[]>([]);
  const [sportFacilityData, setSportFacilityData] = useState<SportFacility[]>([]);
  const [streetLightingData, setStreetLightingData] = useState<StreetLighting[]>([]);
  const [loranetStreetlightData, setLoranetStreetlightData] = useState<LoranetStreetlight[]>([]);
  const [tamanPerumahanData, setTamanPerumahanData] = useState<TamanPerumahan[]>([]);
  const [trafficLightData, setTrafficLightData] = useState<TrafficLight[]>([]);
  const [wartaKawasanLapangData, setWartaKawasanLapangData] = useState<WartaKawasanLapang[]>([]);
  const [zonAhliMajlisData, setZonAhliMajlisData] = useState<ZonAhliMajlis[]>([]);
  const initAttemptedRef = useRef(false);
  const landmarksEnabledRef = useRef(showLandmarks);

  // Use local db-data JSON instead of real SIGIS (localhost:3001). Set to false to reconnect to SIGIS.
  const USE_LOCAL_DB_DATA = true;
  const getLayerDataUrl = (layerKey: string) => `/api/db-data/${layerKey}`;

  // Helper function to get color for each blok
  const getColorForBlok = (blok: BlokPerancangan, index: number): string => {
    const colors = [
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // purple
      '#06b6d4', // cyan
      '#f97316', // orange
      '#ec4899', // pink
    ];
    return colors[index % colors.length];
  };

  // Function to load and plot blok_perancangan data
  const loadBlokPerancanganData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('blok_perancangan') : apiUrl;
      console.log('Fetching blok_perancangan data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`HTTP error! status: ${response.status}`, errorText);
        // Don't throw - just log and return, so map can still work
        setError(`Failed to load blok_perancangan data: ${response.status}`);
        return;
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      const blokPerancangan = data.blok_perancangan || [];
      
      console.log(`Loaded ${blokPerancangan.length} blok_perancangan records`);
      if (blokPerancangan.length > 0) {
        console.log('Sample record:', JSON.stringify(blokPerancangan[0], null, 2));
        console.log('Has geom?', !!blokPerancangan[0].geom);
        console.log('Has lat/lon?', !!blokPerancangan[0].latitude && !!blokPerancangan[0].longitude);
        if (blokPerancangan[0].geom) {
          console.log('Geom type:', typeof blokPerancangan[0].geom);
          if (typeof blokPerancangan[0].geom === 'object') {
            console.log('Geom keys:', Object.keys(blokPerancangan[0].geom));
          }
        }
      }
      setBlokData(blokPerancangan);
      
      if (blokPerancangan.length === 0) {
        console.warn('No blok_perancangan data found');
        return;
      }
      
      // Clear existing polygons
      polygonsRef.current.forEach(polygon => {
        polygon.setMap(null);
      });
      polygonsRef.current = [];
      
      // Clear existing data layer
      dataLayer.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all features first
      const allFeatures: any[] = [];
      
      // Process each blok_perancangan record
      blokPerancangan.forEach((blok: BlokPerancangan, index: number) => {
        try {
          // Always try to add a marker first using lat/lon if available
          if (blok.latitude && blok.longitude) {
            console.log(`Adding marker for ${blok.nama} at ${blok.latitude}, ${blok.longitude}`);
            const marker = new window.google.maps.Marker({
              position: { lat: blok.latitude, lng: blok.longitude },
              map,
              title: blok.nama || `Blok ${blok.id}`,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#ef4444',
                fillOpacity: 0.9,
                strokeColor: '#FFFFFF',
                strokeWeight: 3,
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${blok.nama || 'Blok Perancangan'}</h3>
                  <p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${blok.id}</p>
                  <p style="margin: 4px 0; font-size: 14px;"><strong>Sem RT:</strong> ${blok.sem_rt || 'N/A'}</p>
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Location:</strong> ${blok.latitude?.toFixed(6)}, ${blok.longitude?.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            polygonsRef.current.push(marker);
          }
          
          // Then try to add geometry if available
          if (blok.geom) {
            console.log(`Processing geometry for blok ${blok.gid} (${blok.nama})`);
            // Check if geom is already GeoJSON or needs parsing
            let geometry = blok.geom;
            
            // If geom is a string, try to parse it
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for blok ${blok.gid}:`, e);
                return;
              }
            }
            
            console.log(`Geometry type: ${geometry?.type}`, geometry);
            
            // Create feature for this geometry
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                gid: blok.gid,
                id: blok.id,
                nama: blok.nama,
                sem_rt: blok.sem_rt,
                index: index,
                latitude: blok.latitude,
                longitude: blok.longitude,
              }
            });
          }
        } catch (err) {
          console.error(`Error processing blok ${blok.gid}:`, err);
        }
      });
      
      console.log(`Total features collected: ${allFeatures.length}`);
      
      // Add all features to Data Layer at once
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        console.log('Adding GeoJSON to Data Layer...');
        console.log(`Feature collection has ${allFeatures.length} features`);
        console.log('First feature sample:', JSON.stringify(allFeatures[0], null, 2));
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} features to map`);
          
          if (!addedFeatures || addedFeatures.length === 0) {
            console.warn('No features were added to the map. Check geometry format.');
            return;
          }
          
          // Style the polygons with different colors
          dataLayer.setStyle((feature: any) => {
            try {
              let props: any = {};
              
              // Try different ways to get properties
              if (feature.getProperty) {
                props = feature.getProperty('properties') || {};
              }
              
              if (!props || Object.keys(props).length === 0) {
                try {
                  const geoJson = feature.toGeoJson();
                  props = geoJson?.properties || {};
                } catch (e) {
                  console.warn('Could not get feature properties:', e);
                }
              }
              
              const index = props.index || 0;
              return {
                fillColor: getColorForBlok({} as BlokPerancangan, index),
                fillOpacity: 0.5,
                strokeColor: '#FFFFFF',
                strokeWeight: 3,
                strokeOpacity: 1,
              };
            } catch (err) {
              console.error('Error styling feature:', err);
              // Return default style
              return {
                fillColor: '#3b82f6',
                fillOpacity: 0.5,
                strokeColor: '#FFFFFF',
                strokeWeight: 3,
                strokeOpacity: 1,
              };
            }
          });
          
          // Add click event listener for info window
          dataLayer.addListener('click', (event: any) => {
            try {
              const feature = event.feature;
              let props: any = {};
              
              // Try different ways to get properties
              if (feature.getProperty) {
                props = feature.getProperty('properties') || {};
              }
              
              if (!props || Object.keys(props).length === 0) {
                try {
                  const geoJson = feature.toGeoJson();
                  props = geoJson?.properties || {};
                } catch (e) {
                  console.warn('Could not get feature properties for info window:', e);
                }
              }
              
              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="padding: 8px; min-width: 200px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${props.nama || 'Blok Perancangan'}</h3>
                    <p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${props.id || props.gid || 'N/A'}</p>
                    <p style="margin: 4px 0; font-size: 14px;"><strong>Sem RT:</strong> ${props.sem_rt || 'N/A'}</p>
                    ${props.latitude && props.longitude ? `
                      <p style="margin: 4px 0; font-size: 12px; color: #666;">
                        <strong>Location:</strong> ${props.latitude.toFixed(6)}, ${props.longitude.toFixed(6)}
                      </p>
                    ` : ''}
                  </div>
                `,
              });
              
              infoWindow.setPosition(event.latLng);
              infoWindow.open(map);
            } catch (err) {
              console.error('Error showing info window:', err);
            }
          });
          
          // Fit bounds to show all features - use addedFeatures array instead of getLength()
          if (addedFeatures && addedFeatures.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            
            addedFeatures.forEach((feature: any) => {
              try {
                const geometry = feature.getGeometry();
                if (geometry) {
                  geometry.forEachLatLng((latLng: any) => {
                    bounds.extend(latLng);
                  });
                }
              } catch (err) {
                console.warn('Error processing feature for bounds:', err);
              }
            });
            
            if (!bounds.isEmpty()) {
              console.log('Fitting bounds to show all features');
              map.fitBounds(bounds);
            }
          }
        } catch (geoJsonError) {
          console.error('Error adding GeoJSON to Data Layer:', geoJsonError);
          console.error('Feature collection:', featureCollection);
        }
      }
      
      // Also fit bounds to markers if we have any
      if (polygonsRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        polygonsRef.current.forEach((marker: any) => {
          if (marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show all markers');
          map.fitBounds(bounds);
        }
      }
      
    } catch (err) {
      console.error('Error loading blok_perancangan data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot bridge data
  const loadBridgeData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('bridge') : 'http://localhost:3001/api/bridge';
      console.log('Fetching bridge data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const bridges = data.bridge || [];
      
      console.log(`Loaded ${bridges.length} bridge records`);
      console.log('Bridge API Response:', data);
      if (bridges.length > 0) {
        console.log('Sample bridge record:', JSON.stringify(bridges[0], null, 2));
        console.log('Sample bridge latitude_s:', bridges[0].latitude_s, typeof bridges[0].latitude_s);
        console.log('Sample bridge longitude_:', bridges[0].longitude_, typeof bridges[0].longitude_);
      }
      setBridgeData(bridges);
      
      if (bridges.length === 0) {
        console.warn('No bridge data found');
        return;
      }
      
      // Clear existing bridge markers
      bridgeMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      bridgeMarkersRef.current = [];
      
      // Clear existing bridge features from data layer
      dataLayer.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all bridge features
      const allFeatures: any[] = [];
      
      // Process each bridge record
      let markersCreated = 0;
      bridges.forEach((bridge: Bridge, index: number) => {
        try {
          // Convert latitude and longitude to numbers, handling string values
          const lat = typeof bridge.latitude_s === 'string' 
            ? parseFloat(bridge.latitude_s) 
            : (typeof bridge.latitude_s === 'number' ? bridge.latitude_s : null);
          const lng = typeof bridge.longitude_ === 'string' 
            ? parseFloat(bridge.longitude_) 
            : (typeof bridge.longitude_ === 'number' ? bridge.longitude_ : null);
          
          console.log(`Bridge ${bridge.gid}: lat=${lat}, lng=${lng}, original lat=${bridge.latitude_s}, original lng=${bridge.longitude_}`);
          
          // Add marker at start point if available and valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for bridge ${bridge.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: bridge.lable_id || bridge.route_name || `Bridge ${bridge.gid}`,
              icon: {
                url: '/icon/bridge.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${bridge.lable_id || 'Bridge'}</h3>
                  <p style="margin: 4px 0; font-size: 14px;"><strong>Route:</strong> ${bridge.route_name || 'N/A'}</p>
                  <p style="margin: 4px 0; font-size: 14px;"><strong>Park:</strong> ${bridge.park_name || 'N/A'}</p>
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Start:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            bridgeMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Bridge ${bridge.gid} has invalid coordinates: lat=${bridge.latitude_s} (${typeof bridge.latitude_s}), lng=${bridge.longitude_} (${typeof bridge.longitude_})`);
          }
          
          // Add geometry if available (MULTILINESTRING for bridges)
          if (bridge.geom) {
            let geometry = bridge.geom;
            
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for bridge ${bridge.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'bridge',
                gid: bridge.gid,
                lable_id: bridge.lable_id,
                route_name: bridge.route_name,
                park_name: bridge.park_name,
                index: index,
              }
            });
          }
        } catch (err) {
            console.error(`Error processing bridge ${bridge.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} bridge markers out of ${bridges.length} bridges`);
      
      // Fit map bounds to show all bridge markers (but don't override if blok_perancangan is also loaded)
      // We'll let the blok_perancangan bounds take precedence if both are loaded
      if (bridgeMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        bridgeMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Bridge markers bounds:', bounds.toJSON());
          // Only fit bounds if there are no other features that might have already set bounds
          // This prevents the map from jumping when both datasets load
        }
      }
      
      // Add bridge features to Data Layer
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} bridge features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style bridge lines (MULTILINESTRING) - apply style to all features in this layer
            dataLayer.setStyle({
              strokeColor: '#f59e0b', // Amber color for bridges
              strokeWeight: 4,
              strokeOpacity: 0.8,
            });
            
            // Add click event listener for bridge info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                let props: any = {};
                
                // Try to get properties
                try {
                  props = feature.getProperty('properties') || {};
                } catch (e) {
                  try {
                    const geoJson = feature.toGeoJson();
                    props = geoJson?.properties || {};
                  } catch (e2) {
                    console.warn('Could not get feature properties:', e2);
                  }
                }
                
                const infoWindow = new window.google.maps.InfoWindow({
                  content: `
                    <div style="padding: 8px; min-width: 200px;">
                      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${props.lable_id || 'Bridge'}</h3>
                      <p style="margin: 4px 0; font-size: 14px;"><strong>Route:</strong> ${props.route_name || 'N/A'}</p>
                      <p style="margin: 4px 0; font-size: 14px;"><strong>Park:</strong> ${props.park_name || 'N/A'}</p>
                    </div>
                  `,
                });
                
                infoWindow.setPosition(event.latLng);
                infoWindow.open(map);
              } catch (err) {
                console.error('Error showing bridge info window:', err);
              }
            });
          }
        } catch (geoJsonError) {
          console.error('Error adding bridge GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading bridge data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot CCTV data
  const loadCCTVData = async (map: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('cctv') : 'http://localhost:3001/api/cctv';
      console.log('Fetching CCTV data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const cctvs = data.cctv || [];
      
      console.log(`Loaded ${cctvs.length} CCTV records`);
      setCctvData(cctvs);
      
      if (cctvs.length === 0) {
        console.warn('No CCTV data found');
        return;
      }
      
      // Clear existing CCTV markers
      cctvMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      cctvMarkersRef.current = [];
      
      // Process each CCTV record
      let markersCreated = 0;
      cctvs.forEach((cctv: CCTV, index: number) => {
        try {
          // Get latitude and longitude from API response
          // Priority: latitude/longitude fields > geom extraction
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (cctv.latitude !== undefined && cctv.longitude !== undefined) {
            lat = typeof cctv.latitude === 'string' 
              ? parseFloat(cctv.latitude) 
              : (typeof cctv.latitude === 'number' ? cctv.latitude : null);
            lng = typeof cctv.longitude === 'string' 
              ? parseFloat(cctv.longitude) 
              : (typeof cctv.longitude === 'number' ? cctv.longitude : null);
          } else if (cctv.geom && cctv.geom.type === 'Point' && cctv.geom.coordinates) {
            // Extract from GeoJSON Point geometry [longitude, latitude]
            lng = cctv.geom.coordinates[0];
            lat = cctv.geom.coordinates[1];
          }
          
          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for CCTV ${cctv.no_cctv} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: cctv.no_cctv || `CCTV ${cctv.gid}`,
              icon: {
                url: '/icon/cctv.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; min-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${cctv.no_cctv || 'CCTV'}</h3>
                  <p style="margin: 4px 0; font-size: 14px;"><strong>Location:</strong> ${cctv.lokasi || 'N/A'}</p>
                  <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${cctv.status || 'N/A'}</p>
                  ${cctv.catatan ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Note:</strong> ${cctv.catatan}</p>` : ''}
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            cctvMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`CCTV ${cctv.gid} (${cctv.no_cctv}) has invalid coordinates`);
          }
        } catch (err) {
          console.error(`Error processing CCTV ${cctv.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} CCTV markers out of ${cctvs.length} CCTV records`);
      
      // Fit map bounds to show all CCTV markers if we have any
      if (cctvMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        cctvMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show CCTV markers');
          map.fitBounds(bounds);
        }
      }
      
    } catch (err) {
      console.error('Error loading CCTV data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Feeder Pillar data
  const loadFeederPillarData = async (map: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('feeder_pillar') : 'http://localhost:3001/api/feeder_pillar';
      console.log('Fetching feeder_pillar data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const feederPillars = data.feeder_pillar || [];
      
      console.log(`Loaded ${feederPillars.length} feeder_pillar records`);
      setFeederPillarData(feederPillars);
      
      if (feederPillars.length === 0) {
        console.warn('No feeder_pillar data found');
        return;
      }
      
      // Clear existing feeder_pillar markers
      feederPillarMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      feederPillarMarkersRef.current = [];
      
      // Process each feeder_pillar record
      let markersCreated = 0;
      feederPillars.forEach((feederPillar: FeederPillar, index: number) => {
        try {
          // Get latitude and longitude from API response
          // Priority: latitude/longitude fields > geom extraction
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (feederPillar.latitude !== undefined && feederPillar.longitude !== undefined) {
            lat = typeof feederPillar.latitude === 'string' 
              ? parseFloat(feederPillar.latitude) 
              : (typeof feederPillar.latitude === 'number' ? feederPillar.latitude : null);
            lng = typeof feederPillar.longitude === 'string' 
              ? parseFloat(feederPillar.longitude) 
              : (typeof feederPillar.longitude === 'number' ? feederPillar.longitude : null);
          } else if (feederPillar.geom && feederPillar.geom.type === 'Point' && feederPillar.geom.coordinates) {
            // Extract from GeoJSON Point geometry [longitude, latitude]
            lng = feederPillar.geom.coordinates[0];
            lat = feederPillar.geom.coordinates[1];
          }
          
          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for feeder_pillar ${feederPillar.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Feeder Pillar ${feederPillar.gid}`,
              icon: {
                url: '/icon/feeder-pillar.jpg',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            // Build info window content with available fields
            const infoContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Feeder Pillar ${feederPillar.gid}</h3>
                ${feederPillar.objectid ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Object ID:</strong> ${feederPillar.objectid}</p>` : ''}
                ${Object.keys(feederPillar).filter(key => !['gid', 'objectid', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && feederPillar[key] !== null && feederPillar[key] !== undefined).slice(0, 5).map(key => 
                  `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${feederPillar[key]}</p>`
                ).join('')}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            feederPillarMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Feeder Pillar ${feederPillar.gid} has invalid coordinates`);
          }
        } catch (err) {
          console.error(`Error processing feeder_pillar ${feederPillar.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} feeder_pillar markers out of ${feederPillars.length} feeder_pillar records`);
      
      // Fit map bounds to show all feeder_pillar markers if we have any
      if (feederPillarMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        feederPillarMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show feeder_pillar markers');
          map.fitBounds(bounds);
        }
      }
    } catch (err) {
      console.error('Error loading feeder_pillar data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Location Map Aset data
  const loadLocationMapAsetData = async (map: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('location_map_aset') : 'http://localhost:3001/api/location_map_aset';
      console.log('Fetching location_map_aset data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const locationMapAsets = data.location_map_aset || [];
      
      console.log(`Loaded ${locationMapAsets.length} location_map_aset records`);
      setLocationMapAsetData(locationMapAsets);
      
      if (locationMapAsets.length === 0) {
        console.warn('No location_map_aset data found');
        return;
      }
      
      // Clear existing location_map_aset markers
      locationMapAsetMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      locationMapAsetMarkersRef.current = [];
      
      // Process each location_map_aset record
      let markersCreated = 0;
      locationMapAsets.forEach((locationMapAset: LocationMapAset, index: number) => {
        try {
          // Get latitude and longitude from API response
          // Priority: latitude/longitude fields > geom extraction
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (locationMapAset.latitude !== undefined && locationMapAset.longitude !== undefined) {
            lat = typeof locationMapAset.latitude === 'string' 
              ? parseFloat(locationMapAset.latitude) 
              : (typeof locationMapAset.latitude === 'number' ? locationMapAset.latitude : null);
            lng = typeof locationMapAset.longitude === 'string' 
              ? parseFloat(locationMapAset.longitude) 
              : (typeof locationMapAset.longitude === 'number' ? locationMapAset.longitude : null);
          } else if (locationMapAset.geom && locationMapAset.geom.type === 'Point' && locationMapAset.geom.coordinates) {
            // Extract from GeoJSON Point geometry [longitude, latitude]
            lng = locationMapAset.geom.coordinates[0];
            lat = locationMapAset.geom.coordinates[1];
          }
          
          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for location_map_aset ${locationMapAset.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Location Map Aset ${locationMapAset.gid}`,
              icon: {
                url: '/icon/tree.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            // Build info window content with available fields
            const infoContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Location Map Aset ${locationMapAset.gid}</h3>
                ${locationMapAset.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${locationMapAset.id}</p>` : ''}
                ${Object.keys(locationMapAset).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && locationMapAset[key] !== null && locationMapAset[key] !== undefined).slice(0, 5).map(key => 
                  `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${locationMapAset[key]}</p>`
                ).join('')}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            locationMapAsetMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Location Map Aset ${locationMapAset.gid} has invalid coordinates`);
          }
        } catch (err) {
          console.error(`Error processing location_map_aset ${locationMapAset.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} location_map_aset markers out of ${locationMapAsets.length} location_map_aset records`);
      
      // Fit map bounds to show all location_map_aset markers if we have any
      if (locationMapAsetMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        locationMapAsetMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show location_map_aset markers');
          map.fitBounds(bounds);
        }
      }
    } catch (err) {
      console.error('Error loading location_map_aset data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Location Map Aset Item data
  const loadLocationMapAsetItemData = async (map: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('location_map_aset_item') : 'http://localhost:3001/api/location_map_aset_item';
      console.log('Fetching location_map_aset_item data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const locationMapAsetItems = data.location_map_aset_item || [];
      
      console.log(`Loaded ${locationMapAsetItems.length} location_map_aset_item records`);
      setLocationMapAsetItemData(locationMapAsetItems);
      
      if (locationMapAsetItems.length === 0) {
        console.warn('No location_map_aset_item data found');
        return;
      }
      
      // Clear existing location_map_aset_item markers
      locationMapAsetItemMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      locationMapAsetItemMarkersRef.current = [];
      
      // Process each location_map_aset_item record
      let markersCreated = 0;
      locationMapAsetItems.forEach((locationMapAsetItem: LocationMapAsetItem, index: number) => {
        try {
          // Get latitude and longitude from API response
          // Priority: latitude/longitude fields > geom extraction
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (locationMapAsetItem.latitude !== undefined && locationMapAsetItem.longitude !== undefined) {
            lat = typeof locationMapAsetItem.latitude === 'string' 
              ? parseFloat(locationMapAsetItem.latitude) 
              : (typeof locationMapAsetItem.latitude === 'number' ? locationMapAsetItem.latitude : null);
            lng = typeof locationMapAsetItem.longitude === 'string' 
              ? parseFloat(locationMapAsetItem.longitude) 
              : (typeof locationMapAsetItem.longitude === 'number' ? locationMapAsetItem.longitude : null);
          } else if (locationMapAsetItem.geom && locationMapAsetItem.geom.type === 'Point' && locationMapAsetItem.geom.coordinates) {
            // Extract from GeoJSON Point geometry [longitude, latitude]
            lng = locationMapAsetItem.geom.coordinates[0];
            lat = locationMapAsetItem.geom.coordinates[1];
          }
          
          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for location_map_aset_item ${locationMapAsetItem.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Location Map Aset Item ${locationMapAsetItem.gid}`,
              icon: {
                url: '/icon/tree.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            // Build info window content with available fields
            const infoContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Location Map Aset Item ${locationMapAsetItem.gid}</h3>
                ${locationMapAsetItem.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${locationMapAsetItem.id}</p>` : ''}
                ${Object.keys(locationMapAsetItem).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && locationMapAsetItem[key] !== null && locationMapAsetItem[key] !== undefined).slice(0, 5).map(key => 
                  `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${locationMapAsetItem[key]}</p>`
                ).join('')}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            locationMapAsetItemMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Location Map Aset Item ${locationMapAsetItem.gid} has invalid coordinates`);
          }
        } catch (err) {
          console.error(`Error processing location_map_aset_item ${locationMapAsetItem.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} location_map_aset_item markers out of ${locationMapAsetItems.length} location_map_aset_item records`);
      
      // Fit map bounds to show all location_map_aset_item markers if we have any
      if (locationMapAsetItemMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        locationMapAsetItemMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show location_map_aset_item markers');
          map.fitBounds(bounds);
        }
      }
    } catch (err) {
      console.error('Error loading location_map_aset_item data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Lokasi Banjir data
  const loadLokasiBanjirData = async (map: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('lokasi_banjir') : 'http://localhost:3001/api/lokasi_banjir';
      console.log('Fetching lokasi_banjir data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const lokasiBanjirs = data.lokasi_banjir || [];
      
      console.log(`Loaded ${lokasiBanjirs.length} lokasi_banjir records`);
      setLokasiBanjirData(lokasiBanjirs);
      
      if (lokasiBanjirs.length === 0) {
        console.warn('No lokasi_banjir data found');
        return;
      }
      
      // Clear existing lokasi_banjir markers
      lokasiBanjirMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      lokasiBanjirMarkersRef.current = [];
      
      // Process each lokasi_banjir record
      let markersCreated = 0;
      lokasiBanjirs.forEach((lokasiBanjir: LokasiBanjir, index: number) => {
        try {
          // Get latitude and longitude from API response
          // Priority: latitude/longitude fields > geom extraction
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (lokasiBanjir.latitude !== undefined && lokasiBanjir.longitude !== undefined) {
            lat = typeof lokasiBanjir.latitude === 'string' 
              ? parseFloat(lokasiBanjir.latitude) 
              : (typeof lokasiBanjir.latitude === 'number' ? lokasiBanjir.latitude : null);
            lng = typeof lokasiBanjir.longitude === 'string' 
              ? parseFloat(lokasiBanjir.longitude) 
              : (typeof lokasiBanjir.longitude === 'number' ? lokasiBanjir.longitude : null);
          } else if (lokasiBanjir.geom && lokasiBanjir.geom.type === 'Point' && lokasiBanjir.geom.coordinates) {
            // Extract from GeoJSON Point geometry [longitude, latitude]
            lng = lokasiBanjir.geom.coordinates[0];
            lat = lokasiBanjir.geom.coordinates[1];
          }
          
          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for lokasi_banjir ${lokasiBanjir.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Lokasi Banjir ${lokasiBanjir.gid}`,
              icon: {
                url: '/icon/flood.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            // Build info window content with available fields
            const infoContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Lokasi Banjir ${lokasiBanjir.gid}</h3>
                ${lokasiBanjir.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${lokasiBanjir.id}</p>` : ''}
                ${Object.keys(lokasiBanjir).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && lokasiBanjir[key] !== null && lokasiBanjir[key] !== undefined).slice(0, 5).map(key => 
                  `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${lokasiBanjir[key]}</p>`
                ).join('')}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            lokasiBanjirMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Lokasi Banjir ${lokasiBanjir.gid} has invalid coordinates`);
          }
        } catch (err) {
          console.error(`Error processing lokasi_banjir ${lokasiBanjir.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} lokasi_banjir markers out of ${lokasiBanjirs.length} lokasi_banjir records`);
      
      // Fit map bounds to show all lokasi_banjir markers if we have any
      if (lokasiBanjirMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        lokasiBanjirMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show lokasi_banjir markers');
          map.fitBounds(bounds);
        }
      }
    } catch (err) {
      console.error('Error loading lokasi_banjir data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot charting_km data
  const loadChartingKmData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('charting_km') : 'http://localhost:3001/api/charting_km';
      console.log('Fetching charting_km data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const chartingKms = data.charting_km || [];
      
      console.log(`Loaded ${chartingKms.length} charting_km records`);
      setChartingKmData(chartingKms);
      
      if (chartingKms.length === 0) {
        console.warn('No charting_km data found');
        return;
      }
      
      // Clear existing charting_km markers
      chartingKmMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      chartingKmMarkersRef.current = [];
      
      // Clear existing charting_km features from data layer
      dataLayer.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all charting_km features and create markers
      const allFeatures: any[] = [];
      let markersCreated = 0;
      
      chartingKms.forEach((chartingKm: ChartingKm, index: number) => {
        try {
          if (chartingKm.geom) {
            let geometry = chartingKm.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for charting_km ${chartingKm.gid}:`, e);
                return;
              }
            }
            
            // Calculate centroid for marker placement
            let lat: number | null = null;
            let lng: number | null = null;
            
            if (geometry.type === 'MultiPolygon' && geometry.coordinates) {
              // Calculate centroid from first polygon's first ring
              const firstPolygon = geometry.coordinates[0];
              if (firstPolygon && firstPolygon[0] && firstPolygon[0].length > 0) {
                const coords = firstPolygon[0];
                let sumLat = 0;
                let sumLng = 0;
                let count = 0;
                
                coords.forEach((coord: number[]) => {
                  // GeoJSON coordinates are [longitude, latitude]
                  sumLng += coord[0];
                  sumLat += coord[1];
                  count++;
                });
                
                if (count > 0) {
                  lng = sumLng / count;
                  lat = sumLat / count;
                }
              }
            } else if (geometry.type === 'Polygon' && geometry.coordinates) {
              // Handle single Polygon
              const firstRing = geometry.coordinates[0];
              if (firstRing && firstRing.length > 0) {
                let sumLat = 0;
                let sumLng = 0;
                let count = 0;
                
                firstRing.forEach((coord: number[]) => {
                  sumLng += coord[0];
                  sumLat += coord[1];
                  count++;
                });
                
                if (count > 0) {
                  lng = sumLng / count;
                  lat = sumLat / count;
                }
              }
            }
            
            // Create marker at centroid if coordinates are valid
            if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
              const marker = new window.google.maps.Marker({
                position: { lat, lng },
                map,
                title: chartingKm.no_fail_km || `Charting KM ${chartingKm.gid}`,
                icon: {
                  url: '/icon/chartingkm.png',
                  scaledSize: new window.google.maps.Size(32, 32),
                  anchor: new window.google.maps.Point(16, 16),
                },
              });
              
              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="padding: 8px; min-width: 200px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${chartingKm.no_fail_km || 'Charting KM'}</h3>
                    ${chartingKm.pemaju ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Pemaju:</strong> ${chartingKm.pemaju}</p>` : ''}
                    ${chartingKm.status ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${chartingKm.status}</p>` : ''}
                    ${chartingKm.no_ruj_pel ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>No. Rujukan:</strong> ${chartingKm.no_ruj_pel}</p>` : ''}
                  </div>
                `,
              });
              
              marker.addListener('click', () => {
                infoWindow.open(map, marker);
              });
              
              chartingKmMarkersRef.current.push(marker);
              markersCreated++;
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'charting_km',
                gid: chartingKm.gid,
                no_fail_km: chartingKm.no_fail_km,
                pemaju: chartingKm.pemaju,
                status: chartingKm.status,
                index: index,
              }
            });
          }
        } catch (err) {
          console.error(`Error processing charting_km ${chartingKm.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} charting_km markers out of ${chartingKms.length} charting_km records`);
      
      console.log(`Total features collected: ${allFeatures.length}`);
      
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        console.log('Adding GeoJSON to Data Layer...');
        console.log(`Feature collection has ${allFeatures.length} features`);
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} charting_km features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style the polygons with different colors
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                const index = props.index || 0;
                return {
                  fillColor: getColorForBlok({} as BlokPerancangan, index),
                  fillOpacity: 0.3,
                  strokeColor: getColorForBlok({} as BlokPerancangan, index),
                  strokeWeight: 2,
                  strokeOpacity: 0.8,
                };
              } catch (err) {
                console.error('Error styling charting_km feature:', err);
                return {
                  fillColor: '#8b5cf6',
                  fillOpacity: 0.3,
                  strokeColor: '#8b5cf6',
                  strokeWeight: 2,
                  strokeOpacity: 0.8,
                };
              }
            });
            
            // Add click event listener for charting_km info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'charting_km') {
                  const chartingKm = chartingKms.find((ck: ChartingKm) => ck.gid === props.gid);
                  const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                      <div style="padding: 8px; min-width: 200px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${props.no_fail_km || 'Charting KM'}</h3>
                        ${props.pemaju ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Pemaju:</strong> ${props.pemaju}</p>` : ''}
                        ${props.status ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${props.status}</p>` : ''}
                        ${chartingKm?.no_ruj_pel ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>No. Rujukan:</strong> ${chartingKm.no_ruj_pel}</p>` : ''}
                      </div>
                    `,
                  });
                  infoWindow.setPosition(event.latLng);
                  infoWindow.open(map);
                }
              } catch (err) {
                console.error('Error showing charting_km info window:', err);
              }
            });
          }
        } catch (geoJsonError) {
          console.error('Error adding charting_km GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading charting_km data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot constructed_slope data
  const loadConstructedSlopeData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('constructed_slope') : 'http://localhost:3001/api/constructed_slope';
      console.log('Fetching constructed_slope data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const constructedSlopes = data.constructed_slope || [];
      
      console.log(`Loaded ${constructedSlopes.length} constructed_slope records`);
      setConstructedSlopeData(constructedSlopes);
      
      if (constructedSlopes.length === 0) {
        console.warn('No constructed_slope data found');
        return;
      }
      
      // Clear existing constructed_slope markers
      constructedSlopeMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      constructedSlopeMarkersRef.current = [];
      
      // Clear existing constructed_slope features from data layer
      // Collect features first, then remove them (to avoid iteration issues)
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'constructed_slope') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all constructed_slope features
      const allFeatures: any[] = [];
      
      // Process each constructed_slope record
      let markersCreated = 0;
      constructedSlopes.forEach((slope: ConstructedSlope, index: number) => {
        try {
          // Convert latitude and longitude to numbers, handling string values
          const lat = typeof slope.latitude_s === 'string' 
            ? parseFloat(slope.latitude_s) 
            : (typeof slope.latitude_s === 'number' ? slope.latitude_s : null);
          const lng = typeof slope.longitude_ === 'string' 
            ? parseFloat(slope.longitude_) 
            : (typeof slope.longitude_ === 'number' ? slope.longitude_ : null);
          
          // Add marker at start point if available and valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for constructed_slope ${slope.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: slope.lable_id || slope.route_name || `Constructed Slope ${slope.gid}`,
              icon: {
                url: '/icon/constructionslope.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${slope.lable_id || 'Constructed Slope'}</h3>
                  <p style="margin: 4px 0; font-size: 14px;"><strong>Route:</strong> ${slope.route_name || 'N/A'}</p>
                  <p style="margin: 4px 0; font-size: 14px;"><strong>Park:</strong> ${slope.park_name || 'N/A'}</p>
                  ${slope.type ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Type:</strong> ${slope.type}</p>` : ''}
                  ${slope.events ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Events:</strong> ${slope.events}</p>` : ''}
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Start:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            constructedSlopeMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Constructed Slope ${slope.gid} has invalid coordinates: lat=${slope.latitude_s} (${typeof slope.latitude_s}), lng=${slope.longitude_} (${typeof slope.longitude_})`);
          }
          
          // Add geometry if available (MULTILINESTRING for constructed_slope)
          if (slope.geom) {
            let geometry = slope.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for constructed_slope ${slope.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'constructed_slope',
                gid: slope.gid,
                lable_id: slope.lable_id,
                route_name: slope.route_name,
                park_name: slope.park_name,
                slope_type: slope.type,
                events: slope.events,
                index: index,
              }
            });
          }
        } catch (err) {
          console.error(`Error processing constructed_slope ${slope.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} constructed_slope markers out of ${constructedSlopes.length} constructed_slope records`);
      
      // Fit map bounds to show all constructed_slope markers if we have any
      if (constructedSlopeMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        constructedSlopeMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show constructed_slope markers');
          map.fitBounds(bounds);
        }
      }
      
      // Add constructed_slope features to Data Layer
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} constructed_slope features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style constructed_slope lines (MULTILINESTRING) - apply style to all features in this layer
            dataLayer.setStyle({
              strokeColor: '#10b981', // Green color for constructed slope
              strokeWeight: 4,
              strokeOpacity: 0.8,
            });
            
            // Add click event listener for constructed_slope info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'constructed_slope') {
                  const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                      <div style="padding: 8px; min-width: 200px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${props.lable_id || 'Constructed Slope'}</h3>
                        <p style="margin: 4px 0; font-size: 14px;"><strong>Route:</strong> ${props.route_name || 'N/A'}</p>
                        <p style="margin: 4px 0; font-size: 14px;"><strong>Park:</strong> ${props.park_name || 'N/A'}</p>
                        ${props.slope_type ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Type:</strong> ${props.slope_type}</p>` : ''}
                        ${props.events ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Events:</strong> ${props.events}</p>` : ''}
                      </div>
                    `,
                  });
                  infoWindow.setPosition(event.latLng);
                  infoWindow.open(map);
                }
              } catch (err) {
                console.error('Error showing constructed_slope info window:', err);
              }
            });
          }
        } catch (geoJsonError) {
          console.error('Error adding constructed_slope GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading constructed_slope data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot drainage data
  const loadDrainageData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('drainage') : 'http://localhost:3001/api/drainage';
      console.log('Fetching drainage data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const drainages = data.drainage || [];
      
      console.log(`Loaded ${drainages.length} drainage records`);
      setDrainageData(drainages);
      
      if (drainages.length === 0) {
        console.warn('No drainage data found');
        return;
      }
      
      // Clear existing drainage markers
      drainageMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      drainageMarkersRef.current = [];
      
      // Clear existing drainage features from data layer
      // Collect features first, then remove them (to avoid iteration issues)
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'drainage') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all drainage features
      const allFeatures: any[] = [];
      
      // Process each drainage record
      let markersCreated = 0;
      drainages.forEach((drainage: Drainage, index: number) => {
        try {
          // Convert latitude and longitude to numbers, handling string values
          const lat = typeof drainage.latitude_s === 'string' 
            ? parseFloat(drainage.latitude_s) 
            : (typeof drainage.latitude_s === 'number' ? drainage.latitude_s : null);
          const lng = typeof drainage.longitude_ === 'string' 
            ? parseFloat(drainage.longitude_) 
            : (typeof drainage.longitude_ === 'number' ? drainage.longitude_ : null);
          
          // Add marker at start point if available and valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for drainage ${drainage.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: drainage.lable_id || drainage.route_name || `Drainage ${drainage.gid}`,
              icon: {
                url: '/icon/drainage.png',
                scaledSize: new window.google.maps.Size(32, 32),
                anchor: new window.google.maps.Point(16, 16),
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${drainage.lable_id || 'Drainage'}</h3>
                  <p style="margin: 4px 0; font-size: 14px;"><strong>Route:</strong> ${drainage.route_name || 'N/A'}</p>
                  <p style="margin: 4px 0; font-size: 14px;"><strong>Park:</strong> ${drainage.park_name || 'N/A'}</p>
                  ${drainage.type ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Type:</strong> ${drainage.type}</p>` : ''}
                  ${drainage.location ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Location:</strong> ${drainage.location}</p>` : ''}
                  ${drainage.events ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Events:</strong> ${drainage.events}</p>` : ''}
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Start:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            drainageMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Drainage ${drainage.gid} has invalid coordinates: lat=${drainage.latitude_s} (${typeof drainage.latitude_s}), lng=${drainage.longitude_} (${typeof drainage.longitude_})`);
          }
          
          // Add geometry if available (MULTILINESTRING for drainage)
          if (drainage.geom) {
            let geometry = drainage.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for drainage ${drainage.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'drainage',
                gid: drainage.gid,
                lable_id: drainage.lable_id,
                route_name: drainage.route_name,
                park_name: drainage.park_name,
                drainage_type: drainage.type,
                location: drainage.location,
                events: drainage.events,
                index: index,
              }
            });
          }
        } catch (err) {
          console.error(`Error processing drainage ${drainage.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} drainage markers out of ${drainages.length} drainage records`);
      
      // Fit map bounds to show all drainage markers if we have any
      if (drainageMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        drainageMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show drainage markers');
          map.fitBounds(bounds);
        }
      }
      
      // Add drainage features to Data Layer
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} drainage features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style drainage lines (MULTILINESTRING) - apply style to all features in this layer
            dataLayer.setStyle({
              strokeColor: '#3b82f6', // Blue color for drainage
              strokeWeight: 3,
              strokeOpacity: 0.8,
            });
            
            // Add click event listener for drainage info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'drainage') {
                  const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                      <div style="padding: 8px; min-width: 200px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${props.lable_id || 'Drainage'}</h3>
                        <p style="margin: 4px 0; font-size: 14px;"><strong>Route:</strong> ${props.route_name || 'N/A'}</p>
                        <p style="margin: 4px 0; font-size: 14px;"><strong>Park:</strong> ${props.park_name || 'N/A'}</p>
                        ${props.drainage_type ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Type:</strong> ${props.drainage_type}</p>` : ''}
                        ${props.location ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Location:</strong> ${props.location}</p>` : ''}
                        ${props.events ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Events:</strong> ${props.events}</p>` : ''}
                      </div>
                    `,
                  });
                  infoWindow.setPosition(event.latLng);
                  infoWindow.open(map);
                }
              } catch (err) {
                console.error('Error showing drainage info window:', err);
              }
            });
          }
        } catch (geoJsonError) {
          console.error('Error adding drainage GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading drainage data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Flexible Post data
  const loadFlexiblePostData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('flexible_post') : 'http://localhost:3001/api/flexible_post';
      console.log('Fetching flexible_post data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const flexiblePosts = data.flexible_post || [];
      
      console.log(`Loaded ${flexiblePosts.length} flexible_post records`);
      setFlexiblePostData(flexiblePosts);
      
      if (flexiblePosts.length === 0) {
        console.warn('No flexible_post data found');
        return;
      }
      
      // Clear existing flexible_post markers
      flexiblePostMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      flexiblePostMarkersRef.current = [];
      
      // Clear existing flexible_post features from data layer
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'flexible_post') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all flexible_post features
      const allFeatures: any[] = [];
      
      // Process each flexible_post record
      let markersCreated = 0;
      flexiblePosts.forEach((flexiblePost: FlexiblePost, index: number) => {
        try {
          // Get latitude and longitude from API response
          // Priority: latitude/longitude fields > geom extraction
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (flexiblePost.latitude !== undefined && flexiblePost.longitude !== undefined) {
            lat = typeof flexiblePost.latitude === 'string' 
              ? parseFloat(flexiblePost.latitude) 
              : (typeof flexiblePost.latitude === 'number' ? flexiblePost.latitude : null);
            lng = typeof flexiblePost.longitude === 'string' 
              ? parseFloat(flexiblePost.longitude) 
              : (typeof flexiblePost.longitude === 'number' ? flexiblePost.longitude : null);
          } else if (flexiblePost.geom && flexiblePost.geom.type === 'MultiLineString' && flexiblePost.geom.coordinates) {
            // Extract from GeoJSON MultiLineString geometry - get first point of first line
            const firstLine = flexiblePost.geom.coordinates[0];
            if (firstLine && firstLine.length > 0) {
              const firstPoint = firstLine[0];
              // GeoJSON coordinates are [longitude, latitude]
              lng = firstPoint[0];
              lat = firstPoint[1];
            }
          }
          
          // Add marker at start point if available and valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for flexible_post ${flexiblePost.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Flexible Post ${flexiblePost.gid}`,
              icon: {
                url: '/icon/flexiblepost.png',
                scaledSize: new window.google.maps.Size(32, 32),
                anchor: new window.google.maps.Point(16, 16),
              },
            });
            
            // Build info window content with available fields
            const infoContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Flexible Post ${flexiblePost.gid}</h3>
                ${flexiblePost.objectid ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Object ID:</strong> ${flexiblePost.objectid}</p>` : ''}
                ${Object.keys(flexiblePost).filter(key => !['gid', 'objectid', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && flexiblePost[key] !== null && flexiblePost[key] !== undefined).slice(0, 5).map(key => 
                  `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${flexiblePost[key]}</p>`
                ).join('')}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            flexiblePostMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Flexible Post ${flexiblePost.gid} has invalid coordinates`);
          }
          
          // Add geometry if available (MULTILINESTRING for flexible_post)
          if (flexiblePost.geom) {
            let geometry = flexiblePost.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for flexible_post ${flexiblePost.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'flexible_post',
                gid: flexiblePost.gid,
                objectid: flexiblePost.objectid,
                index: index,
              }
            });
          }
        } catch (err) {
          console.error(`Error processing flexible_post ${flexiblePost.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} flexible_post markers out of ${flexiblePosts.length} flexible_post records`);
      
      // Fit map bounds to show all flexible_post markers if we have any
      if (flexiblePostMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        flexiblePostMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show flexible_post markers');
          map.fitBounds(bounds);
        }
      }
      
      // Add flexible_post features to Data Layer
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} flexible_post features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style flexible_post lines (MULTILINESTRING) - use a distinct color
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                if (props.type === 'flexible_post') {
                  return {
                    strokeColor: '#f97316', // orange-500
                    strokeWeight: 3,
                    strokeOpacity: 0.8,
                  };
                }
                return null;
              } catch (err) {
                console.error('Error styling flexible_post feature:', err);
                return null;
              }
            });
            
            // Add click event listener for flexible_post info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'flexible_post') {
                  const flexiblePost = flexiblePosts.find((fp: FlexiblePost) => fp.gid === props.gid);
                  if (flexiblePost) {
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: `
                        <div style="padding: 8px; min-width: 200px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Flexible Post ${flexiblePost.gid}</h3>
                          ${flexiblePost.objectid ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Object ID:</strong> ${flexiblePost.objectid}</p>` : ''}
                          ${Object.keys(flexiblePost).filter(key => !['gid', 'objectid', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && flexiblePost[key] !== null && flexiblePost[key] !== undefined).slice(0, 5).map(key => 
                            `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${flexiblePost[key]}</p>`
                          ).join('')}
                        </div>
                      `,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error('Error showing flexible_post info window:', err);
              }
            });
          }
        } catch (geoJsonError) {
          console.error('Error adding flexible_post GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading flexible_post data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Gtmix data
  const loadGtmixData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('gtmix') : 'http://localhost:3001/api/gtmix';
      console.log('Fetching gtmix data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const gtmixes = data.gtmix || [];
      
      console.log(`Loaded ${gtmixes.length} gtmix records`);
      setGtmixData(gtmixes);
      
      if (gtmixes.length === 0) {
        console.warn('No gtmix data found');
        return;
      }
      
      // Clear existing gtmix features from data layer
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'gtmix') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all gtmix features
      const allFeatures: any[] = [];
      
      // Process each gtmix record
      gtmixes.forEach((gtmix: Gtmix, index: number) => {
        try {
          // Add geometry if available (MULTIPOLYGON for gtmix)
          if (gtmix.geom) {
            let geometry = gtmix.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for gtmix ${gtmix.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'gtmix',
                gid: gtmix.gid,
                id: gtmix.id,
                index: index,
                latitude: gtmix.latitude,
                longitude: gtmix.longitude,
                ...Object.keys(gtmix).reduce((acc: any, key: string) => {
                  if (!['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key)) {
                    acc[key] = gtmix[key];
                  }
                  return acc;
                }, {}),
              }
            });
          }
        } catch (err) {
          console.error(`Error processing gtmix ${gtmix.gid}:`, err);
        }
      });
      
      console.log(`Total gtmix features collected: ${allFeatures.length}`);
      
      // Add all features to Data Layer at once
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} gtmix features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style gtmix polygons (MULTIPOLYGON) - use a distinct color
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                if (props.type === 'gtmix') {
                  return {
                    fillColor: '#ef4444', // red-500 - bright red
                    fillOpacity: 0.6, // increased opacity for better visibility
                    strokeColor: '#dc2626', // red-600 - darker red for stroke
                    strokeWeight: 3, // thicker stroke for better visibility
                    strokeOpacity: 1.0, // fully opaque stroke
                  };
                }
                return null;
              } catch (err) {
                console.error('Error styling gtmix feature:', err);
                return null;
              }
            });
            
            // Add click event listener for gtmix info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'gtmix') {
                  const gtmix = gtmixes.find((g: Gtmix) => g.gid === props.gid);
                  if (gtmix) {
                    const infoContent = `
                      <div style="padding: 8px; min-width: 200px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">GTMix ${gtmix.gid}</h3>
                        ${gtmix.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${gtmix.id}</p>` : ''}
                        ${Object.keys(gtmix).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && gtmix[key] !== null && gtmix[key] !== undefined).slice(0, 5).map(key => 
                          `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${gtmix[key]}</p>`
                        ).join('')}
                        ${gtmix.latitude && gtmix.longitude ? `
                          <p style="margin: 4px 0; font-size: 12px; color: #666;">
                            <strong>Centroid:</strong> ${gtmix.latitude.toFixed(6)}, ${gtmix.longitude.toFixed(6)}
                          </p>
                        ` : ''}
                      </div>
                    `;
                    
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: infoContent,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error('Error showing gtmix info window:', err);
              }
            });
            
            // Fit bounds to show all features
            if (addedFeatures && addedFeatures.length > 0) {
              const bounds = new window.google.maps.LatLngBounds();
              
              addedFeatures.forEach((feature: any) => {
                try {
                  const geometry = feature.getGeometry();
                  if (geometry) {
                    geometry.forEachLatLng((latLng: any) => {
                      bounds.extend(latLng);
                    });
                  }
                } catch (err) {
                  console.warn('Error processing feature for bounds:', err);
                }
              });
              
              if (!bounds.isEmpty()) {
                console.log('Fitting bounds to show gtmix features');
                map.fitBounds(bounds);
              }
            }
          }
        } catch (geoJsonError) {
          console.error('Error adding gtmix GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading gtmix data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Sempadan Taman data
  const loadSempadanTamanData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('sempadan_taman') : 'http://localhost:3001/api/sempadan_taman';
      console.log('Fetching sempadan_taman data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const sempadanTamans = data.sempadan_taman || [];
      
      console.log(`Loaded ${sempadanTamans.length} sempadan_taman records`);
      setSempadanTamanData(sempadanTamans);
      
      if (sempadanTamans.length === 0) {
        console.warn('No sempadan_taman data found');
        return;
      }
      
      // Clear existing sempadan_taman features from data layer
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'sempadan_taman') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Clear existing sempadan_taman markers
      sempadanTamanMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      sempadanTamanMarkersRef.current = [];
      
      // Collect all sempadan_taman features
      const allFeatures: any[] = [];
      let markersCreated = 0;
      
      // Process each sempadan_taman record
      sempadanTamans.forEach((sempadanTaman: SempadanTaman, index: number) => {
        try {
          // Get latitude and longitude for marker position
          let lat: number | null = null;
          let lng: number | null = null;
          if (sempadanTaman.latitude !== undefined && sempadanTaman.longitude !== undefined) {
            lat = typeof sempadanTaman.latitude === 'string' ? parseFloat(sempadanTaman.latitude) : (typeof sempadanTaman.latitude === 'number' ? sempadanTaman.latitude : null);
            lng = typeof sempadanTaman.longitude === 'string' ? parseFloat(sempadanTaman.longitude) : (typeof sempadanTaman.longitude === 'number' ? sempadanTaman.longitude : null);
          } else if (sempadanTaman.geom && sempadanTaman.geom.type === 'MultiPolygon' && sempadanTaman.geom.coordinates && sempadanTaman.geom.coordinates.length > 0) {
            const firstPolygon = sempadanTaman.geom.coordinates[0];
            if (firstPolygon && firstPolygon.length > 0 && firstPolygon[0] && firstPolygon[0].length > 0) {
              lng = firstPolygon[0][0][0];
              lat = firstPolygon[0][0][1];
            }
          }

          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Sempadan Taman ${sempadanTaman.gid}`,
              icon: { url: '/icon/tamanborder.png', scaledSize: new window.google.maps.Size(24, 24), anchor: new window.google.maps.Point(12, 12), },
            });
            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div style="padding: 8px;"><h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Sempadan Taman ${sempadanTaman.gid}</h3>${sempadanTaman.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${sempadanTaman.id}</p>` : ''}${Object.keys(sempadanTaman).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && sempadanTaman[key] !== null && sempadanTaman[key] !== undefined).slice(0, 5).map(key => `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${sempadanTaman[key]}</p>`).join('')}<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Center:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p></div>`,
            });
            marker.addListener('click', () => { infoWindow.open(map, marker); });
            sempadanTamanMarkersRef.current.push(marker);
            markersCreated++;
          }
          
          // Add geometry if available (MULTIPOLYGON for sempadan_taman)
          if (sempadanTaman.geom) {
            let geometry = sempadanTaman.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for sempadan_taman ${sempadanTaman.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'sempadan_taman',
                gid: sempadanTaman.gid,
                id: sempadanTaman.id,
                index: index,
                latitude: sempadanTaman.latitude,
                longitude: sempadanTaman.longitude,
                ...Object.keys(sempadanTaman).reduce((acc: any, key: string) => {
                  if (!['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key)) {
                    acc[key] = sempadanTaman[key];
                  }
                  return acc;
                }, {}),
              }
            });
          }
        } catch (err) {
          console.error(`Error processing sempadan_taman ${sempadanTaman.gid}:`, err);
        }
      });
      
      console.log(`Total sempadan_taman features collected: ${allFeatures.length}`);
      
      // Add all features to Data Layer at once
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} sempadan_taman features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style sempadan_taman polygons (MULTIPOLYGON) - use a distinct color
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                if (props.type === 'sempadan_taman') {
                  return {
                    fillColor: '#10b981', // green-500
                    fillOpacity: 0.5,
                    strokeColor: '#059669', // green-600
                    strokeWeight: 3,
                    strokeOpacity: 1.0,
                  };
                }
                return null;
              } catch (err) {
                console.error('Error styling sempadan_taman feature:', err);
                return null;
              }
            });
            
            // Add click event listener for sempadan_taman info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'sempadan_taman') {
                  const sempadanTaman = sempadanTamans.find((s: SempadanTaman) => s.gid === props.gid);
                  if (sempadanTaman) {
                    const infoContent = `
                      <div style="padding: 8px; min-width: 200px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Sempadan Taman ${sempadanTaman.gid}</h3>
                        ${sempadanTaman.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${sempadanTaman.id}</p>` : ''}
                        ${Object.keys(sempadanTaman).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && sempadanTaman[key] !== null && sempadanTaman[key] !== undefined).slice(0, 5).map(key => 
                          `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${sempadanTaman[key]}</p>`
                        ).join('')}
                        ${sempadanTaman.latitude && sempadanTaman.longitude ? `
                          <p style="margin: 4px 0; font-size: 12px; color: #666;">
                            <strong>Centroid:</strong> ${sempadanTaman.latitude.toFixed(6)}, ${sempadanTaman.longitude.toFixed(6)}
                          </p>
                        ` : ''}
                      </div>
                    `;
                    
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: infoContent,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error('Error showing sempadan_taman info window:', err);
              }
            });
            
            // Fit bounds to show all features
            if (addedFeatures && addedFeatures.length > 0) {
              const bounds = new window.google.maps.LatLngBounds();
              
              addedFeatures.forEach((feature: any) => {
                try {
                  const geometry = feature.getGeometry();
                  if (geometry) {
                    geometry.forEachLatLng((latLng: any) => {
                      bounds.extend(latLng);
                    });
                  }
                } catch (err) {
                  console.warn('Error processing feature for bounds:', err);
                }
              });
              
              if (!bounds.isEmpty()) {
                console.log('Fitting bounds to show sempadan_taman features');
                map.fitBounds(bounds);
              }
            }
          }
        } catch (geoJsonError) {
          console.error('Error adding sempadan_taman GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading sempadan_taman data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Gtnh Semasa data
  const loadGtnhSemasaData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('gtnh_semasa') : 'http://localhost:3001/api/gtnh_semasa';
      console.log('Fetching gtnh_semasa data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const gtnhSemasas = data.gtnh_semasa || [];
      
      console.log(`Loaded ${gtnhSemasas.length} gtnh_semasa records`);
      setGtnhSemasaData(gtnhSemasas);
      
      if (gtnhSemasas.length === 0) {
        console.warn('No gtnh_semasa data found');
        return;
      }
      
      // Clear existing gtnh_semasa features from data layer
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'gtnh_semasa') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all gtnh_semasa features
      const allFeatures: any[] = [];
      
      // Process each gtnh_semasa record
      gtnhSemasas.forEach((gtnhSemasa: GtnhSemasa, index: number) => {
        try {
          // Add geometry if available (MULTIPOLYGON for gtnh_semasa)
          if (gtnhSemasa.geom) {
            let geometry = gtnhSemasa.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for gtnh_semasa ${gtnhSemasa.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'gtnh_semasa',
                gid: gtnhSemasa.gid,
                id: gtnhSemasa.id,
                index: index,
                latitude: gtnhSemasa.latitude,
                longitude: gtnhSemasa.longitude,
                ...Object.keys(gtnhSemasa).reduce((acc: any, key: string) => {
                  if (!['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key)) {
                    acc[key] = gtnhSemasa[key];
                  }
                  return acc;
                }, {}),
              }
            });
          }
        } catch (err) {
          console.error(`Error processing gtnh_semasa ${gtnhSemasa.gid}:`, err);
        }
      });
      
      console.log(`Total gtnh_semasa features collected: ${allFeatures.length}`);
      
      // Add all features to Data Layer at once
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} gtnh_semasa features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style gtnh_semasa polygons (MULTIPOLYGON) - use a distinct color
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                if (props.type === 'gtnh_semasa') {
                  return {
                    fillColor: '#3b82f6', // blue-500
                    fillOpacity: 0.5,
                    strokeColor: '#2563eb', // blue-600
                    strokeWeight: 3,
                    strokeOpacity: 1.0,
                  };
                }
                return null;
              } catch (err) {
                console.error('Error styling gtnh_semasa feature:', err);
                return null;
              }
            });
            
            // Add click event listener for gtnh_semasa info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'gtnh_semasa') {
                  const gtnhSemasa = gtnhSemasas.find((g: GtnhSemasa) => g.gid === props.gid);
                  if (gtnhSemasa) {
                    const infoContent = `
                      <div style="padding: 8px; min-width: 200px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">GTNH Semasa ${gtnhSemasa.gid}</h3>
                        ${gtnhSemasa.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${gtnhSemasa.id}</p>` : ''}
                        ${Object.keys(gtnhSemasa).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && gtnhSemasa[key] !== null && gtnhSemasa[key] !== undefined).slice(0, 5).map(key => 
                          `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${gtnhSemasa[key]}</p>`
                        ).join('')}
                        ${gtnhSemasa.latitude && gtnhSemasa.longitude ? `
                          <p style="margin: 4px 0; font-size: 12px; color: #666;">
                            <strong>Centroid:</strong> ${gtnhSemasa.latitude.toFixed(6)}, ${gtnhSemasa.longitude.toFixed(6)}
                          </p>
                        ` : ''}
                      </div>
                    `;
                    
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: infoContent,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error('Error showing gtnh_semasa info window:', err);
              }
            });
            
            // Fit bounds to show all features
            if (addedFeatures && addedFeatures.length > 0) {
              const bounds = new window.google.maps.LatLngBounds();
              
              addedFeatures.forEach((feature: any) => {
                try {
                  const geometry = feature.getGeometry();
                  if (geometry) {
                    geometry.forEachLatLng((latLng: any) => {
                      bounds.extend(latLng);
                    });
                  }
                } catch (err) {
                  console.warn('Error processing feature for bounds:', err);
                }
              });
              
              if (!bounds.isEmpty()) {
                console.log('Fitting bounds to show gtnh_semasa features');
                map.fitBounds(bounds);
              }
            }
          }
        } catch (geoJsonError) {
          console.error('Error adding gtnh_semasa GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading gtnh_semasa data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Jalan data
  const loadJalanData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('jalan') : 'http://localhost:3001/api/jalan';
      console.log('Fetching jalan data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const jalans = data.jalan || [];
      
      console.log(`Loaded ${jalans.length} jalan records`);
      setJalanData(jalans);
      
      if (jalans.length === 0) {
        console.warn('No jalan data found');
        return;
      }
      
      // Clear existing jalan markers
      jalanMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      jalanMarkersRef.current = [];
      
      // Clear existing jalan features from data layer
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'jalan') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all jalan features
      const allFeatures: any[] = [];
      
      // Process each jalan record
      let markersCreated = 0;
      jalans.forEach((jalan: Jalan, index: number) => {
        try {
          // Convert latitude and longitude to numbers, handling string values
          const lat = typeof jalan.latitude_s === 'string' 
            ? parseFloat(jalan.latitude_s) 
            : (typeof jalan.latitude_s === 'number' ? jalan.latitude_s : null);
          const lng = typeof jalan.longitude_s === 'string' 
            ? parseFloat(jalan.longitude_s) 
            : (typeof jalan.longitude_s === 'number' ? jalan.longitude_s : null);
          
          // Add marker at start point if available and valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for jalan ${jalan.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Jalan ${jalan.gid}`,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#6366f1', // indigo-500
                fillOpacity: 0.9,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Jalan ${jalan.gid}</h3>
                  ${jalan.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${jalan.id}</p>` : ''}
                  ${Object.keys(jalan).filter(key => !['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key) && jalan[key] !== null && jalan[key] !== undefined).slice(0, 5).map(key => 
                    `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${jalan[key]}</p>`
                  ).join('')}
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Start:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            jalanMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Jalan ${jalan.gid} has invalid coordinates: lat=${jalan.latitude_s} (${typeof jalan.latitude_s}), lng=${jalan.longitude_s} (${typeof jalan.longitude_s})`);
          }
          
          // Add geometry if available (MULTILINESTRING for jalan)
          if (jalan.geom) {
            let geometry = jalan.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for jalan ${jalan.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'jalan',
                gid: jalan.gid,
                id: jalan.id,
                index: index,
                latitude_s: jalan.latitude_s,
                longitude_s: jalan.longitude_s,
                latitude_e: jalan.latitude_e,
                longitude_e: jalan.longitude_e,
                ...Object.keys(jalan).reduce((acc: any, key: string) => {
                  if (!['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key)) {
                    acc[key] = jalan[key];
                  }
                  return acc;
                }, {}),
              }
            });
          }
        } catch (err) {
          console.error(`Error processing jalan ${jalan.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} jalan markers out of ${jalans.length} jalan records`);
      
      // Fit map bounds to show all jalan markers if we have any
      if (jalanMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        jalanMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show jalan markers');
          map.fitBounds(bounds);
        }
      }
      
      // Add jalan features to Data Layer
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} jalan features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style jalan lines (MULTILINESTRING) - use a distinct color
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                if (props.type === 'jalan') {
                  return {
                    strokeColor: '#6366f1', // indigo-500
                    strokeWeight: 4,
                    strokeOpacity: 0.8,
                  };
                }
                return null;
              } catch (err) {
                console.error('Error styling jalan feature:', err);
                return null;
              }
            });
            
            // Add click event listener for jalan info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'jalan') {
                  const jalan = jalans.find((j: Jalan) => j.gid === props.gid);
                  if (jalan) {
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: `
                        <div style="padding: 8px; min-width: 200px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Jalan ${jalan.gid}</h3>
                          ${jalan.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${jalan.id}</p>` : ''}
                          ${Object.keys(jalan).filter(key => !['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key) && jalan[key] !== null && jalan[key] !== undefined).slice(0, 5).map(key => 
                            `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${jalan[key]}</p>`
                          ).join('')}
                          ${jalan.latitude_s && jalan.longitude_s ? `
                            <p style="margin: 4px 0; font-size: 12px; color: #666;">
                              <strong>Start:</strong> ${jalan.latitude_s.toFixed(6)}, ${jalan.longitude_s.toFixed(6)}
                            </p>
                          ` : ''}
                        </div>
                      `,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error('Error showing jalan info window:', err);
              }
            });
          }
        } catch (geoJsonError) {
          console.error('Error adding jalan GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading jalan data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Jalan Kejuruteraan data
  const loadJalanKejuruteraanData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('jalan_kejuruteraan') : 'http://localhost:3001/api/jalan_kejuruteraan';
      console.log('Fetching jalan_kejuruteraan data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const jalanKejuruteraans = data.jalan_kejuruteraan || [];
      
      console.log(`Loaded ${jalanKejuruteraans.length} jalan_kejuruteraan records`);
      setJalanKejuruteraanData(jalanKejuruteraans);
      
      if (jalanKejuruteraans.length === 0) {
        console.warn('No jalan_kejuruteraan data found');
        return;
      }
      
      // Clear existing jalan_kejuruteraan markers
      jalanKejuruteraanMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      jalanKejuruteraanMarkersRef.current = [];
      
      // Clear existing jalan_kejuruteraan features from data layer
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'jalan_kejuruteraan') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all jalan_kejuruteraan features
      const allFeatures: any[] = [];
      
      // Process each jalan_kejuruteraan record
      let markersCreated = 0;
      jalanKejuruteraans.forEach((jalanKejuruteraan: JalanKejuruteraan, index: number) => {
        try {
          // Convert latitude and longitude to numbers, handling string values
          const lat = typeof jalanKejuruteraan.latitude_s === 'string' 
            ? parseFloat(jalanKejuruteraan.latitude_s) 
            : (typeof jalanKejuruteraan.latitude_s === 'number' ? jalanKejuruteraan.latitude_s : null);
          const lng = typeof jalanKejuruteraan.longitude_s === 'string' 
            ? parseFloat(jalanKejuruteraan.longitude_s) 
            : (typeof jalanKejuruteraan.longitude_s === 'number' ? jalanKejuruteraan.longitude_s : null);
          
          // Add marker at start point if available and valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for jalan_kejuruteraan ${jalanKejuruteraan.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Jalan Kejuruteraan ${jalanKejuruteraan.gid}`,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#ec4899', // pink-500
                fillOpacity: 0.9,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Jalan Kejuruteraan ${jalanKejuruteraan.gid}</h3>
                  ${jalanKejuruteraan.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${jalanKejuruteraan.id}</p>` : ''}
                  ${Object.keys(jalanKejuruteraan).filter(key => !['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key) && jalanKejuruteraan[key] !== null && jalanKejuruteraan[key] !== undefined).slice(0, 5).map(key => 
                    `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${jalanKejuruteraan[key]}</p>`
                  ).join('')}
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Start:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            jalanKejuruteraanMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Jalan Kejuruteraan ${jalanKejuruteraan.gid} has invalid coordinates: lat=${jalanKejuruteraan.latitude_s} (${typeof jalanKejuruteraan.latitude_s}), lng=${jalanKejuruteraan.longitude_s} (${typeof jalanKejuruteraan.longitude_s})`);
          }
          
          // Add geometry if available (MULTILINESTRING ZM for jalan_kejuruteraan)
          if (jalanKejuruteraan.geom) {
            let geometry = jalanKejuruteraan.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for jalan_kejuruteraan ${jalanKejuruteraan.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'jalan_kejuruteraan',
                gid: jalanKejuruteraan.gid,
                id: jalanKejuruteraan.id,
                index: index,
                latitude_s: jalanKejuruteraan.latitude_s,
                longitude_s: jalanKejuruteraan.longitude_s,
                latitude_e: jalanKejuruteraan.latitude_e,
                longitude_e: jalanKejuruteraan.longitude_e,
                ...Object.keys(jalanKejuruteraan).reduce((acc: any, key: string) => {
                  if (!['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key)) {
                    acc[key] = jalanKejuruteraan[key];
                  }
                  return acc;
                }, {}),
              }
            });
          }
        } catch (err) {
          console.error(`Error processing jalan_kejuruteraan ${jalanKejuruteraan.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} jalan_kejuruteraan markers out of ${jalanKejuruteraans.length} jalan_kejuruteraan records`);
      
      // Fit map bounds to show all jalan_kejuruteraan markers if we have any
      if (jalanKejuruteraanMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        jalanKejuruteraanMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show jalan_kejuruteraan markers');
          map.fitBounds(bounds);
        }
      }
      
      // Add jalan_kejuruteraan features to Data Layer
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} jalan_kejuruteraan features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style jalan_kejuruteraan lines (MULTILINESTRING) - use a distinct color
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                if (props.type === 'jalan_kejuruteraan') {
                  return {
                    strokeColor: '#ec4899', // pink-500
                    strokeWeight: 4,
                    strokeOpacity: 0.8,
                  };
                }
                return null;
              } catch (err) {
                console.error('Error styling jalan_kejuruteraan feature:', err);
                return null;
              }
            });
            
            // Add click event listener for jalan_kejuruteraan info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'jalan_kejuruteraan') {
                  const jalanKejuruteraan = jalanKejuruteraans.find((j: JalanKejuruteraan) => j.gid === props.gid);
                  if (jalanKejuruteraan) {
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: `
                        <div style="padding: 8px; min-width: 200px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Jalan Kejuruteraan ${jalanKejuruteraan.gid}</h3>
                          ${jalanKejuruteraan.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${jalanKejuruteraan.id}</p>` : ''}
                          ${Object.keys(jalanKejuruteraan).filter(key => !['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key) && jalanKejuruteraan[key] !== null && jalanKejuruteraan[key] !== undefined).slice(0, 5).map(key => 
                            `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${jalanKejuruteraan[key]}</p>`
                          ).join('')}
                          ${jalanKejuruteraan.latitude_s && jalanKejuruteraan.longitude_s ? `
                            <p style="margin: 4px 0; font-size: 12px; color: #666;">
                              <strong>Start:</strong> ${jalanKejuruteraan.latitude_s.toFixed(6)}, ${jalanKejuruteraan.longitude_s.toFixed(6)}
                            </p>
                          ` : ''}
                        </div>
                      `,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error('Error showing jalan_kejuruteraan info window:', err);
              }
            });
          }
        } catch (geoJsonError) {
          console.error('Error adding jalan_kejuruteraan GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading jalan_kejuruteraan data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Komited KM data
  const loadKomitedKmData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('komited_km') : 'http://localhost:3001/api/komited_km';
      console.log('Fetching komited_km data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const komitedKms = data.komited_km || [];
      
      console.log(`Loaded ${komitedKms.length} komited_km records`);
      setKomitedKmData(komitedKms);
      
      if (komitedKms.length === 0) {
        console.warn('No komited_km data found');
        return;
      }
      
      // Clear existing komited_km markers
      komitedKmMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      komitedKmMarkersRef.current = [];
      
      // Clear existing komited_km features from data layer
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'komited_km') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all komited_km features
      const allFeatures: any[] = [];
      
      // Process each komited_km record
      let markersCreated = 0;
      komitedKms.forEach((komitedKm: KomitedKm, index: number) => {
        try {
          // Convert latitude and longitude to numbers, handling string values
          const lat = typeof komitedKm.latitude === 'string' 
            ? parseFloat(komitedKm.latitude) 
            : (typeof komitedKm.latitude === 'number' ? komitedKm.latitude : null);
          const lng = typeof komitedKm.longitude === 'string' 
            ? parseFloat(komitedKm.longitude) 
            : (typeof komitedKm.longitude === 'number' ? komitedKm.longitude : null);
          
          // Add marker at centroid if available and valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for komited_km ${komitedKm.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Komited KM ${komitedKm.gid}`,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#f59e0b', // amber-500
                fillOpacity: 0.9,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Komited KM ${komitedKm.gid}</h3>
                  ${komitedKm.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${komitedKm.id}</p>` : ''}
                  ${Object.keys(komitedKm).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && komitedKm[key] !== null && komitedKm[key] !== undefined).slice(0, 5).map(key => 
                    `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${komitedKm[key]}</p>`
                  ).join('')}
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Centroid:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            komitedKmMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Komited KM ${komitedKm.gid} has invalid coordinates: lat=${komitedKm.latitude} (${typeof komitedKm.latitude}), lng=${komitedKm.longitude} (${typeof komitedKm.longitude})`);
          }
          
          // Add geometry if available (MULTIPOLYGON for komited_km)
          if (komitedKm.geom) {
            let geometry = komitedKm.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for komited_km ${komitedKm.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'komited_km',
                gid: komitedKm.gid,
                id: komitedKm.id,
                index: index,
                latitude: komitedKm.latitude,
                longitude: komitedKm.longitude,
                ...Object.keys(komitedKm).reduce((acc: any, key: string) => {
                  if (!['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key)) {
                    acc[key] = komitedKm[key];
                  }
                  return acc;
                }, {}),
              }
            });
          }
        } catch (err) {
          console.error(`Error processing komited_km ${komitedKm.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} komited_km markers out of ${komitedKms.length} komited_km records`);
      
      // Fit map bounds to show all komited_km markers if we have any
      if (komitedKmMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        komitedKmMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show komited_km markers');
          map.fitBounds(bounds);
        }
      }
      
      // Add komited_km features to Data Layer
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} komited_km features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style komited_km polygons (MULTIPOLYGON) - use a distinct color
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                if (props.type === 'komited_km') {
                  return {
                    fillColor: '#f59e0b', // amber-500
                    fillOpacity: 0.6,
                    strokeColor: '#d97706', // amber-600
                    strokeWeight: 3,
                    strokeOpacity: 1.0,
                  };
                }
                return null;
              } catch (err) {
                console.error('Error styling komited_km feature:', err);
                return null;
              }
            });
            
            // Add click event listener for komited_km info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'komited_km') {
                  const komitedKm = komitedKms.find((k: KomitedKm) => k.gid === props.gid);
                  if (komitedKm) {
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: `
                        <div style="padding: 8px; min-width: 200px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Komited KM ${komitedKm.gid}</h3>
                          ${komitedKm.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${komitedKm.id}</p>` : ''}
                          ${Object.keys(komitedKm).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && komitedKm[key] !== null && komitedKm[key] !== undefined).slice(0, 5).map(key => 
                            `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${komitedKm[key]}</p>`
                          ).join('')}
                          ${komitedKm.latitude && komitedKm.longitude ? `
                            <p style="margin: 4px 0; font-size: 12px; color: #666;">
                              <strong>Centroid:</strong> ${komitedKm.latitude.toFixed(6)}, ${komitedKm.longitude.toFixed(6)}
                            </p>
                          ` : ''}
                        </div>
                      `,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error('Error showing komited_km info window:', err);
              }
            });
            
            // Fit bounds to show all features
            if (addedFeatures && addedFeatures.length > 0) {
              const bounds = new window.google.maps.LatLngBounds();
              
              addedFeatures.forEach((feature: any) => {
                try {
                  const geometry = feature.getGeometry();
                  if (geometry) {
                    geometry.forEachLatLng((latLng: any) => {
                      bounds.extend(latLng);
                    });
                  }
                } catch (err) {
                  console.error('Error processing feature bounds:', err);
                }
              });
              
              if (!bounds.isEmpty()) {
                console.log('Fitting bounds to show komited_km features');
                map.fitBounds(bounds);
              }
            }
          }
        } catch (geoJsonError) {
          console.error('Error adding komited_km GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading komited_km data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot NDCDB20 data
  const loadNdcdb20Data = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('ndcdb20') : 'http://localhost:3001/api/ndcdb20';
      console.log('Fetching ndcdb20 data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const ndcdb20s = data.ndcdb20 || [];
      
      console.log(`Loaded ${ndcdb20s.length} ndcdb20 records`);
      setNdcdb20Data(ndcdb20s);
      
      if (ndcdb20s.length === 0) {
        console.warn('No ndcdb20 data found');
        return;
      }
      
      // Clear existing ndcdb20 markers
      ndcdb20MarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      ndcdb20MarkersRef.current = [];
      
      // Clear existing ndcdb20 features from data layer
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'ndcdb20') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all ndcdb20 features
      const allFeatures: any[] = [];
      
      // Process each ndcdb20 record
      let markersCreated = 0;
      ndcdb20s.forEach((ndcdb20: Ndcdb20, index: number) => {
        try {
          // Convert latitude and longitude to numbers, handling string values
          const lat = typeof ndcdb20.latitude === 'string' 
            ? parseFloat(ndcdb20.latitude) 
            : (typeof ndcdb20.latitude === 'number' ? ndcdb20.latitude : null);
          const lng = typeof ndcdb20.longitude === 'string' 
            ? parseFloat(ndcdb20.longitude) 
            : (typeof ndcdb20.longitude === 'number' ? ndcdb20.longitude : null);
          
          // Add marker at centroid if available and valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for ndcdb20 ${ndcdb20.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `NDCDB20 ${ndcdb20.gid}`,
              icon: {
                url: '/icon/ndcdb20.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">NDCDB20 ${ndcdb20.gid}</h3>
                  ${ndcdb20.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${ndcdb20.id}</p>` : ''}
                  ${Object.keys(ndcdb20).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && ndcdb20[key] !== null && ndcdb20[key] !== undefined).slice(0, 5).map(key => 
                    `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${ndcdb20[key]}</p>`
                  ).join('')}
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Centroid:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            ndcdb20MarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`NDCDB20 ${ndcdb20.gid} has invalid coordinates: lat=${ndcdb20.latitude} (${typeof ndcdb20.latitude}), lng=${ndcdb20.longitude} (${typeof ndcdb20.longitude})`);
          }
          
          // Add geometry if available (MULTIPOLYGON for ndcdb20)
          if (ndcdb20.geom) {
            let geometry = ndcdb20.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for ndcdb20 ${ndcdb20.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'ndcdb20',
                gid: ndcdb20.gid,
                id: ndcdb20.id,
                index: index,
                latitude: ndcdb20.latitude,
                longitude: ndcdb20.longitude,
                ...Object.keys(ndcdb20).reduce((acc: any, key: string) => {
                  if (!['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key)) {
                    acc[key] = ndcdb20[key];
                  }
                  return acc;
                }, {}),
              }
            });
          }
        } catch (err) {
          console.error(`Error processing ndcdb20 ${ndcdb20.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} ndcdb20 markers out of ${ndcdb20s.length} ndcdb20 records`);
      
      // Fit map bounds to show all ndcdb20 markers if we have any
      if (ndcdb20MarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        ndcdb20MarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show ndcdb20 markers');
          map.fitBounds(bounds);
        }
      }
      
      // Add ndcdb20 features to Data Layer
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} ndcdb20 features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style ndcdb20 polygons (MULTIPOLYGON) - use a distinct color
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                if (props.type === 'ndcdb20') {
                  return {
                    fillColor: '#06b6d4', // cyan-500
                    fillOpacity: 0.6,
                    strokeColor: '#0891b2', // cyan-600
                    strokeWeight: 3,
                    strokeOpacity: 1.0,
                  };
                }
                return null;
              } catch (err) {
                console.error('Error styling ndcdb20 feature:', err);
                return null;
              }
            });
            
            // Add click event listener for ndcdb20 info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'ndcdb20') {
                  const ndcdb20 = ndcdb20s.find((n: Ndcdb20) => n.gid === props.gid);
                  if (ndcdb20) {
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: `
                        <div style="padding: 8px; min-width: 200px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">NDCDB20 ${ndcdb20.gid}</h3>
                          ${ndcdb20.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${ndcdb20.id}</p>` : ''}
                          ${Object.keys(ndcdb20).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && ndcdb20[key] !== null && ndcdb20[key] !== undefined).slice(0, 5).map(key => 
                            `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${ndcdb20[key]}</p>`
                          ).join('')}
                          ${ndcdb20.latitude && ndcdb20.longitude ? `
                            <p style="margin: 4px 0; font-size: 12px; color: #666;">
                              <strong>Centroid:</strong> ${ndcdb20.latitude.toFixed(6)}, ${ndcdb20.longitude.toFixed(6)}
                            </p>
                          ` : ''}
                        </div>
                      `,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error('Error showing ndcdb20 info window:', err);
              }
            });
            
            // Fit bounds to show all features
            if (addedFeatures && addedFeatures.length > 0) {
              const bounds = new window.google.maps.LatLngBounds();
              
              addedFeatures.forEach((feature: any) => {
                try {
                  const geometry = feature.getGeometry();
                  if (geometry) {
                    geometry.forEachLatLng((latLng: any) => {
                      bounds.extend(latLng);
                    });
                  }
                } catch (err) {
                  console.error('Error processing feature bounds:', err);
                }
              });
              
              if (!bounds.isEmpty()) {
                console.log('Fitting bounds to show ndcdb20 features');
                map.fitBounds(bounds);
              }
            }
          }
        } catch (geoJsonError) {
          console.error('Error adding ndcdb20 GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading ndcdb20 data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot NDCDB23 data
  const loadNdcdb23Data = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('ndcdb23') : 'http://localhost:3001/api/ndcdb23';
      console.log('Fetching ndcdb23 data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const ndcdb23s = data.ndcdb23 || [];
      
      console.log(`Loaded ${ndcdb23s.length} ndcdb23 records`);
      setNdcdb23Data(ndcdb23s);
      
      if (ndcdb23s.length === 0) {
        console.warn('No ndcdb23 data found');
        return;
      }
      
      // Clear existing ndcdb23 markers
      ndcdb23MarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      ndcdb23MarkersRef.current = [];
      
      // Clear existing ndcdb23 features from data layer
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'ndcdb23') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all ndcdb23 features
      const allFeatures: any[] = [];
      
      // Process each ndcdb23 record
      let markersCreated = 0;
      ndcdb23s.forEach((ndcdb23: Ndcdb23, index: number) => {
        try {
          // Convert latitude and longitude to numbers, handling string values
          const lat = typeof ndcdb23.latitude === 'string' 
            ? parseFloat(ndcdb23.latitude) 
            : (typeof ndcdb23.latitude === 'number' ? ndcdb23.latitude : null);
          const lng = typeof ndcdb23.longitude === 'string' 
            ? parseFloat(ndcdb23.longitude) 
            : (typeof ndcdb23.longitude === 'number' ? ndcdb23.longitude : null);
          
          // Add marker at centroid if available and valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for ndcdb23 ${ndcdb23.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `NDCDB23 ${ndcdb23.gid}`,
              icon: {
                url: '/icon/ndcdb23.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">NDCDB23 ${ndcdb23.gid}</h3>
                  ${ndcdb23.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${ndcdb23.id}</p>` : ''}
                  ${Object.keys(ndcdb23).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && ndcdb23[key] !== null && ndcdb23[key] !== undefined).slice(0, 5).map(key => 
                    `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${ndcdb23[key]}</p>`
                  ).join('')}
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Centroid:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            ndcdb23MarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`NDCDB23 ${ndcdb23.gid} has invalid coordinates: lat=${ndcdb23.latitude} (${typeof ndcdb23.latitude}), lng=${ndcdb23.longitude} (${typeof ndcdb23.longitude})`);
          }
          
          // Add geometry if available (MULTIPOLYGON for ndcdb23)
          if (ndcdb23.geom) {
            let geometry = ndcdb23.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for ndcdb23 ${ndcdb23.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'ndcdb23',
                gid: ndcdb23.gid,
                id: ndcdb23.id,
                index: index,
                latitude: ndcdb23.latitude,
                longitude: ndcdb23.longitude,
                ...Object.keys(ndcdb23).reduce((acc: any, key: string) => {
                  if (!['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key)) {
                    acc[key] = ndcdb23[key];
                  }
                  return acc;
                }, {}),
              }
            });
          }
        } catch (err) {
          console.error(`Error processing ndcdb23 ${ndcdb23.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} ndcdb23 markers out of ${ndcdb23s.length} ndcdb23 records`);
      
      // Fit map bounds to show all ndcdb23 markers if we have any
      if (ndcdb23MarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        ndcdb23MarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show ndcdb23 markers');
          map.fitBounds(bounds);
        }
      }
      
      // Add ndcdb23 features to Data Layer
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} ndcdb23 features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style ndcdb23 polygons (MULTIPOLYGON) - use a distinct color
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                if (props.type === 'ndcdb23') {
                  return {
                    fillColor: '#0891b2', // cyan-600
                    fillOpacity: 0.6,
                    strokeColor: '#0e7490', // cyan-700
                    strokeWeight: 3,
                    strokeOpacity: 1.0,
                  };
                }
                return null;
              } catch (err) {
                console.error('Error styling ndcdb23 feature:', err);
                return null;
              }
            });
            
            // Add click event listener for ndcdb23 info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'ndcdb23') {
                  const ndcdb23 = ndcdb23s.find((n: Ndcdb23) => n.gid === props.gid);
                  if (ndcdb23) {
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: `
                        <div style="padding: 8px; min-width: 200px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">NDCDB23 ${ndcdb23.gid}</h3>
                          ${ndcdb23.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${ndcdb23.id}</p>` : ''}
                          ${Object.keys(ndcdb23).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && ndcdb23[key] !== null && ndcdb23[key] !== undefined).slice(0, 5).map(key => 
                            `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${ndcdb23[key]}</p>`
                          ).join('')}
                          ${ndcdb23.latitude && ndcdb23.longitude ? `
                            <p style="margin: 4px 0; font-size: 12px; color: #666;">
                              <strong>Centroid:</strong> ${ndcdb23.latitude.toFixed(6)}, ${ndcdb23.longitude.toFixed(6)}
                            </p>
                          ` : ''}
                        </div>
                      `,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error('Error showing ndcdb23 info window:', err);
              }
            });
            
            // Fit bounds to show all features
            if (addedFeatures && addedFeatures.length > 0) {
              const bounds = new window.google.maps.LatLngBounds();
              
              addedFeatures.forEach((feature: any) => {
                try {
                  const geometry = feature.getGeometry();
                  if (geometry) {
                    geometry.forEachLatLng((latLng: any) => {
                      bounds.extend(latLng);
                    });
                  }
                } catch (err) {
                  console.error('Error processing feature bounds:', err);
                }
              });
              
              if (!bounds.isEmpty()) {
                console.log('Fitting bounds to show ndcdb23 features');
                map.fitBounds(bounds);
              }
            }
          }
        } catch (geoJsonError) {
          console.error('Error adding ndcdb23 GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading ndcdb23 data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Generic helper function to load pasar data
  const loadPasarData = async (
    map: any,
    dataLayer: any,
    apiUrl: string,
    typeName: string,
    setData: (data: any[]) => void,
    markersRef: React.MutableRefObject<any[]>,
    dataArray: any[]
  ) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl(typeName) : apiUrl;
      console.log(`Fetching ${typeName} data...`, url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const items = data[typeName] || [];
      
      console.log(`Loaded ${items.length} ${typeName} records`);
      setData(items);
      
      if (items.length === 0) {
        console.warn(`No ${typeName} data found`);
        return;
      }
      
      // Clear existing markers
      markersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
      
      // Clear existing features from data layer
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === typeName) {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all features
      const allFeatures: any[] = [];
      
      // Process each record
      let markersCreated = 0;
      items.forEach((item: any, index: number) => {
        try {
          // Convert latitude and longitude to numbers
          const lat = typeof item.latitude === 'string' 
            ? parseFloat(item.latitude) 
            : (typeof item.latitude === 'number' ? item.latitude : null);
          const lng = typeof item.longitude === 'string' 
            ? parseFloat(item.longitude) 
            : (typeof item.longitude === 'number' ? item.longitude : null);
          
          // Add marker at centroid if available and valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for ${typeName} ${item.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `${typeName} ${item.gid}`,
              icon: {
                url: '/icon/pasar.png',
                scaledSize: new window.google.maps.Size(32, 32),
                anchor: new window.google.maps.Point(16, 16),
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${typeName} ${item.gid}</h3>
                  ${item.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${item.id}</p>` : ''}
                  ${Object.keys(item).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && item[key] !== null && item[key] !== undefined).slice(0, 5).map(key => 
                    `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${item[key]}</p>`
                  ).join('')}
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Centroid:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            markersRef.current.push(marker);
            markersCreated++;
          }
          
          // Add geometry if available (MULTIPOLYGON)
          if (item.geom) {
            let geometry = item.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for ${typeName} ${item.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: typeName,
                gid: item.gid,
                id: item.id,
                index: index,
                latitude: item.latitude,
                longitude: item.longitude,
                ...Object.keys(item).reduce((acc: any, key: string) => {
                  if (!['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key)) {
                    acc[key] = item[key];
                  }
                  return acc;
                }, {}),
              }
            });
          }
        } catch (err) {
          console.error(`Error processing ${typeName} ${item.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} ${typeName} markers out of ${items.length} ${typeName} records`);
      
      // Fit map bounds to show all markers if we have any
      if (markersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        markersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log(`Fitting bounds to show ${typeName} markers`);
          map.fitBounds(bounds);
        }
      }
      
      // Add features to Data Layer
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} ${typeName} features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style polygons - use a distinct color for pasar
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                if (props.type === typeName) {
                  return {
                    fillColor: '#8b5cf6', // violet-500
                    fillOpacity: 0.6,
                    strokeColor: '#7c3aed', // violet-600
                    strokeWeight: 3,
                    strokeOpacity: 1.0,
                  };
                }
                return null;
              } catch (err) {
                console.error(`Error styling ${typeName} feature:`, err);
                return null;
              }
            });
            
            // Add click event listener for info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === typeName) {
                  const item = items.find((i: any) => i.gid === props.gid);
                  if (item) {
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: `
                        <div style="padding: 8px; min-width: 200px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${typeName} ${item.gid}</h3>
                          ${item.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${item.id}</p>` : ''}
                          ${Object.keys(item).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && item[key] !== null && item[key] !== undefined).slice(0, 5).map(key => 
                            `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${item[key]}</p>`
                          ).join('')}
                          ${item.latitude && item.longitude ? `
                            <p style="margin: 4px 0; font-size: 12px; color: #666;">
                              <strong>Centroid:</strong> ${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}
                            </p>
                          ` : ''}
                        </div>
                      `,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error(`Error showing ${typeName} info window:`, err);
              }
            });
            
            // Fit bounds to show all features
            if (addedFeatures && addedFeatures.length > 0) {
              const bounds = new window.google.maps.LatLngBounds();
              
              addedFeatures.forEach((feature: any) => {
                try {
                  const geometry = feature.getGeometry();
                  if (geometry) {
                    geometry.forEachLatLng((latLng: any) => {
                      bounds.extend(latLng);
                    });
                  }
                } catch (err) {
                  console.error('Error processing feature bounds:', err);
                }
              });
              
              if (!bounds.isEmpty()) {
                console.log(`Fitting bounds to show ${typeName} features`);
                map.fitBounds(bounds);
              }
            }
          }
        } catch (geoJsonError) {
          console.error(`Error adding ${typeName} GeoJSON to Data Layer:`, geoJsonError);
        }
      }
      
    } catch (err) {
      console.error(`Error loading ${typeName} data:`, err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Pasar Awam data
  const loadPasarAwamData = async (map: any, dataLayer: any) => {
    return loadPasarData(
      map,
      dataLayer,
      'http://localhost:3001/api/pasar_awam',
      'pasar_awam',
      setPasarAwamData,
      pasarAwamMarkersRef,
      pasarAwamData
    );
  };

  // Function to load and plot Pasar Malam data
  const loadPasarMalamData = async (map: any, dataLayer: any) => {
    return loadPasarData(
      map,
      dataLayer,
      'http://localhost:3001/api/pasar_malam',
      'pasar_malam',
      setPasarMalamData,
      pasarMalamMarkersRef,
      pasarMalamData
    );
  };

  // Function to load and plot Pasar Sari data
  const loadPasarSariData = async (map: any, dataLayer: any) => {
    return loadPasarData(
      map,
      dataLayer,
      'http://localhost:3001/api/pasar_sari',
      'pasar_sari',
      setPasarSariData,
      pasarSariMarkersRef,
      pasarSariData
    );
  };

  // Function to load and plot Pasar Tani data
  const loadPasarTaniData = async (map: any, dataLayer: any) => {
    return loadPasarData(
      map,
      dataLayer,
      'http://localhost:3001/api/pasar_tani',
      'pasar_tani',
      setPasarTaniData,
      pasarTaniMarkersRef,
      pasarTaniData
    );
  };

  // Function to load and plot Road Marking Linear data
  const loadRoadMarkingLinearData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('road_marking_linear') : 'http://localhost:3001/api/road_marking_linear';
      console.log('Fetching road_marking_linear data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const roadMarkingLinears = data.road_marking_linear || [];
      
      console.log(`Loaded ${roadMarkingLinears.length} road_marking_linear records`);
      setRoadMarkingLinearData(roadMarkingLinears);
      
      if (roadMarkingLinears.length === 0) {
        console.warn('No road_marking_linear data found');
        return;
      }
      
      // Clear existing road_marking_linear markers
      roadMarkingLinearMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      roadMarkingLinearMarkersRef.current = [];
      
      // Clear existing road_marking_linear features from data layer
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'road_marking_linear') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all road_marking_linear features
      const allFeatures: any[] = [];
      
      // Process each road_marking_linear record
      let markersCreated = 0;
      roadMarkingLinears.forEach((roadMarkingLinear: RoadMarkingLinear, index: number) => {
        try {
          // Convert latitude and longitude to numbers, handling string values
          const lat = typeof roadMarkingLinear.latitude_s === 'string' 
            ? parseFloat(roadMarkingLinear.latitude_s) 
            : (typeof roadMarkingLinear.latitude_s === 'number' ? roadMarkingLinear.latitude_s : null);
          const lng = typeof roadMarkingLinear.longitude_s === 'string' 
            ? parseFloat(roadMarkingLinear.longitude_s) 
            : (typeof roadMarkingLinear.longitude_s === 'number' ? roadMarkingLinear.longitude_s : null);
          
          // Add marker at start point if available and valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for road_marking_linear ${roadMarkingLinear.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Road Marking Linear ${roadMarkingLinear.gid}`,
              icon: {
                url: '/icon/road-marking.png',
                scaledSize: new window.google.maps.Size(24, 24), // Size of the icon
                anchor: new window.google.maps.Point(12, 12), // Center of the icon
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Road Marking Linear ${roadMarkingLinear.gid}</h3>
                  ${roadMarkingLinear.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${roadMarkingLinear.id}</p>` : ''}
                  ${Object.keys(roadMarkingLinear).filter(key => !['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key) && roadMarkingLinear[key] !== null && roadMarkingLinear[key] !== undefined).slice(0, 5).map(key => 
                    `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${roadMarkingLinear[key]}</p>`
                  ).join('')}
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Start:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            roadMarkingLinearMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Road Marking Linear ${roadMarkingLinear.gid} has invalid coordinates: lat=${roadMarkingLinear.latitude_s} (${typeof roadMarkingLinear.latitude_s}), lng=${roadMarkingLinear.longitude_s} (${typeof roadMarkingLinear.longitude_s})`);
          }
          
          // Add geometry if available (MULTILINESTRING for road_marking_linear)
          if (roadMarkingLinear.geom) {
            let geometry = roadMarkingLinear.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for road_marking_linear ${roadMarkingLinear.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'road_marking_linear',
                gid: roadMarkingLinear.gid,
                id: roadMarkingLinear.id,
                index: index,
                latitude_s: roadMarkingLinear.latitude_s,
                longitude_s: roadMarkingLinear.longitude_s,
                latitude_e: roadMarkingLinear.latitude_e,
                longitude_e: roadMarkingLinear.longitude_e,
                ...Object.keys(roadMarkingLinear).reduce((acc: any, key: string) => {
                  if (!['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key)) {
                    acc[key] = roadMarkingLinear[key];
                  }
                  return acc;
                }, {}),
              }
            });
          }
        } catch (err) {
          console.error(`Error processing road_marking_linear ${roadMarkingLinear.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} road_marking_linear markers out of ${roadMarkingLinears.length} road_marking_linear records`);
      
      // Fit map bounds to show all road_marking_linear markers if we have any
      if (roadMarkingLinearMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        roadMarkingLinearMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show road_marking_linear markers');
          map.fitBounds(bounds);
        }
      }
      
      // Add road_marking_linear features to Data Layer
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} road_marking_linear features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style road_marking_linear lines (MULTILINESTRING) - use orange color
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                if (props.type === 'road_marking_linear') {
                  return {
                    strokeColor: '#f97316', // orange-500
                    strokeWeight: 3,
                    strokeOpacity: 0.9,
                  };
                }
                return null;
              } catch (err) {
                console.error('Error styling road_marking_linear feature:', err);
                return null;
              }
            });
            
            // Add click event listener for road_marking_linear info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'road_marking_linear') {
                  const roadMarkingLinear = roadMarkingLinears.find((r: RoadMarkingLinear) => r.gid === props.gid);
                  if (roadMarkingLinear) {
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: `
                        <div style="padding: 8px; min-width: 200px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Road Marking Linear ${roadMarkingLinear.gid}</h3>
                          ${roadMarkingLinear.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${roadMarkingLinear.id}</p>` : ''}
                          ${Object.keys(roadMarkingLinear).filter(key => !['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key) && roadMarkingLinear[key] !== null && roadMarkingLinear[key] !== undefined).slice(0, 5).map(key => 
                            `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${roadMarkingLinear[key]}</p>`
                          ).join('')}
                          <p style="margin: 4px 0; font-size: 12px; color: #666;">
                            <strong>Start:</strong> ${props.latitude_s?.toFixed(6) || 'N/A'}, ${props.longitude_s?.toFixed(6) || 'N/A'}
                          </p>
                        </div>
                      `,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error('Error showing road_marking_linear info window:', err);
              }
            });
          }
        } catch (err) {
          console.error('Error adding road_marking_linear GeoJSON to map:', err);
        }
      }
      
    } catch (err) {
      console.error('Error loading road_marking_linear data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Road Median data
  const loadRoadMedianData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('road_median') : 'http://localhost:3001/api/road_median';
      console.log('Fetching road_median data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const roadMedians = data.road_median || [];
      
      console.log(`Loaded ${roadMedians.length} road_median records`);
      setRoadMedianData(roadMedians);
      
      if (roadMedians.length === 0) {
        console.warn('No road_median data found');
        return;
      }
      
      // Clear existing road_median markers
      roadMedianMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      roadMedianMarkersRef.current = [];
      
      // Clear existing road_median features from data layer
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'road_median') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all road_median features
      const allFeatures: any[] = [];
      
      // Process each road_median record
      let markersCreated = 0;
      roadMedians.forEach((roadMedian: RoadMedian, index: number) => {
        try {
          // Convert latitude and longitude to numbers, handling string values
          const lat = typeof roadMedian.latitude_s === 'string' 
            ? parseFloat(roadMedian.latitude_s) 
            : (typeof roadMedian.latitude_s === 'number' ? roadMedian.latitude_s : null);
          const lng = typeof roadMedian.longitude_s === 'string' 
            ? parseFloat(roadMedian.longitude_s) 
            : (typeof roadMedian.longitude_s === 'number' ? roadMedian.longitude_s : null);
          
          // Add marker at start point if available and valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for road_median ${roadMedian.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Road Median ${roadMedian.gid}`,
              icon: {
                url: '/icon/roadmedian.webp',
                scaledSize: new window.google.maps.Size(24, 24), // Size of the icon
                anchor: new window.google.maps.Point(12, 12), // Center of the icon
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Road Median ${roadMedian.gid}</h3>
                  ${roadMedian.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${roadMedian.id}</p>` : ''}
                  ${Object.keys(roadMedian).filter(key => !['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key) && roadMedian[key] !== null && roadMedian[key] !== undefined).slice(0, 5).map(key => 
                    `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${roadMedian[key]}</p>`
                  ).join('')}
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Start:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            roadMedianMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Road Median ${roadMedian.gid} has invalid coordinates: lat=${roadMedian.latitude_s} (${typeof roadMedian.latitude_s}), lng=${roadMedian.longitude_s} (${typeof roadMedian.longitude_s})`);
          }
          
          // Add geometry if available (MULTILINESTRING for road_median)
          if (roadMedian.geom) {
            let geometry = roadMedian.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for road_median ${roadMedian.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'road_median',
                gid: roadMedian.gid,
                id: roadMedian.id,
                index: index,
                latitude_s: roadMedian.latitude_s,
                longitude_s: roadMedian.longitude_s,
                latitude_e: roadMedian.latitude_e,
                longitude_e: roadMedian.longitude_e,
                ...Object.keys(roadMedian).reduce((acc: any, key: string) => {
                  if (!['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key)) {
                    acc[key] = roadMedian[key];
                  }
                  return acc;
                }, {}),
              }
            });
          }
        } catch (err) {
          console.error(`Error processing road_median ${roadMedian.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} road_median markers out of ${roadMedians.length} road_median records`);
      
      // Fit map bounds to show all road_median markers if we have any
      if (roadMedianMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        roadMedianMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show road_median markers');
          map.fitBounds(bounds);
        }
      }
      
      // Add road_median features to Data Layer
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} road_median features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style road_median lines (MULTILINESTRING) - use teal color
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                if (props.type === 'road_median') {
                  return {
                    strokeColor: '#14b8a6', // teal-500
                    strokeWeight: 3,
                    strokeOpacity: 0.9,
                  };
                }
                return null;
              } catch (err) {
                console.error('Error styling road_median feature:', err);
                return null;
              }
            });
            
            // Add click event listener for road_median info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'road_median') {
                  const roadMedian = roadMedians.find((r: RoadMedian) => r.gid === props.gid);
                  if (roadMedian) {
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: `
                        <div style="padding: 8px; min-width: 200px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Road Median ${roadMedian.gid}</h3>
                          ${roadMedian.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${roadMedian.id}</p>` : ''}
                          ${Object.keys(roadMedian).filter(key => !['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key) && roadMedian[key] !== null && roadMedian[key] !== undefined).slice(0, 5).map(key => 
                            `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${roadMedian[key]}</p>`
                          ).join('')}
                          <p style="margin: 4px 0; font-size: 12px; color: #666;">
                            <strong>Start:</strong> ${props.latitude_s?.toFixed(6) || 'N/A'}, ${props.longitude_s?.toFixed(6) || 'N/A'}
                          </p>
                        </div>
                      `,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error('Error showing road_median info window:', err);
              }
            });
          }
        } catch (err) {
          console.error('Error adding road_median GeoJSON to map:', err);
        }
      }
      
    } catch (err) {
      console.error('Error loading road_median data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Road Shoulder data
  const loadRoadShoulderData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('road_shoulder') : 'http://localhost:3001/api/road_shoulder';
      console.log('Fetching road_shoulder data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const roadShoulders = data.road_shoulder || [];
      
      console.log(`Loaded ${roadShoulders.length} road_shoulder records`);
      setRoadShoulderData(roadShoulders);
      
      if (roadShoulders.length === 0) {
        console.warn('No road_shoulder data found');
        return;
      }
      
      // Clear existing road_shoulder markers
      roadShoulderMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      roadShoulderMarkersRef.current = [];
      
      // Clear existing road_shoulder features from data layer
      const featuresToRemove: any[] = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'road_shoulder') {
          featuresToRemove.push(feature);
        }
      });
      featuresToRemove.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all road_shoulder features
      const allFeatures: any[] = [];
      
      // Process each road_shoulder record
      let markersCreated = 0;
      roadShoulders.forEach((roadShoulder: RoadShoulder, index: number) => {
        try {
          // Convert latitude and longitude to numbers, handling string values
          const lat = typeof roadShoulder.latitude_s === 'string' 
            ? parseFloat(roadShoulder.latitude_s) 
            : (typeof roadShoulder.latitude_s === 'number' ? roadShoulder.latitude_s : null);
          const lng = typeof roadShoulder.longitude_s === 'string' 
            ? parseFloat(roadShoulder.longitude_s) 
            : (typeof roadShoulder.longitude_s === 'number' ? roadShoulder.longitude_s : null);
          
          // Add marker at start point if available and valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for road_shoulder ${roadShoulder.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Road Shoulder ${roadShoulder.gid}`,
              icon: {
                url: '/icon/roadshoulder.png',
                scaledSize: new window.google.maps.Size(24, 24), // Size of the icon
                anchor: new window.google.maps.Point(12, 12), // Center of the icon
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Road Shoulder ${roadShoulder.gid}</h3>
                  ${roadShoulder.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${roadShoulder.id}</p>` : ''}
                  ${Object.keys(roadShoulder).filter(key => !['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key) && roadShoulder[key] !== null && roadShoulder[key] !== undefined).slice(0, 5).map(key => 
                    `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${roadShoulder[key]}</p>`
                  ).join('')}
                  <p style="margin: 4px 0; font-size: 12px; color: #666;">
                    <strong>Start:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                  </p>
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            roadShoulderMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            console.warn(`Road Shoulder ${roadShoulder.gid} has invalid coordinates: lat=${roadShoulder.latitude_s} (${typeof roadShoulder.latitude_s}), lng=${roadShoulder.longitude_s} (${typeof roadShoulder.longitude_s})`);
          }
          
          // Add geometry if available (MULTILINESTRING for road_shoulder)
          if (roadShoulder.geom) {
            let geometry = roadShoulder.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for road_shoulder ${roadShoulder.gid}:`, e);
                return;
              }
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'road_shoulder',
                gid: roadShoulder.gid,
                id: roadShoulder.id,
                index: index,
                latitude_s: roadShoulder.latitude_s,
                longitude_s: roadShoulder.longitude_s,
                latitude_e: roadShoulder.latitude_e,
                longitude_e: roadShoulder.longitude_e,
                ...Object.keys(roadShoulder).reduce((acc: any, key: string) => {
                  if (!['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key)) {
                    acc[key] = roadShoulder[key];
                  }
                  return acc;
                }, {}),
              }
            });
          }
        } catch (err) {
          console.error(`Error processing road_shoulder ${roadShoulder.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} road_shoulder markers out of ${roadShoulders.length} road_shoulder records`);
      
      // Fit map bounds to show all road_shoulder markers if we have any
      if (roadShoulderMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        roadShoulderMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show road_shoulder markers');
          map.fitBounds(bounds);
        }
      }
      
      // Add road_shoulder features to Data Layer
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} road_shoulder features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style road_shoulder lines (MULTILINESTRING) - use slate color
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                if (props.type === 'road_shoulder') {
                  return {
                    strokeColor: '#64748b', // slate-500
                    strokeWeight: 3,
                    strokeOpacity: 0.9,
                  };
                }
                return null;
              } catch (err) {
                console.error('Error styling road_shoulder feature:', err);
                return null;
              }
            });
            
            // Add click event listener for road_shoulder info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'road_shoulder') {
                  const roadShoulder = roadShoulders.find((r: RoadShoulder) => r.gid === props.gid);
                  if (roadShoulder) {
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: `
                        <div style="padding: 8px; min-width: 200px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Road Shoulder ${roadShoulder.gid}</h3>
                          ${roadShoulder.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${roadShoulder.id}</p>` : ''}
                          ${Object.keys(roadShoulder).filter(key => !['gid', 'id', 'latitude_s', 'longitude_s', 'latitude_e', 'longitude_e', 'geom', 'geom_geojson'].includes(key) && roadShoulder[key] !== null && roadShoulder[key] !== undefined).slice(0, 5).map(key => 
                            `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${roadShoulder[key]}</p>`
                          ).join('')}
                          <p style="margin: 4px 0; font-size: 12px; color: #666;">
                            <strong>Start:</strong> ${props.latitude_s?.toFixed(6) || 'N/A'}, ${props.longitude_s?.toFixed(6) || 'N/A'}
                          </p>
                        </div>
                      `,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error('Error showing road_shoulder info window:', err);
              }
            });
          }
        } catch (err) {
          console.error('Error adding road_shoulder GeoJSON to map:', err);
        }
      }
      
    } catch (err) {
      console.error('Error loading road_shoulder data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Sempadan Daerah data
  const loadSempadanDaerahData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('sempadan_daerah') : 'http://localhost:3001/api/sempadan_daerah';
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const sempadanDaerahs = data.sempadan_daerah || [];
      setSempadanDaerahData(sempadanDaerahs);

      sempadanDaerahMarkersRef.current.forEach((marker: any) => { if (marker.setMap) marker.setMap(null); });
      sempadanDaerahMarkersRef.current = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'sempadan_daerah') dataLayer.remove(feature);
      });

      const allFeatures: any[] = [];
      let markersCreated = 0;
      sempadanDaerahs.forEach((sempadanDaerah: SempadanDaerah, index: number) => {
        let lat: number | null = null;
        let lng: number | null = null;
        if (sempadanDaerah.latitude !== undefined && sempadanDaerah.longitude !== undefined) {
          lat = typeof sempadanDaerah.latitude === 'string' ? parseFloat(sempadanDaerah.latitude) : (typeof sempadanDaerah.latitude === 'number' ? sempadanDaerah.latitude : null);
          lng = typeof sempadanDaerah.longitude === 'string' ? parseFloat(sempadanDaerah.longitude) : (typeof sempadanDaerah.longitude === 'number' ? sempadanDaerah.longitude : null);
        } else if (sempadanDaerah.geom && sempadanDaerah.geom.type === 'MultiPolygon' && sempadanDaerah.geom.coordinates && sempadanDaerah.geom.coordinates.length > 0) {
          const firstPolygon = sempadanDaerah.geom.coordinates[0];
          if (firstPolygon && firstPolygon.length > 0 && firstPolygon[0] && firstPolygon[0].length > 0) {
            lng = firstPolygon[0][0][0];
            lat = firstPolygon[0][0][1];
          }
        }

        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map,
            title: `Sempadan Daerah ${sempadanDaerah.gid}`,
            icon: { url: '/icon/daerah.png', scaledSize: new window.google.maps.Size(24, 24), anchor: new window.google.maps.Point(12, 12), },
          });
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="padding: 8px;"><h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Sempadan Daerah ${sempadanDaerah.gid}</h3>${sempadanDaerah.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${sempadanDaerah.id}</p>` : ''}${Object.keys(sempadanDaerah).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && sempadanDaerah[key] !== null && sempadanDaerah[key] !== undefined).slice(0, 5).map(key => `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${sempadanDaerah[key]}</p>`).join('')}<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Center:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p></div>`,
          });
          marker.addListener('click', () => { infoWindow.open(map, marker); });
          sempadanDaerahMarkersRef.current.push(marker);
          markersCreated++;
        }

        if (sempadanDaerah.geom) {
          let geometry = sempadanDaerah.geom;
          if (typeof geometry === 'string') geometry = JSON.parse(geometry);
          allFeatures.push({ type: 'Feature', geometry: geometry, properties: { type: 'sempadan_daerah', gid: sempadanDaerah.gid, id: sempadanDaerah.id, index: index, latitude: sempadanDaerah.latitude, longitude: sempadanDaerah.longitude, ...Object.keys(sempadanDaerah).reduce((acc: any, key: string) => { if (!['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key)) { acc[key] = sempadanDaerah[key]; } return acc; }, {}), } });
        }
      });

      if (allFeatures.length > 0) {
        const featureCollection = { type: 'FeatureCollection', features: allFeatures };
        const addedFeatures = dataLayer.addGeoJson(featureCollection);
        if (addedFeatures && addedFeatures.length > 0) {
          dataLayer.setStyle((feature: any) => {
            const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
            if (props.type === 'sempadan_daerah') { return { fillColor: '#3b82f6', fillOpacity: 0.3, strokeColor: '#60a5fa', strokeWeight: 2, strokeOpacity: 0.9, }; }
            return null;
          });
          dataLayer.addListener('click', (event: any) => {
            const feature = event.feature;
            const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
            if (props.type === 'sempadan_daerah') {
              const sempadanDaerah = sempadanDaerahs.find((s: SempadanDaerah) => s.gid === props.gid);
              if (sempadanDaerah) {
                const infoWindow = new window.google.maps.InfoWindow({
                  content: `<div style="padding: 8px; min-width: 200px;"><h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Sempadan Daerah ${sempadanDaerah.gid}</h3>${sempadanDaerah.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${sempadanDaerah.id}</p>` : ''}${Object.keys(sempadanDaerah).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && sempadanDaerah[key] !== null && sempadanDaerah[key] !== undefined).slice(0, 5).map(key => `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${sempadanDaerah[key]}</p>`).join('')}${sempadanDaerah.latitude && sempadanDaerah.longitude ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Center:</strong> ${sempadanDaerah.latitude.toFixed(6)}, ${sempadanDaerah.longitude.toFixed(6)}</p>` : ''}</div>`,
                });
                infoWindow.setPosition(event.latLng);
                infoWindow.open(map);
              }
            }
          });
        }
      }
    } catch (err) {
      console.error('Error loading sempadan_daerah data:', err);
    }
  };

  // Function to load and plot Sampah Haram data
  const loadSampahHaramData = async (map: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('sampah_haram') : 'http://localhost:3001/api/sampah_haram';
      console.log('Fetching sampah_haram data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const sampahHarams = data.sampah_haram || [];
      
      console.log(`Loaded ${sampahHarams.length} sampah_haram records`);
      setSampahHaramData(sampahHarams);
      
      if (sampahHarams.length === 0) {
        console.warn('No sampah_haram data found');
        return;
      }
      
      // Clear existing sampah_haram markers
      sampahHaramMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      sampahHaramMarkersRef.current = [];
      
      // Process each sampah_haram record
      let markersCreated = 0;
      sampahHarams.forEach((sampahHaram: SampahHaram, index: number) => {
        try {
          // Get latitude and longitude from API response
          // Priority: latitude/longitude fields > geom extraction
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (sampahHaram.latitude !== undefined && sampahHaram.longitude !== undefined) {
            lat = typeof sampahHaram.latitude === 'string' 
              ? parseFloat(sampahHaram.latitude) 
              : (typeof sampahHaram.latitude === 'number' ? sampahHaram.latitude : null);
            lng = typeof sampahHaram.longitude === 'string' 
              ? parseFloat(sampahHaram.longitude) 
              : (typeof sampahHaram.longitude === 'number' ? sampahHaram.longitude : null);
          } else if (sampahHaram.geom && sampahHaram.geom.type === 'Point' && sampahHaram.geom.coordinates) {
            // Extract from GeoJSON Point geometry [longitude, latitude]
            lng = sampahHaram.geom.coordinates[0];
            lat = sampahHaram.geom.coordinates[1];
          }
          
          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for sampah_haram ${sampahHaram.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Sampah Haram ${sampahHaram.gid}`,
              icon: {
                url: '/icon/illegaldumping.jpeg',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            // Build info window content with available fields
            const infoContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Sampah Haram ${sampahHaram.gid}</h3>
                ${sampahHaram.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${sampahHaram.id}</p>` : ''}
                ${Object.keys(sampahHaram).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && sampahHaram[key] !== null && sampahHaram[key] !== undefined).slice(0, 5).map(key => 
                  `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${sampahHaram[key]}</p>`
                ).join('')}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            sampahHaramMarkersRef.current.push(marker);
            markersCreated++;
          }
        } catch (err) {
          console.error(`Error processing sampah_haram ${sampahHaram.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} sampah_haram markers out of ${sampahHarams.length} sampah_haram records`);
      
      // Fit map bounds to show all markers if we have any
      if (sampahHaramMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        sampahHaramMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show sampah_haram markers');
          map.fitBounds(bounds);
        }
      }
      
    } catch (err) {
      console.error('Error loading sampah_haram data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Signboard data
  const loadSignboardData = async (map: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('signboard') : 'http://localhost:3001/api/signboard';
      console.log('Fetching signboard data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const signboards = data.signboard || [];
      
      console.log(`Loaded ${signboards.length} signboard records`);
      setSignboardData(signboards);
      
      if (signboards.length === 0) {
        console.warn('No signboard data found');
        return;
      }
      
      // Clear existing signboard markers
      signboardMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      signboardMarkersRef.current = [];
      
      // Process each signboard record
      let markersCreated = 0;
      signboards.forEach((signboard: Signboard, index: number) => {
        try {
          // Get latitude and longitude from API response
          // Priority: latitude/longitude fields > geom extraction
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (signboard.latitude !== undefined && signboard.longitude !== undefined) {
            lat = typeof signboard.latitude === 'string' 
              ? parseFloat(signboard.latitude) 
              : (typeof signboard.latitude === 'number' ? signboard.latitude : null);
            lng = typeof signboard.longitude === 'string' 
              ? parseFloat(signboard.longitude) 
              : (typeof signboard.longitude === 'number' ? signboard.longitude : null);
          } else if (signboard.geom && signboard.geom.type === 'Point' && signboard.geom.coordinates) {
            // Extract from GeoJSON Point geometry [longitude, latitude]
            lng = signboard.geom.coordinates[0];
            lat = signboard.geom.coordinates[1];
          }
          
          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for signboard ${signboard.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Signboard ${signboard.gid}`,
              icon: {
                url: '/icon/signboard.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            // Build info window content with available fields
            const infoContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Signboard ${signboard.gid}</h3>
                ${signboard.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${signboard.id}</p>` : ''}
                ${Object.keys(signboard).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && signboard[key] !== null && signboard[key] !== undefined).slice(0, 5).map(key => 
                  `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${signboard[key]}</p>`
                ).join('')}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            signboardMarkersRef.current.push(marker);
            markersCreated++;
          }
        } catch (err) {
          console.error(`Error processing signboard ${signboard.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} signboard markers out of ${signboards.length} signboard records`);
      
      // Fit map bounds to show all markers if we have any
      if (signboardMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        signboardMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show signboard markers');
          map.fitBounds(bounds);
        }
      }
      
    } catch (err) {
      console.error('Error loading signboard data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Sport Facility data
  const loadSportFacilityData = async (map: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('sport_facility') : 'http://localhost:3001/api/sport_facility';
      console.log('Fetching sport_facility data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const sportFacilities = data.sport_facility || [];
      
      console.log(`Loaded ${sportFacilities.length} sport_facility records`);
      setSportFacilityData(sportFacilities);
      
      if (sportFacilities.length === 0) {
        console.warn('No sport_facility data found');
        return;
      }
      
      // Clear existing sport_facility markers
      sportFacilityMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      sportFacilityMarkersRef.current = [];
      
      // Process each sport_facility record
      let markersCreated = 0;
      sportFacilities.forEach((sportFacility: SportFacility, index: number) => {
        try {
          // Get latitude and longitude from API response
          // Priority: latitude/longitude fields > geom extraction
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (sportFacility.latitude !== undefined && sportFacility.longitude !== undefined) {
            lat = typeof sportFacility.latitude === 'string' 
              ? parseFloat(sportFacility.latitude) 
              : (typeof sportFacility.latitude === 'number' ? sportFacility.latitude : null);
            lng = typeof sportFacility.longitude === 'string' 
              ? parseFloat(sportFacility.longitude) 
              : (typeof sportFacility.longitude === 'number' ? sportFacility.longitude : null);
          } else if (sportFacility.geom && sportFacility.geom.type === 'Point' && sportFacility.geom.coordinates) {
            // Extract from GeoJSON Point geometry [longitude, latitude]
            lng = sportFacility.geom.coordinates[0];
            lat = sportFacility.geom.coordinates[1];
          }
          
          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for sport_facility ${sportFacility.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Sport Facility ${sportFacility.gid}`,
              icon: {
                url: '/icon/sport.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            // Build info window content with available fields
            const infoContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Sport Facility ${sportFacility.gid}</h3>
                ${sportFacility.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${sportFacility.id}</p>` : ''}
                ${Object.keys(sportFacility).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && sportFacility[key] !== null && sportFacility[key] !== undefined).slice(0, 5).map(key => 
                  `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${sportFacility[key]}</p>`
                ).join('')}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            sportFacilityMarkersRef.current.push(marker);
            markersCreated++;
          }
        } catch (err) {
          console.error(`Error processing sport_facility ${sportFacility.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} sport_facility markers out of ${sportFacilities.length} sport_facility records`);
      
      // Fit map bounds to show all markers if we have any
      if (sportFacilityMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        sportFacilityMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show sport_facility markers');
          map.fitBounds(bounds);
        }
      }
      
    } catch (err) {
      console.error('Error loading sport_facility data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Street Lighting data
  const loadStreetLightingData = async (map: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('street_lighting') : 'http://localhost:3001/api/street_lighting';
      console.log('Fetching street_lighting data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const streetLightings = data.street_lighting || [];
      
      console.log(`Loaded ${streetLightings.length} street_lighting records`);
      setStreetLightingData(streetLightings);
      
      if (streetLightings.length === 0) {
        console.warn('No street_lighting data found');
        return;
      }
      
      // Clear existing street_lighting markers
      streetLightingMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      streetLightingMarkersRef.current = [];
      
      // Process each street_lighting record
      let markersCreated = 0;
      streetLightings.forEach((streetLighting: StreetLighting, index: number) => {
        try {
          // Get latitude and longitude from API response
          // Priority: latitude/longitude fields > geom extraction
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (streetLighting.latitude !== undefined && streetLighting.longitude !== undefined) {
            lat = typeof streetLighting.latitude === 'string' 
              ? parseFloat(streetLighting.latitude) 
              : (typeof streetLighting.latitude === 'number' ? streetLighting.latitude : null);
            lng = typeof streetLighting.longitude === 'string' 
              ? parseFloat(streetLighting.longitude) 
              : (typeof streetLighting.longitude === 'number' ? streetLighting.longitude : null);
          } else if (streetLighting.geom && streetLighting.geom.type === 'Point' && streetLighting.geom.coordinates) {
            // Extract from GeoJSON Point geometry [longitude, latitude]
            lng = streetLighting.geom.coordinates[0];
            lat = streetLighting.geom.coordinates[1];
          }
          
          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for street_lighting ${streetLighting.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Street Lighting ${streetLighting.gid}`,
              icon: {
                url: '/icon/street-light-mps.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            // Build info window content with available fields
            const infoContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Street Lighting ${streetLighting.gid}</h3>
                ${streetLighting.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${streetLighting.id}</p>` : ''}
                ${Object.keys(streetLighting).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && streetLighting[key] !== null && streetLighting[key] !== undefined).slice(0, 5).map(key => 
                  `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${streetLighting[key]}</p>`
                ).join('')}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            streetLightingMarkersRef.current.push(marker);
            markersCreated++;
          }
        } catch (err) {
          console.error(`Error processing street_lighting ${streetLighting.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} street_lighting markers out of ${streetLightings.length} street_lighting records`);
      
      // Fit map bounds to show all markers if we have any
      if (streetLightingMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        streetLightingMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show street_lighting markers');
          map.fitBounds(bounds);
        }
      }
      
    } catch (err) {
      console.error('Error loading street_lighting data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Loranet Streetlight data
  const loadLoranetStreetlightData = async (map: any) => {
    try {
      const loranetApiUrl = '/api/loranet/streetlight';
      console.log('Fetching Loranet streetlight data from API...', loranetApiUrl);
      const response = await fetch(loranetApiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        console.warn('Loranet streetlight API returned success: false', data.message || data.error);
        return;
      }
      const streetlights = data.data || [];
      
      console.log(`Loaded ${streetlights.length} Loranet streetlight records`);
      
      // Log first few records for debugging coordinate format
      if (streetlights.length > 0) {
        console.log('Sample Loranet streetlight data:', JSON.stringify(streetlights.slice(0, 3), null, 2));
      }
      
      setLoranetStreetlightData(streetlights);
      
      if (streetlights.length === 0) {
        console.warn('No Loranet streetlight data found');
        return;
      }
      
      // Clear existing Loranet streetlight markers
      loranetStreetlightMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      loranetStreetlightMarkersRef.current = [];
      
      // Process each Loranet streetlight record
      let markersCreated = 0;
      streetlights.forEach((streetlight: LoranetStreetlight, index: number) => {
        try {
          // Use GeoJSON method to extract coordinates (same as other layers)
          // Priority: geom (GeoJSON) > latitude/longitude fields
          let lat: number | null = null;
          let lng: number | null = null;
          
          // First, try to extract from GeoJSON geometry (most accurate)
          // Check both geom and geom_geojson fields
          let geometry = streetlight.geom || streetlight.geom_geojson;
          
          if (geometry) {
            // Parse if it's a string
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for ${streetlight.device_id}:`, e);
              }
            }
            
            // Extract coordinates from GeoJSON Point geometry
            // GeoJSON format: [longitude, latitude] for Point coordinates
            if (geometry && geometry.type === 'Point' && geometry.coordinates && Array.isArray(geometry.coordinates)) {
              // GeoJSON coordinates are [longitude, latitude]
              lng = geometry.coordinates[0];
              lat = geometry.coordinates[1];
            } else if (geometry && geometry.type === 'Feature' && geometry.geometry) {
              // Handle Feature type GeoJSON
              if (geometry.geometry.type === 'Point' && geometry.geometry.coordinates) {
                lng = geometry.geometry.coordinates[0];
                lat = geometry.geometry.coordinates[1];
              }
            }
          }
          
          // Fallback to latitude/longitude fields if GeoJSON not available
          if (lat === null || lng === null) {
            if (streetlight.latitude !== undefined && streetlight.longitude !== undefined) {
              lat = typeof streetlight.latitude === 'string' 
                ? parseFloat(streetlight.latitude) 
                : (typeof streetlight.latitude === 'number' ? streetlight.latitude : null);
              lng = typeof streetlight.longitude === 'string' 
                ? parseFloat(streetlight.longitude) 
                : (typeof streetlight.longitude === 'number' ? streetlight.longitude : null);
            }
          }
          
          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for Loranet streetlight ${streetlight.device_id} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: streetlight.device_name || streetlight.device_id || 'Loranet Streetlight',
              icon: {
                url: '/icon/loranetstreetlight.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            // Build info window content
            const infoContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${streetlight.device_name || streetlight.device_id || 'Loranet Streetlight'}</h3>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Device ID:</strong> ${streetlight.device_id || 'N/A'}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${streetlight.device_status || 'N/A'}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Power:</strong> ${String(streetlight.status_power) === '1' ? 'ON' : String(streetlight.status_power) === '0' ? 'OFF' : (streetlight.status_power ?? 'N/A')}</p>
                ${streetlight.dim_value !== undefined && streetlight.dim_value !== null ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Brightness:</strong> ${streetlight.dim_value}${typeof streetlight.dim_value === 'number' ? '%' : ''}</p>` : ''}
                ${streetlight.light_type ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Type:</strong> ${streetlight.light_type}</p>` : ''}
                ${streetlight.brand ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Brand:</strong> ${streetlight.brand}</p>` : ''}
                ${streetlight.model ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Model:</strong> ${streetlight.model}</p>` : ''}
                ${streetlight.power_source ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Power Source:</strong> ${streetlight.power_source}</p>` : ''}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            loranetStreetlightMarkersRef.current.push(marker);
            markersCreated++;
          } else {
            // Log detailed coordinate information for debugging
            console.warn(`Loranet streetlight ${streetlight.device_id} has invalid coordinates:`, {
              device_id: streetlight.device_id,
              device_name: streetlight.device_name,
              has_geom: !!streetlight.geom,
              geom_type: streetlight.geom?.type,
              raw_latitude: streetlight.latitude,
              raw_longitude: streetlight.longitude,
              parsed_lat: lat,
              parsed_lng: lng,
              allFields: Object.keys(streetlight)
            });
          }
        } catch (err) {
          console.error(`Error processing Loranet streetlight ${streetlight.device_id}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} Loranet streetlight markers out of ${streetlights.length} records`);
      
      // Don't auto-fit bounds - keep view on Sepang area
      // Map view will remain unchanged when markers are loaded
      if (loranetStreetlightMarkersRef.current.length > 0) {
        console.log(`Loranet streetlight markers loaded. Map view remains on Sepang area.`);
        // Map view stays unchanged - user can manually zoom/pan to see markers
      }
      
    } catch (err) {
      console.error('Error loading Loranet streetlight data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Taman Perumahan data
  const loadTamanPerumahanData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('taman_perumahan') : 'http://localhost:3001/api/taman_perumahan';
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const tamanPerumahans = data.taman_perumahan || [];
      setTamanPerumahanData(tamanPerumahans);

      tamanPerumahanMarkersRef.current.forEach((marker: any) => { if (marker.setMap) marker.setMap(null); });
      tamanPerumahanMarkersRef.current = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'taman_perumahan') dataLayer.remove(feature);
      });

      const allFeatures: any[] = [];
      let markersCreated = 0;
      tamanPerumahans.forEach((tamanPerumahan: TamanPerumahan, index: number) => {
        let lat: number | null = null;
        let lng: number | null = null;
        if (tamanPerumahan.latitude !== undefined && tamanPerumahan.longitude !== undefined) {
          lat = typeof tamanPerumahan.latitude === 'string' ? parseFloat(tamanPerumahan.latitude) : (typeof tamanPerumahan.latitude === 'number' ? tamanPerumahan.latitude : null);
          lng = typeof tamanPerumahan.longitude === 'string' ? parseFloat(tamanPerumahan.longitude) : (typeof tamanPerumahan.longitude === 'number' ? tamanPerumahan.longitude : null);
        } else if (tamanPerumahan.geom && tamanPerumahan.geom.type === 'MultiPolygon' && tamanPerumahan.geom.coordinates && tamanPerumahan.geom.coordinates.length > 0) {
          const firstPolygon = tamanPerumahan.geom.coordinates[0];
          if (firstPolygon && firstPolygon.length > 0 && firstPolygon[0] && firstPolygon[0].length > 0) {
            lng = firstPolygon[0][0][0];
            lat = firstPolygon[0][0][1];
          }
        }

        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map,
            title: `Taman Perumahan ${tamanPerumahan.gid}`,
            icon: { url: '/icon/tamanperumahan.png', scaledSize: new window.google.maps.Size(24, 24), anchor: new window.google.maps.Point(12, 12), },
          });
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="padding: 8px;"><h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Taman Perumahan ${tamanPerumahan.gid}</h3>${tamanPerumahan.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${tamanPerumahan.id}</p>` : ''}${Object.keys(tamanPerumahan).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && tamanPerumahan[key] !== null && tamanPerumahan[key] !== undefined).slice(0, 5).map(key => `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${tamanPerumahan[key]}</p>`).join('')}<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Center:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p></div>`,
          });
          marker.addListener('click', () => { infoWindow.open(map, marker); });
          tamanPerumahanMarkersRef.current.push(marker);
          markersCreated++;
        }

        if (tamanPerumahan.geom) {
          let geometry = tamanPerumahan.geom;
          if (typeof geometry === 'string') geometry = JSON.parse(geometry);
          allFeatures.push({ type: 'Feature', geometry: geometry, properties: { type: 'taman_perumahan', gid: tamanPerumahan.gid, id: tamanPerumahan.id, index: index, latitude: tamanPerumahan.latitude, longitude: tamanPerumahan.longitude, ...Object.keys(tamanPerumahan).reduce((acc: any, key: string) => { if (!['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key)) { acc[key] = tamanPerumahan[key]; } return acc; }, {}), } });
        }
      });

      if (allFeatures.length > 0) {
        const featureCollection = { type: 'FeatureCollection', features: allFeatures };
        const addedFeatures = dataLayer.addGeoJson(featureCollection);
        if (addedFeatures && addedFeatures.length > 0) {
          dataLayer.setStyle((feature: any) => {
            const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
            if (props.type === 'taman_perumahan') { return { fillColor: '#10b981', fillOpacity: 0.3, strokeColor: '#059669', strokeWeight: 2, strokeOpacity: 0.8, }; }
            return null;
          });
          dataLayer.addListener('click', (event: any) => {
            const feature = event.feature;
            const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
            if (props.type === 'taman_perumahan') {
              const tamanPerumahan = tamanPerumahans.find((t: TamanPerumahan) => t.gid === props.gid);
              if (tamanPerumahan) {
                const infoWindow = new window.google.maps.InfoWindow({
                  content: `<div style="padding: 8px; min-width: 200px;"><h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Taman Perumahan ${tamanPerumahan.gid}</h3>${tamanPerumahan.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${tamanPerumahan.id}</p>` : ''}${Object.keys(tamanPerumahan).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && tamanPerumahan[key] !== null && tamanPerumahan[key] !== undefined).slice(0, 5).map(key => `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${tamanPerumahan[key]}</p>`).join('')}${tamanPerumahan.latitude && tamanPerumahan.longitude ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Center:</strong> ${tamanPerumahan.latitude.toFixed(6)}, ${tamanPerumahan.longitude.toFixed(6)}</p>` : ''}</div>`,
                });
                infoWindow.setPosition(event.latLng);
                infoWindow.open(map);
              }
            }
          });
        }
      }
    } catch (err) {
      console.error('Error loading taman_perumahan data:', err);
    }
  };

  // Function to load and plot Traffic Light data
  const loadTrafficLightData = async (map: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('traffic_light') : 'http://localhost:3001/api/traffic-light';
      console.log('Fetching traffic_light data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const trafficLights = data.traffic_light || [];
      
      console.log(`Loaded ${trafficLights.length} traffic_light records`);
      setTrafficLightData(trafficLights);
      
      if (trafficLights.length === 0) {
        console.warn('No traffic_light data found');
        return;
      }
      
      // Clear existing traffic_light markers
      trafficLightMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      trafficLightMarkersRef.current = [];
      
      // Process each traffic_light record
      let markersCreated = 0;
      trafficLights.forEach((trafficLight: TrafficLight, index: number) => {
        try {
          // Get latitude and longitude from API response
          // Priority: latitude/longitude fields > geom extraction
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (trafficLight.latitude !== undefined && trafficLight.longitude !== undefined) {
            lat = typeof trafficLight.latitude === 'string' 
              ? parseFloat(trafficLight.latitude) 
              : (typeof trafficLight.latitude === 'number' ? trafficLight.latitude : null);
            lng = typeof trafficLight.longitude === 'string' 
              ? parseFloat(trafficLight.longitude) 
              : (typeof trafficLight.longitude === 'number' ? trafficLight.longitude : null);
          } else if (trafficLight.geom && trafficLight.geom.type === 'Point' && trafficLight.geom.coordinates) {
            // Extract from GeoJSON Point geometry [longitude, latitude]
            lng = trafficLight.geom.coordinates[0];
            lat = trafficLight.geom.coordinates[1];
          }
          
          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for traffic_light ${trafficLight.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Traffic Light ${trafficLight.gid}`,
              icon: {
                url: '/icon/traffic-light.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            // Build info window content with available fields
            const infoContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Traffic Light ${trafficLight.gid}</h3>
                ${trafficLight.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${trafficLight.id}</p>` : ''}
                ${Object.keys(trafficLight).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && trafficLight[key] !== null && trafficLight[key] !== undefined).slice(0, 5).map(key => 
                  `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${trafficLight[key]}</p>`
                ).join('')}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            trafficLightMarkersRef.current.push(marker);
            markersCreated++;
          }
        } catch (err) {
          console.error(`Error processing traffic_light ${trafficLight.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} traffic_light markers out of ${trafficLights.length} traffic_light records`);
      
      // Fit map bounds to show all markers if we have any
      if (trafficLightMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        trafficLightMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show traffic_light markers');
          map.fitBounds(bounds);
        }
      }
      
    } catch (err) {
      console.error('Error loading traffic_light data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Warta Kawasan Lapang data
  const loadWartaKawasanLapangData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('warta_kawasan_lapang') : 'http://localhost:3001/api/warta_kawasan_lapang';
      console.log('Fetching warta_kawasan_lapang data...', url);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const wartaKawasanLapangs = data.warta_kawasan_lapang || [];
      console.log(`Loaded ${wartaKawasanLapangs.length} warta_kawasan_lapang records`);
      setWartaKawasanLapangData(wartaKawasanLapangs);

      wartaKawasanLapangMarkersRef.current.forEach((marker: any) => { if (marker.setMap) marker.setMap(null); });
      wartaKawasanLapangMarkersRef.current = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'warta_kawasan_lapang') dataLayer.remove(feature);
      });

      const allFeatures: any[] = [];
      let markersCreated = 0;
      wartaKawasanLapangs.forEach((wartaKawasanLapang: WartaKawasanLapang, index: number) => {
        let lat: number | null = null;
        let lng: number | null = null;
        if (wartaKawasanLapang.latitude !== undefined && wartaKawasanLapang.longitude !== undefined) {
          lat = typeof wartaKawasanLapang.latitude === 'string' ? parseFloat(wartaKawasanLapang.latitude) : (typeof wartaKawasanLapang.latitude === 'number' ? wartaKawasanLapang.latitude : null);
          lng = typeof wartaKawasanLapang.longitude === 'string' ? parseFloat(wartaKawasanLapang.longitude) : (typeof wartaKawasanLapang.longitude === 'number' ? wartaKawasanLapang.longitude : null);
        } else if (wartaKawasanLapang.geom && wartaKawasanLapang.geom.type === 'MultiPolygon' && wartaKawasanLapang.geom.coordinates && wartaKawasanLapang.geom.coordinates.length > 0) {
          const firstPolygon = wartaKawasanLapang.geom.coordinates[0];
          if (firstPolygon && firstPolygon.length > 0 && firstPolygon[0] && firstPolygon[0].length > 0) {
            lng = firstPolygon[0][0][0];
            lat = firstPolygon[0][0][1];
          }
        }

        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map,
            title: `Warta Kawasan Lapang ${wartaKawasanLapang.gid}`,
            icon: { url: '/icon/land.png', scaledSize: new window.google.maps.Size(24, 24), anchor: new window.google.maps.Point(12, 12), },
          });
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="padding: 8px;"><h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Warta Kawasan Lapang ${wartaKawasanLapang.gid}</h3>${wartaKawasanLapang.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${wartaKawasanLapang.id}</p>` : ''}${Object.keys(wartaKawasanLapang).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && wartaKawasanLapang[key] !== null && wartaKawasanLapang[key] !== undefined).slice(0, 5).map(key => `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${wartaKawasanLapang[key]}</p>`).join('')}<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Center:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p></div>`,
          });
          marker.addListener('click', () => { infoWindow.open(map, marker); });
          wartaKawasanLapangMarkersRef.current.push(marker);
          markersCreated++;
        }

        if (wartaKawasanLapang.geom) {
          let geometry = wartaKawasanLapang.geom;
          if (typeof geometry === 'string') geometry = JSON.parse(geometry);
          allFeatures.push({ type: 'Feature', geometry: geometry, properties: { type: 'warta_kawasan_lapang', gid: wartaKawasanLapang.gid, id: wartaKawasanLapang.id, index: index, latitude: wartaKawasanLapang.latitude, longitude: wartaKawasanLapang.longitude, ...Object.keys(wartaKawasanLapang).reduce((acc: any, key: string) => { if (!['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key)) { acc[key] = wartaKawasanLapang[key]; } return acc; }, {}), } });
        }
      });

      if (allFeatures.length > 0) {
        const featureCollection = { type: 'FeatureCollection', features: allFeatures };
        const addedFeatures = dataLayer.addGeoJson(featureCollection);
        if (addedFeatures && addedFeatures.length > 0) {
          dataLayer.setStyle((feature: any) => {
            const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
            if (props.type === 'warta_kawasan_lapang') { return { fillColor: '#84cc16', fillOpacity: 0.3, strokeColor: '#65a30d', strokeWeight: 2, strokeOpacity: 0.8, }; }
            return null;
          });
          dataLayer.addListener('click', (event: any) => {
            const feature = event.feature;
            const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
            if (props.type === 'warta_kawasan_lapang') {
              const wartaKawasanLapang = wartaKawasanLapangs.find((w: WartaKawasanLapang) => w.gid === props.gid);
              if (wartaKawasanLapang) {
                const infoWindow = new window.google.maps.InfoWindow({
                  content: `<div style="padding: 8px; min-width: 200px;"><h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Warta Kawasan Lapang ${wartaKawasanLapang.gid}</h3>${wartaKawasanLapang.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${wartaKawasanLapang.id}</p>` : ''}${Object.keys(wartaKawasanLapang).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && wartaKawasanLapang[key] !== null && wartaKawasanLapang[key] !== undefined).slice(0, 5).map(key => `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${wartaKawasanLapang[key]}</p>`).join('')}${wartaKawasanLapang.latitude && wartaKawasanLapang.longitude ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Center:</strong> ${wartaKawasanLapang.latitude.toFixed(6)}, ${wartaKawasanLapang.longitude.toFixed(6)}</p>` : ''}</div>`,
                });
                infoWindow.setPosition(event.latLng);
                infoWindow.open(map);
              }
            }
          });
        }
      }
      console.log(`Created ${markersCreated} warta_kawasan_lapang markers out of ${wartaKawasanLapangs.length} records`);
    } catch (err) {
      console.error('Error loading warta_kawasan_lapang data:', err);
    }
  };

  // Function to load and plot Zon Ahli Majlis data
  const loadZonAhliMajlisData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('zon_ahli_majlis') : 'http://localhost:3001/api/zon_ahli_majlis';
      console.log('Fetching zon_ahli_majlis data...', url);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const zonAhliMajlises = data.zon_ahli_majlis || [];
      console.log(`Loaded ${zonAhliMajlises.length} zon_ahli_majlis records`);
      setZonAhliMajlisData(zonAhliMajlises);

      zonAhliMajlisMarkersRef.current.forEach((marker: any) => { if (marker.setMap) marker.setMap(null); });
      zonAhliMajlisMarkersRef.current = [];
      dataLayer.forEach((feature: any) => {
        const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
        if (props.type === 'zon_ahli_majlis') dataLayer.remove(feature);
      });

      const allFeatures: any[] = [];
      let markersCreated = 0;
      zonAhliMajlises.forEach((zonAhliMajlis: ZonAhliMajlis, index: number) => {
        let lat: number | null = null;
        let lng: number | null = null;
        if (zonAhliMajlis.latitude !== undefined && zonAhliMajlis.longitude !== undefined) {
          lat = typeof zonAhliMajlis.latitude === 'string' ? parseFloat(zonAhliMajlis.latitude) : (typeof zonAhliMajlis.latitude === 'number' ? zonAhliMajlis.latitude : null);
          lng = typeof zonAhliMajlis.longitude === 'string' ? parseFloat(zonAhliMajlis.longitude) : (typeof zonAhliMajlis.longitude === 'number' ? zonAhliMajlis.longitude : null);
        } else if (zonAhliMajlis.geom && zonAhliMajlis.geom.type === 'MultiPolygon' && zonAhliMajlis.geom.coordinates && zonAhliMajlis.geom.coordinates.length > 0) {
          const firstPolygon = zonAhliMajlis.geom.coordinates[0];
          if (firstPolygon && firstPolygon.length > 0 && firstPolygon[0] && firstPolygon[0].length > 0) {
            lng = firstPolygon[0][0][0];
            lat = firstPolygon[0][0][1];
          }
        }

        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map,
            title: `Zon Ahli Majlis ${zonAhliMajlis.gid}`,
            icon: { url: '/icon/zoning.png', scaledSize: new window.google.maps.Size(24, 24), anchor: new window.google.maps.Point(12, 12), },
          });
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="padding: 8px;"><h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Zon Ahli Majlis ${zonAhliMajlis.gid}</h3>${zonAhliMajlis.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${zonAhliMajlis.id}</p>` : ''}${Object.keys(zonAhliMajlis).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && zonAhliMajlis[key] !== null && zonAhliMajlis[key] !== undefined).slice(0, 5).map(key => `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${zonAhliMajlis[key]}</p>`).join('')}<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Center:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p></div>`,
          });
          marker.addListener('click', () => { infoWindow.open(map, marker); });
          zonAhliMajlisMarkersRef.current.push(marker);
          markersCreated++;
        }

        if (zonAhliMajlis.geom) {
          let geometry = zonAhliMajlis.geom;
          if (typeof geometry === 'string') geometry = JSON.parse(geometry);
          allFeatures.push({ type: 'Feature', geometry: geometry, properties: { type: 'zon_ahli_majlis', gid: zonAhliMajlis.gid, id: zonAhliMajlis.id, index: index, latitude: zonAhliMajlis.latitude, longitude: zonAhliMajlis.longitude, ...Object.keys(zonAhliMajlis).reduce((acc: any, key: string) => { if (!['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key)) { acc[key] = zonAhliMajlis[key]; } return acc; }, {}), } });
        }
      });

      if (allFeatures.length > 0) {
        const featureCollection = { type: 'FeatureCollection', features: allFeatures };
        const addedFeatures = dataLayer.addGeoJson(featureCollection);
        if (addedFeatures && addedFeatures.length > 0) {
          dataLayer.setStyle((feature: any) => {
            const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
            if (props.type === 'zon_ahli_majlis') { return { fillColor: '#8b5cf6', fillOpacity: 0.3, strokeColor: '#7c3aed', strokeWeight: 2, strokeOpacity: 0.8, }; }
            return null;
          });
          dataLayer.addListener('click', (event: any) => {
            const feature = event.feature;
            const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
            if (props.type === 'zon_ahli_majlis') {
              const zonAhliMajlis = zonAhliMajlises.find((z: ZonAhliMajlis) => z.gid === props.gid);
              if (zonAhliMajlis) {
                const infoWindow = new window.google.maps.InfoWindow({
                  content: `<div style="padding: 8px; min-width: 200px;"><h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Zon Ahli Majlis ${zonAhliMajlis.gid}</h3>${zonAhliMajlis.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${zonAhliMajlis.id}</p>` : ''}${Object.keys(zonAhliMajlis).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && zonAhliMajlis[key] !== null && zonAhliMajlis[key] !== undefined).slice(0, 5).map(key => `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${zonAhliMajlis[key]}</p>`).join('')}${zonAhliMajlis.latitude && zonAhliMajlis.longitude ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Center:</strong> ${zonAhliMajlis.latitude.toFixed(6)}, ${zonAhliMajlis.longitude.toFixed(6)}</p>` : ''}</div>`,
                });
                infoWindow.setPosition(event.latLng);
                infoWindow.open(map);
              }
            }
          });
        }
      }
      console.log(`Created ${markersCreated} zon_ahli_majlis markers out of ${zonAhliMajlises.length} records`);
    } catch (err) {
      console.error('Error loading zon_ahli_majlis data:', err);
    }
  };

  // Function to load and plot Road Marking Point data
  const loadRoadMarkingPointData = async (map: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('road_marking_point') : 'http://localhost:3001/api/road_marking_point';
      console.log('Fetching road_marking_point data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const roadMarkingPoints = data.road_marking_point || [];
      
      console.log(`Loaded ${roadMarkingPoints.length} road_marking_point records`);
      setRoadMarkingPointData(roadMarkingPoints);
      
      if (roadMarkingPoints.length === 0) {
        console.warn('No road_marking_point data found');
        return;
      }
      
      // Clear existing road_marking_point markers
      roadMarkingPointMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      roadMarkingPointMarkersRef.current = [];
      
      // Process each road_marking_point record
      let markersCreated = 0;
      roadMarkingPoints.forEach((roadMarkingPoint: RoadMarkingPoint, index: number) => {
        try {
          // Get latitude and longitude from API response
          // Priority: latitude/longitude fields > geom extraction
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (roadMarkingPoint.latitude !== undefined && roadMarkingPoint.longitude !== undefined) {
            lat = typeof roadMarkingPoint.latitude === 'string' 
              ? parseFloat(roadMarkingPoint.latitude) 
              : (typeof roadMarkingPoint.latitude === 'number' ? roadMarkingPoint.latitude : null);
            lng = typeof roadMarkingPoint.longitude === 'string' 
              ? parseFloat(roadMarkingPoint.longitude) 
              : (typeof roadMarkingPoint.longitude === 'number' ? roadMarkingPoint.longitude : null);
          } else if (roadMarkingPoint.geom && roadMarkingPoint.geom.type === 'Point' && roadMarkingPoint.geom.coordinates) {
            // Extract from GeoJSON Point geometry [longitude, latitude]
            lng = roadMarkingPoint.geom.coordinates[0];
            lat = roadMarkingPoint.geom.coordinates[1];
          }
          
          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for road_marking_point ${roadMarkingPoint.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Road Marking Point ${roadMarkingPoint.gid}`,
              icon: {
                url: '/icon/road-marking-point.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            // Build info window content with available fields
            const infoContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Road Marking Point ${roadMarkingPoint.gid}</h3>
                ${roadMarkingPoint.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${roadMarkingPoint.id}</p>` : ''}
                ${Object.keys(roadMarkingPoint).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && roadMarkingPoint[key] !== null && roadMarkingPoint[key] !== undefined).slice(0, 5).map(key => 
                  `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${roadMarkingPoint[key]}</p>`
                ).join('')}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            roadMarkingPointMarkersRef.current.push(marker);
            markersCreated++;
          }
        } catch (err) {
          console.error(`Error processing road_marking_point ${roadMarkingPoint.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} road_marking_point markers out of ${roadMarkingPoints.length} road_marking_point records`);
      
      // Fit map bounds to show all markers if we have any
      if (roadMarkingPointMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        roadMarkingPointMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show road_marking_point markers');
          map.fitBounds(bounds);
        }
      }
      
    } catch (err) {
      console.error('Error loading road_marking_point data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  // Function to load and plot Road Hump data
  const loadRoadHumpData = async (map: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('road_hump') : 'http://localhost:3001/api/road_hump';
      console.log('Fetching road_hump data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const roadHumps = data.road_hump || [];
      
      console.log(`Loaded ${roadHumps.length} road_hump records`);
      setRoadHumpData(roadHumps);
      
      if (roadHumps.length === 0) {
        console.warn('No road_hump data found');
        return;
      }
      
      // Clear existing road_hump markers
      roadHumpMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      roadHumpMarkersRef.current = [];
      
      // Process each road_hump record
      let markersCreated = 0;
      roadHumps.forEach((roadHump: RoadHump, index: number) => {
        try {
          // Get latitude and longitude from API response
          // Priority: latitude/longitude fields > geom extraction
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (roadHump.latitude !== undefined && roadHump.longitude !== undefined) {
            lat = typeof roadHump.latitude === 'string' 
              ? parseFloat(roadHump.latitude) 
              : (typeof roadHump.latitude === 'number' ? roadHump.latitude : null);
            lng = typeof roadHump.longitude === 'string' 
              ? parseFloat(roadHump.longitude) 
              : (typeof roadHump.longitude === 'number' ? roadHump.longitude : null);
          } else if (roadHump.geom && roadHump.geom.type === 'Point' && roadHump.geom.coordinates) {
            // Extract from GeoJSON Point geometry [longitude, latitude]
            lng = roadHump.geom.coordinates[0];
            lat = roadHump.geom.coordinates[1];
          }
          
          // Add marker if coordinates are valid
          if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Creating marker for road_hump ${roadHump.gid} at ${lat}, ${lng}`);
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: `Road Hump ${roadHump.gid}`,
              icon: {
                url: '/icon/roadhump.png',
                scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
                anchor: new window.google.maps.Point(16, 16), // Center of the icon
              },
            });
            
            // Build info window content with available fields
            const infoContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Road Hump ${roadHump.gid}</h3>
                ${roadHump.id ? `<p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${roadHump.id}</p>` : ''}
                ${Object.keys(roadHump).filter(key => !['gid', 'id', 'latitude', 'longitude', 'geom', 'geom_geojson'].includes(key) && roadHump[key] !== null && roadHump[key] !== undefined).slice(0, 5).map(key => 
                  `<p style="margin: 4px 0; font-size: 12px;"><strong>${key}:</strong> ${roadHump[key]}</p>`
                ).join('')}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                  <strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            roadHumpMarkersRef.current.push(marker);
            markersCreated++;
          }
        } catch (err) {
          console.error(`Error processing road_hump ${roadHump.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} road_hump markers out of ${roadHumps.length} road_hump records`);
      
      // Fit map bounds to show all markers if we have any
      if (roadHumpMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        roadHumpMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.getPosition) {
            bounds.extend(marker.getPosition());
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting bounds to show road_hump markers');
          map.fitBounds(bounds);
        }
      }
      
    } catch (err) {
      console.error('Error loading road_hump data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  const loadEarthWorkData = async (map: any, dataLayer: any) => {
    try {
      const url = USE_LOCAL_DB_DATA ? getLayerDataUrl('earth_work') : 'http://localhost:3001/api/earth_work';
      console.log('Fetching earth_work data...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const earthWorks = data.earth_work || [];
      
      console.log(`Loaded ${earthWorks.length} earth_work records`);
      setEarthWorkData(earthWorks);
      
      if (earthWorks.length === 0) {
        console.warn('No earth_work data found');
        return;
      }
      
      // Clear existing earth_work markers
      earthWorkMarkersRef.current.forEach((marker: any) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      earthWorkMarkersRef.current = [];
      
      // Clear existing earth_work features from data layer
      dataLayer.forEach((feature: any) => {
        dataLayer.remove(feature);
      });
      
      // Collect all earth_work features and create markers
      const allFeatures: any[] = [];
      let markersCreated = 0;
      
      earthWorks.forEach((earthWork: EarthWork, index: number) => {
        try {
          // Use latitude/longitude from API if available, otherwise calculate from geometry
          let lat: number | null = earthWork.latitude || null;
          let lng: number | null = earthWork.longitude || null;
          
          if (earthWork.geom) {
            let geometry = earthWork.geom;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.warn(`Failed to parse geom for earth_work ${earthWork.gid}:`, e);
                return;
              }
            }
            
            // If lat/lng not available, calculate centroid from geometry
            if ((lat === null || lng === null) && geometry.type === 'MultiPolygon' && geometry.coordinates) {
              // Calculate centroid from first polygon's first ring
              const firstPolygon = geometry.coordinates[0];
              if (firstPolygon && firstPolygon[0] && firstPolygon[0].length > 0) {
                const coords = firstPolygon[0];
                let sumLat = 0;
                let sumLng = 0;
                let count = 0;
                
                coords.forEach((coord: number[]) => {
                  // GeoJSON coordinates are [longitude, latitude]
                  sumLng += coord[0];
                  sumLat += coord[1];
                  count++;
                });
                
                if (count > 0) {
                  lng = sumLng / count;
                  lat = sumLat / count;
                }
              }
            } else if ((lat === null || lng === null) && geometry.type === 'Polygon' && geometry.coordinates) {
              // Handle single Polygon
              const firstRing = geometry.coordinates[0];
              if (firstRing && firstRing.length > 0) {
                let sumLat = 0;
                let sumLng = 0;
                let count = 0;
                
                firstRing.forEach((coord: number[]) => {
                  sumLng += coord[0];
                  sumLat += coord[1];
                  count++;
                });
                
                if (count > 0) {
                  lng = sumLng / count;
                  lat = sumLat / count;
                }
              }
            }
            
            // Create marker at centroid if coordinates are valid
            if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
              const marker = new window.google.maps.Marker({
                position: { lat, lng },
                map,
                title: earthWork.tetuan || earthWork.tajuk || `Earth Work ${earthWork.gid}`,
                icon: {
                  url: '/icon/earthwork.png',
                  scaledSize: new window.google.maps.Size(32, 32),
                  anchor: new window.google.maps.Point(16, 16),
                },
              });
              
              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="padding: 8px; min-width: 200px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${earthWork.tetuan || 'Earth Work'}</h3>
                    ${earthWork.lot_no ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Lot No:</strong> ${earthWork.lot_no}</p>` : ''}
                    ${earthWork.tajuk ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Tajuk:</strong> ${earthWork.tajuk}</p>` : ''}
                    ${earthWork.status ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${earthWork.status}</p>` : ''}
                    ${earthWork.keluasan ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Keluasan:</strong> ${earthWork.keluasan}</p>` : ''}
                    ${earthWork.no_fail ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>No. Fail:</strong> ${earthWork.no_fail}</p>` : ''}
                    ${lat !== null && lng !== null ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Location:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>` : ''}
                  </div>
                `,
              });
              
              marker.addListener('click', () => {
                infoWindow.open(map, marker);
              });
              
              earthWorkMarkersRef.current.push(marker);
              markersCreated++;
            }
            
            allFeatures.push({
              type: 'Feature',
              geometry: geometry,
              properties: {
                type: 'earth_work',
                gid: earthWork.gid,
                tetuan: earthWork.tetuan,
                lot_no: earthWork.lot_no,
                status: earthWork.status,
                tajuk: earthWork.tajuk,
                index: index,
              }
            });
          } else if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            // Create marker even if no geometry (just use lat/lng)
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: earthWork.tetuan || earthWork.tajuk || `Earth Work ${earthWork.gid}`,
              icon: {
                url: '/icon/earthwork.png',
                scaledSize: new window.google.maps.Size(32, 32),
                anchor: new window.google.maps.Point(16, 16),
              },
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; min-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${earthWork.tetuan || 'Earth Work'}</h3>
                  ${earthWork.lot_no ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Lot No:</strong> ${earthWork.lot_no}</p>` : ''}
                  ${earthWork.tajuk ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Tajuk:</strong> ${earthWork.tajuk}</p>` : ''}
                  ${earthWork.status ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${earthWork.status}</p>` : ''}
                </div>
              `,
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
            
            earthWorkMarkersRef.current.push(marker);
            markersCreated++;
          }
        } catch (err) {
          console.error(`Error processing earth_work ${earthWork.gid}:`, err);
        }
      });
      
      console.log(`Created ${markersCreated} earth_work markers out of ${earthWorks.length} earth_work records`);
      
      console.log(`Total features collected: ${allFeatures.length}`);
      
      if (allFeatures.length > 0) {
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures
        };
        
        console.log('Adding GeoJSON to Data Layer...');
        console.log(`Feature collection has ${allFeatures.length} features`);
        
        try {
          const addedFeatures = dataLayer.addGeoJson(featureCollection);
          console.log(`Added ${addedFeatures?.length || 0} earth_work features to map`);
          
          if (addedFeatures && addedFeatures.length > 0) {
            // Style the polygons with orange/brown color for earth work
            dataLayer.setStyle((feature: any) => {
              try {
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                const index = props.index || 0;
                return {
                  fillColor: '#d97706', // orange-600
                  fillOpacity: 0.3,
                  strokeColor: '#d97706',
                  strokeWeight: 2,
                  strokeOpacity: 0.8,
                };
              } catch (err) {
                console.error('Error styling earth_work feature:', err);
                return {
                  fillColor: '#d97706',
                  fillOpacity: 0.3,
                  strokeColor: '#d97706',
                  strokeWeight: 2,
                  strokeOpacity: 0.8,
                };
              }
            });
            
            // Add click event listener for earth_work info window
            dataLayer.addListener('click', (event: any) => {
              try {
                const feature = event.feature;
                const props = feature.getProperty?.('properties') || feature.toGeoJson?.()?.properties || {};
                
                if (props.type === 'earth_work') {
                  const earthWork = earthWorks.find((ew: EarthWork) => ew.gid === props.gid);
                  if (earthWork) {
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: `
                        <div style="padding: 8px; min-width: 200px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${earthWork.tetuan || 'Earth Work'}</h3>
                          ${earthWork.lot_no ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Lot No:</strong> ${earthWork.lot_no}</p>` : ''}
                          ${earthWork.tajuk ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Tajuk:</strong> ${earthWork.tajuk}</p>` : ''}
                          ${earthWork.status ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${earthWork.status}</p>` : ''}
                          ${earthWork.keluasan ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>Keluasan:</strong> ${earthWork.keluasan}</p>` : ''}
                          ${earthWork.no_fail ? `<p style="margin: 4px 0; font-size: 12px; color: #666;"><strong>No. Fail:</strong> ${earthWork.no_fail}</p>` : ''}
                        </div>
                      `,
                    });
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                  }
                }
              } catch (err) {
                console.error('Error handling earth_work click:', err);
              }
            });
            
            // Fit bounds to show all features
            if (allFeatures.length > 0) {
              const bounds = new window.google.maps.LatLngBounds();
              allFeatures.forEach((feature: any) => {
                const geometry = feature.geometry;
                if (geometry.type === 'MultiPolygon' && geometry.coordinates) {
                  geometry.coordinates.forEach((polygon: any[][][]) => {
                    polygon.forEach((ring: any[][]) => {
                      ring.forEach((coord: number[]) => {
                        bounds.extend({ lat: coord[1], lng: coord[0] });
                      });
                    });
                  });
                } else if (geometry.type === 'Polygon' && geometry.coordinates) {
                  geometry.coordinates.forEach((ring: any[][]) => {
                    ring.forEach((coord: number[]) => {
                      bounds.extend({ lat: coord[1], lng: coord[0] });
                    });
                  });
                }
              });
              
              // Also include marker positions
              earthWorkMarkersRef.current.forEach((marker: any) => {
                if (marker && marker.getPosition) {
                  bounds.extend(marker.getPosition());
                }
              });
              
              if (!bounds.isEmpty()) {
                map.fitBounds(bounds);
              }
            }
          }
        } catch (geoJsonError) {
          console.error('Error adding earth_work GeoJSON to Data Layer:', geoJsonError);
        }
      }
      
    } catch (err) {
      console.error('Error loading earth_work data:', err);
      // Don't set error state, just log it - map should still work
    }
  };

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttemptedRef.current) {
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
      const errorMsg = 'API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local';
      setError(errorMsg);
      setIsLoading(false);
      onMapError?.(errorMsg);
      return;
    }

    initAttemptedRef.current = true;

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) {
        console.log('Map already initialized or ref not available');
        return;
      }

      if (!window.google || !window.google.maps) {
        console.error('Google Maps API not loaded');
        return;
      }

      try {
        const center = { lat: 2.7608, lng: 101.7380 };

        console.log('Initializing Google Map...');
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 15,
          mapTypeId: 'hybrid',
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          disableDefaultUI: false,
          // Control landmarks visibility
          styles: landmarksEnabledRef.current ? [] : [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'poi.attraction',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'poi.place_of_worship',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'poi.school',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'poi.sports_complex',
              stylers: [{ visibility: 'off' }]
            }
          ],
        });

        // Zone markers
        const zones = [
          { name: 'Zone A - Main Facility', lat: 2.7618, lng: 101.7370, status: 'secure' },
          { name: 'Zone B - Data Center', lat: 2.7608, lng: 101.7390, status: 'secure' },
          { name: 'Zone C - Perimeter', lat: 2.7598, lng: 101.7380, status: 'alert' },
          { name: 'Zone D - Parking Area', lat: 2.7608, lng: 101.7360, status: 'secure' },
        ];

        zones.forEach((zone) => {
          new window.google.maps.Marker({
            position: { lat: zone.lat, lng: zone.lng },
            map,
            title: zone.name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: zone.status === 'secure' ? '#10b981' : '#f59e0b',
              fillOpacity: 0.7,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            },
          });
        });

        mapInstanceRef.current = map;
        
        // Initialize Data Layer for GeoJSON
        const dataLayer = new window.google.maps.Data({ map });
        dataLayerRef.current = dataLayer;
        
        // Initialize separate data layer for bridges
        const bridgeDataLayer = new window.google.maps.Data({ map });
        bridgeDataLayerRef.current = bridgeDataLayer;
        
        // Initialize separate data layer for charting_km
        const chartingKmDataLayer = new window.google.maps.Data({ map });
        chartingKmDataLayerRef.current = chartingKmDataLayer;
        
        // Initialize separate data layer for constructed_slope
        const constructedSlopeDataLayer = new window.google.maps.Data({ map });
        constructedSlopeDataLayerRef.current = constructedSlopeDataLayer;
        
        // Initialize separate data layer for drainage
        const drainageDataLayer = new window.google.maps.Data({ map });
        drainageDataLayerRef.current = drainageDataLayer;
        
        // Initialize separate data layer for earth_work
        const earthWorkDataLayer = new window.google.maps.Data({ map });
        earthWorkDataLayerRef.current = earthWorkDataLayer;
        
        // Initialize separate data layer for flexible_post
        const flexiblePostDataLayer = new window.google.maps.Data({ map });
        flexiblePostDataLayerRef.current = flexiblePostDataLayer;
        
        // Initialize separate data layer for gtmix
        const gtmixDataLayer = new window.google.maps.Data({ map });
        gtmixDataLayerRef.current = gtmixDataLayer;
        
        // Initialize separate data layer for sempadan_taman
        const sempadanTamanDataLayer = new window.google.maps.Data({ map });
        sempadanTamanDataLayerRef.current = sempadanTamanDataLayer;
        
        // Initialize separate data layer for gtnh_semasa
        const gtnhSemasaDataLayer = new window.google.maps.Data({ map });
        gtnhSemasaDataLayerRef.current = gtnhSemasaDataLayer;
        
        // Initialize separate data layer for jalan
        const jalanDataLayer = new window.google.maps.Data({ map });
        jalanDataLayerRef.current = jalanDataLayer;
        
        // Initialize separate data layer for jalan_kejuruteraan
        const jalanKejuruteraanDataLayer = new window.google.maps.Data({ map });
        
        // Initialize separate data layer for road_marking_linear
        const roadMarkingLinearDataLayer = new window.google.maps.Data({ map });
        roadMarkingLinearDataLayerRef.current = roadMarkingLinearDataLayer;
        jalanKejuruteraanDataLayerRef.current = jalanKejuruteraanDataLayer;
        
        // Initialize separate data layer for komited_km
        const komitedKmDataLayer = new window.google.maps.Data({ map });
        komitedKmDataLayerRef.current = komitedKmDataLayer;
        
        // Initialize separate data layer for ndcdb20
        const ndcdb20DataLayer = new window.google.maps.Data({ map });
        ndcdb20DataLayerRef.current = ndcdb20DataLayer;
        
        // Initialize separate data layer for ndcdb23
        const ndcdb23DataLayer = new window.google.maps.Data({ map });
        ndcdb23DataLayerRef.current = ndcdb23DataLayer;
        
        // Initialize separate data layers for pasar types
        const pasarAwamDataLayer = new window.google.maps.Data({ map });
        pasarAwamDataLayerRef.current = pasarAwamDataLayer;
        const pasarMalamDataLayer = new window.google.maps.Data({ map });
        pasarMalamDataLayerRef.current = pasarMalamDataLayer;
        const pasarSariDataLayer = new window.google.maps.Data({ map });
        pasarSariDataLayerRef.current = pasarSariDataLayer;
        const pasarTaniDataLayer = new window.google.maps.Data({ map });
        pasarTaniDataLayerRef.current = pasarTaniDataLayer;
        
        // Initialize separate data layer for road_median
        const roadMedianDataLayer = new window.google.maps.Data({ map });
        roadMedianDataLayerRef.current = roadMedianDataLayer;
        
        // Initialize separate data layer for road_shoulder
        const roadShoulderDataLayer = new window.google.maps.Data({ map });
        roadShoulderDataLayerRef.current = roadShoulderDataLayer;
        
        // Initialize separate data layer for sempadan_daerah
        const sempadanDaerahDataLayer = new window.google.maps.Data({ map });
        sempadanDaerahDataLayerRef.current = sempadanDaerahDataLayer;
        
        // Initialize separate data layer for taman_perumahan
        const tamanPerumahanDataLayer = new window.google.maps.Data({ map });
        tamanPerumahanDataLayerRef.current = tamanPerumahanDataLayer;
        
        // Initialize separate data layer for warta_kawasan_lapang
        const wartaKawasanLapangDataLayer = new window.google.maps.Data({ map });
        wartaKawasanLapangDataLayerRef.current = wartaKawasanLapangDataLayer;
        
        // Initialize separate data layer for zon_ahli_majlis
        const zonAhliMajlisDataLayer = new window.google.maps.Data({ map });
        zonAhliMajlisDataLayerRef.current = zonAhliMajlisDataLayer;
        
        // Load blok_perancangan data from API if enabled
        if (showBlokPerancangan) {
          loadBlokPerancanganData(map, dataLayer);
        }
        
        // Load bridge data from API if enabled
        if (showBridge) {
          loadBridgeData(map, bridgeDataLayer);
        }
        
        // Load CCTV data from API if enabled
        if (showCCTV) {
          loadCCTVData(map);
        }
        
        // Load feeder_pillar data from API if enabled
        if (showFeederPillar) {
          loadFeederPillarData(map);
        }
        
        // Load location_map_aset data from API if enabled
        if (showLocationMapAset) {
          loadLocationMapAsetData(map);
        }
        
        // Load location_map_aset_item data from API if enabled
        if (showLocationMapAsetItem) {
          loadLocationMapAsetItemData(map);
        }
        
        // Load lokasi_banjir data from API if enabled
        if (showLokasiBanjir) {
          loadLokasiBanjirData(map);
        }
        
        // Load charting_km data from API if enabled
        if (showChartingKm) {
          loadChartingKmData(map, chartingKmDataLayer);
        }
        
        // Load constructed_slope data from API if enabled
        if (showConstructedSlope) {
          loadConstructedSlopeData(map, constructedSlopeDataLayer);
        }
        
        // Load drainage data from API if enabled
        if (showDrainage) {
          loadDrainageData(map, drainageDataLayer);
        }
        
        // Load earth_work data from API if enabled
        if (showEarthWork) {
          loadEarthWorkData(map, earthWorkDataLayer);
        }
        
        // Load flexible_post data from API if enabled
        if (showFlexiblePost) {
          loadFlexiblePostData(map, flexiblePostDataLayer);
        }
        
        // Load gtmix data from API if enabled
        if (showGtmix) {
          loadGtmixData(map, gtmixDataLayer);
        }
        
        // Load sempadan_taman data from API if enabled
        if (showSempadanTaman) {
          loadSempadanTamanData(map, sempadanTamanDataLayer);
        }
        
        // Load gtnh_semasa data from API if enabled
        if (showGtnhSemasa) {
          loadGtnhSemasaData(map, gtnhSemasaDataLayer);
        }
        
        // Load jalan data from API if enabled
        if (showJalan) {
          loadJalanData(map, jalanDataLayer);
        }
        
        // Load jalan_kejuruteraan data from API if enabled
        if (showJalanKejuruteraan) {
          loadJalanKejuruteraanData(map, jalanKejuruteraanDataLayer);
        }
        
        // Load komited_km data from API if enabled
        if (showKomitedKm) {
          loadKomitedKmData(map, komitedKmDataLayer);
        }
        
        // Load ndcdb20 data from API if enabled
        if (showNdcdb20) {
          loadNdcdb20Data(map, ndcdb20DataLayer);
        }
        
        // Load ndcdb23 data from API if enabled
        if (showNdcdb23) {
          loadNdcdb23Data(map, ndcdb23DataLayer);
        }
        
        // Load pasar data from API if enabled
        if (showPasarAwam) {
          loadPasarAwamData(map, pasarAwamDataLayer);
        }
        if (showPasarMalam) {
          loadPasarMalamData(map, pasarMalamDataLayer);
        }
        if (showPasarSari) {
          loadPasarSariData(map, pasarSariDataLayer);
        }
        if (showPasarTani) {
          loadPasarTaniData(map, pasarTaniDataLayer);
        }
        
        // Load road_hump data from API if enabled
        if (showRoadHump) {
          loadRoadHumpData(map);
        }
        
        // Load road_marking_linear data from API if enabled
        if (showRoadMarkingLinear && roadMarkingLinearDataLayerRef.current) {
          loadRoadMarkingLinearData(map, roadMarkingLinearDataLayerRef.current);
        }
        
        // Load road_marking_point data from API if enabled
        if (showRoadMarkingPoint) {
          loadRoadMarkingPointData(map);
        }
        
        // Load road_median data from API if enabled
        if (showRoadMedian && roadMedianDataLayerRef.current) {
          loadRoadMedianData(map, roadMedianDataLayerRef.current);
        }
        
        // Load road_shoulder data from API if enabled
        if (showRoadShoulder && roadShoulderDataLayerRef.current) {
          loadRoadShoulderData(map, roadShoulderDataLayerRef.current);
        }
        
        // Load sampah_haram data from API if enabled
        if (showSampahHaram) {
          loadSampahHaramData(map);
        }
        
        // Load sempadan_daerah data from API if enabled
        if (showSempadanDaerah && sempadanDaerahDataLayerRef.current) {
          loadSempadanDaerahData(map, sempadanDaerahDataLayerRef.current);
        }
        
        // Load signboard data from API if enabled
        if (showSignboard) {
          loadSignboardData(map);
        }
        
        // Load sport_facility data from API if enabled
        if (showSportFacility) {
          loadSportFacilityData(map);
        }
        
        // Load street_lighting data from API if enabled
        if (showStreetLighting) {
          loadStreetLightingData(map);
        }
        
        // Load Loranet streetlight data from API if enabled
        if (showLoranetStreetlight) {
          loadLoranetStreetlightData(map);
        }
        
        // Load taman_perumahan data from API if enabled
        if (showTamanPerumahan && tamanPerumahanDataLayerRef.current) {
          loadTamanPerumahanData(map, tamanPerumahanDataLayerRef.current);
        }
        
        // Load traffic-light data from API if enabled
        if (showTrafficLight) {
          loadTrafficLightData(map);
        }
        
        // Load warta_kawasan_lapang data from API if enabled
        if (showWartaKawasanLapang && wartaKawasanLapangDataLayerRef.current) {
          loadWartaKawasanLapangData(map, wartaKawasanLapangDataLayerRef.current);
        }
        
        // Load zon_ahli_majlis data from API if enabled
        if (showZonAhliMajlis && zonAhliMajlisDataLayerRef.current) {
          loadZonAhliMajlisData(map, zonAhliMajlisDataLayerRef.current);
        }
        
        // Handle window resize to ensure map fills container
        const handleResize = () => {
          if (mapInstanceRef.current && window.google?.maps) {
            window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
          }
        };

        // Store handler reference for cleanup
        resizeHandlerRef.current = handleResize;

        // Listen for window resize events
        window.addEventListener('resize', handleResize);
        
        // Also listen for orientation changes (mobile)
        window.addEventListener('orientationchange', handleResize);
        
        // Listen for zoom changes and trigger resize
        window.google.maps.event.addListener(map, 'zoom_changed', () => {
          setTimeout(() => {
            if (mapInstanceRef.current && window.google?.maps) {
              window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
            }
          }, 100);
        });

        // Listen for idle event (map finished loading/rendering) and trigger resize
        window.google.maps.event.addListener(map, 'idle', () => {
          if (mapInstanceRef.current && window.google?.maps) {
            window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
          }
        });

        // Listen for bounds_changed (when panning/zooming) and trigger resize
        window.google.maps.event.addListener(map, 'bounds_changed', () => {
          setTimeout(() => {
            if (mapInstanceRef.current && window.google?.maps) {
              window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
            }
          }, 50);
        });
        
        // Trigger resize after initialization to ensure map fills container
        setTimeout(() => {
          if (window.google?.maps) {
            window.google.maps.event.trigger(map, 'resize');
          }
        }, 100);
        
        // Also trigger on next frame to catch any layout changes
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (window.google?.maps && mapInstanceRef.current) {
              window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
            }
          }, 50);
        });

        // Additional resize trigger after a longer delay to catch all layout changes
        setTimeout(() => {
          if (window.google?.maps && mapInstanceRef.current) {
            window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
          }
        }, 500);

        setIsLoading(false);
        console.log('Google Map initialized successfully');
        onMapLoad?.();
      } catch (err) {
        const errorMsg = 'Failed to initialize map';
        console.error('Map initialization error:', err);
        setError(errorMsg);
        setIsLoading(false);
        onMapError?.(errorMsg);
      }
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps already loaded, initializing...');
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        setTimeout(initMap, 100);
      });
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]') as HTMLScriptElement;
    if (existingScript) {
      console.log('Google Maps script already exists, waiting for load...');
      if (existingScript.onload) {
        // Script might already be loaded
        if (window.google && window.google.maps) {
          requestAnimationFrame(() => {
            setTimeout(initMap, 100);
          });
        }
      } else {
        existingScript.onload = () => {
          console.log('Existing script loaded');
          requestAnimationFrame(() => {
            setTimeout(initMap, 100);
          });
        };
      }
      return;
    }

    // Load Google Maps script
    console.log('Loading Google Maps script...');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Maps script loaded successfully');
      requestAnimationFrame(() => {
        setTimeout(initMap, 100);
      });
    };
    script.onerror = () => {
      const errorMsg = 'Failed to load Google Maps. Check your API key and internet connection.';
      console.error('Script load error:', errorMsg);
      setError(errorMsg);
      setIsLoading(false);
      onMapError?.(errorMsg);
    };
    document.head.appendChild(script);

    // Cleanup resize listeners
    return () => {
      if (resizeHandlerRef.current) {
        window.removeEventListener('resize', resizeHandlerRef.current);
        window.removeEventListener('orientationchange', resizeHandlerRef.current);
      }
    };
  }, [onMapLoad, onMapError, showLandmarks]);

  // Update landmarks when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      landmarksEnabledRef.current = showLandmarks;
      const styles = showLandmarks ? [] : [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.business',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.attraction',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.place_of_worship',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.school',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.sports_complex',
          stylers: [{ visibility: 'off' }]
        }
      ];
      mapInstanceRef.current.setOptions({ styles });
    }
  }, [showLandmarks]);

  // Update blok_perancangan visibility when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && dataLayerRef.current && window.google?.maps) {
      if (showBlokPerancangan) {
        // Load data if not already loaded
        if (blokData.length === 0) {
          loadBlokPerancanganData(mapInstanceRef.current, dataLayerRef.current);
        } else {
          // Show existing data
          dataLayerRef.current.setMap(mapInstanceRef.current);
          polygonsRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide data
        dataLayerRef.current.setMap(null);
        polygonsRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showBlokPerancangan, blokData]);

  // Update bridge visibility when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && bridgeDataLayerRef.current && window.google?.maps) {
      if (showBridge) {
        // Load data if not already loaded
        if (bridgeData.length === 0) {
          loadBridgeData(mapInstanceRef.current, bridgeDataLayerRef.current);
        } else {
          // Show existing data
          bridgeDataLayerRef.current.setMap(mapInstanceRef.current);
          bridgeMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide data
        bridgeDataLayerRef.current.setMap(null);
        bridgeMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showBridge, bridgeData]);

  // Update CCTV visibility when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      if (showCCTV) {
        // Load data if not already loaded
        if (cctvData.length === 0) {
          loadCCTVData(mapInstanceRef.current);
        } else {
          // Show existing markers
          cctvMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide markers
        cctvMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showCCTV, cctvData]);

  // Update feeder_pillar visibility when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      if (showFeederPillar) {
        // Load data if not already loaded
        if (feederPillarData.length === 0) {
          loadFeederPillarData(mapInstanceRef.current);
        } else {
          // Show existing markers
          feederPillarMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide markers
        feederPillarMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showFeederPillar, feederPillarData]);

  // Toggle location_map_aset visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      if (showLocationMapAset) {
        // Load data if not already loaded
        if (locationMapAsetData.length === 0) {
          loadLocationMapAsetData(mapInstanceRef.current);
        } else {
          // Show existing markers
          locationMapAsetMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide markers
        locationMapAsetMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showLocationMapAset, locationMapAsetData]);

  // Toggle location_map_aset_item visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      if (showLocationMapAsetItem) {
        // Load data if not already loaded
        if (locationMapAsetItemData.length === 0) {
          loadLocationMapAsetItemData(mapInstanceRef.current);
        } else {
          // Show existing markers
          locationMapAsetItemMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide markers
        locationMapAsetItemMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showLocationMapAsetItem, locationMapAsetItemData]);

  // Toggle lokasi_banjir visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      if (showLokasiBanjir) {
        // Load data if not already loaded
        if (lokasiBanjirData.length === 0) {
          loadLokasiBanjirData(mapInstanceRef.current);
        } else {
          // Show existing markers
          lokasiBanjirMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide markers
        lokasiBanjirMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showLokasiBanjir, lokasiBanjirData]);

  // Update charting_km visibility when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && chartingKmDataLayerRef.current && window.google?.maps) {
      if (showChartingKm) {
        // Load data if not already loaded
        if (chartingKmData.length === 0) {
          loadChartingKmData(mapInstanceRef.current, chartingKmDataLayerRef.current);
        } else {
          // Show existing data
          chartingKmDataLayerRef.current.setMap(mapInstanceRef.current);
          chartingKmMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide data
        chartingKmDataLayerRef.current.setMap(null);
        chartingKmMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showChartingKm, chartingKmData]);

  // Update constructed_slope visibility when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && constructedSlopeDataLayerRef.current && window.google?.maps) {
      if (showConstructedSlope) {
        // Load data if not already loaded
        if (constructedSlopeData.length === 0) {
          loadConstructedSlopeData(mapInstanceRef.current, constructedSlopeDataLayerRef.current);
        } else {
          // Show existing data
          constructedSlopeDataLayerRef.current.setMap(mapInstanceRef.current);
          constructedSlopeMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide data
        constructedSlopeDataLayerRef.current.setMap(null);
        constructedSlopeMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showConstructedSlope, constructedSlopeData]);

  // Update drainage visibility when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && drainageDataLayerRef.current && window.google?.maps) {
      if (showDrainage) {
        // Load data if not already loaded
        if (drainageData.length === 0) {
          loadDrainageData(mapInstanceRef.current, drainageDataLayerRef.current);
        } else {
          // Show existing data
          drainageDataLayerRef.current.setMap(mapInstanceRef.current);
          drainageMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide data
        drainageDataLayerRef.current.setMap(null);
        drainageMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showDrainage, drainageData]);

  // Toggle earth_work visibility
  useEffect(() => {
    if (mapInstanceRef.current && earthWorkDataLayerRef.current && window.google?.maps) {
      if (showEarthWork) {
        // Load data if not already loaded
        if (earthWorkData.length === 0) {
          loadEarthWorkData(mapInstanceRef.current, earthWorkDataLayerRef.current);
        } else {
          // Show existing data
          earthWorkDataLayerRef.current.setMap(mapInstanceRef.current);
          earthWorkMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide data
        earthWorkDataLayerRef.current.setMap(null);
        earthWorkMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showEarthWork, earthWorkData]);

  // Toggle flexible_post visibility
  useEffect(() => {
    if (mapInstanceRef.current && flexiblePostDataLayerRef.current && window.google?.maps) {
      if (showFlexiblePost) {
        // Load data if not already loaded
        if (flexiblePostData.length === 0) {
          loadFlexiblePostData(mapInstanceRef.current, flexiblePostDataLayerRef.current);
        } else {
          // Show existing data
          flexiblePostDataLayerRef.current.setMap(mapInstanceRef.current);
          flexiblePostMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide data
        flexiblePostDataLayerRef.current.setMap(null);
        flexiblePostMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showFlexiblePost, flexiblePostData]);

  // Toggle gtmix visibility
  useEffect(() => {
    if (mapInstanceRef.current && gtmixDataLayerRef.current && window.google?.maps) {
      if (showGtmix) {
        // Load data if not already loaded
        if (gtmixData.length === 0) {
          loadGtmixData(mapInstanceRef.current, gtmixDataLayerRef.current);
        } else {
          // Show existing data
          gtmixDataLayerRef.current.setMap(mapInstanceRef.current);
        }
      } else {
        // Hide data
        gtmixDataLayerRef.current.setMap(null);
      }
    }
  }, [showGtmix, gtmixData]);

  // Toggle sempadan_taman visibility
  useEffect(() => {
    if (mapInstanceRef.current && sempadanTamanDataLayerRef.current && window.google?.maps) {
      if (showSempadanTaman) {
        // Load data if not already loaded
        if (sempadanTamanData.length === 0) {
          loadSempadanTamanData(mapInstanceRef.current, sempadanTamanDataLayerRef.current);
        } else {
          // Show existing data
          sempadanTamanDataLayerRef.current.setMap(mapInstanceRef.current);
          sempadanTamanMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide data
        sempadanTamanDataLayerRef.current.setMap(null);
        sempadanTamanMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showSempadanTaman, sempadanTamanData]);

  // Toggle gtnh_semasa visibility
  useEffect(() => {
    if (mapInstanceRef.current && gtnhSemasaDataLayerRef.current && window.google?.maps) {
      if (showGtnhSemasa) {
        // Load data if not already loaded
        if (gtnhSemasaData.length === 0) {
          loadGtnhSemasaData(mapInstanceRef.current, gtnhSemasaDataLayerRef.current);
        } else {
          // Show existing data
          gtnhSemasaDataLayerRef.current.setMap(mapInstanceRef.current);
        }
      } else {
        // Hide data
        gtnhSemasaDataLayerRef.current.setMap(null);
      }
    }
  }, [showGtnhSemasa, gtnhSemasaData]);

  // Toggle jalan visibility
  useEffect(() => {
    if (mapInstanceRef.current && jalanDataLayerRef.current && window.google?.maps) {
      if (showJalan) {
        // Load data if not already loaded
        if (jalanData.length === 0) {
          loadJalanData(mapInstanceRef.current, jalanDataLayerRef.current);
        } else {
          // Show existing data
          jalanDataLayerRef.current.setMap(mapInstanceRef.current);
          jalanMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide data
        jalanDataLayerRef.current.setMap(null);
        jalanMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showJalan, jalanData]);

  // Toggle jalan_kejuruteraan visibility
  useEffect(() => {
    if (mapInstanceRef.current && jalanKejuruteraanDataLayerRef.current && window.google?.maps) {
      if (showJalanKejuruteraan) {
        // Load data if not already loaded
        if (jalanKejuruteraanData.length === 0) {
          loadJalanKejuruteraanData(mapInstanceRef.current, jalanKejuruteraanDataLayerRef.current);
        } else {
          // Show existing data
          jalanKejuruteraanDataLayerRef.current.setMap(mapInstanceRef.current);
          jalanKejuruteraanMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide data
        jalanKejuruteraanDataLayerRef.current.setMap(null);
        jalanKejuruteraanMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showJalanKejuruteraan, jalanKejuruteraanData]);

  // Toggle komited_km visibility
  useEffect(() => {
    if (mapInstanceRef.current && komitedKmDataLayerRef.current && window.google?.maps) {
      if (showKomitedKm) {
        // Load data if not already loaded
        if (komitedKmData.length === 0) {
          loadKomitedKmData(mapInstanceRef.current, komitedKmDataLayerRef.current);
        } else {
          // Show existing data
          komitedKmDataLayerRef.current.setMap(mapInstanceRef.current);
          komitedKmMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide data
        komitedKmDataLayerRef.current.setMap(null);
        komitedKmMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showKomitedKm, komitedKmData]);

  // Toggle ndcdb20 visibility
  useEffect(() => {
    if (mapInstanceRef.current && ndcdb20DataLayerRef.current && window.google?.maps) {
      if (showNdcdb20) {
        // Load data if not already loaded
        if (ndcdb20Data.length === 0) {
          loadNdcdb20Data(mapInstanceRef.current, ndcdb20DataLayerRef.current);
        } else {
          // Show existing data
          ndcdb20DataLayerRef.current.setMap(mapInstanceRef.current);
          ndcdb20MarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide data
        ndcdb20DataLayerRef.current.setMap(null);
        ndcdb20MarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showNdcdb20, ndcdb20Data]);

  // Toggle ndcdb23 visibility
  useEffect(() => {
    if (mapInstanceRef.current && ndcdb23DataLayerRef.current && window.google?.maps) {
      if (showNdcdb23) {
        // Load data if not already loaded
        if (ndcdb23Data.length === 0) {
          loadNdcdb23Data(mapInstanceRef.current, ndcdb23DataLayerRef.current);
        } else {
          // Show existing data
          ndcdb23DataLayerRef.current.setMap(mapInstanceRef.current);
          ndcdb23MarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide data
        ndcdb23DataLayerRef.current.setMap(null);
        ndcdb23MarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showNdcdb23, ndcdb23Data]);

  // Toggle pasar_awam visibility
  useEffect(() => {
    if (mapInstanceRef.current && pasarAwamDataLayerRef.current && window.google?.maps) {
      if (showPasarAwam) {
        if (pasarAwamData.length === 0) {
          loadPasarAwamData(mapInstanceRef.current, pasarAwamDataLayerRef.current);
        } else {
          pasarAwamDataLayerRef.current.setMap(mapInstanceRef.current);
          pasarAwamMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        pasarAwamDataLayerRef.current.setMap(null);
        pasarAwamMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showPasarAwam, pasarAwamData]);

  // Toggle pasar_malam visibility
  useEffect(() => {
    if (mapInstanceRef.current && pasarMalamDataLayerRef.current && window.google?.maps) {
      if (showPasarMalam) {
        if (pasarMalamData.length === 0) {
          loadPasarMalamData(mapInstanceRef.current, pasarMalamDataLayerRef.current);
        } else {
          pasarMalamDataLayerRef.current.setMap(mapInstanceRef.current);
          pasarMalamMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        pasarMalamDataLayerRef.current.setMap(null);
        pasarMalamMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showPasarMalam, pasarMalamData]);

  // Toggle pasar_sari visibility
  useEffect(() => {
    if (mapInstanceRef.current && pasarSariDataLayerRef.current && window.google?.maps) {
      if (showPasarSari) {
        if (pasarSariData.length === 0) {
          loadPasarSariData(mapInstanceRef.current, pasarSariDataLayerRef.current);
        } else {
          pasarSariDataLayerRef.current.setMap(mapInstanceRef.current);
          pasarSariMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        pasarSariDataLayerRef.current.setMap(null);
        pasarSariMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showPasarSari, pasarSariData]);

  // Toggle pasar_tani visibility
  useEffect(() => {
    if (mapInstanceRef.current && pasarTaniDataLayerRef.current && window.google?.maps) {
      if (showPasarTani) {
        if (pasarTaniData.length === 0) {
          loadPasarTaniData(mapInstanceRef.current, pasarTaniDataLayerRef.current);
        } else {
          pasarTaniDataLayerRef.current.setMap(mapInstanceRef.current);
          pasarTaniMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        pasarTaniDataLayerRef.current.setMap(null);
        pasarTaniMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showPasarTani, pasarTaniData]);

  // Toggle road_hump visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      if (showRoadHump) {
        if (roadHumpData.length === 0) {
          loadRoadHumpData(mapInstanceRef.current);
        } else {
          roadHumpMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        roadHumpMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showRoadHump, roadHumpData]);

  // Toggle road_marking_linear visibility
  useEffect(() => {
    if (mapInstanceRef.current && roadMarkingLinearDataLayerRef.current && window.google?.maps) {
      if (showRoadMarkingLinear) {
        // Load data if not already loaded
        if (roadMarkingLinearData.length === 0) {
          loadRoadMarkingLinearData(mapInstanceRef.current, roadMarkingLinearDataLayerRef.current);
        } else {
          // Show existing features
          roadMarkingLinearDataLayerRef.current.setMap(mapInstanceRef.current);
          roadMarkingLinearMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide features
        roadMarkingLinearDataLayerRef.current.setMap(null);
        roadMarkingLinearMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showRoadMarkingLinear, roadMarkingLinearData]);

  // Toggle road_marking_point visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      if (showRoadMarkingPoint) {
        if (roadMarkingPointData.length === 0) {
          loadRoadMarkingPointData(mapInstanceRef.current);
        } else {
          roadMarkingPointMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        roadMarkingPointMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showRoadMarkingPoint, roadMarkingPointData]);

  // Toggle road_median visibility
  useEffect(() => {
    if (mapInstanceRef.current && roadMedianDataLayerRef.current && window.google?.maps) {
      if (showRoadMedian) {
        // Load data if not already loaded
        if (roadMedianData.length === 0) {
          loadRoadMedianData(mapInstanceRef.current, roadMedianDataLayerRef.current);
        } else {
          // Show existing features
          roadMedianDataLayerRef.current.setMap(mapInstanceRef.current);
          roadMedianMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide features
        roadMedianDataLayerRef.current.setMap(null);
        roadMedianMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showRoadMedian, roadMedianData]);

  // Toggle road_shoulder visibility
  useEffect(() => {
    if (mapInstanceRef.current && roadShoulderDataLayerRef.current && window.google?.maps) {
      if (showRoadShoulder) {
        // Load data if not already loaded
        if (roadShoulderData.length === 0) {
          loadRoadShoulderData(mapInstanceRef.current, roadShoulderDataLayerRef.current);
        } else {
          // Show existing features
          roadShoulderDataLayerRef.current.setMap(mapInstanceRef.current);
          roadShoulderMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        // Hide features
        roadShoulderDataLayerRef.current.setMap(null);
        roadShoulderMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showRoadShoulder, roadShoulderData]);

  // Toggle sampah_haram visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      if (showSampahHaram) {
        if (sampahHaramData.length === 0) {
          loadSampahHaramData(mapInstanceRef.current);
        } else {
          sampahHaramMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        sampahHaramMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showSampahHaram, sampahHaramData]);

  // Toggle sempadan_daerah visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps && sempadanDaerahDataLayerRef.current) {
      if (showSempadanDaerah) {
        if (sempadanDaerahData.length === 0) {
          loadSempadanDaerahData(mapInstanceRef.current, sempadanDaerahDataLayerRef.current);
        } else {
          sempadanDaerahDataLayerRef.current.setMap(mapInstanceRef.current);
          sempadanDaerahMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        sempadanDaerahDataLayerRef.current.setMap(null);
        sempadanDaerahMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showSempadanDaerah, sempadanDaerahData]);

  // Toggle signboard visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      if (showSignboard) {
        if (signboardData.length === 0) {
          loadSignboardData(mapInstanceRef.current);
        } else {
          signboardMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        signboardMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showSignboard, signboardData]);

  // Toggle sport_facility visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      if (showSportFacility) {
        if (sportFacilityData.length === 0) {
          loadSportFacilityData(mapInstanceRef.current);
        } else {
          sportFacilityMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        sportFacilityMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showSportFacility, sportFacilityData]);

  // Toggle street_lighting visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      if (showStreetLighting) {
        if (streetLightingData.length === 0) {
          loadStreetLightingData(mapInstanceRef.current);
        } else {
          streetLightingMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        streetLightingMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showStreetLighting, streetLightingData]);

  // Toggle Loranet streetlight visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      if (showLoranetStreetlight) {
        if (loranetStreetlightData.length === 0) {
          loadLoranetStreetlightData(mapInstanceRef.current);
        } else {
          loranetStreetlightMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        loranetStreetlightMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showLoranetStreetlight, loranetStreetlightData]);

  // Toggle taman_perumahan visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps && tamanPerumahanDataLayerRef.current) {
      if (showTamanPerumahan) {
        if (tamanPerumahanData.length === 0) {
          loadTamanPerumahanData(mapInstanceRef.current, tamanPerumahanDataLayerRef.current);
        } else {
          tamanPerumahanDataLayerRef.current.setMap(mapInstanceRef.current);
          tamanPerumahanMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        tamanPerumahanDataLayerRef.current.setMap(null);
        tamanPerumahanMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showTamanPerumahan, tamanPerumahanData]);

  // Toggle traffic_light visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      if (showTrafficLight) {
        if (trafficLightData.length === 0) {
          loadTrafficLightData(mapInstanceRef.current);
        } else {
          trafficLightMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        trafficLightMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showTrafficLight, trafficLightData]);

  // Toggle warta_kawasan_lapang visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps && wartaKawasanLapangDataLayerRef.current) {
      if (showWartaKawasanLapang) {
        if (wartaKawasanLapangData.length === 0) {
          loadWartaKawasanLapangData(mapInstanceRef.current, wartaKawasanLapangDataLayerRef.current);
        } else {
          wartaKawasanLapangDataLayerRef.current.setMap(mapInstanceRef.current);
          wartaKawasanLapangMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        wartaKawasanLapangDataLayerRef.current.setMap(null);
        wartaKawasanLapangMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showWartaKawasanLapang, wartaKawasanLapangData]);

  // Toggle zon_ahli_majlis visibility
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps && zonAhliMajlisDataLayerRef.current) {
      if (showZonAhliMajlis) {
        if (zonAhliMajlisData.length === 0) {
          loadZonAhliMajlisData(mapInstanceRef.current, zonAhliMajlisDataLayerRef.current);
        } else {
          zonAhliMajlisDataLayerRef.current.setMap(mapInstanceRef.current);
          zonAhliMajlisMarkersRef.current.forEach((marker: any) => {
            if (marker && marker.setMap) {
              marker.setMap(mapInstanceRef.current);
            }
          });
        }
      } else {
        zonAhliMajlisDataLayerRef.current.setMap(null);
        zonAhliMajlisMarkersRef.current.forEach((marker: any) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
    }
  }, [showZonAhliMajlis, zonAhliMajlisData]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <div className="text-center p-8 max-w-md">
          <h3 className="text-lg font-semibold mb-2 text-destructive">Map Loading Error</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full" style={{ width: '100%', height: '100%' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading Map...</p>
          </div>
        </div>
      )}
      {/* Data loading status indicator */}
      {!isLoading && blokData.length > 0 && (
        <div className="absolute top-4 right-4 z-20 bg-black/70 text-white px-3 py-2 rounded-lg text-xs backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{blokData.length} blok loaded</span>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '600px',
          position: 'relative',
          display: 'block',
          overflow: 'hidden'
        }}
      />
    </div>
  );
}

