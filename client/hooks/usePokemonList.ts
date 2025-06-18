'use client';

import { useQuery } from '@apollo/client';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLoading, setError, setPokemons, addPokemons, setHasNextPage, setEndCursor } from '@/store/slices/pokemonSlice';
import { GET_POKEMONS } from '@/graphql/queries';
import { Pokemon } from '@/types/pokemon';
import { useEffect, useRef, useState } from 'react';

interface UsePokemonListOptions {
  limit?: number;
  autoFetch?: boolean;
}

export function usePokemonList({ limit = 20, autoFetch = true }: UsePokemonListOptions = {}) {
  const dispatch = useAppDispatch();
  const { pokemons, loading, error, hasNextPage, endCursor, filters } = useAppSelector((state) => state.pokemon);
  const isLoadingMore = useRef(false);
  const [isAutoLoading, setIsAutoLoading] = useState(false);

  const { data, loading: queryLoading, error: queryError, fetchMore, refetch } = useQuery(
    GET_POKEMONS,
    {
      variables: { limit, offset: 0 },
      skip: !autoFetch,
      notifyOnNetworkStatusChange: true,
      errorPolicy: 'all',
    }
  );

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
    if (data?.pokemons && !isLoadingMore.current) {
      const { edges, pageInfo } = data.pokemons;
      const pokemonList = edges.map((edge: any) => edge.node);
      
      dispatch(setPokemons(pokemonList));
      dispatch(setHasNextPage(pageInfo.hasNextPage));
      dispatch(setEndCursor(pageInfo.endCursor));
    }
  }, [data, dispatch]);

  // Auto-load more Pokemon when generation filters are applied
  useEffect(() => {
    const hasGenerationFilter = filters.generation !== null;
    
    const autoLoadMore = async () => {
      if (!hasGenerationFilter) {
        setIsAutoLoading(false);
        return;
      }
      
      // For generation filters, determine how many Pokemon we need
      const generationRanges = {
        1: 151,   // Kanto
        2: 251,   // Through Johto
        3: 386,   // Through Hoenn
        4: 493,   // Through Sinnoh
        5: 649,   // Through Unova
        6: 721,   // Through Kalos
        7: 809,   // Through Alola
        8: 905,   // Through Galar
        9: 1000,  // Through Paldea (approximate)
      };
      const targetCount = generationRanges[filters.generation as keyof typeof generationRanges] || 1000;
      
      setIsAutoLoading(true);
      
      // Load more Pokemon if we don't have enough for the current generation
      let attempts = 0;
      const maxAttempts = 10; // Increase attempts for higher generations
      let currentPokemonCount = pokemons.length;
      
      while (currentPokemonCount < targetCount && hasNextPage && attempts < maxAttempts) {
        attempts++;
        console.log(`Auto-loading attempt ${attempts} for generation ${filters.generation}. Current: ${currentPokemonCount}, Target: ${targetCount}`);
        
        if (!isLoadingMore.current && !loading) {
          await loadMore();
          // Wait for state to update
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Re-check the current count from Redux state
          currentPokemonCount = pokemons.length;
          console.log(`After loading: ${currentPokemonCount} Pokemon available`);
        } else {
          // Wait if already loading
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      setIsAutoLoading(false);
      console.log(`Auto-loading completed for generation ${filters.generation}. Final count: ${currentPokemonCount}`);
    };
    
    if (hasGenerationFilter) {
      autoLoadMore();
    } else {
      setIsAutoLoading(false);
    }
  }, [filters.generation, pokemons.length]);

  const loadMore = async () => {
    if (!hasNextPage || loading || isLoadingMore.current) {
      console.log('loadMore blocked:', { hasNextPage, loading, isLoadingMore: isLoadingMore.current });
      return;
    }

    try {
      isLoadingMore.current = true;
      dispatch(setLoading(true));
      
      const currentOffset = pokemons.length;
      console.log('Loading more Pokemon. Current count:', currentOffset, 'Limit:', limit);
      
      const { data: moreData } = await fetchMore({
        variables: {
          limit,
          offset: currentOffset,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          
          return {
            pokemons: {
              ...fetchMoreResult.pokemons,
              edges: [...prev.pokemons.edges, ...fetchMoreResult.pokemons.edges],
            },
          };
        },
      });

      if (moreData?.pokemons) {
        const { edges, pageInfo } = moreData.pokemons;
        const newPokemon = edges.map((edge: any) => edge.node);
        
        console.log('Fetched', newPokemon.length, 'new Pokemon. HasNextPage:', pageInfo.hasNextPage);
        
        dispatch(addPokemons(newPokemon));
        dispatch(setHasNextPage(pageInfo.hasNextPage));
        dispatch(setEndCursor(pageInfo.endCursor));
      }
    } catch (err) {
      console.error('Failed to load more Pokemon:', err);
      dispatch(setError(err instanceof Error ? err.message : 'Failed to load more Pokemon'));
    } finally {
      dispatch(setLoading(false));
      isLoadingMore.current = false;
    }
  };

  const refresh = async () => {
    try {
      dispatch(setLoading(true));
      await refetch({ limit, offset: 0 });
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to refresh Pokemon list'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Remove duplicates from pokemons array before filtering
  const uniquePokemons = pokemons.reduce((acc: Pokemon[], current) => {
    const exists = acc.find(pokemon => pokemon.id === current.id);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  // Filter pokemons based on current filters (client-side filtering)
  const filteredPokemons = uniquePokemons.filter((pokemon) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (!pokemon.name.toLowerCase().includes(searchTerm) && 
          !pokemon.id.includes(searchTerm)) {
        return false;
      }
    }

    // Type filter
    if (filters.types.length > 0) {
      const pokemonTypes = pokemon.types.map(t => t.type.name);
      const hasMatchingType = filters.types.some(filterType => 
        pokemonTypes.includes(filterType.name)
      );
      if (!hasMatchingType) {
        return false;
      }
    }

    // Generation filter with comprehensive ranges
    if (filters.generation !== null) {
      const pokemonId = parseInt(pokemon.id);
      const generationRanges = {
        1: { min: 1, max: 151 },      // Kanto
        2: { min: 152, max: 251 },    // Johto
        3: { min: 252, max: 386 },    // Hoenn
        4: { min: 387, max: 493 },    // Sinnoh
        5: { min: 494, max: 649 },    // Unova
        6: { min: 650, max: 721 },    // Kalos
        7: { min: 722, max: 809 },    // Alola
        8: { min: 810, max: 905 },    // Galar
        9: { min: 906, max: 9999 },   // Paldea (open-ended)
      };
      
      const range = generationRanges[filters.generation as keyof typeof generationRanges];
      if (range && (pokemonId < range.min || pokemonId > range.max)) {
        return false;
      }
    }

    return true;
  });

  // Check if we have active filters
  const hasActiveFilters: boolean = Boolean(filters.search || filters.types.length > 0 || filters.generation !== null);
  
  // Debug logging for filtering
  useEffect(() => {
    console.log(`Filtering state: Unique Pokemon: ${uniquePokemons.length}, Filtered: ${filteredPokemons.length}, Generation: ${filters.generation}`);
    if (filters.generation !== null) {
      const genPokemons = uniquePokemons.filter(p => {
        const id = parseInt(p.id);
        const ranges = {
          2: { min: 152, max: 251 }
        };
        const range = ranges[filters.generation as keyof typeof ranges];
        return range ? (id >= range.min && id <= range.max) : false;
      });
      console.log(`Generation ${filters.generation} Pokemon found: ${genPokemons.length}`, genPokemons.map(p => `#${p.id} ${p.name}`));
    }
  }, [uniquePokemons.length, filteredPokemons.length, filters.generation]);
  
  // When filtering, show loading during auto-load or when we have no filtered results yet
  // This prevents showing loading skeleton cards for unfiltered results
  const shouldShowLoading = hasActiveFilters 
    ? (isAutoLoading || (loading && filteredPokemons.length === 0))
    : loading;
  
  // Disable infinite scroll when filtering to prevent loading irrelevant Pokemon
  const shouldShowHasNextPage = hasActiveFilters ? false : hasNextPage;

  return {
    pokemons: filteredPokemons,
    allPokemons: uniquePokemons,
    loading: shouldShowLoading,
    error,
    hasNextPage: shouldShowHasNextPage,
    loadMore,
    refresh,
    isFiltering: hasActiveFilters,
    originalCount: uniquePokemons.length,
    filteredCount: filteredPokemons.length,
    isAutoLoading,
  };
}