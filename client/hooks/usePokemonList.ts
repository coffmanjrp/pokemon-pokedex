"use client";

import { useQuery } from "@apollo/client";

// Type extension for window object to handle timeout IDs
declare global {
  interface Window {
    generationSwitchingTimeout?: NodeJS.Timeout;
  }
}
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setLoading,
  setError,
  setPokemons,
  setHasNextPage,
  setEndCursor,
  setCurrentGeneration as setReduxCurrentGeneration,
  setGenerationSwitching,
} from "@/store/slices/pokemonSlice";
import { getListQuery, isSSGBuild } from "@/lib/querySelector";
import { Pokemon } from "@/types/pokemon";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

interface PokemonEdge {
  node: Pokemon;
}

import { GENERATION_RANGES } from "@/lib/data/generations";

// Smart clear logic: Check if current Pokemon data belongs to the new generation
const needsClearForGeneration = (
  currentPokemons: Pokemon[],
  newGeneration: number,
): boolean => {
  if (currentPokemons.length === 0) {
    return false; // No data to clear
  }

  const newGenerationRange =
    GENERATION_RANGES[newGeneration as keyof typeof GENERATION_RANGES];
  const currentFirstPokemon = currentPokemons[0];

  if (!currentFirstPokemon) {
    return true; // If no current Pokemon, we need to switch
  }

  const currentFirstId = parseInt(currentFirstPokemon.id);

  // Check if current first Pokemon is outside the new generation range
  const isOutsideRange =
    currentFirstId < newGenerationRange.min ||
    currentFirstId > newGenerationRange.max;

  return isOutsideRange;
};

interface UsePokemonListOptions {
  generation?: number;
  initialPokemon?: Pokemon[];
  autoFetch?: boolean;
}

