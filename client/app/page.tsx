'use client';

import Image from 'next/image';
import { Header } from '../components/layout/Header';
import { PokemonGrid } from '../components/ui/PokemonGrid';
import { LoadingOverlay } from '../components/ui/LoadingSpinner';
import { FilterSummary } from '../components/ui/FilterSummary';
import { usePokemonList } from '../hooks/usePokemonList';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSelectedPokemon } from '../store/slices/pokemonSlice';
import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Pokemon } from '@/types/pokemon';

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { language } = useAppSelector((state) => state.ui);
  const { filters } = useAppSelector((state) => state.pokemon);
  const { pokemons, allPokemons, loading, error, hasNextPage, loadMore, isFiltering, isAutoLoading } = usePokemonList();
  
  const observerTarget = useRef<HTMLDivElement>(null);

  const handlePokemonClick = (pokemon: Pokemon) => {
    dispatch(setSelectedPokemon(pokemon));
    router.push(`/pokemon/${pokemon.id}`);
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-16 text-red-500">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2">Error loading Pokémon</h3>
          <p className="text-center max-w-md text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-12 px-4">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt={language === 'en' ? 'Pokédex' : 'ポケモン図鑑'}
              width={300}
              height={112}
              priority
              className="h-auto w-auto max-w-xs md:max-w-md"
            />
          </div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Discover and explore the wonderful world of Pokémon. Search, filter, and learn about your favorite creatures!'
              : 'ポケモンの素晴らしい世界を発見し、探検しましょう。お気に入りのポケモンを検索、フィルタリング、学習しましょう！'
            }
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
                {language === 'en' 
                  ? `Loading Pokémon for Generation ${filters.generation}...`
                  : `第${filters.generation}世代のポケモンを読み込み中...`
                }
              </div>
              <div className="text-sm text-blue-600 mt-2">
                {language === 'en' 
                  ? 'This may take a moment for higher generations'
                  : '高い世代の場合、時間がかかる場合があります'
                }
              </div>
            </div>
          </div>
        )}

        {/* Pokemon Grid */}
        <LoadingOverlay show={loading && pokemons.length === 0 && !isAutoLoading} message="Loading Pokémon...">
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
                {language === 'en' ? 'Loading more Pokémon...' : 'もっとポケモンを読み込み中...'}
              </div>
            )}
          </div>
        )}

        {/* End Message */}
        {!hasNextPage && pokemons.length > 0 && !isFiltering && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎉</div>
            <p>
              {language === 'en' 
                ? "You&apos;ve seen all available Pokémon!" 
                : 'すべてのポケモンを見ました！'
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
