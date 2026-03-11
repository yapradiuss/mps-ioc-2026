import { NextRequest, NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import path from "path";
import { Geometry } from "wkx";
// Bundled at build so tax/compound widgets work on Vercel (no fs read)
import ekompaunMpspSummary from "@/data/ekompaun_mpsp_summary.json";
import maklumatAkaunAnalytics from "@/data/maklumat_akaun_analytics.json";

/**
 * Resolve the actual filename for a layer inside src/db-data.
 * Files may carry a timestamp suffix, e.g. bridge_202603120134.json.
 * Priority: exact match → first file starting with "<layer>_" → "<layer>.json"
 */
async function resolveDbDataFile(dbDataDir: string, layer: string): Promise<string | null> {
  try {
    const files = await readdir(dbDataDir);
    // 1. Exact match (no timestamp)
    if (files.includes(`${layer}.json`)) return `${layer}.json`;
    // 2. Timestamped variant: e.g. bridge_202603120134.json
    const prefixed = files.find(
      (f) => f.startsWith(`${layer}_`) && f.endsWith(".json")
    );
    if (prefixed) return prefixed;
    return null;
  } catch {
    return null;
  }
}

// Allowed layer names – must match filenames in src/db-data (timestamp suffix resolved dynamically)
const ALLOWED_LAYERS = new Set([
  // Infrastructure
  "blok_perancangan",
  "bridge",
  "charting_km",
  "constructed_slope",
  "drainage",
  "earth_work",
  "feeder_pillar",
  "flexible_post",
  "jalan",
  "jalan_kejuruteraan",
  "komited_km",
  "road_hump",
  "road_marking_linear",
  "road_marking_point",
  "road_median",
  "road_shoulder",
  "signboard",
  // Facilities
  "cctv",
  "sport_facility",
  "street_lighting",
  "traffic_light",
  // Boundaries / zones
  "mukim",
  "sempadan_daerah",
  "sempadan_taman",
  "taman_perumahan",
  "warta_kawasan_lapang",
  "zon_ahli_majlis",
  // Markets
  "pasar_awam",
  "pasar_malam",
  "pasar_sari",
  "pasar_tani",
  // Assets
  "gtmix",
  "gtnh_semasa",
  "location_map_aset",
  "location_map_aset_item",
  "ndcdb20",
  "ndcdb23",
  // Others
  "lokasi_banjir",
  "sampah_haram",
  // Analytics (bundled JSON, no fs read)
  "ekompaun_mpsp_summary",
  "maklumat_akaun_analytics",
]);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ layer: string }> }
) {
  const { layer } = await params;
  if (!layer || !ALLOWED_LAYERS.has(layer)) {
    return NextResponse.json(
      { error: "Invalid or unknown layer" },
      { status: 400 }
    );
  }

  // Tax and compound: return bundled JSON (no fs; works on Vercel)
  if (layer === "ekompaun_mpsp_summary") {
    return NextResponse.json(ekompaunMpspSummary as Record<string, unknown>);
  }
  if (layer === "maklumat_akaun_analytics") {
    return NextResponse.json(maklumatAkaunAnalytics as Record<string, unknown>);
  }

  try {
    // db-data JSON lives under src/db-data; filenames may carry a timestamp suffix
    const dbDataDir = path.join(process.cwd(), "src", "db-data");
    const effectiveFileName = await resolveDbDataFile(dbDataDir, layer);
    if (!effectiveFileName) {
      return NextResponse.json(
        { error: `Data file not found for layer: ${layer}` },
        { status: 404 }
      );
    }
    const filePath = path.join(dbDataDir, effectiveFileName);
    const raw = await readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    // ALL layers in db-data store geometry as WKT in EPSG:3857 (Web Mercator).
    // Every layer with a geom field must be reprojected to WGS84 lon/lat GeoJSON.
    const CONVERT_LAYERS = new Set([
      // Boundaries / zones
      "blok_perancangan",
      "gtmix",
      "gtnh_semasa",
      "komited_km",
      "mukim",
      "ndcdb20",
      "ndcdb23",
      "sempadan_daerah",
      "sempadan_taman",
      "taman_perumahan",
      "warta_kawasan_lapang",
      "zon_ahli_majlis",
      // Markets
      "pasar_awam",
      "pasar_malam",
      "pasar_sari",
      "pasar_tani",
      // Roads / infrastructure lines
      "bridge",
      "charting_km",
      "constructed_slope",
      "drainage",
      "earth_work",
      "flexible_post",
      "jalan",
      "jalan_kejuruteraan",
      "road_marking_linear",
      "road_marking_point",
      "road_median",
      "road_shoulder",
      // Point layers
      "cctv",
      "feeder_pillar",
      "lokasi_banjir",
      "location_map_aset",
      "location_map_aset_item",
      "road_hump",
      "sampah_haram",
      "signboard",
      "sport_facility",
      "street_lighting",
      "traffic_light",
    ]);

    // WKT geometry keywords (covers both POINT and MULTI* variants)
    const WKT_PREFIXES = [
      "POINT",
      "LINESTRING",
      "POLYGON",
      "MULTIPOINT",
      "MULTILINESTRING",
      "MULTIPOLYGON",
      "GEOMETRYCOLLECTION",
    ];

    const R = 6378137;
    const mercToLonLat = (xy: number[]): number[] => {
      const x = xy[0], y = xy[1];
      const lon = (x / R) * (180 / Math.PI);
      const lat = (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * (180 / Math.PI);
      return [lon, lat];
    };
    // Recursively reproject a nested coordinate array from Web Mercator to WGS84.
    // Leaf nodes are [x, y, ...] – only the first two values matter for display.
    const reprojectCoords = (coords: unknown): unknown => {
      if (!Array.isArray(coords)) return coords;
      if (typeof coords[0] === "number") return mercToLonLat(coords as number[]);
      return coords.map(reprojectCoords);
    };

    const convertRecord = (record: any) => {
      if (!record || !record.geom || typeof record.geom !== "string") return record;

      const geomText = record.geom.trim().toUpperCase();

      // All db-data geometries are WKT in EPSG:3857 → parse & reproject to WGS84 GeoJSON.
      if (WKT_PREFIXES.some((p) => geomText.startsWith(p))) {
        try {
          const parsed = Geometry.parse(record.geom.trim());
          const gj = parsed.toGeoJSON() as { type: string; coordinates: unknown };
          const geom = { ...gj, coordinates: reprojectCoords(gj.coordinates) };
          return { ...record, geom };
        } catch {
          return record;
        }
      }

      // Fallback: try EWKB hex (legacy, just in case)
      const hex = record.geom.trim();
      if (/^[0-9A-Fa-f]+$/.test(hex) && hex.length >= 32) {
        try {
          const geom = Geometry.parse(Buffer.from(hex, "hex")).toGeoJSON();
          return { ...record, geom };
        } catch {
          return record;
        }
      }

      return record;
    };

    let normalized: any;
    if (Array.isArray(data)) {
      normalized = CONVERT_LAYERS.has(layer) ? data.map(convertRecord) : data;
      normalized = { [layer]: normalized };
    } else if (Array.isArray((data as any)[layer])) {
      const arr = (data as any)[layer];
      (data as any)[layer] = CONVERT_LAYERS.has(layer) ? arr.map(convertRecord) : arr;
      normalized = data;
    } else {
      normalized = data;
    }

    return NextResponse.json(normalized);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to load layer data", detail: message },
      { status: 500 }
    );
  }
}
