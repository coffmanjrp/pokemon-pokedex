'use client';

import { Header } from '../components/layout/Header';
import { PokemonGrid } from '../components/ui/PokemonGrid';
import { LoadingOverlay } from '../components/ui/LoadingSpinner';
import { usePokemonList } from '../hooks/usePokemonList';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSelectedPokemon } from '../store/slices/pokemonSlice';
import { useEffect, useRef, useCallback } from 'react';
import { Pokemon } from '@/types/pokemon';

export default function Home() {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.ui);
  const { pokemons, loading, error, hasNextPage, loadMore } = usePokemonList();
  
  const observerTarget = useRef<HTMLDivElement>(null);

  const handlePokemonClick = (pokemon: Pokemon) => {
    dispatch(setSelectedPokemon(pokemon));
    // TODO: Navigate to Pokemon detail page
    console.log('Selected Pokemon:', pokemon);
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
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
              {language === 'en' ? 'Pokédex' : 'ポケモン図鑑'}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Discover and explore the wonderful world of Pokémon. Search, filter, and learn about your favorite creatures!'
              : 'ポケモンの素晴らしい世界を発見し、探検しましょう。お気に入りのポケモンを検索、フィルタリング、学習しましょう！'
            }
          </p>
        </div>

        {/* Pokemon Grid */}
        <LoadingOverlay show={loading && pokemons.length === 0} message="Loading Pokémon...">
          <PokemonGrid
            pokemons={pokemons}
            onPokemonClick={handlePokemonClick}
            loading={loading}
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
        {!hasNextPage && pokemons.length > 0 && (
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
