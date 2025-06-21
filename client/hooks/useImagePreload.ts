'use client';

import { useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';

interface UseImagePreloadOptions {
  pokemons: Pokemon[];
  currentIndex: number;
  preloadRange: number;
}

export function useImagePreload({ 
  pokemons, 
  currentIndex, 
  preloadRange = 5 
}: UseImagePreloadOptions) {
  useEffect(() => {
    const preloadImages = () => {
      const start = Math.max(0, currentIndex - preloadRange);
      const end = Math.min(pokemons.length, currentIndex + preloadRange);
      
      for (let i = start; i < end; i++) {
        const pokemon = pokemons[i];
        if (pokemon?.sprites?.other?.officialArtwork?.frontDefault) {
          const img = new Image();
          img.src = pokemon.sprites.other.officialArtwork.frontDefault;
        }
      }
    };

    if (pokemons.length > 0) {
      // Debounce preloading
      const timeout = setTimeout(preloadImages, 100);
      return () => clearTimeout(timeout);
    }
  }, [pokemons, currentIndex, preloadRange]);
}