import { NextRequest, NextResponse } from "next/server";

// ArcGIS Feature Server for PLANMalaysia DBIKMS2025 (public endpoint)
// Original config reference:
// https://gisdev.planmalaysia.gov.my/server/rest/services/Hosted/DBIKMS2025/FeatureServer/0
const PLAN_MALAYSIA_LAYER_URL =
  "https://gisdev.planmalaysia.gov.my/server/rest/services/Hosted/DBIKMS2025/FeatureServer/0";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Default ArcGIS query parameters – caller can override via query string
  const params = new URLSearchParams();
  params.set("f", searchParams.get("f") ?? "json");
  params.set("where", searchParams.get("where") ?? "1=1");
  params.set("outFields", searchParams.get("outFields") ?? "*");
  params.set("returnGeometry", searchParams.get("returnGeometry") ?? "true");
  params.set(
    "outSR",
    searchParams.get("outSR") ?? "4326" // WGS84 lon/lat for Google Maps
  );

  // Pass through any additional ArcGIS query params untouched
  searchParams.forEach((value, key) => {
    if (!params.has(key)) {
      params.set(key, value);
    }
  });

  const url = `${PLAN_MALAYSIA_LAYER_URL}/query?${params.toString()}`;

  try {
    const response = await fetch(url, {
      // 30s timeout at the edge of what's reasonable for feature queries
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "ArcGIS API error",
          status: response.status,
          statusText: response.statusText,
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        {
          error: "ArcGIS API error",
          detail: data.error,
        },
        { status: 502 }
      );
    }

    // Return the raw ArcGIS FeatureSet as-is; the frontend (google-map.tsx)
    // can decide how to convert it to GeoJSON or native google.maps.Data features.
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to query PLANMalaysia layer",
        detail: message,
      },
      { status: 500 }
    );
  }
}

