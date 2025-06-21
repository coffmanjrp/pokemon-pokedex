'use client';

import { VirtualPokemonGrid } from '../../components/ui/VirtualPokemonGrid';
import { LoadingOverlay } from '../../components/ui/LoadingSpinner';
import { FilterSummary } from '../../components/ui/FilterSummary';
import { AnimatedLoadingScreen } from '../../components/ui/AnimatedLoadingScreen';
import { usePokemonList } from '../../hooks/usePokemonList';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSelectedPokemon } from '../../store/slices/pokemonSlice';
import { setLanguage } from '../../store/slices/uiSlice';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pokemon } from '@/types/pokemon';
import { Dictionary, Locale } from '@/lib/dictionaries';

interface PokemonListClientProps {
  dictionary: Dictionary;
  lang: Locale;
}

export function PokemonListClient({ dictionary, lang }: PokemonListClientProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { language: currentLanguage } = useAppSelector((state) => state.ui);
  const { pokemons, allPokemons, loading, error, hasNextPage, loadMore, isFiltering, isAutoLoading } = usePokemonList({ limit: 12 });
  
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
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
      // データ取得完了後、少し待ってからローディング終了
      setTimeout(() => {
        setShowLoadingScreen(false);
      }, 800); // 0.8秒でローディング終了（従来の2.5秒より短縮）
    }
  }, [loading, pokemons.length, initialLoadComplete]);

  const handleLoadingComplete = () => {
    // データがまだの場合のフォールバック
    if (initialLoadComplete) {
      setShowLoadingScreen(false);
    }
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    dispatch(setSelectedPokemon(pokemon));
    router.push(`/${lang}/pokemon/${pokemon.id}`);
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
      {/* Filter Summary */}
      <div className="bg-white">
        <FilterSummary 
          resultCount={pokemons.length}
          totalCount={allPokemons.length}
        />
      </div>

      {/* Auto-loading is now handled by Toast notifications */}

      {/* Pokemon Grid */}
      <LoadingOverlay show={loading && pokemons.length === 0 && !isAutoLoading} message={dictionary.ui.loading.loadingPokemon}>
        <VirtualPokemonGrid
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

    </>
  );
}