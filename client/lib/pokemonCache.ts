import { Pokemon } from "@/types/pokemon";

// Cache configuration
const CACHE_VERSION = "1.0.0";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_CACHED_GENERATIONS = 5; // Limit to prevent excessive storage usage

// Compressed Pokemon data for efficient storage
interface CachedPokemon {
  id: string;
  name: string;
  types: string[];
  sprite: string;
}

interface GenerationCacheData {
  generation: number;
  pokemons: CachedPokemon[];
  hasNextPage: boolean;
  endCursor: string | null;
  loadedCount: number;
  timestamp: number;
  version: string;
}

interface PokemonCacheStorage {
  [generation: number]: GenerationCacheData;
  meta: {
    lastAccessed: { [generation: number]: number };
    totalSize: number;
  };
}

/**
 * Compress Pokemon data for efficient localStorage storage
 */
const compressPokemon = (pokemon: Pokemon): CachedPokemon => ({
  id: pokemon.id,
  name: pokemon.name,
  types: pokemon.types?.map((t) => t.type.name) || [],
  sprite:
    pokemon.sprites?.other?.officialArtwork?.frontDefault ||
    pokemon.sprites?.frontDefault ||
    "",
});

/**
 * Decompress cached Pokemon data back to full Pokemon objects
 */
const decompressPokemon = (cached: CachedPokemon): Pokemon =>
  ({
    id: cached.id,
    name: cached.name,
    types: cached.types.map((typeName, index) => ({
      slot: index + 1,
      type: { id: typeName, name: typeName, url: "" },
    })),
    sprites: {
      frontDefault: cached.sprite,
      other: {
        officialArtwork: {
          frontDefault: cached.sprite,
        },
      },
    },
    height: 0,
    weight: 0,
    baseExperience: 0,
    abilities: [],
    stats: [],
    moves: [],
  }) as Pokemon;

/**
 * Get cache storage key
 */
const getCacheKey = (): string => "pokemon_generation_cache";

/**
 * Get current cache from localStorage
 */
const getCurrentCache = (): PokemonCacheStorage => {
  try {
    const cached = localStorage.getItem(getCacheKey());
    if (!cached) {
      return {
        meta: {
          lastAccessed: {},
          totalSize: 0,
        },
      };
    }

    return JSON.parse(cached);
  } catch (error) {
    console.warn(
      "Failed to parse Pokemon cache, initializing new cache:",
      error,
    );
    return {
      meta: {
        lastAccessed: {},
        totalSize: 0,
      },
    };
  }
};

/**
 * Save cache to localStorage
 */
const saveCache = (cache: PokemonCacheStorage): void => {
  try {
    const cacheString = JSON.stringify(cache);
    localStorage.setItem(getCacheKey(), cacheString);

    // Update total size in meta
    cache.meta.totalSize = new Blob([cacheString]).size;
  } catch (error) {
    console.error("Failed to save Pokemon cache:", error);
    // If storage is full, clear oldest caches and retry
    clearOldestCaches(2);
    try {
      localStorage.setItem(getCacheKey(), JSON.stringify(cache));
    } catch (retryError) {
      console.error("Failed to save cache after cleanup:", retryError);
    }
  }
};

/**
 * Check if cached data is still valid (within TTL)
 */
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_TTL;
};

/**
 * Clear oldest cached generations to free up space
 */
const clearOldestCaches = (count: number): void => {
  const cache = getCurrentCache();
  const generations = Object.keys(cache)
    .filter((key) => key !== "meta" && !isNaN(Number(key)))
    .map(Number);

  if (generations.length <= count) return;

  // Sort by last accessed time
  const sortedGenerations = generations.sort((a, b) => {
    const aAccessed = cache.meta?.lastAccessed?.[a] || 0;
    const bAccessed = cache.meta?.lastAccessed?.[b] || 0;
    return aAccessed - bAccessed;
  });

  // Remove oldest caches
  for (let i = 0; i < count; i++) {
    const genToRemove = sortedGenerations[i];
    if (genToRemove !== undefined) {
      delete cache[genToRemove];
      if (cache.meta?.lastAccessed) {
        delete cache.meta.lastAccessed[genToRemove];
      }
    }
  }

  saveCache(cache);
};

/**
 * Cache Pokemon data for a generation
 */
