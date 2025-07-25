"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setQuery,
  setIsSearching,
  setResults,
  setSuggestions,
  addToSearchHistory,
  setIsSearchMode,
  setError,
  clearSearch,
  setFilters,
  clearFilters,
  SearchResult,
  SearchFilters,
  setSearchScope,
  setCachedAllGenerationsData,
} from "@/store/slices/searchSlice";
import { useCallback, useEffect, useMemo } from "react";
import { useDebounce } from "./useDebounce";
import { getPokemonName } from "@/lib/pokemonUtils";
import { japaneseMatch } from "@/lib/utils/japaneseUtils";
import { POKEMON_TYPES, type PokemonTypeName } from "@/lib/data/index";
import { SearchScope } from "@/types/search";
import { searchAllGenerationsPokemon } from "@/lib/supabase/pokemon";
import { getGenerationByPokemonId } from "@/lib/data/generations";

interface UsePokemonSearchOptions {
  enableSuggestions?: boolean;
  debounceMs?: number;
}

export function usePokemonSearch({
  enableSuggestions = true,
  debounceMs = 300,
}: UsePokemonSearchOptions = {}) {
  const dispatch = useAppDispatch();
  const {
    query,
    isSearching,
    results,
    suggestions,
    filters,
    searchHistory,
    isSearchMode,
    error,
    searchScope,
    allGenerationsData,
  } = useAppSelector((state) => state.search);

  const { pokemons } = useAppSelector((state) => state.pokemon);
  const { language } = useAppSelector((state) => state.ui);

  // Debounce the search query for suggestions
  const debouncedQuery = useDebounce(query, debounceMs);

  // All available Pokemon for searching (from current generation or all cached data)
  const searchablePokemons = useMemo(() => {
    return pokemons || [];
  }, [pokemons]);

  // Generate suggestions based on query
  const generateSuggestions = useCallback(
    (searchQuery: string): string[] => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        return searchHistory.slice(0, 5);
      }

      const query = searchQuery.toLowerCase();
      const suggestionSet = new Set<string>();

      // Add matching Pokemon names with Japanese support
      searchablePokemons.forEach((pokemon) => {
        const name = getPokemonName(pokemon, language);
        const englishName = pokemon.name;

        // Use Japanese-aware matching for suggestions
        const nameMatches =
          language === "ja"
            ? japaneseMatch(query, name)
            : name.toLowerCase().includes(query);
        const englishNameMatches = englishName.toLowerCase().includes(query);

        if (nameMatches || englishNameMatches) {
          suggestionSet.add(getPokemonName(pokemon, language));
        }

        // Add ID matches
        if (
          pokemon.id.includes(query) ||
          pokemon.id.padStart(3, "0").includes(query)
        ) {
          suggestionSet.add(
            `#${pokemon.id.padStart(3, "0")} ${getPokemonName(pokemon, language)}`,
          );
        }
      });

      // Add type suggestions if query matches type names
      POKEMON_TYPES.forEach((type) => {
        if (type.includes(query)) {
          suggestionSet.add(`Type: ${type}`);
        }
      });

      return Array.from(suggestionSet).slice(0, 8);
    },
    [searchablePokemons, language, searchHistory],
  );

  // Perform the actual search
  const performSearch = useCallback(
    (
      searchQuery: string,
      searchFilters?: Partial<SearchFilters>,
    ): SearchResult[] => {
      const query = searchQuery.trim().toLowerCase();
      const results: SearchResult[] = [];
      const appliedFilters = { ...filters, ...searchFilters };
      const hasQuery = query.length > 0;

      // If no query, return all Pokemon for filtering
      if (!hasQuery) {
        searchablePokemons.forEach((pokemon) => {
          results.push({
            pokemon,
            matchType: "name",
            matchedValue: getPokemonName(pokemon, language),
          });
        });
      } else {
        searchablePokemons.forEach((pokemon) => {
          // Name search (multi-language with Japanese support)
          const name = getPokemonName(pokemon, language);
          const englishName = pokemon.name;

          // Use Japanese-aware matching for Japanese language, regular matching for others
          const nameMatches =
            language === "ja"
              ? japaneseMatch(query, name)
              : name.toLowerCase().includes(query);
          const englishNameMatches = englishName.toLowerCase().includes(query);

          if (nameMatches || englishNameMatches) {
            results.push({
              pokemon,
              matchType: "name",
              matchedValue: getPokemonName(pokemon, language),
            });
            return;
          }

          // ID search
          const pokemonId = pokemon.id.padStart(3, "0");
          if (
            pokemon.id === query ||
            pokemonId === query ||
            pokemonId.includes(query)
          ) {
            results.push({
              pokemon,
              matchType: "id",
              matchedValue: `#${pokemonId}`,
            });
            return;
          }

          // Type search
          const hasMatchingType = pokemon.types.some((typeSlot) =>
            typeSlot.type.name.toLowerCase().includes(query),
          );

          if (hasMatchingType) {
            const matchedType = pokemon.types.find((typeSlot) =>
              typeSlot.type.name.toLowerCase().includes(query),
            )?.type.name;

            results.push({
              pokemon,
              matchType: "type",
              matchedValue: matchedType || "",
            });
            return;
          }

          // Ability search
          if (pokemon.abilities && pokemon.abilities.length > 0) {
            const hasMatchingAbility = pokemon.abilities.some((abilitySlot) =>
              abilitySlot.ability?.name?.toLowerCase().includes(query),
            );

            if (hasMatchingAbility) {
              const matchedAbility = pokemon.abilities.find((abilitySlot) =>
                abilitySlot.ability?.name?.toLowerCase().includes(query),
              )?.ability?.name;

              results.push({
                pokemon,
                matchType: "ability",
                matchedValue: matchedAbility || "",
              });
            }
          }
        });
      }

      // Apply filters
      let filteredResults = results;

      // Type filter
      if (appliedFilters.types.length > 0) {
        filteredResults = filteredResults.filter((result) =>
          result.pokemon.types.some((typeSlot) =>
            appliedFilters.types.includes(
              typeSlot.type.name as PokemonTypeName,
            ),
          ),
        );
      }

      // Generation filter (based on Pokemon ID ranges)
      if (appliedFilters.generations.length > 0) {
        filteredResults = filteredResults.filter((result) => {
          const pokemonId = parseInt(result.pokemon.id);
          return appliedFilters.generations.some((gen) => {
            // Simple generation ranges - could be made more precise
            const ranges: Record<number, readonly [number, number]> = {
              0: [10033, 10274],
              1: [1, 151],
              2: [152, 251],
              3: [252, 386],
              4: [387, 493],
              5: [494, 649],
              6: [650, 721],
              7: [722, 809],
              8: [810, 905],
              9: [906, 1025],
            } as const;
            const range = ranges[gen];
            return range
              ? pokemonId >= range[0] && pokemonId <= range[1]
              : false;
          });
        });
      }

      // ID range filter
      if (
        appliedFilters.minId !== undefined ||
        appliedFilters.maxId !== undefined
      ) {
        filteredResults = filteredResults.filter((result) => {
          const pokemonId = parseInt(result.pokemon.id);
          const min = appliedFilters.minId ?? 1;
          const max = appliedFilters.maxId ?? 10274;
          return pokemonId >= min && pokemonId <= max;
        });
      }

      // Sort results by relevance
      return filteredResults.sort((a, b) => {
        // Exact name matches first
        if (a.matchType === "name" && b.matchType !== "name") return -1;
        if (b.matchType === "name" && a.matchType !== "name") return 1;

        // Then ID matches
        if (a.matchType === "id" && b.matchType !== "id") return -1;
        if (b.matchType === "id" && a.matchType !== "id") return 1;

        // Then by Pokemon ID
        return parseInt(a.pokemon.id) - parseInt(b.pokemon.id);
      });
    },
    [searchablePokemons, language, filters],
  );

  // Update suggestions when debounced query changes
  useEffect(() => {
    if (enableSuggestions) {
      const newSuggestions = generateSuggestions(debouncedQuery);
      dispatch(setSuggestions(newSuggestions));
    }
  }, [debouncedQuery, generateSuggestions, enableSuggestions, dispatch]);

  // Re-run search when Pokemon list updates (for dynamic filtering)
  // Using pokemons.length as dependency to avoid deep comparison issues
  useEffect(() => {
    // Only re-run if we're in search mode, current generation scope, and have a query or active filters
    if (
      isSearchMode &&
      searchScope === SearchScope.CURRENT_GENERATION &&
      (query.trim().length > 0 || filters.types.length > 0)
    ) {
      // Perform search with current query and filters
      const updatedResults = performSearch(query, filters);
      dispatch(setResults(updatedResults));
    }
  }, [
    pokemons.length,
    isSearchMode,
    query,
    filters,
    performSearch,
    dispatch,
    searchScope,
  ]);

  // Perform search across all generations
  const performAllGenerationsSearch = useCallback(
    async (searchQuery: string, searchFilters?: Partial<SearchFilters>) => {
      dispatch(setIsSearching(true));
      dispatch(setError(null));

      try {
        // Check cache first
        if (
          allGenerationsData &&
          allGenerationsData.query === searchQuery &&
          Date.now() - allGenerationsData.timestamp < 300000 // 5 minutes cache
        ) {
          dispatch(setResults(allGenerationsData.results));
          dispatch(setIsSearchMode(true));
          return;
        }

        // Fetch from Supabase
        const response = await searchAllGenerationsPokemon(
          searchQuery,
          { types: searchFilters?.types || [] },
          0,
          50,
        );

        // Transform results to include generation info
        const searchResults: SearchResult[] = response.pokemon.map(
          (pokemon) => {
            const generation = getGenerationByPokemonId(parseInt(pokemon.id));
            return {
              pokemon,
              matchType: "name" as const,
              matchedValue: getPokemonName(pokemon, language),
              ...(generation && { generation: generation.id }),
            };
          },
        );

        dispatch(setResults(searchResults));
        dispatch(
          setCachedAllGenerationsData({
            query: searchQuery,
            results: searchResults,
          }),
        );
        dispatch(setIsSearchMode(true));

        // Add to search history
        if (searchQuery.trim()) {
          dispatch(addToSearchHistory(searchQuery));
        }
      } catch (err) {
        dispatch(
          setError(err instanceof Error ? err.message : "Search failed"),
        );
      } finally {
        dispatch(setIsSearching(false));
      }
    },
    [dispatch, language, allGenerationsData],
  );

  // Search function to be called from components
  const search = useCallback(
    async (searchQuery: string, searchFilters?: Partial<SearchFilters>) => {
      const hasQuery = searchQuery.trim().length > 0;
      const hasFilters =
        searchFilters &&
        ((searchFilters.types && searchFilters.types.length > 0) ||
          (searchFilters.generations && searchFilters.generations.length > 0) ||
          searchFilters.minId !== undefined ||
          searchFilters.maxId !== undefined);

      // Clear search if no query and no filters
      if (!hasQuery && !hasFilters) {
        dispatch(clearSearch());
        return;
      }

      // Use all generations search if scope is set to ALL_GENERATIONS
      if (searchScope === SearchScope.ALL_GENERATIONS) {
        await performAllGenerationsSearch(searchQuery, searchFilters);
        return;
      }

      // Otherwise use current generation search
      dispatch(setIsSearching(true));
      dispatch(setError(null));

      try {
        const searchResults = performSearch(searchQuery, searchFilters);
        dispatch(setResults(searchResults));

        // Only add to search history if there's a query
        if (hasQuery) {
          dispatch(addToSearchHistory(searchQuery));
        }

        dispatch(setIsSearchMode(true));
      } catch (err) {
        dispatch(
          setError(err instanceof Error ? err.message : "Search failed"),
        );
      } finally {
        dispatch(setIsSearching(false));
      }
    },
    [dispatch, performSearch, performAllGenerationsSearch, searchScope],
  );

  // Update query
  const updateQuery = useCallback(
    (newQuery: string) => {
      dispatch(setQuery(newQuery));
    },
    [dispatch],
  );

  // Clear search
  const clearSearchResults = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  // Exit search mode
  const exitSearchMode = useCallback(() => {
    dispatch(setIsSearchMode(false));
  }, [dispatch]);

  // Update filters
  const updateFilters = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch],
  );

  // Clear filters
  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Update search scope
  const updateSearchScope = useCallback(
    (newScope: SearchScope) => {
      dispatch(setSearchScope(newScope));
      // Re-run search with new scope if there's an active query
      if (query.trim() || filters.types.length > 0) {
        search(query, filters);
      }
    },
    [dispatch, query, filters, search],
  );

  return {
    // State
    query,
    isSearching,
    results,
    suggestions,
    filters,
    searchHistory,
    isSearchMode,
    error,
    hasResults: results.length > 0,
    searchScope,

    // Actions
    search,
    updateQuery,
    updateFilters,
    clearSearchResults,
    clearAllFilters,
    exitSearchMode,
    updateSearchScope,

    // Utils
    generateSuggestions,
    performSearch,
  };
}

export default usePokemonSearch;
