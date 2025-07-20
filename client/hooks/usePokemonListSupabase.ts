"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setLoading,
  setError,
  setPokemons,
  setHasNextPage,
  setEndCursor,
  setCurrentGeneration as setReduxCurrentGeneration,
  setGenerationSwitching,
  cacheGenerationData,
} from "@/store/slices/pokemonSlice";
import {
  cacheGenerationData as persistCacheData,
  getCachedGenerationData,
} from "@/lib/pokemonCache";
import {
  getPokemonByGeneration,
  getPokemonForms,
} from "@/lib/supabase/pokemon";
import { Pokemon } from "@/types/pokemon";
import { GENERATION_RANGES } from "@/lib/data/generations";

interface UsePokemonListOptions {
  generation?: number;
  initialPokemon?: Pokemon[];
  autoFetch?: boolean;
}

export function usePokemonListSupabase({
  generation = 1,
  initialPokemon = [],
  autoFetch = true,
}: UsePokemonListOptions = {}) {
  const dispatch = useAppDispatch();
  const {
    currentGeneration,
    generationData,
    pokemons,
    loading,
    error,
    hasNextPage,
  } = useAppSelector((state) => state.pokemon);

  // Use Redux state's currentGeneration as the source of truth
  const [localGeneration, setLocalGeneration] = useState(generation);
  const loadingRef = useRef(false);
  const mountedRef = useRef(true);
  const isFirstMountRef = useRef(true);

  // Fetch Pokemon data from Supabase
  const fetchGenerationData = useCallback(
    async (gen: number) => {
      // Prevent multiple simultaneous fetches
      if (loadingRef.current) return;
      loadingRef.current = true;

      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        // Check cache first
        const cachedData = getCachedGenerationData(gen);
        if (
          cachedData &&
          cachedData.pokemons &&
          cachedData.pokemons.length > 0
        ) {
          if (mountedRef.current) {
            dispatch(setPokemons(cachedData.pokemons));
            dispatch(setHasNextPage(cachedData.hasNextPage || false));
            dispatch(setEndCursor(cachedData.endCursor || null));
            dispatch(
              cacheGenerationData({
                generation: gen,
                pokemons: cachedData.pokemons,
                hasNextPage: cachedData.hasNextPage || false,
                endCursor: cachedData.endCursor || null,
                loadedCount: cachedData.pokemons.length,
              }),
            );
          }
          return;
        }

        let pokemonData: Pokemon[] = [];

        if (gen === 0) {
          // Fetch forms for generation 0
          pokemonData = await getPokemonForms();
        } else {
          // Fetch regular Pokemon by generation
          pokemonData = await getPokemonByGeneration(gen);
        }

        if (!mountedRef.current) return;

        // Update Redux store
        dispatch(setPokemons(pokemonData));
        dispatch(setHasNextPage(false));
        dispatch(setEndCursor(null));

        // Cache the data
        const cacheData = {
          pokemons: pokemonData,
          hasNextPage: false,
          endCursor: null,
        };

        dispatch(
          cacheGenerationData({
            generation: gen,
            pokemons: pokemonData,
            hasNextPage: false,
            endCursor: null,
            loadedCount: pokemonData.length,
          }),
        );
        persistCacheData(
          gen,
          cacheData.pokemons,
          cacheData.hasNextPage,
          cacheData.endCursor,
          cacheData.pokemons.length,
        );
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
        if (mountedRef.current) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch Pokemon";

          // Log more details for debugging
          console.error("Fetch error details:", {
            generation: gen,
            error: error,
            errorMessage: errorMessage,
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          });

          dispatch(setError(errorMessage));
        }
      } finally {
        if (mountedRef.current) {
          dispatch(setLoading(false));
          dispatch(setGenerationSwitching(false));
        }
        loadingRef.current = false;
      }
    },
    [dispatch],
  );

  // Set current generation
  const setCurrentGeneration = useCallback(
    async (newGeneration: number) => {
      if (newGeneration === currentGeneration) return;

      dispatch(setGenerationSwitching(true));
      dispatch(setReduxCurrentGeneration(newGeneration));
      setLocalGeneration(newGeneration);

      // Check if data is already cached in Redux
      const cachedInRedux = generationData[newGeneration];
      if (
        cachedInRedux &&
        cachedInRedux.pokemons &&
        cachedInRedux.pokemons.length > 0
      ) {
        dispatch(setPokemons(cachedInRedux.pokemons));
        dispatch(setHasNextPage(cachedInRedux.hasNextPage || false));
        dispatch(setEndCursor(cachedInRedux.endCursor || null));
        dispatch(setGenerationSwitching(false));
        return;
      }

      // Otherwise fetch from Supabase
      await fetchGenerationData(newGeneration);
    },
    [currentGeneration, generationData, dispatch, fetchGenerationData],
  );

  // Initialize on mount
  useEffect(() => {
    mountedRef.current = true;

    // Always prefer the generation prop passed from parent
    const targetGeneration = generation;

    // Update Redux state to match the prop
    if (currentGeneration !== targetGeneration) {
      dispatch(setReduxCurrentGeneration(targetGeneration));
    }

    if (autoFetch && initialPokemon.length === 0) {
      fetchGenerationData(targetGeneration);
    } else if (initialPokemon.length > 0) {
      dispatch(setPokemons(initialPokemon));
    }

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generation]);

  // Handle generation changes from Redux state (but skip on first mount)
  useEffect(() => {
    // Skip this effect on first mount to avoid duplicate fetches
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }

    if (currentGeneration !== localGeneration) {
      setLocalGeneration(currentGeneration);
      if (autoFetch) {
        fetchGenerationData(currentGeneration);
      }
    }
  }, [currentGeneration, localGeneration, autoFetch, fetchGenerationData]);

  // Get generation range from GENERATION_RANGES
  // Use the generation prop passed from parent, not Redux state
  const effectiveGeneration = generation;
  const generationRange = GENERATION_RANGES[
    effectiveGeneration as keyof typeof GENERATION_RANGES
  ] || {
    min: 1,
    max: 1025,
    region: { en: "Unknown", ja: "不明" },
  };

  return {
    pokemons: pokemons || [],
    loading,
    error,
    hasNextPage,
    loadMore: () => {}, // Supabase loads all at once, no pagination
    refresh: () => fetchGenerationData(effectiveGeneration),
    currentGeneration: effectiveGeneration,
    changeGeneration: setCurrentGeneration,
    generationRange,
    loadedCount: pokemons?.length || 0,
    totalCount: pokemons?.length || 0,
  };
}
