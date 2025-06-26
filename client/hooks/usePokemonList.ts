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
  addPokemons,
  setHasNextPage,
  setEndCursor,
  setCurrentGeneration as setReduxCurrentGeneration,
  setGenerationSwitching,
} from "@/store/slices/pokemonSlice";
import { getListQuery, isSSGBuild } from "@/lib/querySelector";
import { Pokemon } from "@/types/pokemon";
import { useEffect, useRef, useState, useCallback } from "react";

interface PokemonEdge {
  node: Pokemon;
}

const GENERATION_RANGES = {
  1: { min: 1, max: 151, region: { en: "Kanto", ja: "カントー地方" } },
  2: { min: 152, max: 251, region: { en: "Johto", ja: "ジョウト地方" } },
  3: { min: 252, max: 386, region: { en: "Hoenn", ja: "ホウエン地方" } },
  4: { min: 387, max: 493, region: { en: "Sinnoh", ja: "シンオウ地方" } },
  5: { min: 494, max: 649, region: { en: "Unova", ja: "イッシュ地方" } },
  6: { min: 650, max: 721, region: { en: "Kalos", ja: "カロス地方" } },
  7: { min: 722, max: 809, region: { en: "Alola", ja: "アローラ地方" } },
  8: { min: 810, max: 905, region: { en: "Galar", ja: "ガラル地方" } },
  9: { min: 906, max: 1025, region: { en: "Paldea", ja: "パルデア地方" } },
};

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
  autoFetch?: boolean;
}

