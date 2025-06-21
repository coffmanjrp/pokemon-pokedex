'use client';

import { useQuery } from '@apollo/client';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLoading, setError, setPokemons } from '@/store/slices/pokemonSlice';
import { GET_POKEMONS } from '@/graphql/queries';
import { POPULAR_POKEMON_IDS } from '@/lib/data/popularPokemon';
import { useEffect } from 'react';

export function useFastInitialLoad() {
  const dispatch = useAppDispatch();
  const { pokemons, loading, error } = useAppSelector((state) => state.pokemon);

  // Super fast initial load with only 12 popular Pokemon
  const { data, loading: queryLoading, error: queryError } = useQuery(
    GET_POKEMONS,
    {
      variables: { 
        limit: 12,  // Reduced from 50 to 12 for ultra-fast load
        offset: 0 
      },
      notifyOnNetworkStatusChange: true,
      errorPolicy: 'all',
      fetchPolicy: 'cache-first', // Prioritize cache
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
      const { edges } = data.pokemons;
      const pokemonList = edges.map((edge: any) => edge.node);
      
      dispatch(setPokemons(pokemonList));
      console.log(`Ultra-fast load: ${pokemonList.length} Pokemon loaded`);
    }
  }, [data, dispatch]);

  return {
    pokemons,
    loading: queryLoading,
    error,
    isInitialLoadComplete: !queryLoading && pokemons.length > 0,
  };
}