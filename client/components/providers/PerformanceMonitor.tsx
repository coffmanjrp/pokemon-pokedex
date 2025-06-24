"use client";

import { useEffect } from "react";
import { initPerformanceMonitoring } from "@/lib/performance";

/**
 * Performance monitoring component
 * Initializes performance tracking and Web Vitals monitoring
 */
export function PerformanceMonitor() {
  useEffect(() => {
    // Initialize performance monitoring when component mounts
    initPerformanceMonitoring();
  }, []);

  // This component doesn't render anything
  return null;
}
