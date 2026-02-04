/**
 * Backend API base URL. Uses first value if NEXT_PUBLIC_API_URL is comma-separated.
 * Required at build time for Next.js (NEXT_PUBLIC_*).
 */
export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").split(",")[0].trim();
