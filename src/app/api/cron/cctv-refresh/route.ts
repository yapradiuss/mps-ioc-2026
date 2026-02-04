import { NextRequest, NextResponse } from "next/server";

/**
 * Cron endpoint: runs inside Next.js only (no Express.js).
 * Vercel Cron hits this route on schedule; no secret required, runs automatically.
 * Add any in-app refresh logic here (e.g. cache invalidation, internal APIs).
 */
export async function GET(_request: NextRequest) {
  return runCctvRefresh();
}

export async function POST(_request: NextRequest) {
  return runCctvRefresh();
}

async function runCctvRefresh() {
  // Cron runs entirely in Next.js — no auth, no call to Express.
  // Add any server-side refresh logic here.
  return NextResponse.json({
    success: true,
    message: "CCTV cron ran (Next.js only, no Express)",
  });
}
