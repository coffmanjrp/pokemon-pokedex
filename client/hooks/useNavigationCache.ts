import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import {
  setCurrentGeneration,
  loadCachedGeneration,
} from "@/store/slices/pokemonSlice";
import {
  getCachedGenerationData,
  isGenerationCached,
} from "@/lib/pokemonCache";

/**
 * Hook for managing navigation cache restoration
 * Handles browser back/forward navigation and URL-based generation switching
 */
export const useNavigationCache = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return;
    }

    // Handle browser navigation events (back/forward buttons)
    const handlePopState = (event: PopStateEvent) => {
      // Extract generation from current URL
      const urlParams = new URLSearchParams(window.location.search);
      const generationParam = urlParams.get("generation");

      if (generationParam) {
        const generation = parseInt(generationParam);

        if (!isNaN(generation) && generation >= 0 && generation <= 9) {
          // Check if we have cached data for this generation
          if (isGenerationCached(generation)) {
            const cachedData = getCachedGenerationData(generation);

            if (cachedData) {
              // Dispatch Redux actions to restore state
              dispatch(loadCachedGeneration(generation));

              // Prevent default navigation behavior since we're handling it
              event.preventDefault();

              return;
            }
          }

          // If no cache available, update generation normally
          dispatch(setCurrentGeneration(generation));
        }
      }
    };

    // Add event listener for browser navigation
    window.addEventListener("popstate", handlePopState);

    // Cleanup event listener
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [dispatch]);

  /**
   * Navigate to a specific generation with cache awareness
   */
  const navigateToGeneration = (generation: number, pathname: string = "/") => {
    const url = `${pathname}?generation=${generation}`;

    // Only use cache navigation in browser environment
    if (typeof window !== "undefined") {
      // Check if we have cached data for this generation
      if (isGenerationCached(generation)) {
        const cachedData = getCachedGenerationData(generation);

        if (cachedData) {
          // Load cached data immediately
          dispatch(loadCachedGeneration(generation));

          // Update URL without triggering a reload
          window.history.pushState({ generation }, "", url);

          return;
        }
      }
    }

    // If no cache available, navigate normally
    router.push(url);
  };

  /**
   * Restore generation state from URL on initial load
   */
  const restoreFromURL = () => {
    // Check if running in browser (not SSR)
    if (typeof window === "undefined") {
      return false;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const generationParam = urlParams.get("generation");

    if (generationParam) {
      const generation = parseInt(generationParam);

      if (!isNaN(generation) && generation >= 0 && generation <= 9) {
        // Check if we have cached data for this generation
        if (isGenerationCached(generation)) {
          const cachedData = getCachedGenerationData(generation);

          if (cachedData) {
            dispatch(loadCachedGeneration(generation));
            return true;
          }
        }

        // If no cache, just set the generation
        dispatch(setCurrentGeneration(generation));
        return true;
      }
    }

    return false;
  };

  return {
    navigateToGeneration,
    restoreFromURL,
  };
};
