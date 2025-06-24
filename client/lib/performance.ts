/**
 * Performance monitoring utilities
 */

// Performance marks for measuring critical user journeys
export const PerformanceMarks = {
  NAVIGATION_START: "navigation-start",
  POKEMON_LIST_LOADED: "pokemon-list-loaded",
  POKEMON_DETAIL_LOADED: "pokemon-detail-loaded",
  SEARCH_COMPLETED: "search-completed",
  FILTER_APPLIED: "filter-applied",
} as const;

// Web Vitals thresholds
export const WEB_VITALS_THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100, // First Input Delay (ms)
  CLS: 0.1, // Cumulative Layout Shift
  FCP: 1800, // First Contentful Paint (ms)
  TTFB: 600, // Time to First Byte (ms)
} as const;

// Layout shift entry interface
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

/**
 * Mark performance milestone
 */
export function markPerformance(name: string): void {
  if (typeof window !== "undefined" && "performance" in window) {
    try {
      performance.mark(name);
    } catch (error) {
      console.warn("Failed to mark performance:", error);
    }
  }
}

/**
 * Measure performance between two marks
 */
export function measurePerformance(
  name: string,
  startMark: string,
  endMark?: string,
): number | null {
  if (typeof window !== "undefined" && "performance" in window) {
    try {
      const measurement = endMark
        ? performance.measure(name, startMark, endMark)
        : performance.measure(name, startMark);
      return measurement.duration;
    } catch (error) {
      console.warn("Failed to measure performance:", error);
      return null;
    }
  }
  return null;
}

/**
 * Get navigation timing metrics
 */
export function getNavigationTiming() {
  if (typeof window !== "undefined" && "performance" in window) {
    const timing = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    if (timing) {
      return {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        request: timing.responseStart - timing.requestStart,
        response: timing.responseEnd - timing.responseStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.fetchStart,
        load: timing.loadEventEnd - timing.fetchStart,
        ttfb: timing.responseStart - timing.requestStart,
      };
    }
  }
  return null;
}

/**
 * Log performance metrics to console (development only)
 */
export function logPerformanceMetrics(): void {
  if (process.env.NODE_ENV === "development") {
    const timing = getNavigationTiming();
    if (timing) {
      console.group("🚀 Performance Metrics");
      console.log("DNS Lookup:", `${timing.dns.toFixed(2)}ms`);
      console.log("TCP Connection:", `${timing.tcp.toFixed(2)}ms`);
      console.log("Request:", `${timing.request.toFixed(2)}ms`);
      console.log("Response:", `${timing.response.toFixed(2)}ms`);
      console.log(
        "DOM Content Loaded:",
        `${timing.domContentLoaded.toFixed(2)}ms`,
      );
      console.log("Load Complete:", `${timing.load.toFixed(2)}ms`);
      console.log("Time to First Byte:", `${timing.ttfb.toFixed(2)}ms`);
      console.groupEnd();
    }
  }
}

/**
 * Monitor Web Vitals and report if thresholds are exceeded
 */
export function monitorWebVitals(): void {
  if (typeof window !== "undefined" && "PerformanceObserver" in window) {
    // Monitor LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        if (lastEntry && lastEntry.startTime > WEB_VITALS_THRESHOLDS.LCP) {
          console.warn(
            `⚠️ LCP exceeded threshold: ${lastEntry.startTime.toFixed(2)}ms`,
          );
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (error) {
      console.warn("LCP observer not supported:", error);
    }

    // Monitor FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const firstInputEntry = entry as PerformanceEventTiming;
          const fid =
            firstInputEntry.processingStart - firstInputEntry.startTime;
          if (fid > WEB_VITALS_THRESHOLDS.FID) {
            console.warn(`⚠️ FID exceeded threshold: ${fid.toFixed(2)}ms`);
          }
        });
      });
      fidObserver.observe({ type: "first-input", buffered: true });
    } catch (error) {
      console.warn("FID observer not supported:", error);
    }

    // Monitor CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as LayoutShiftEntry;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        });
        if (clsValue > WEB_VITALS_THRESHOLDS.CLS) {
          console.warn(`⚠️ CLS exceeded threshold: ${clsValue.toFixed(4)}`);
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch (error) {
      console.warn("CLS observer not supported:", error);
    }
  }
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(): void {
  if (typeof window !== "undefined") {
    // Mark navigation start
    markPerformance(PerformanceMarks.NAVIGATION_START);

    // Start Web Vitals monitoring
    monitorWebVitals();

    // Log metrics when page loads (development only)
    if (document.readyState === "complete") {
      logPerformanceMetrics();
    } else {
      window.addEventListener("load", logPerformanceMetrics);
    }
  }
}
