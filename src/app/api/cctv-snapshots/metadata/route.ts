import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import path from "path";

const CCTV_SNAPSHOT_DIR = path.join(process.cwd(), "public", "cctv-snapshots");

export interface SnapshotDeviceMeta {
  deviceId: string;
  timestamp: number;
  success: boolean;
  imageUrl: string;
}

export interface SnapshotMetadataResponse {
  lastUpdated: number;
  devices: SnapshotDeviceMeta[];
}

/**
 * GET /api/cctv-snapshots/metadata
 * Reads snapshot metadata from the cctv-snapshots folder (no cron).
 * - Lists *.jpg files in public/cctv-snapshots for each CCTV device.
 * - Optionally merges with metadata.json if present (timestamp, success).
 */
export async function GET() {
  try {
    const devicesMap = new Map<string, { timestamp: number; success: boolean }>();
    let lastUpdated = 0;

    // 1. Read metadata.json if it exists
    const metadataPath = path.join(CCTV_SNAPSHOT_DIR, "metadata.json");
    try {
      const raw = await readFile(metadataPath, "utf-8");
      const meta = JSON.parse(raw) as {
        lastUpdated?: number;
        devices?: Record<string, { timestamp?: number; success?: boolean }>;
      };
      if (typeof meta.lastUpdated === "number") lastUpdated = meta.lastUpdated;
      if (meta.devices && typeof meta.devices === "object") {
        for (const [deviceId, entry] of Object.entries(meta.devices)) {
          devicesMap.set(deviceId, {
            timestamp: typeof entry?.timestamp === "number" ? entry.timestamp : Date.now(),
            success: entry?.success === true,
          });
        }
      }
    } catch {
      // no metadata.json or invalid — we'll rely on directory listing
    }

    // 2. List .jpg files in cctv-snapshots folder (one image per CCTV)
    try {
      const entries = await readdir(CCTV_SNAPSHOT_DIR, { withFileTypes: true });
      for (const e of entries) {
        if (!e.isFile()) continue;
        const name = e.name;
        if (!name.toLowerCase().endsWith(".jpg")) continue;
        const deviceId = name.slice(0, -4);
        if (!devicesMap.has(deviceId)) {
          devicesMap.set(deviceId, {
            timestamp: Date.now(),
            success: true,
          });
        } else {
          // keep existing metadata, but ensure success if file exists
          const existing = devicesMap.get(deviceId)!;
          devicesMap.set(deviceId, { ...existing, success: true });
        }
      }
    } catch (err) {
      console.error("Failed to read cctv-snapshots dir:", err);
    }

    const devices: SnapshotDeviceMeta[] = Array.from(devicesMap.entries()).map(
      ([deviceId, { timestamp, success }]) => ({
        deviceId,
        timestamp,
        success,
        imageUrl: `/cctv-snapshots/${deviceId}.jpg`,
      })
    );

    const body: SnapshotMetadataResponse = {
      lastUpdated: lastUpdated || Date.now(),
      devices,
    };

    return NextResponse.json(body);
  } catch (err) {
    console.error("CCTV snapshot metadata error:", err);
    return NextResponse.json(
      { error: "Failed to read snapshot metadata" },
      { status: 500 }
    );
  }
}
