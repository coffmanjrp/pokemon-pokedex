'use client';

import { useEffect, useRef, useState } from 'react';
import { apolloClient } from '@/lib/apollo';
import { GET_POKEMONS } from '@/graphql/queries';

interface UseBackgroundPreloadOptions {
  currentPokemonId: number;
  enabled?: boolean;
  delay?: number; // milliseconds
  maxConcurrent?: number;
  priority?: 'low' | 'normal';
}

export function useBackgroundPreload({
  currentPokemonId,
  enabled = true,
  delay = 3000, // Start after 3 seconds
  maxConcurrent = 2, // Maximum concurrent requests
  priority = 'low'
}: UseBackgroundPreloadOptions) {
  // Dynamic control based on network conditions
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  
  useEffect(() => {
    // Detect slow connections using Connection API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const checkConnection = () => {
        setIsSlowConnection(
          connection.effectiveType === 'slow-2g' || 
          connection.effectiveType === '2g' ||
          connection.saveData === true
        );
      };
      
      checkConnection();
      connection.addEventListener('change', checkConnection);
      
      return () => connection.removeEventListener('change', checkConnection);
    }
  }, []);
  
  // Disable on slow connections
  const shouldPreload = enabled && !isSlowConnection;
  const [preloadStatus, setPreloadStatus] = useState<{
    total: number;
    completed: number;
    active: boolean;
  }>({ total: 0, completed: 0, active: false });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPreloadingRef = useRef(false);

  // Calculate generation range for Pokemon ID
  const getGenerationRange = (pokemonId: number) => {
    if (pokemonId <= 151) return { min: 1, max: 151, generation: 1 };
    if (pokemonId <= 251) return { min: 152, max: 251, generation: 2 };
    if (pokemonId <= 386) return { min: 252, max: 386, generation: 3 };
    if (pokemonId <= 493) return { min: 387, max: 493, generation: 4 };
    if (pokemonId <= 649) return { min: 494, max: 649, generation: 5 };
    if (pokemonId <= 721) return { min: 650, max: 721, generation: 6 };
    if (pokemonId <= 809) return { min: 722, max: 809, generation: 7 };
    if (pokemonId <= 905) return { min: 810, max: 905, generation: 8 };
    return { min: 906, max: 1025, generation: 9 };
  };

  // Get the highest cached Pokemon ID
  const getCachedPokemonCount = (): number => {
    try {
      const cache = apolloClient.cache.extract();
      let maxCachedId = 0;
      
      // Extract Pokemon IDs directly from Apollo Client cache
      Object.keys(cache).forEach(key => {
        if (key.startsWith('Pokemon:')) {
          const id = parseInt(key.replace('Pokemon:', ''));
          if (!isNaN(id) && id > maxCachedId) {
            maxCachedId = id;
          }
        }
        
        // Also check from query results
        if (key.includes('GetPokemons')) {
          const queryData = cache[key] as any;
          if (queryData?.pokemons?.edges) {
            queryData.pokemons.edges.forEach((edge: any) => {
              const id = parseInt(edge.node.id);
              if (!isNaN(id) && id > maxCachedId) {
                maxCachedId = id;
              }
            });
          }
        }
      });
      
      return maxCachedId;
    } catch {
      return 0;
    }
  };

  // Determine preload target Pokemon IDs with strategic approach
  const getPreloadTargets = (currentId: number): number[] => {
    const range = getGenerationRange(currentId);
    const cachedCount = getCachedPokemonCount();
    const targets: number[] = [];
    
    // Strategy 1: Next 10 Pokemon after current (sequential browsing pattern)
    const sequentialTargets: number[] = [];
    for (let i = currentId + 1; i <= Math.min(range.max, currentId + 10); i++) {
      sequentialTargets.push(i);
    }
    
    // Strategy 2: Next 10 Pokemon after cached range (list to detail navigation pattern)
    const nextUnloadedTargets: number[] = [];
    if (cachedCount > 0) {
      const startFrom = Math.max(cachedCount + 1, range.min);
      for (let i = startFrom; i <= Math.min(range.max, startFrom + 9); i++) {
        if (!sequentialTargets.includes(i)) {
          nextUnloadedTargets.push(i);
        }
      }
    }
    
    // Strategy 3: First 9 Pokemon of each generation (for faster generation switching)
    const generationStartTargets = getGenerationStartTargets();
    
    // Strategy 4: Popular Pokemon in current generation (starters, legendaries, evolutions)
    const popularTargets = getPopularPokemonInRange(range);
    
    // Priority order: Sequential > Next unloaded > Generation starts > Popular Pokemon
    targets.push(...sequentialTargets);
    
    // Add next unloaded Pokemon to remaining slots
    let remaining = 10 - targets.length;
    if (remaining > 0) {
      targets.push(...nextUnloadedTargets.slice(0, remaining));
    }
    
    // Add generation start Pokemon if slots available
    remaining = 10 - targets.length;
    if (remaining > 0) {
      targets.push(...generationStartTargets.filter(id => 
        !targets.includes(id) && id !== currentId
      ).slice(0, remaining));
    }
    
    // Add popular Pokemon if slots still available
    const stillRemaining = 10 - targets.length;
    if (stillRemaining > 0) {
      targets.push(...popularTargets.filter(id => 
        !targets.includes(id) && id !== currentId
      ).slice(0, stillRemaining));
    }
    
    return targets.filter(id => id >= range.min && id <= range.max);
  };

  // First 9 Pokemon of each generation (for faster generation switching)
  const getGenerationStartTargets = (): number[] => {
    const targets: number[] = [];
    const generationStarts = [1, 152, 252, 387, 494, 650, 722, 810, 906]; // Starting IDs for each generation
    
    generationStarts.forEach(startId => {
      // Check first 9 Pokemon of each generation
      for (let i = 0; i < 9; i++) {
        const pokemonId = startId + i;
        
        // Only add if not already cached
        const isAlreadyCached = isIdInCache(pokemonId);
        if (!isAlreadyCached) {
          targets.push(pokemonId);
        }
      }
    });
    
    return targets.slice(0, 40); // Maximum 40 Pokemon (generous allocation for generation switching)
  };

  // Check if Pokemon ID exists in cache
  const isIdInCache = (pokemonId: number): boolean => {
    try {
      const cache = apolloClient.cache.extract();
      return Object.keys(cache).some(key => 
        key === `Pokemon:${pokemonId}` || 
        (key.includes('GetPokemons') && (cache[key] as any)?.pokemons?.edges?.some((edge: any) => 
          parseInt(edge.node.id) === pokemonId
        ))
      );
    } catch {
      return false;
    }
  };

  // Get popular Pokemon in generation range (starters, evolutions, legendaries)
  const getPopularPokemonInRange = (range: { min: number; max: number; generation: number }): number[] => {
    const popular: number[] = [];
    
    // Popular Pokemon by generation (starter evolutions and iconic Pokemon)
    const popularByGeneration: { [key: number]: number[] } = {
      1: [3, 6, 9, 25, 65, 68, 94, 130, 131, 144, 145, 146, 150, 151], // Venusaur, Charizard, Blastoise, Pikachu, Alakazam, Machamp, Gengar, Gyarados, Lapras, legendary birds, Mewtwo, Mew
      2: [154, 157, 160, 181, 196, 197, 230, 245, 249, 250, 251], // Starter finals, Ampharos, Espeon, Umbreon, Kingdra, Suicune, Lugia, Ho-Oh, Celebi
      3: [254, 257, 260, 282, 302, 334, 350, 376, 380, 381, 382, 383, 384, 385], // Starter finals, Gardevoir, Sableye, Altaria, Milotic, Metagross, Latias, Latios, Kyogre, Groudon, Rayquaza, Jirachi
      4: [389, 392, 395, 445, 448, 461, 466, 467, 477, 480, 481, 482, 483, 484, 487, 491, 493], // Starter finals, Garchomp, Lucario, Weavile, Electivire, Magmortar, Dusknoir, lake trio, creation trio, Darkrai, Arceus
      5: [497, 500, 503, 609, 612, 621, 635, 643, 644, 646, 647, 648, 649], // Starter finals, Chandelure, Haxorus, Druddigon, Hydreigon, Reshiram, Zekrom, Kyurem, Keldeo, Meloetta, Genesect
      6: [658, 663, 668, 681, 700, 717, 718, 719, 720, 721], // Starter finals, Aegislash, Talonflame, Sylveon, Yveltal, Xerneas, Zygarde, Diancie, Hoopa, Volcanion
      7: [724, 727, 730, 738, 745, 784, 785, 786, 787, 788, 789, 790, 791, 792, 800, 801, 802], // Starter finals, Vikavolt, Primarina, Lycanroc, Tapu guardians, Necrozma, Marshadow, Zeraora
      8: [812, 815, 818, 823, 830, 884, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898], // Starter finals, Corviknight, Gossifleur, Dragapult, Zacian, Zamazenta, Eternatus, Kubfu, Urshifu, Regieleki, Regidrago, Glastrier, Spectrier, Calyrex
      9: [906, 909, 912, 1000, 1001, 1002, 1003, 1004, 1007, 1008, 1009, 1010, 1017, 1024, 1025] // Paldea starter finals and other popular Pokemon
    };
    
    const generationPopular = popularByGeneration[range.generation] || [];
    return generationPopular.filter(id => id >= range.min && id <= range.max);
  };

  // Execute background preloading
  const executePreload = async (targets: number[], signal: AbortSignal) => {
    const batchSize = maxConcurrent;
    let completed = 0;
    
    setPreloadStatus(prev => ({ ...prev, total: targets.length, active: true }));

    for (let i = 0; i < targets.length; i += batchSize) {
      if (signal.aborted) break;
      
      const batch = targets.slice(i, i + batchSize);
      
      // Process batch
      await Promise.allSettled(
        batch.map(async (offset) => {
          try {
            if (signal.aborted) return;
            
            // Request with low priority
            await apolloClient.query({
              query: GET_POKEMONS,
              variables: { limit: 1, offset: offset - 1 },
              fetchPolicy: 'cache-first',
              errorPolicy: 'ignore',
              // Lower network priority
              context: {
                headers: {
                  'Priority': priority === 'low' ? 'u=4' : 'u=3'
                }
              }
            });
            
            completed++;
            setPreloadStatus(prev => ({ ...prev, completed }));
            
          } catch (error) {
            // Ignore errors (background processing)
            console.debug(`Preload failed for Pokemon ${offset}:`, error);
          }
        })
      );
      
      // Interval between batches (to avoid blocking main thread)
      if (i + batchSize < targets.length && !signal.aborted) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setPreloadStatus(prev => ({ ...prev, active: false }));
  };

  useEffect(() => {
    if (!shouldPreload || isPreloadingRef.current) return;

    // Cancel existing preload
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Delayed execution
    const timeoutId = setTimeout(() => {
      if (controller.signal.aborted) return;
      
      isPreloadingRef.current = true;
      const targets = getPreloadTargets(currentPokemonId);
      
      executePreload(targets, controller.signal)
        .finally(() => {
          isPreloadingRef.current = false;
        });
        
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
      isPreloadingRef.current = false;
    };
  }, [currentPokemonId, shouldPreload, delay, maxConcurrent, priority]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    preloadStatus,
    isPreloading: preloadStatus.active,
    cancel: () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setPreloadStatus(prev => ({ ...prev, active: false }));
      }
    }
  };
}