export function usePokemonList({
  generation = 1,
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

  // Use appropriate query based on build mode
  const selectedQuery = getListQuery();

  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery(selectedQuery, {
    variables: { limit: generationLimit, offset: generationOffset },
    skip: !autoFetch,
    notifyOnNetworkStatusChange: true,
    errorPolicy: "all",
  });

  // Direct fetch function to bypass Apollo Client circular reference issues
  const fetchMorePokemons = async (variables: {
    limit: number;
    offset: number;
  }) => {
    // Use appropriate query based on build mode
    const queryString = isSSGBuild()
      ? `
      query GetPokemonsFull($limit: Int, $offset: Int) {
        pokemons(limit: $limit, offset: $offset) {
          edges {
            node {
              id
              name
              height
              weight
              baseExperience
              types {
                slot
                type {
                  id
                  name
                  url
                }
              }
              sprites {
                frontDefault
                frontShiny
                other {
                  officialArtwork {
                    frontDefault
                    frontShiny
                  }
                  home {
                    frontDefault
                    frontShiny
                  }
                }
              }
              stats {
                baseStat
                effort
                stat {
                  id
                  name
                  url
                }
              }
              abilities {
                isHidden
                slot
                ability {
                  id
                  name
                  url
                  names {
                    name
                    language {
                      name
                      url
                    }
                  }
                }
              }
              species {
                id
                name
                names {
                  name
                  language {
                    name
                    url
                  }
                }
                genera {
                  genus
                  language {
                    name
                    url
                  }
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    `
      : `
      query GetPokemonsBasic($limit: Int, $offset: Int) {
        pokemonsBasic(limit: $limit, offset: $offset) {
          edges {
            node {
              id
              name
              types {
                type {
                  name
                }
              }
              sprites {
                frontDefault
                other {
                  officialArtwork {
                    frontDefault
                  }
                }
              }
              species {
                names {
                  name
                  language {
                    name
                  }
                }
                genera {
                  genus
                  language {
                    name
                  }
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    `;

    // Dynamic GraphQL URL based on server mode
    const getGraphQLURL = () => {
      const serverMode = process.env.NEXT_PUBLIC_SERVER_MODE || "development";

      if (serverMode === "production") {
        return (
          process.env.NEXT_PUBLIC_GRAPHQL_URL_PROD ||
          "https://pokemon-pokedex-production.up.railway.app/graphql"
        );
      } else {
        return (
          process.env.NEXT_PUBLIC_GRAPHQL_URL_DEV ||
          "http://localhost:4000/graphql"
        );
      }
    };

    const graphqlUrl = getGraphQLURL();
    console.log("Using GraphQL URL:", graphqlUrl);

    const response = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: queryString,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Pokemon data");
    }

    return response.json();
  };

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
    const pokemonData = data?.pokemonsBasic || data?.pokemons;
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

        // Successfully loaded Pokemon - end generation switching overlay
        dispatch(setGenerationSwitching(false));

        // Clear generation switching timeout (successful completion)
        if (window.generationSwitchingTimeout) {
          clearTimeout(window.generationSwitchingTimeout);
          delete window.generationSwitchingTimeout;
        }
      } else if (edges.length > 0) {
        // If we got data but no Pokemon match the generation range, something is wrong
        console.warn(
          "Received Pokemon data but none match the current generation range",
        );
        dispatch(setError("No Pokemon found for this generation"));
        dispatch(setLoading(false));
        dispatch(setGenerationSwitching(false));

        // Clear timeout since we're handling the error
        if (window.generationSwitchingTimeout) {
          clearTimeout(window.generationSwitchingTimeout);
          delete window.generationSwitchingTimeout;
        }
      } else {
        // No data received at all - this could happen if the query returns empty results
        console.warn(
          "No Pokemon data received for generation",
          currentGeneration,
        );
        dispatch(setError("Failed to load Pokemon for this generation"));
        dispatch(setLoading(false));
        dispatch(setGenerationSwitching(false));

        // Clear timeout since we're handling the error
        if (window.generationSwitchingTimeout) {
          clearTimeout(window.generationSwitchingTimeout);
          delete window.generationSwitchingTimeout;
        }
      }
    }
  }, [data, dispatch, generationRange, currentGeneration]);

  // Calculate unique Pokemon for counting (move this before loadMore function)
  const uniquePokemons = pokemons.reduce((acc: Pokemon[], current) => {
    const exists = acc.find((pokemon) => pokemon.id === current.id);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

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

      const result = await fetchMorePokemons({
        limit: loadLimit,
        offset: nextOffset,
      });

      const moreData = result.data;

      const morePokemonData = moreData?.pokemons || moreData?.pokemonsBasic;
      if (morePokemonData) {
        const { edges, pageInfo } = morePokemonData;
        const newPokemon = edges
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
            // Only include Pokemon within generation range
            const pokemonId = parseInt(pokemon.id);
            return (
              pokemonId >= generationRange.min &&
              pokemonId <= generationRange.max
            );
          });

        dispatch(addPokemons(newPokemon));

        // Check if we've reached the end of the generation
        const totalLoadedAfterAdd =
          currentLoadedInGeneration + newPokemon.length;
        const hasMoreInGeneration =
          totalLoadedAfterAdd < totalPokemonInGeneration;

        dispatch(setHasNextPage(hasMoreInGeneration));
        dispatch(setEndCursor(pageInfo.endCursor));

        return newPokemon.length;
      }
      return 0;
    } catch (error) {
      console.error("LoadMore error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load more Pokemon";
      dispatch(setError(errorMessage));
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

        // Failsafe: Handle timeout after 15 seconds with proper error state
        // This prevents infinite loading but provides user feedback
        const timeoutId = setTimeout(() => {
          console.warn("Generation switching timeout - data loading failed");
          dispatch(setGenerationSwitching(false));
          dispatch(setLoading(false));
          dispatch(
            setError(
              `Failed to load ${newRange.region.en} Pokémon. Please try again or refresh the page.`,
            ),
          );
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
        dispatch(
          setError(
            error.message || "Failed to load Pokemon for this generation",
          ),
        );
        dispatch(setLoading(false));
        dispatch(setGenerationSwitching(false));

        // Clear timeout since we're handling the error
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
