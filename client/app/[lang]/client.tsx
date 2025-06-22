'use client';

import { VirtualPokemonGrid } from '../../components/ui/VirtualPokemonGrid';
import { AnimatedLoadingScreen } from '../../components/ui/AnimatedLoadingScreen';
import { Sidebar } from '../../components/layout/Sidebar';
import { usePokemonList } from '../../hooks/usePokemonList';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSelectedPokemon } from '../../store/slices/pokemonSlice';
import { setLanguage } from '../../store/slices/uiSlice';
import { useEffect, useState } from 'react';
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
  const [currentGeneration, setCurrentGeneration] = useState(1);
  const { pokemons, loading, error, hasNextPage, loadMore, changeGeneration, generationRange, loadedCount, totalCount } = usePokemonList({ generation: currentGeneration });
  
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

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
      // データ取得完了後、すぐにローディング終了
      setShowLoadingScreen(false);
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

  const handleGenerationChange = (generation: number) => {
    setCurrentGeneration(generation);
    changeGeneration(generation);
    // Generation change doesn't show loading screen, only inline loading indicators
  };


  // プリロード用のPreload Generation hook
  // usePreloadGeneration(currentGeneration);



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

  // Show loading screen until showLoadingScreen is false
  if (showLoadingScreen) {
    return (
      <AnimatedLoadingScreen 
        language={lang} 
        onComplete={handleLoadingComplete}
      />
    );
  }

  return (
    <>
      {/* Sidebar Navigation */}
      <Sidebar 
        lang={lang}
        currentGeneration={currentGeneration}
        onGenerationChange={handleGenerationChange}
      />

      {/* Main Content */}
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Sticky Generation Header */}
        <header className="flex-shrink-0 bg-gray-50 border-b border-gray-200 shadow-sm z-30">
          <div className="px-4 md:px-6 py-2">
            <h1 className="text-sm md:text-base font-bold text-gray-700">
              {lang === 'ja' 
                ? `${generationRange.region.ja} (第${currentGeneration}世代)`
                : `${generationRange.region.en} (Generation ${currentGeneration})`
              }
            </h1>
          </div>
        </header>

        {/* Pokemon Grid */}
        <div className="flex-1 overflow-hidden">
          {/* Inline loading indicator for generation changes */}
          {loading && pokemons.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-lg font-medium text-gray-700">
                  {lang === 'ja' 
                    ? `${generationRange.region.ja}のポケモンを読み込み中...`
                    : `Loading ${generationRange.region.en} Pokémon...`
                  }
                </span>
              </div>
              
              {/* Progress Bar for Generation Loading */}
              <div className="w-full max-w-md mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>
                    {lang === 'ja' 
                      ? `第${currentGeneration}世代`
                      : `Generation ${currentGeneration}`
                    }
                  </span>
                  <span className="font-medium">
                    {lang === 'ja' 
                      ? `0/${totalCount}匹`
                      : `0/${totalCount} Pokémon`
                    }
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3 shadow-inner">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full animate-pulse shadow-sm" style={{ width: '25%' }}></div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                {lang === 'ja' 
                  ? `範囲: #${generationRange.min}-#${generationRange.max}`
                  : `Range: #${generationRange.min}-#${generationRange.max}`
                }
              </p>
            </div>
          )}

          {/* Pokemon Grid - only show when we have Pokemon */}
          {pokemons.length > 0 && (
            <VirtualPokemonGrid
              pokemons={pokemons}
              onPokemonClick={handlePokemonClick}
              loading={loading}
              isFiltering={false}
              isAutoLoading={false}
              hasNextPage={hasNextPage}
              onLoadMore={loadMore}
              language={lang}
              priority={true}
            />
          )}
        </div>


        {/* Progress Footer - Show based on loading state */}
        {pokemons.length > 0 && (
          <>
            {loading ? (
              <footer className="fixed bottom-0 left-0 lg:left-80 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
                <div className="px-4 md:px-6 py-3">
                  <div className="flex items-center justify-between">
                    {/* Left side - Loading indicator and text */}
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-blue-600"></div>
                      <span className="text-xs md:text-sm font-medium text-gray-700">
                        {lang === 'ja' 
                          ? `さらに読み込み中...`
                          : `Loading more...`
                        }
                      </span>
                    </div>
                    
                    {/* Right side - Progress info */}
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <span className="text-xs md:text-sm text-gray-600 hidden sm:block">
                        {lang === 'ja' 
                          ? `${loadedCount}/${totalCount}匹`
                          : `${loadedCount}/${totalCount}`
                        }
                      </span>
                      <div className="w-16 md:w-20 bg-gray-200 rounded-full h-1.5 md:h-2">
                        <div 
                          className="bg-blue-600 h-1.5 md:h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(loadedCount / totalCount) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-blue-600 min-w-[2rem] md:min-w-[2.5rem]">
                        {Math.round((loadedCount / totalCount) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </footer>
            ) : !hasNextPage ? (
              <footer className="fixed bottom-0 left-0 lg:left-80 right-0 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200 shadow-lg z-40">
                <div className="px-4 md:px-6 py-3">
                  <div className="flex items-center justify-between">
                    {/* Left side - Success indicator and text */}
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="text-lg md:text-xl">🎉</div>
                      <span className="text-xs md:text-sm font-medium text-green-700">
                        {lang === 'ja' 
                          ? `${generationRange.region.ja}の全ポケモンを表示完了！`
                          : `All ${generationRange.region.en} Pokémon loaded!`
                        }
                      </span>
                    </div>
                    
                    {/* Right side - Complete progress info */}
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <span className="text-xs md:text-sm text-green-600 hidden sm:block">
                        {lang === 'ja' 
                          ? `${totalCount}/${totalCount}匹`
                          : `${totalCount}/${totalCount}`
                        }
                      </span>
                      <div className="w-16 md:w-20 bg-green-200 rounded-full h-1.5 md:h-2">
                        <div className="bg-green-600 h-1.5 md:h-2 rounded-full w-full shadow-sm"></div>
                      </div>
                      <span className="text-xs font-medium text-green-600 min-w-[2rem] md:min-w-[2.5rem]">
                        100%
                      </span>
                    </div>
                  </div>
                </div>
              </footer>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}