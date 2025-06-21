'use client';

import Image from 'next/image';
import { PokemonGrid } from '../../components/ui/PokemonGrid';
import { LoadingOverlay } from '../../components/ui/LoadingSpinner';
import { FilterSummary } from '../../components/ui/FilterSummary';
import { AnimatedLoadingScreen } from '../../components/ui/AnimatedLoadingScreen';
import { PageTransition } from '../../components/ui/PageTransition';
import { usePokemonList } from '../../hooks/usePokemonList';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSelectedPokemon } from '../../store/slices/pokemonSlice';
import { setLanguage } from '../../store/slices/uiSlice';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pokemon } from '@/types/pokemon';
import { Dictionary, Locale, interpolate } from '@/lib/dictionaries';

interface PokemonListClientProps {
  dictionary: Dictionary;
  lang: Locale;
}

export function PokemonListClient({ dictionary, lang }: PokemonListClientProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { filters } = useAppSelector((state) => state.pokemon);
  const { language: currentLanguage } = useAppSelector((state) => state.ui);
  const { pokemons, allPokemons, loading, error, hasNextPage, loadMore, isFiltering, isAutoLoading } = usePokemonList();
  
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [selectedPokemonForTransition, setSelectedPokemonForTransition] = useState<Pokemon | null>(null);
  const [sourceElement, setSourceElement] = useState<HTMLElement | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Sync language from server props to Redux store
  useEffect(() => {
    if (currentLanguage !== lang) {
      dispatch(setLanguage(lang));
    }
  }, [lang, currentLanguage, dispatch]);

  // Handle initial loading completion
  useEffect(() => {
    if (!loading && pokemons.length > 0 && !initialLoadComplete) {
      setInitialLoadComplete(true);
    }
  }, [loading, pokemons.length, initialLoadComplete]);

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
  };

  const handlePokemonClick = (pokemon: Pokemon, element?: HTMLElement) => {
    dispatch(setSelectedPokemon(pokemon));
    
    if (element) {
      // Start transition animation
      setSelectedPokemonForTransition(pokemon);
      setSourceElement(element);
      setShowTransition(true);
    } else {
      // Fallback to direct navigation
      router.push(`/${lang}/pokemon/${pokemon.id}`);
    }
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    if (selectedPokemonForTransition) {
      router.push(`/${lang}/pokemon/${selectedPokemonForTransition.id}`);
    }
    setSelectedPokemonForTransition(null);
    setSourceElement(null);
  };

  // Infinite scroll implementation with debouncing
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !loading) {
        // Small delay to prevent rapid firing
        setTimeout(() => {
          if (hasNextPage && !loading) {
            loadMore();
          }
        }, 100);
      }
    },
    [hasNextPage, loading, loadMore]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.5, // Increased threshold to trigger less frequently
      rootMargin: '100px', // Trigger 100px before reaching the element
    });

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [handleObserver]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-red-500">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold mb-2">{dictionary.ui.error.title}</h3>
        <p className="text-center max-w-md text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {dictionary.ui.error.tryAgain}
        </button>
      </div>
    );
  }

  // Show loading screen until initial data is loaded
  if (showLoadingScreen && !initialLoadComplete) {
    return (
      <AnimatedLoadingScreen 
        language={lang} 
        onComplete={handleLoadingComplete}
      />
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="text-center py-12 px-4">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt={lang === 'en' ? 'Pokédex' : 'ポケモン図鑑'}
            width={300}
            height={112}
            priority
            className="h-auto w-auto max-w-xs md:max-w-md"
          />
        </div>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          {dictionary.meta.description}
        </p>
      </div>

      {/* Filter Summary */}
      <FilterSummary 
        resultCount={pokemons.length}
        totalCount={allPokemons.length}
      />

      {/* Auto-loading indicator for filtering */}
      {isAutoLoading && (
        <div className="flex justify-center items-center py-8 mx-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 w-full max-w-md text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-blue-800 font-medium">
              {interpolate(dictionary.ui.loading.loadingGeneration, { generation: filters.generation?.toString() || '' })}
            </div>
            <div className="text-sm text-blue-600 mt-2">
              {lang === 'en' 
                ? 'This may take a moment for higher generations'
                : '高い世代の場合、時間がかかる場合があります'
              }
            </div>
          </div>
        </div>
      )}

      {/* Pokemon Grid */}
      <LoadingOverlay show={loading && pokemons.length === 0 && !isAutoLoading} message={dictionary.ui.loading.loadingPokemon}>
        <PokemonGrid
          pokemons={pokemons}
          onPokemonClick={handlePokemonClick}
          loading={loading}
          isFiltering={isFiltering}
          isAutoLoading={isAutoLoading}
        />
      </LoadingOverlay>

      {/* Load More Trigger */}
      {hasNextPage && (
        <div
          ref={observerTarget}
          className="flex justify-center py-8"
        >
          {loading && (
            <div className="text-gray-500">
              {dictionary.ui.loading.loadingMore}
            </div>
          )}
        </div>
      )}

      {/* End Message */}
      {!hasNextPage && pokemons.length > 0 && !isFiltering && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🎉</div>
          <p>
            {lang === 'en' 
              ? "You've seen all available Pokémon!" 
              : 'すべてのポケモンを見ました！'
            }
          </p>
        </div>
      )}

      {/* Page Transition Animation */}
      <PageTransition
        isActive={showTransition}
        pokemon={selectedPokemonForTransition || undefined}
        sourceElement={sourceElement}
        onComplete={handleTransitionComplete}
      />
    </>
  );
}