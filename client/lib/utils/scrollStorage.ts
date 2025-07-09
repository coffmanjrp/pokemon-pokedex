/**
 * Session storage utility for scroll position persistence
 * Maintains scroll positions across navigation but clears on tab close
 */

interface ScrollPositionData {
  generation: number;
  scrollTop?: number; // For standard grid
  pokemonIndex?: number; // For virtual scroll
  pokemonId?: string; // The Pokemon ID clicked
  timestamp: number;
}

const STORAGE_KEY = "pokemon-scroll-positions";
const LAST_VISITED_KEY = "pokemon-last-visited";
const RETURN_FLAG_KEY = "pokemon-return-from-detail";

/**
 * Save scroll position to session storage
 */
export function saveScrollPositionToStorage(data: ScrollPositionData): void {
  try {
    // Get existing positions
    const existing = getScrollPositionsFromStorage();

    // Update with new position
    existing[data.generation] = data;

    // Save back to storage
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.warn("Failed to save scroll position to session storage:", error);
  }
}

/**
 * Get all scroll positions from session storage
 */
export function getScrollPositionsFromStorage(): Record<
  number,
  ScrollPositionData
> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    return JSON.parse(stored);
  } catch (error) {
    console.warn(
      "Failed to load scroll positions from session storage:",
      error,
    );
    return {};
  }
}

/**
 * Get scroll position for a specific generation
 */
export function getScrollPositionForGeneration(
  generation: number,
): ScrollPositionData | null {
  const positions = getScrollPositionsFromStorage();
  return positions[generation] || null;
}

/**
 * Clear scroll position for a specific generation
 */
export function clearScrollPositionForGeneration(generation: number): void {
  try {
    const positions = getScrollPositionsFromStorage();
    delete positions[generation];

    if (Object.keys(positions).length === 0) {
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    }
  } catch (error) {
    console.warn("Failed to clear scroll position:", error);
  }
}

/**
 * Clear all scroll positions
 */
export function clearAllScrollPositions(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(LAST_VISITED_KEY);
    sessionStorage.removeItem(RETURN_FLAG_KEY);
  } catch (error) {
    console.warn("Failed to clear all scroll positions:", error);
  }
}

/**
 * Save last visited Pokemon
 */
export function saveLastVisitedPokemon(pokemonId: string): void {
  try {
    sessionStorage.setItem(LAST_VISITED_KEY, pokemonId);
  } catch (error) {
    console.warn("Failed to save last visited Pokemon:", error);
  }
}

/**
 * Get last visited Pokemon
 */
export function getLastVisitedPokemon(): string | null {
  try {
    return sessionStorage.getItem(LAST_VISITED_KEY);
  } catch (error) {
    console.warn("Failed to get last visited Pokemon:", error);
    return null;
  }
}

/**
 * Set return from detail flag
 */
export function setReturnFromDetailFlag(value: boolean): void {
  try {
    if (value) {
      sessionStorage.setItem(RETURN_FLAG_KEY, "true");
    } else {
      sessionStorage.removeItem(RETURN_FLAG_KEY);
    }
  } catch (error) {
    console.warn("Failed to set return from detail flag:", error);
  }
}

/**
 * Get return from detail flag
 */
export function getReturnFromDetailFlag(): boolean {
  try {
    return sessionStorage.getItem(RETURN_FLAG_KEY) === "true";
  } catch (error) {
    console.warn("Failed to get return from detail flag:", error);
    return false;
  }
}

/**
 * Sync Redux state with session storage
 * Call this when initializing the app
 */
export function syncScrollPositionsFromStorage(): Record<
  number,
  ScrollPositionData
> {
  return getScrollPositionsFromStorage();
}
