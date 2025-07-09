// Scroll position storage utilities using sessionStorage
const SCROLL_STORAGE_KEY = "pokemon-scroll-positions";

export interface ScrollData {
  generation: number;
  scrollTop?: number;
  pokemonIndex?: number;
  pokemonId?: string;
  timestamp: number;
}

export interface ScrollStorage {
  [generation: number]: ScrollData;
}

/**
 * Save scroll position to sessionStorage
 */
export const saveScrollToStorage = (data: ScrollData): void => {
  try {
    const existing = getScrollFromStorage();
    existing[data.generation] = data;
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error("Failed to save scroll position to storage:", error);
  }
};

/**
 * Get all scroll positions from sessionStorage
 */
export const getScrollFromStorage = (): ScrollStorage => {
  try {
    const stored = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as ScrollStorage;
    }
  } catch (error) {
    console.error("Failed to get scroll position from storage:", error);
  }
  return {};
};

/**
 * Get scroll position for a specific generation
 */
export const getGenerationScroll = (generation: number): ScrollData | null => {
  const storage = getScrollFromStorage();
  return storage[generation] || null;
};

/**
 * Clear scroll position for a specific generation
 */
export const clearGenerationScroll = (generation: number): void => {
  try {
    const storage = getScrollFromStorage();
    delete storage[generation];
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error("Failed to clear scroll position from storage:", error);
  }
};

/**
 * Clear all scroll positions
 */
export const clearAllScrolls = (): void => {
  try {
    sessionStorage.removeItem(SCROLL_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear all scroll positions:", error);
  }
};

/**
 * Check if scroll data is still valid (within 30 minutes)
 */
export const isScrollDataValid = (data: ScrollData): boolean => {
  const THIRTY_MINUTES = 30 * 60 * 1000;
  return Date.now() - data.timestamp < THIRTY_MINUTES;
};