export function usePokemonList({
  generation = 1,
  initialPokemon = [],
  autoFetch = true,
}: UsePokemonListOptions = {}) {
  const dispatch = useAppDispatch();
  const { pokemons, loading, error, hasNextPage } = useAppSelector(
    (state) => state.pokemon,
  );
  const isLoadingMore = useRef(false);
  const [currentGeneration, setCurrentGeneration] = useState(generation);

  // Calculate offset and limit based on generation
  const generationRange =
    GENERATION_RANGES[currentGeneration as keyof typeof GENERATION_RANGES];
  const generationOffset = generationRange.min - 1; // Convert to 0-based index

  // Start with initial batch, then load more progressively
  const initialBatchSize = 20;
  const generationLimit = initialBatchSize;

  // Update generation when prop changes
  useEffect(() => {
    if (generation !== currentGeneration) {
      setCurrentGeneration(generation);
    }
  }, [generation, currentGeneration]);

  // Initialize with server-side data (ISR)
  useEffect(() => {
    if (initialPokemon.length > 0 && pokemons.length === 0) {
      console.log(
        `Initializing with ${initialPokemon.length} server-side Pokemon for ISR`,
      );
      dispatch(setPokemons(initialPokemon));
      dispatch(setHasNextPage(initialPokemon.length >= initialBatchSize));
      dispatch(setLoading(false));
    }
  }, [initialPokemon, pokemons.length, dispatch]);

  // Use appropriate query based on build mode
  const selectedQuery = getListQuery();

  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
    fetchMore,
  } = useQuery(selectedQuery, {
    variables: { limit: generationLimit, offset: generationOffset },
    skip: !autoFetch,
    notifyOnNetworkStatusChange: true,
    errorPolicy: "all",
  });

  // Helper function to get field name based on query type
  const getDataFieldName = useCallback(() => {
    return isSSGBuild() ? "pokemons" : "pokemonsBasic";
  }, []);

  useEffect(() => {
    if (!isLoadingMore.current) {
      dispatch(setLoading(queryLoading));
    }
  }, [queryLoading, dispatch]);

  useEffect(() => {
    if (queryError) {
      dispatch(setError(queryError.message));
    } else {
      dispatch(setError(null));
    }
  }, [queryError, dispatch]);

  useEffect(() => {
    // Handle both pokemonsBasic and pokemons response formats
    const fieldName = getDataFieldName();
    const pokemonData = data?.[fieldName];
    if (pokemonData && !isLoadingMore.current) {
      const { edges, pageInfo } = pokemonData;
      const pokemonList = edges
        .map((edge: PokemonEdge) => {
          // Clean Pokemon data to remove any potential circular references
          const pokemon = edge.node;
          return {
            id: pokemon.id,
            name: pokemon.name,
            height: pokemon.height,
            weight: pokemon.weight,
            baseExperience: pokemon.baseExperience,
            types: pokemon.types,
            sprites: pokemon.sprites,
            stats: pokemon.stats,
            abilities: pokemon.abilities,
            moves: pokemon.moves,
            species: pokemon.species,
            gameIndices: pokemon.gameIndices,
          } as Pokemon;
        })
        .filter((pokemon: Pokemon) => {
          // Strict generation range check - only include Pokemon within current generation range
          const pokemonId = parseInt(pokemon.id);
          const isInCurrentGeneration =
            pokemonId >= generationRange.min &&
            pokemonId <= generationRange.max;

          // Debug log (remove in production)
          if (!isInCurrentGeneration) {
            console.warn(
              `Filtered out Pokemon #${pokemonId} (${pokemon.name}) - not in current generation range ${generationRange.min}-${generationRange.max}`,
            );
          }

          return isInCurrentGeneration;
        });

      // Only update state if we have valid Pokemon in the correct generation
      if (pokemonList.length > 0) {
        dispatch(setPokemons(pokemonList));

        // Check if we've loaded all Pokemon in this generation
        const totalPokemonInGeneration =
          generationRange.max - generationRange.min + 1;
        const hasMoreInGeneration =
          pokemonList.length < totalPokemonInGeneration;

        dispatch(setHasNextPage(hasMoreInGeneration));
        dispatch(setEndCursor(pageInfo.endCursor));

        // Successfully loaded Pokemon - end generation switching overlay and loading
        dispatch(setGenerationSwitching(false));
        dispatch(setLoading(false));

        // Clear generation switching timeout (successful completion)
        if (window.generationSwitchingTimeout) {
          clearTimeout(window.generationSwitchingTimeout);
          delete window.generationSwitchingTimeout;
        }
      } else if (edges.length > 0) {
        // If we got data but no Pokemon match the generation range, silently continue with current data
        console.warn(
          "Received Pokemon data but none match the current generation range",
        );
        dispatch(setLoading(false));
        dispatch(setGenerationSwitching(false));

        // Clear timeout since we're handling the situation
        if (window.generationSwitchingTimeout) {
          clearTimeout(window.generationSwitchingTimeout);
          delete window.generationSwitchingTimeout;
        }
      } else {
        // No data received at all - silently end loading without error
        console.warn(
          "No Pokemon data received for generation",
          currentGeneration,
        );
        dispatch(setLoading(false));
        dispatch(setGenerationSwitching(false));

        // Clear timeout since we're handling the situation
        if (window.generationSwitchingTimeout) {
          clearTimeout(window.generationSwitchingTimeout);
          delete window.generationSwitchingTimeout;
        }
      }
    }
  }, [data, dispatch, generationRange, currentGeneration, getDataFieldName]);

  // Calculate unique Pokemon for counting from Apollo Client cache
  const uniquePokemons = useMemo(() => {
    const fieldName = getDataFieldName();
    const apolloData =
      data?.[fieldName]?.edges?.map((edge: PokemonEdge) => edge.node) || [];

    // Combine with Redux state and deduplicate
    const allPokemons = [...apolloData, ...pokemons];
    return allPokemons.reduce((acc: Pokemon[], current) => {
      const exists = acc.find((pokemon) => pokemon.id === current.id);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);
  }, [data, pokemons, getDataFieldName]);

  // Refetch when generation changes
  useEffect(() => {
    if (autoFetch) {
      refetch({
        limit: generationLimit,
        offset: generationOffset,
      });
    }
  }, [
    currentGeneration,
    autoFetch,
    refetch,
    generationLimit,
    generationOffset,
  ]);

  const loadMore = useCallback(async (): Promise<number> => {
    if (!hasNextPage || loading || isLoadingMore.current) {
      return 0;
    }

    try {
      isLoadingMore.current = true;
      dispatch(setLoading(true));

      // Calculate current loaded Pokemon count in this generation only
      const currentGenerationPokemons = uniquePokemons.filter((pokemon) => {
        const pokemonId = parseInt(pokemon.id);
        return (
          pokemonId >= generationRange.min && pokemonId <= generationRange.max
        );
      });

      const currentLoadedInGeneration = currentGenerationPokemons.length;
      const nextOffset = generationRange.min - 1 + currentLoadedInGeneration;

      // Calculate remaining Pokemon in generation
      const totalPokemonInGeneration =
        generationRange.max - generationRange.min + 1;
      const remainingPokemon =
        totalPokemonInGeneration - currentLoadedInGeneration;

      // Don't load more than what's remaining in this generation
      const loadLimit = Math.min(20, remainingPokemon);

      if (loadLimit <= 0) {
        dispatch(setHasNextPage(false));
        return 0;
      }

      // Use Apollo Client fetchMore instead of direct fetch
      const result = await fetchMore({
        variables: {
          limit: loadLimit,
          offset: nextOffset,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;

          const fieldName = getDataFieldName();
          const previousData = previousResult[fieldName];
          const newData = fetchMoreResult[fieldName];

          if (!newData || !newData.edges.length) {
            return previousResult;
          }

          // Filter new Pokemon to only include those in current generation
          const filteredEdges = newData.edges.filter((edge: PokemonEdge) => {
            const pokemonId = parseInt(edge.node.id);
            return (
              pokemonId >= generationRange.min &&
              pokemonId <= generationRange.max
            );
          });

          return {
            ...previousResult,
            [fieldName]: {
              ...newData,
              edges: [...previousData.edges, ...filteredEdges],
            },
          };
        },
      });

      const fieldName = getDataFieldName();
      const newData = result.data[fieldName];

      if (newData) {
        const newPokemon = newData.edges
          .slice(-loadLimit) // Get only the newly added Pokemon
          .map((edge: PokemonEdge) => edge.node as Pokemon)
          .filter((pokemon: Pokemon) => {
            const pokemonId = parseInt(pokemon.id);
            return (
              pokemonId >= generationRange.min &&
              pokemonId <= generationRange.max
            );
          });

        // Check if we've reached the end of the generation
        const totalLoadedAfterAdd =
          currentLoadedInGeneration + newPokemon.length;
        const hasMoreInGeneration =
          totalLoadedAfterAdd < totalPokemonInGeneration;

        dispatch(setHasNextPage(hasMoreInGeneration));

        return newPokemon.length;
      }
      return 0;
    } catch (error) {
      console.error("LoadMore error:", error);
      // Silently handle errors - no error message to user
      return 0;
    } finally {
      dispatch(setLoading(false));
      isLoadingMore.current = false;
    }
  }, [
    hasNextPage,
    loading,
    dispatch,
    generationRange.min,
    generationRange.max,
    uniquePokemons,
    fetchMore,
    getDataFieldName,
  ]);

  const refresh = async () => {
    try {
      dispatch(setLoading(true));
      await refetch({
        limit: generationLimit,
        offset: generationOffset,
      });
    } catch (err) {
      dispatch(
        setError(
          err instanceof Error ? err.message : "Failed to refresh Pokemon list",
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Generation change handler
  const changeGeneration = (newGeneration: number) => {
    if (newGeneration !== currentGeneration) {
      // Check if we need to clear current data
      const shouldClear = needsClearForGeneration(pokemons, newGeneration);

      // Calculate new parameters first to use in timeout error message
      const newRange =
        GENERATION_RANGES[newGeneration as keyof typeof GENERATION_RANGES];

      if (shouldClear) {
        // Start generation switching overlay
        dispatch(setGenerationSwitching(true));

        // Clear Pokemon list and state
        dispatch(setPokemons([]));
        dispatch(setHasNextPage(true));
        dispatch(setEndCursor(null));
        dispatch(setError(null));

        // Failsafe: Handle timeout after 15 seconds with silent fallback
        // This prevents infinite loading and maintains current Pokemon data
        const timeoutId = setTimeout(() => {
          console.warn(
            "Generation switching timeout - silently ending loading state",
          );
          dispatch(setGenerationSwitching(false));
          dispatch(setLoading(false));
          // No error dispatch - maintain current Pokemon data display
        }, 15000);

        // Store timeout ID to clear it when generation switching completes normally
        window.generationSwitchingTimeout = timeoutId;
      }

      // Always set loading state for new generation
      dispatch(setLoading(true));

      // Update generation in both local state and Redux store
      setCurrentGeneration(newGeneration);
      dispatch(setReduxCurrentGeneration(newGeneration));

      // Calculate refetch parameters
      const newOffset = newRange.min - 1;
      const newLimit = initialBatchSize;

      // Immediate refetch without setTimeout to prevent race conditions
      refetch({
        limit: newLimit,
        offset: newOffset,
      }).catch((error) => {
        console.error("Generation change refetch failed:", error);
        // Silently handle refetch failure - no error message to user
        dispatch(setLoading(false));
        dispatch(setGenerationSwitching(false));

        // Clear timeout since we're handling the situation
        if (window.generationSwitchingTimeout) {
          clearTimeout(window.generationSwitchingTimeout);
          delete window.generationSwitchingTimeout;
        }
      });
    }
  };

  const totalPokemonInGeneration =
    generationRange.max - generationRange.min + 1;
  const canLoadMore = uniquePokemons.length < totalPokemonInGeneration;

  // Auto-load remaining Pokemon after initial load
  useEffect(() => {
    if (
      !loading &&
      uniquePokemons.length > 0 &&
      canLoadMore &&
      uniquePokemons.length >= initialBatchSize
    ) {
      // Start loading more after a short delay to show initial Pokemon first
      const timer = setTimeout(() => {
        loadMore();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [loading, uniquePokemons.length, canLoadMore, initialBatchSize, loadMore]);

  return {
    pokemons: uniquePokemons,
    loading,
    error,
    hasNextPage: canLoadMore,
    loadMore,
    refresh,
    currentGeneration,
    changeGeneration,
    generationRange,
    loadedCount: uniquePokemons.length,
    totalCount: totalPokemonInGeneration,
  };
}
