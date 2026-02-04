"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logPageView } from "@/lib/audit-logger";

/**
 * RouteTracker component
 * Automatically logs page views when the route changes
 */
export function RouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Get page title from document or pathname
    const pageTitle = document.title || pathname;
    
    // Log the page view
    logPageView(pathname, pageTitle);
  }, [pathname]);

  return null; // This component doesn't render anything
}