export const cacheGenerationData = (
  generation: number,
  pokemons: Pokemon[],
  hasNextPage: boolean,
  endCursor: string | null,
  loadedCount: number,
): void => {
  try {
    const cache = getCurrentCache();

    // Ensure we don't exceed cache limits
    const currentCacheCount = Object.keys(cache).filter(
      (key) => key !== "meta",
    ).length;

    if (currentCacheCount >= MAX_CACHED_GENERATIONS && !cache[generation]) {
      clearOldestCaches(1);
    }

    // Compress Pokemon data
    const compressedPokemons = pokemons.map(compressPokemon);

    cache[generation] = {
      generation,
      pokemons: compressedPokemons,
      hasNextPage,
      endCursor,
      loadedCount,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    };

    // Update access time
    cache.meta.lastAccessed[generation] = Date.now();

    saveCache(cache);

    console.log(
      `Cached ${pokemons.length} Pokemon for generation ${generation}`,
    );
  } catch (error) {
    console.error("Failed to cache generation data:", error);
  }
};

/**
 * Retrieve cached Pokemon data for a generation
 */
export const getCachedGenerationData = (
  generation: number,
): {
  pokemons: Pokemon[];
  hasNextPage: boolean;
  endCursor: string | null;
  loadedCount: number;
} | null => {
  try {
    const cache = getCurrentCache();
    const generationData = cache[generation];

    if (!generationData) {
      return null;
    }

    // Check if cache is still valid
    if (!isCacheValid(generationData.timestamp)) {
      console.log(`Cache expired for generation ${generation}, removing...`);
      delete cache[generation];
      delete cache.meta.lastAccessed[generation];
      saveCache(cache);
      return null;
    }

    // Check version compatibility
    if (generationData.version !== CACHE_VERSION) {
      console.log(
        `Cache version mismatch for generation ${generation}, removing...`,
      );
      delete cache[generation];
      delete cache.meta.lastAccessed[generation];
      saveCache(cache);
      return null;
    }

    // Update access time
    cache.meta.lastAccessed[generation] = Date.now();
    saveCache(cache);

    // Decompress Pokemon data
    const pokemons = generationData.pokemons.map(decompressPokemon);

    console.log(
      `Retrieved ${pokemons.length} cached Pokemon for generation ${generation}`,
    );

    return {
      pokemons,
      hasNextPage: generationData.hasNextPage,
      endCursor: generationData.endCursor,
      loadedCount: generationData.loadedCount,
    };
  } catch (error) {
    console.error("Failed to retrieve cached generation data:", error);
    return null;
  }
};

/**
 * Check if generation data is cached and valid
 */
export const isGenerationCached = (generation: number): boolean => {
  try {
    const cache = getCurrentCache();
    const generationData = cache[generation];

    return !!(
      generationData &&
      isCacheValid(generationData.timestamp) &&
      generationData.version === CACHE_VERSION
    );
  } catch (error) {
    console.error("Failed to check cache status:", error);
    return false;
  }
};

/**
 * Clear cache for a specific generation
 */
export const clearGenerationCache = (generation: number): void => {
  try {
    const cache = getCurrentCache();
    delete cache[generation];
    delete cache.meta.lastAccessed[generation];
    saveCache(cache);

    console.log(`Cleared cache for generation ${generation}`);
  } catch (error) {
    console.error("Failed to clear generation cache:", error);
  }
};

/**
 * Clear all cached data
 */
export const clearAllCache = (): void => {
  try {
    localStorage.removeItem(getCacheKey());
    console.log("Cleared all Pokemon cache");
  } catch (error) {
    console.error("Failed to clear all cache:", error);
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = (): {
  cachedGenerations: number[];
  totalSize: number;
  oldestCache: number | null;
  newestCache: number | null;
} => {
  try {
    const cache = getCurrentCache();
    const generations = Object.keys(cache)
      .filter((key) => key !== "meta" && !isNaN(Number(key)))
      .map(Number);

    const accessTimes = cache.meta.lastAccessed;
    const oldestCache =
      generations.length > 0
        ? generations.reduce((oldest, gen) =>
            (accessTimes[gen] || 0) < (accessTimes[oldest] || 0) ? gen : oldest,
          )
        : null;

    const newestCache =
      generations.length > 0
        ? generations.reduce((newest, gen) =>
            (accessTimes[gen] || 0) > (accessTimes[newest] || 0) ? gen : newest,
          )
        : null;

    return {
      cachedGenerations: generations,
      totalSize: cache.meta.totalSize || 0,
      oldestCache,
      newestCache,
    };
  } catch (error) {
    console.error("Failed to get cache stats:", error);
    return {
      cachedGenerations: [],
      totalSize: 0,
      oldestCache: null,
      newestCache: null,
    };
  }
};
