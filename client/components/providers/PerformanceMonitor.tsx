"use client";

import { useEffect } from "react";
import { initPerformanceMonitoring } from "@/lib/performance";

/**
 * Performance monitoring component
 * Initializes performance tracking and Web Vitals monitoring
 */
export function PerformanceMonitor() {
  useEffect(() => {
    // Only initialize on client-side after component mounts
    if (typeof window !== "undefined") {
      initPerformanceMonitoring();
    }
  }, []);

  // This component doesn't render anything
  return null;
}
