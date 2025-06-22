'use client';

import { useEffect } from 'react';
import { apolloClient } from '@/lib/apollo';
import { GET_POKEMONS } from '@/graphql/queries';

const GENERATION_RANGES = {
  1: { min: 1, max: 151 },
  2: { min: 152, max: 251 },
  3: { min: 252, max: 386 },
  4: { min: 387, max: 493 },
  5: { min: 494, max: 649 },
  6: { min: 650, max: 721 },
  7: { min: 722, max: 809 },
  8: { min: 810, max: 905 },
  9: { min: 906, max: 1025 },
};

export function usePreloadGeneration(currentGeneration: number) {
  useEffect(() => {
    // Preload next generation in background
    const nextGeneration = currentGeneration + 1;
    if (nextGeneration <= 9) {
      const generationRange = GENERATION_RANGES[nextGeneration as keyof typeof GENERATION_RANGES];
      const offset = generationRange.min - 1;
      const limit = 20; // Initial batch size
      
      // Preload with low priority
      setTimeout(() => {
        apolloClient.query({
          query: GET_POKEMONS,
          variables: { limit, offset },
          fetchPolicy: 'cache-first',
          errorPolicy: 'ignore',
        }).catch(() => {
          // Silently fail preloading
        });
      }, 2000); // Wait 2 seconds after current generation loads
    }

    // Preload previous generation
    const prevGeneration = currentGeneration - 1;
    if (prevGeneration >= 1) {
      const generationRange = GENERATION_RANGES[prevGeneration as keyof typeof GENERATION_RANGES];
      const offset = generationRange.min - 1;
      const limit = 20;
      
      setTimeout(() => {
        apolloClient.query({
          query: GET_POKEMONS,
          variables: { limit, offset },
          fetchPolicy: 'cache-first',
          errorPolicy: 'ignore',
        }).catch(() => {
          // Silently fail preloading
        });
      }, 3000); // Wait 3 seconds
    }
  }, [currentGeneration]);
}