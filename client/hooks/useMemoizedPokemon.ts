'use client';

import { useMemo } from 'react';
import { Pokemon } from '@/types/pokemon';

export function useMemoizedPokemon(pokemons: Pokemon[]) {
  // Memoize filtered and sorted Pokemon
  const memoizedPokemons = useMemo(() => {
    // Remove duplicates by ID
    const uniquePokemons = pokemons.reduce((acc: Pokemon[], current) => {
      const exists = acc.find(pokemon => pokemon.id === current.id);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    // Sort by ID for consistent ordering
    return uniquePokemons.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  }, [pokemons]);

  // Memoize Pokemon lookup map for faster access
  const pokemonMap = useMemo(() => {
    return new Map(memoizedPokemons.map(pokemon => [pokemon.id, pokemon]));
  }, [memoizedPokemons]);

  return {
    pokemons: memoizedPokemons,
    pokemonMap,
    count: memoizedPokemons.length,
  };
}