'use client';

import { useQuery } from '@apollo/client';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLoading, setError, setPokemons, addPokemons, setHasNextPage, setEndCursor } from '@/store/slices/pokemonSlice';
import { GET_POKEMONS } from '@/graphql/queries';
import { useEffect } from 'react';

interface UsePokemonListOptions {
  limit?: number;
  autoFetch?: boolean;
}

export function usePokemonList({ limit = 20, autoFetch = true }: UsePokemonListOptions = {}) {
  const dispatch = useAppDispatch();
  const { pokemons, loading, error, hasNextPage, endCursor, filters } = useAppSelector((state) => state.pokemon);

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
    dispatch(setLoading(queryLoading));
  }, [queryLoading, dispatch]);

  useEffect(() => {
    if (queryError) {
      dispatch(setError(queryError.message));
    } else {
      dispatch(setError(null));
    }
  }, [queryError, dispatch]);

  useEffect(() => {
    if (data?.pokemons) {
      const { edges, pageInfo } = data.pokemons;
      const pokemonList = edges.map((edge: any) => edge.node);
      
      dispatch(setPokemons(pokemonList));
      dispatch(setHasNextPage(pageInfo.hasNextPage));
      dispatch(setEndCursor(pageInfo.endCursor));
    }
  }, [data, dispatch]);

  const loadMore = async () => {
    if (!hasNextPage || loading) return;

    try {
      dispatch(setLoading(true));
      
      const { data: moreData } = await fetchMore({
        variables: {
          limit,
          offset: pokemons.length,
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
        
        dispatch(addPokemons(newPokemon));
        dispatch(setHasNextPage(pageInfo.hasNextPage));
        dispatch(setEndCursor(pageInfo.endCursor));
      }
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to load more Pokemon'));
    } finally {
      dispatch(setLoading(false));
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

    // Generation filter (basic implementation - assumes Gen 1 is Pokemon 1-151)
    if (filters.generation !== null) {
      const pokemonId = parseInt(pokemon.id);
      if (filters.generation === 1 && (pokemonId < 1 || pokemonId > 151)) {
        return false;
      }
      // Add more generation logic as needed
    }

    return true;
  });

  return {
    pokemons: filteredPokemons,
    allPokemons: pokemons,
    loading,
    error,
    hasNextPage,
    loadMore,
    refresh,
  };
}