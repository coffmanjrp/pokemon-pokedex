'use client';

import { useQuery } from '@apollo/client';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLoading, setError, setPokemons, addPokemons, setHasNextPage, setEndCursor } from '@/store/slices/pokemonSlice';
import { GET_POKEMONS } from '@/graphql/queries';
import { useEffect, useRef } from 'react';

interface UsePokemonListOptions {
  limit?: number;
  autoFetch?: boolean;
}

export function usePokemonList({ limit = 20, autoFetch = true }: UsePokemonListOptions = {}) {
  const dispatch = useAppDispatch();
  const { pokemons, loading, error, hasNextPage, endCursor, filters } = useAppSelector((state) => state.pokemon);
  const isLoadingMore = useRef(false);

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

  // Filter pokemons based on current filters
  const filteredPokemons = pokemons.filter((pokemon) => {
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
  const hasActiveFilters = filters.search || filters.types.length > 0 || filters.generation !== null;
  
  // When filtering, disable infinite scroll and show loading only for initial load
  const shouldShowLoading = hasActiveFilters ? (loading && pokemons.length === 0) : loading;
  const shouldShowHasNextPage = hasActiveFilters ? false : hasNextPage;

  return {
    pokemons: filteredPokemons,
    allPokemons: pokemons,
    loading: shouldShowLoading,
    error,
    hasNextPage: shouldShowHasNextPage,
    loadMore,
    refresh,
    isFiltering: hasActiveFilters,
    originalCount: pokemons.length,
    filteredCount: filteredPokemons.length,
  };
}