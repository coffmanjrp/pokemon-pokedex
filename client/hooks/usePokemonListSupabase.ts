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

  const [localGeneration, setLocalGeneration] = useState(generation);
  const loadingRef = useRef(false);
  const mountedRef = useRef(true);

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
          }),
        );
        persistCacheData(gen, cacheData);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
        if (mountedRef.current) {
          dispatch(
            setError(
              error instanceof Error
                ? error.message
                : "Failed to fetch Pokemon",
            ),
          );
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

    if (
      autoFetch &&
      initialPokemon.length === 0 &&
      currentGeneration === localGeneration
    ) {
      fetchGenerationData(currentGeneration);
    } else if (initialPokemon.length > 0) {
      dispatch(setPokemons(initialPokemon));
    }

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle generation changes
  useEffect(() => {
    if (currentGeneration !== localGeneration) {
      setLocalGeneration(currentGeneration);
      if (autoFetch) {
        fetchGenerationData(currentGeneration);
      }
    }
  }, [currentGeneration, localGeneration, autoFetch, fetchGenerationData]);

  // Get generation range (similar to usePokemonList)
  const generationRange = (() => {
    if (currentGeneration === 0) {
      return { min: 10001, max: 11000 }; // Arbitrary range for forms
    }
    const genStart = (currentGeneration - 1) * 151 + 1;
    const genEnd = currentGeneration * 151;
    return { min: genStart, max: genEnd };
  })();

  return {
    pokemons: pokemons || [],
    loading,
    error,
    hasNextPage,
    loadMore: () => {}, // Supabase loads all at once, no pagination
    refresh: () => fetchGenerationData(currentGeneration),
    currentGeneration,
    changeGeneration: setCurrentGeneration,
    generationRange,
    loadedCount: pokemons?.length || 0,
    totalCount: pokemons?.length || 0,
  };
}
