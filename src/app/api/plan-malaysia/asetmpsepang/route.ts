import { NextRequest, NextResponse } from "next/server";

// ArcGIS Feature Server for PLANMalaysia AsetMPSepang (public endpoint)
// Original config reference:
// https://gisdev.planmalaysia.gov.my/server/rest/services/Hosted/AsetMPSepang/FeatureServer/0
const ASET_MPSEPANG_LAYER_URL =
  "https://gisdev.planmalaysia.gov.my/server/rest/services/Hosted/AsetMPSepang/FeatureServer/0";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params = new URLSearchParams();
  params.set("f", searchParams.get("f") ?? "json");
  params.set("where", searchParams.get("where") ?? "1=1");
  params.set("outFields", searchParams.get("outFields") ?? "*");
  params.set("returnGeometry", searchParams.get("returnGeometry") ?? "true");
  params.set("outSR", searchParams.get("outSR") ?? "4326");

  searchParams.forEach((value, key) => {
    if (!params.has(key)) {
      params.set(key, value);
    }
  });

  const url = `${ASET_MPSEPANG_LAYER_URL}/query?${params.toString()}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
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
        { error: "ArcGIS API error", detail: data.error },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to query PLANMalaysia AsetMPSepang layer",
        detail: message,
      },
      { status: 500 }
    );
  }
}

