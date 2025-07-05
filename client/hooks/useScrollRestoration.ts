import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
}

const SCROLL_POSITIONS_KEY = "pokemon-scroll-positions";
const POSITION_TTL = 30 * 60 * 1000; // 30 minutes

export function useScrollRestoration(key?: string) {
  const pathname = usePathname();
  const scrollKey = key || pathname;
  const hasRestoredRef = useRef(false);

  // Get stored positions
  const getStoredPositions = useCallback((): Record<string, ScrollPosition> => {
    try {
      const stored = sessionStorage.getItem(SCROLL_POSITIONS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  // Save scroll position
  const saveScrollPosition = useCallback(() => {
    const positions = getStoredPositions();
    positions[scrollKey] = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now(),
    };

    // Clean up old positions
    const now = Date.now();
    Object.keys(positions).forEach((key) => {
      const position = positions[key];
      if (position && now - position.timestamp > POSITION_TTL) {
        delete positions[key];
      }
    });

    try {
      sessionStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(positions));
    } catch {
      // Ignore storage errors
    }
  }, [scrollKey, getStoredPositions]);

  // Restore scroll position
  const restoreScrollPosition = useCallback(() => {
    if (hasRestoredRef.current) return;

    const positions = getStoredPositions();
    const position = positions[scrollKey];

    if (position && Date.now() - position.timestamp < POSITION_TTL) {
      // Use requestAnimationFrame for smoother restoration
      requestAnimationFrame(() => {
        window.scrollTo({
          top: position.y,
          left: position.x,
          behavior: "instant" as ScrollBehavior,
        });
        hasRestoredRef.current = true;
      });
    }
  }, [scrollKey, getStoredPositions]);

  // Clear scroll position
  const clearScrollPosition = useCallback(() => {
    const positions = getStoredPositions();
    delete positions[scrollKey];
    try {
      sessionStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(positions));
    } catch {
      // Ignore storage errors
    }
  }, [scrollKey, getStoredPositions]);

  useEffect(() => {
    // Restore position when component mounts
    const timeoutId = setTimeout(restoreScrollPosition, 100);

    // Save position before unmount
    const handleBeforeUnload = () => saveScrollPosition();

    // Save position on scroll (debounced)
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(saveScrollPosition, 150);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(scrollTimeout);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("scroll", handleScroll);
      saveScrollPosition(); // Save on unmount
    };
  }, [scrollKey, restoreScrollPosition, saveScrollPosition]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
  };
}
