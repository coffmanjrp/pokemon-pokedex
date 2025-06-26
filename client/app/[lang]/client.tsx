"use client";

import { VirtualPokemonGrid } from "../../components/ui/pokemon/VirtualPokemonGrid";
import { AnimatedLoadingScreen } from "../../components/ui/animation/AnimatedLoadingScreen";
import { Sidebar } from "../../components/layout/Sidebar";
import { usePokemonList } from "../../hooks/usePokemonList";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setSelectedPokemon } from "../../store/slices/pokemonSlice";
import { setLanguage } from "../../store/slices/uiSlice";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pokemon } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { gsap } from "gsap";

interface PokemonListClientProps {
  dictionary: Dictionary;
  lang: Locale;
}

function PokemonListContent({ dictionary, lang }: PokemonListClientProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language: currentLanguage } = useAppSelector((state) => state.ui);
  // Initialize generation from URL parameter on first load
  const [currentGeneration, setCurrentGeneration] = useState(() => {
    const generationParam = searchParams.get("generation");
    if (generationParam) {
      const generation = parseInt(generationParam, 10);
      if (generation >= 1 && generation <= 9) {
        return generation;
      }
    }
    return 1;
  });
  const {
    pokemons,
    loading,
    error,
    hasNextPage,
    loadMore,
    changeGeneration,
    generationRange,
    loadedCount,
    totalCount,
  } = usePokemonList({ generation: currentGeneration });
  const { generationSwitching } = useAppSelector((state) => state.pokemon);

  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [showCompletionFooter, setShowCompletionFooter] = useState(true);
  const completionFooterRef = useRef<HTMLElement>(null);

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
    router.push(
      `/${lang}/pokemon/${pokemon.id}?from=generation-${currentGeneration}`,
    );
  };

  const handleGenerationChange = (generation: number) => {
    setCurrentGeneration(generation);
    changeGeneration(generation);
    // Reset completion footer when generation changes
    setShowCompletionFooter(true);
    // Generation change doesn't show loading screen, only inline loading indicators

    // Update URL with generation parameter
    router.replace(`/${lang}/?generation=${generation}`);
  };

  // Auto-hide completion footer after 5 seconds with fade animation
  useEffect(() => {
    if (
      !loading &&
      !hasNextPage &&
      pokemons.length > 0 &&
      showCompletionFooter
    ) {
      const timer = setTimeout(() => {
        // Animate footer fade out before hiding
        if (completionFooterRef.current) {
          gsap.to(completionFooterRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
              setShowCompletionFooter(false);
            },
          });
        } else {
          // Fallback if ref is not available
          setShowCompletionFooter(false);
        }
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [loading, hasNextPage, pokemons.length, showCompletionFooter]);

  // Animate completion footer entrance
  useEffect(() => {
    if (
      !loading &&
      !hasNextPage &&
      pokemons.length > 0 &&
      showCompletionFooter &&
      completionFooterRef.current
    ) {
      // Reset opacity and position for entrance animation
      gsap.set(completionFooterRef.current, { opacity: 0, y: 20 });
      gsap.to(completionFooterRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay: 0.2, // Small delay for better UX
      });
    }
  }, [loading, hasNextPage, pokemons.length, showCompletionFooter]);

  // プリロード用のPreload Generation hook
  // usePreloadGeneration(currentGeneration);

  if (error) {
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
          <div className="flex-1 ml-0 lg:ml-64 transition-all duration-300 ease-in-out">
            <div className="flex flex-col items-center justify-center h-full py-16 text-red-500">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">
                {dictionary.ui.error.title}
              </h3>
              <p className="text-center max-w-md text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {dictionary.ui.error.tryAgain}
              </button>
            </div>
          </div>
        </div>
      </>
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
        <div className="flex-1 ml-0 lg:ml-64 transition-all duration-300 ease-in-out">
          {/* Sticky Generation Header */}
          <header className="flex-shrink-0 bg-gray-50 border-b border-gray-200 shadow-sm z-30">
            <div className="relative px-4 md:px-6 py-3">
              <h1 className="text-sm md:text-base font-bold text-gray-700 text-center lg:text-left lg:ml-0">
                {lang === "ja"
                  ? `${generationRange.region.ja} (第${currentGeneration}世代)`
                  : `${generationRange.region.en} (Generation ${currentGeneration})`}
              </h1>
            </div>
          </header>

          {/* Pokemon Grid */}
          <div className="flex-1 overflow-hidden relative">
            {/* Inline loading indicator for initial load when no Pokemon data */}
            {loading && pokemons.length === 0 && !generationSwitching && (
              <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-lg font-medium text-gray-700">
                    {lang === "ja"
                      ? `${generationRange.region.ja}のポケモンを読み込み中...`
                      : `Loading ${generationRange.region.en} Pokémon...`}
                  </span>
                </div>

                {/* Progress Bar for Generation Loading */}
                <div className="w-full max-w-md mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>
                      {lang === "ja"
                        ? `第${currentGeneration}世代`
                        : `Generation ${currentGeneration}`}
                    </span>
                    <span className="font-medium">
                      {lang === "ja"
                        ? `0/${totalCount}匹`
                        : `0/${totalCount} Pokémon`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full animate-pulse shadow-sm"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  {lang === "ja"
                    ? `範囲: #${generationRange.min}-#${generationRange.max}`
                    : `Range: #${generationRange.min}-#${generationRange.max}`}
                </p>
              </div>
            )}

            {/* Pokemon Grid - show when we have Pokemon (overlay will handle generation switching) */}
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

            {/* Generation Switching Overlay */}
            {generationSwitching && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-700 mb-1">
                      {lang === "ja"
                        ? `${generationRange.region.ja}に切り替え中...`
                        : `Switching to ${generationRange.region.en}...`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {lang === "ja"
                        ? `第${currentGeneration}世代 (#${generationRange.min}-#${generationRange.max})`
                        : `Generation ${currentGeneration} (#${generationRange.min}-#${generationRange.max})`}
                    </p>
                  </div>
                </div>
              </div>
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
                          {lang === "ja"
                            ? `さらに読み込み中...`
                            : `Loading more...`}
                        </span>
                      </div>

                      {/* Right side - Progress info */}
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <span className="text-xs md:text-sm text-gray-600 hidden sm:block">
                          {lang === "ja"
                            ? `${loadedCount}/${totalCount}匹`
                            : `${loadedCount}/${totalCount}`}
                        </span>
                        <div className="w-16 md:w-20 bg-gray-200 rounded-full h-1.5 md:h-2">
                          <div
                            className="bg-blue-600 h-1.5 md:h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(loadedCount / totalCount) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-blue-600 min-w-[2rem] md:min-w-[2.5rem]">
                          {Math.round((loadedCount / totalCount) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </footer>
              ) : !hasNextPage && showCompletionFooter ? (
                <footer
                  ref={completionFooterRef}
                  className="fixed bottom-0 left-0 lg:left-80 right-0 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200 shadow-lg z-40"
                >
                  <div className="px-4 md:px-6 py-3">
                    <div className="flex items-center justify-between">
                      {/* Left side - Success indicator and text */}
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="text-lg md:text-xl">🎉</div>
                        <span className="text-xs md:text-sm font-medium text-green-700">
                          {lang === "ja"
                            ? `${generationRange.region.ja}の全ポケモンを表示完了！`
                            : `All ${generationRange.region.en} Pokémon loaded!`}
                        </span>
                      </div>

                      {/* Right side - Complete progress info and close button */}
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <span className="text-xs md:text-sm text-green-600 hidden sm:block">
                          {lang === "ja"
                            ? `${totalCount}/${totalCount}匹`
                            : `${totalCount}/${totalCount}`}
                        </span>
                        <div className="w-16 md:w-20 bg-green-200 rounded-full h-1.5 md:h-2">
                          <div className="bg-green-600 h-1.5 md:h-2 rounded-full w-full shadow-sm"></div>
                        </div>
                        <span className="text-xs font-medium text-green-600 min-w-[2rem] md:min-w-[2.5rem]">
                          100%
                        </span>
                        <button
                          onClick={() => {
                            if (completionFooterRef.current) {
                              gsap.to(completionFooterRef.current, {
                                opacity: 0,
                                y: 20,
                                duration: 0.3,
                                ease: "power2.inOut",
                                onComplete: () => {
                                  setShowCompletionFooter(false);
                                },
                              });
                            } else {
                              setShowCompletionFooter(false);
                            }
                          }}
                          className="ml-2 p-1 text-green-500 hover:text-green-700 hover:bg-green-100 rounded-full transition-colors duration-200"
                          aria-label={lang === "ja" ? "閉じる" : "Close"}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </footer>
              ) : null}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export function PokemonListClient({
  dictionary,
  lang,
}: PokemonListClientProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PokemonListContent dictionary={dictionary} lang={lang} />
    </Suspense>
  );
}
