'use client';

import { useQuery } from '@apollo/client';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLoading, setError, setPokemons, addPokemons, setHasNextPage, setEndCursor } from '@/store/slices/pokemonSlice';
import { GET_POKEMONS } from '@/graphql/queries';
import { Pokemon } from '@/types/pokemon';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface UsePokemonListOptions {
  limit?: number;
  autoFetch?: boolean;
}

export function usePokemonList({ limit = 20, autoFetch = true }: UsePokemonListOptions = {}) {
  const dispatch = useAppDispatch();
  const { pokemons, loading, error, hasNextPage, endCursor, filters } = useAppSelector((state) => state.pokemon);
  const { language } = useAppSelector((state) => state.ui);
  const isLoadingMore = useRef(false);
  const [isAutoLoading, setIsAutoLoading] = useState(false);
  const [currentToastId, setCurrentToastId] = useState<string | null>(null);
  const [lastFilterState, setLastFilterState] = useState<string>('');

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

  // Auto-load Pokemon when filters are applied (generation or type filters)
  useEffect(() => {
    const hasGenerationFilter = filters.generation !== null;
    const hasTypeFilter = filters.types.length > 0;
    const hasSearchFilter = filters.search && filters.search.trim() !== '';
    const hasAnyFilter = hasGenerationFilter || hasTypeFilter || hasSearchFilter;
    
    const autoLoadMore = async () => {
      if (!hasAnyFilter) {
        setIsAutoLoading(false);
        // Dismiss any existing toast when clearing filters
        if (currentToastId) {
          console.log('Dismissing toast due to filter clear');
          toast.dismiss(currentToastId);
          setCurrentToastId(null);
        }
        // Also dismiss all toasts to be safe
        toast.dismiss();
        return;
      }
      
      // For any filter application, we want to load sufficient Pokemon data for filtering
      // Reduced target due to server API issues with some Pokemon
      const TARGET_POKEMON_COUNT = Math.min(300, 1010); // Load 300 Pokemon for good type coverage while avoiding problematic Pokemon
      
      setIsAutoLoading(true);
      
      // Check if filters have actually changed
      const currentFilterState = JSON.stringify({
        generation: filters.generation,
        types: filters.types,
        search: filters.search
      });
      
      // Only show toast if filters changed or no toast is active
      if (currentFilterState !== lastFilterState || !currentToastId) {
        setLastFilterState(currentFilterState);
        
        // Dismiss previous toast if exists
        if (currentToastId) {
          toast.dismiss(currentToastId);
        }
        
        // Show toast notification for loading
        const getFilterMessage = () => {
          if (hasGenerationFilter) {
            return language === 'ja' 
              ? `第${filters.generation}世代のポケモンを読み込み中...`
              : `Loading Generation ${filters.generation} Pokemon...`;
          } else if (hasTypeFilter) {
            const typeNames = filters.types.map(t => t.name).join(', ');
            return language === 'ja'
              ? `${typeNames}タイプのポケモンを読み込み中...`
              : `Loading ${typeNames} type Pokemon...`;
          } else {
            return language === 'ja'
              ? 'ポケモンを読み込み中...'
              : 'Loading Pokemon...';
          }
        };
        
        const toastId = toast.loading(getFilterMessage());
        setCurrentToastId(toastId);
      }
      
      // Only start loading if we haven't reached the target yet
      if (pokemons.length < TARGET_POKEMON_COUNT && hasNextPage) {
        // Load more Pokemon until we have sufficient data for filtering
        let attempts = 0;
        const maxAttempts = 15; // Reduced for faster completion
        let currentPokemonCount = pokemons.length;
        let consecutiveFailures = 0;
        let noProgressAttempts = 0;
        
        console.log(`Starting auto-load for filters. Current: ${currentPokemonCount}, Target: ${TARGET_POKEMON_COUNT}`);
        
        let forcedOffset = 0; // Track forced offset to skip duplicates
        
        while (currentPokemonCount < TARGET_POKEMON_COUNT && hasNextPage && attempts < maxAttempts && consecutiveFailures < 8) {
          attempts++;
          const previousCount = currentPokemonCount;
          console.log(`Auto-loading attempt ${attempts}. Current: ${currentPokemonCount}, Target: ${TARGET_POKEMON_COUNT}, HasNextPage: ${hasNextPage}`);
          
          if (!isLoadingMore.current && !loading) {
            try {
              // If we had no progress in previous attempts, try forcing offset
              const useForceOffset = noProgressAttempts >= 2 ? forcedOffset : undefined;
              if (useForceOffset !== undefined) {
                console.log(`Using forced offset: ${useForceOffset} to skip potential duplicates`);
              }
              
              const actuallyAdded = await loadMore(useForceOffset);
              
              // Wait for Redux state to update with polling
              let waitCount = 0;
              const maxWaitCount = 10;
              let newReduxCount = pokemons.length;
              
              while (waitCount < maxWaitCount && newReduxCount === previousCount) {
                await new Promise(resolve => setTimeout(resolve, 200));
                newReduxCount = pokemons.length; // Re-check Redux state
                waitCount++;
              }
              
              // Get fresh counts from both sources
              const reduxCount = newReduxCount;
              const uniqueCount = uniquePokemons.length;
              const maxCount = Math.max(reduxCount, uniqueCount);
              
              console.log(`After loadMore: Redux=${reduxCount}, Unique=${uniqueCount}, Max=${maxCount}, Previous=${previousCount}, ActuallyAdded=${actuallyAdded}`);
              
              // Update currentPokemonCount - use actual progress from Redux
              if (reduxCount > currentPokemonCount) {
                currentPokemonCount = reduxCount;
                console.log(`Progress detected: ${previousCount} -> ${currentPokemonCount} Pokemon available`);
                consecutiveFailures = 0; // Reset on successful load
                noProgressAttempts = 0; // Reset no progress counter
                forcedOffset = 0; // Reset forced offset on success
              } else if (actuallyAdded === 0) {
                // No new Pokemon were actually added (all were duplicates)
                noProgressAttempts++;
                console.warn(`No progress made in attempt ${attempts}. No progress attempts: ${noProgressAttempts}`);
                console.warn(`Previous: ${previousCount}, Current: ${currentPokemonCount}, Redux: ${reduxCount}, ActuallyAdded: ${actuallyAdded}`);
                
                // If no progress for multiple attempts, increment forced offset
                if (noProgressAttempts >= 1) { // More aggressive offset jumping
                  forcedOffset = Math.max(forcedOffset, reduxCount) + limit; // Jump ahead
                  console.log(`Incrementing forced offset to ${forcedOffset} to skip duplicates`);
                  consecutiveFailures++;
                  await new Promise(resolve => setTimeout(resolve, 500));
                }
              } else {
                // ActuallyAdded > 0 but Redux didn't update yet - likely a timing issue
                console.log(`ActuallyAdded: ${actuallyAdded} but Redux not updated. Waiting longer...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                currentPokemonCount = Math.max(currentPokemonCount, pokemons.length);
              }
            } catch (error) {
              console.error(`Error during auto-loading attempt ${attempts}:`, error);
              consecutiveFailures++;
              
              // If it's a server error, try to skip ahead more aggressively
              if (error instanceof Error && (error.message.includes('404') || error.message.includes('500') || error.message.includes('Network Error'))) {
                console.warn('Server error detected, skipping ahead more aggressively');
                forcedOffset += limit * 2; // Skip ahead by 2 batch sizes to avoid problematic Pokemon
              }
              
              await new Promise(resolve => setTimeout(resolve, 1500)); // Longer wait for server recovery
            }
          } else {
            // Wait if already loading
            console.log(`Waiting for current load to complete... (loading: ${loading}, isLoadingMore: ${isLoadingMore.current})`);
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        // Log final status and handle toast
        if (consecutiveFailures >= 8) {
          console.warn(`Auto-loading stopped due to consecutive failures. Loaded ${currentPokemonCount} Pokemon.`);
          if (currentToastId) {
            toast.error(
              language === 'ja'
                ? '読み込み中にエラーが発生しました。利用可能なポケモンでフィルタリングします。'
                : 'Loading error occurred. Filtering with available Pokemon.',
              { id: currentToastId }
            );
          }
        } else if (attempts >= maxAttempts) {
          console.warn(`Auto-loading stopped due to max attempts reached. Loaded ${currentPokemonCount} Pokemon.`);
          if (currentToastId) {
            toast.dismiss(currentToastId);
          }
        } else {
          console.log(`Auto-loading completed successfully. Loaded ${currentPokemonCount} Pokemon.`);
        }
      }
      
      setIsAutoLoading(false);
      
      // Simply dismiss the loading toast without showing success message
      if (currentToastId) {
        toast.dismiss(currentToastId);
      }
      
      setCurrentToastId(null);
      console.log(`Auto-loading completed. Final count: ${pokemons.length}`);
    };
    
    if (hasAnyFilter) {
      autoLoadMore();
    } else {
      setIsAutoLoading(false);
      setLastFilterState(''); // Reset filter state when no filters
      // Ensure toast is dismissed when no filters
      if (currentToastId) {
        console.log('Force dismissing toast - no filters active');
        toast.dismiss(currentToastId);
        setCurrentToastId(null);
      }
    }
  }, [filters.generation, filters.types, filters.search, language, currentToastId]); // Added currentToastId to ensure cleanup

  // Additional useEffect specifically for toast cleanup on filter clear
  useEffect(() => {
    const hasAnyFilter = filters.generation !== null || filters.types.length > 0 || (filters.search && filters.search.trim() !== '');
    
    if (!hasAnyFilter) {
      console.log('Cleanup useEffect: No filters detected, dismissing all toasts');
      if (currentToastId) {
        console.log('Dismissing specific toast:', currentToastId);
        toast.dismiss(currentToastId);
        setCurrentToastId(null);
      }
      // Always dismiss all toasts when no filters
      toast.dismiss();
      setIsAutoLoading(false); // Stop auto loading
    }
  }, [filters, currentToastId]);

  // Force cleanup on component unmount
  useEffect(() => {
    return () => {
      if (currentToastId) {
        console.log('Component cleanup: Dismissing toast');
        toast.dismiss(currentToastId);
      }
    };
  }, [currentToastId]);

  const loadMore = async (forceOffset?: number): Promise<number> => {
    if (!hasNextPage || loading || isLoadingMore.current) {
      console.log('loadMore blocked:', { hasNextPage, loading, isLoadingMore: isLoadingMore.current });
      return 0;
    }

    try {
      isLoadingMore.current = true;
      dispatch(setLoading(true));
      
      // Use forced offset if provided, otherwise use current Pokemon count
      const currentOffset = forceOffset !== undefined ? forceOffset : pokemons.length;
      console.log('Loading more Pokemon. Current count:', pokemons.length, 'Using offset:', currentOffset, 'Limit:', limit);
      
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
        
        const beforeCount = pokemons.length;
        dispatch(addPokemons(newPokemon));
        dispatch(setHasNextPage(pageInfo.hasNextPage));
        dispatch(setEndCursor(pageInfo.endCursor));
        
        // Check if any new Pokemon were actually added (more reliable)
        const newUniqueIds = new Set(pokemons.map((p: Pokemon) => p.id));
        const actuallyAdded = newPokemon.filter((p: Pokemon) => !newUniqueIds.has(p.id)).length;
        console.log(`Actually added ${actuallyAdded} new Pokemon (before: ${beforeCount}, checking ${newPokemon.length} fetched)`);
        
        return actuallyAdded; // Return count of actually added Pokemon
      }
      return 0;
    } catch (err) {
      console.error('Failed to load more Pokemon:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more Pokemon';
      
      // Don't set permanent error for server-side issues, just log them
      if (errorMessage.includes('dudunsparce') || errorMessage.includes('404') || errorMessage.includes('500')) {
        console.warn('Server-side Pokemon data issue, continuing with available data');
      } else {
        dispatch(setError(errorMessage));
      }
      return 0;
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
      const filterTypeNames = filters.types.map(ft => ft.name);
      
      // Debug logging for type filtering issues
      if (filterTypeNames.includes('dark')) {
        console.log(`[DEBUG] Pokemon ${pokemon.name} (${pokemon.id}) types:`, pokemonTypes);
        console.log(`[DEBUG] Filter types:`, filterTypeNames);
      }
      
      const hasMatchingType = filters.types.some(filterType => 
        pokemonTypes.includes(filterType.name)
      );
      
      if (filterTypeNames.includes('dark') && hasMatchingType) {
        console.log(`[DEBUG] Found matching dark type Pokemon: ${pokemon.name} (${pokemon.id})`);
      }
      
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
  
  // Enable infinite scroll when not filtering or when auto-loading is complete
  // During auto-loading, we want to continue loading more Pokemon
  const shouldShowHasNextPage = hasActiveFilters 
    ? false  // Disable infinite scroll when filtering (we load all data via auto-loading)
    : hasNextPage;

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