"use client";

import {
  PokemonGrid,
  PokemonGridHandle,
} from "../../components/ui/pokemon/list/PokemonGrid";
import { AnimatedLoadingScreen } from "../../components/ui/animation/AnimatedLoadingScreen";
import { Sidebar } from "../../components/layout/Sidebar";
import { GenerationHeader } from "../../components/layout/GenerationHeader";
import { PokemonLoadingIndicator } from "../../components/ui/pokemon/list/PokemonLoadingIndicator";
import { PokemonProgressFooter } from "../../components/ui/pokemon/list/PokemonProgressFooter";
import { GenerationSwitchingOverlay } from "../../components/ui/pokemon/list/GenerationSwitchingOverlay";
import { SearchResults } from "../../components/ui/pokemon/list/SearchResults";
import { NoSearchResults } from "../../components/ui/pokemon/list/NoSearchResults";
import { usePokemonList } from "../../hooks/usePokemonList";
import { useNavigationCache } from "../../hooks/useNavigationCache";
import { usePokemonSearch } from "../../hooks/usePokemonSearch";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setSelectedPokemon } from "../../store/slices/pokemonSlice";
import { setLanguage, setDictionary } from "../../store/slices/uiSlice";
import { setReturnFromDetail } from "../../store/slices/navigationSlice";
import { getScrollPositionForGeneration } from "../../lib/utils/scrollStorage";
import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pokemon, PokemonTypeName } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { gsap } from "gsap";

interface PokemonListClientProps {
  dictionary: Dictionary;
  lang: Locale;
  initialPokemon?: Pokemon[];
}

function PokemonListContent({
  dictionary,
  lang,
  initialPokemon = [],
}: PokemonListClientProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language: currentLanguage, dictionary: currentDictionary } =
    useAppSelector((state) => state.ui);

  // Navigation cache restoration
  const { restoreFromURL } = useNavigationCache();

  // Initialize generation from URL parameter on first load
  const [currentGeneration, setCurrentGeneration] = useState(() => {
    const generationParam = searchParams.get("generation");
    if (generationParam) {
      const generation = parseInt(generationParam, 10);
      if (generation >= 0 && generation <= 9) {
        return generation;
      }
    }
    return 1;
  });

  // Header visibility state
  const [headerState, setHeaderState] = useState<"visible" | "shrink">(
    "visible",
  );
  const lastScrollYRef = useRef(0);

  // Track if cache restoration has been attempted to prevent infinite loops
  const cacheRestoredRef = useRef(false);

  // Restore from cache after component mount to avoid setState during render
  useEffect(() => {
    if (cacheRestoredRef.current) return; // Prevent multiple executions

    const generationParam = searchParams.get("generation");
    if (generationParam) {
      const generation = parseInt(generationParam, 10);
      if (generation >= 0 && generation <= 9) {
        // Try to restore from cache
        restoreFromURL();
      }
    }
    cacheRestoredRef.current = true;
  }, [searchParams, restoreFromURL]);
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
  } = usePokemonList({
    generation: currentGeneration,
    initialPokemon: initialPokemon,
  });
  const { generationSwitching } = useAppSelector((state) => state.pokemon);

  // Search functionality
  const {
    query: searchQuery,
    isSearching,
    results: searchResults,
    suggestions: searchSuggestions,
    isSearchMode,
    hasResults,
    search,
    updateQuery,
    clearSearchResults,
    updateFilters,
    clearAllFilters,
    filters,
  } = usePokemonSearch();

  const [showLoadingScreen, setShowLoadingScreen] = useState(
    initialPokemon.length === 0,
  );
  const [initialLoadComplete, setInitialLoadComplete] = useState(
    initialPokemon.length > 0,
  );
  const [showCompletionFooter, setShowCompletionFooter] = useState(true);
  const completionFooterRef = useRef<HTMLElement>(null);
  const pokemonGridRef = useRef<PokemonGridHandle>(null);

  // Sync language and dictionary from server props to Redux store
  useEffect(() => {
    if (currentLanguage !== lang) {
      dispatch(setLanguage(lang));
    }
    // Update dictionary when language changes or when dictionary is not set
    if (!currentDictionary || currentLanguage !== lang) {
      dispatch(setDictionary(dictionary));
    }
  }, [lang, currentLanguage, dictionary, currentDictionary, dispatch]);

  // Handle initial loading completion
  useEffect(() => {
    if (!loading && pokemons.length > 0 && !initialLoadComplete) {
      setInitialLoadComplete(true);
      // End loading immediately after data fetch completion
      setShowLoadingScreen(false);
    }
  }, [loading, pokemons.length, initialLoadComplete]);

  // Check if returning from detail page and restore scroll position
  useEffect(() => {
    if (!loading && pokemons.length > 0 && pokemonGridRef.current) {
      const fromParam = searchParams.get("from");
      if (fromParam && fromParam.startsWith("generation-")) {
        // Extract generation number from "generation-X" format
        const generationFromParam = parseInt(
          fromParam.replace("generation-", ""),
        );

        if (generationFromParam === currentGeneration) {
          // Check session storage for scroll position
          const scrollData = getScrollPositionForGeneration(currentGeneration);

          if (scrollData && scrollData.timestamp > Date.now() - 300000) {
            // 5 minutes validity
            // Small delay to ensure DOM is ready
            setTimeout(() => {
              if (
                scrollData.pokemonIndex !== undefined &&
                pokemonGridRef.current
              ) {
                // Use index-based scrolling for virtual grid
                pokemonGridRef.current.scrollToItem(scrollData.pokemonIndex);
              } else if (scrollData.scrollTop !== undefined) {
                // Use scroll position for standard grid
                window.scrollTo({
                  top: scrollData.scrollTop,
                  behavior: "auto",
                });
              }

              // Clear the "from" parameter after restoring
              dispatch(setReturnFromDetail(false));
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.delete("from");
              router.replace(newUrl.pathname + newUrl.search, {
                scroll: false,
              });
            }, 100);
          }
        }
      }
    }
  }, [
    loading,
    pokemons.length,
    currentGeneration,
    searchParams,
    router,
    dispatch,
  ]);

  const handleLoadingComplete = () => {
    // Fallback when data is not ready yet
    if (initialLoadComplete) {
      setShowLoadingScreen(false);
    }
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    // Optimize Redux dispatch - only set if different from current selection
    dispatch(setSelectedPokemon(pokemon));
    // Navigation is now handled by PokemonCard Link component
    // This function is kept for Redux state management
  };

  const handleGenerationChange = (generation: number) => {
    setCurrentGeneration(generation);
    changeGeneration(generation);
    // Reset completion footer when generation changes
    setShowCompletionFooter(true);
    // Generation change doesn't show loading screen, only inline loading indicators

    // Clear search when changing generations
    if (isSearchMode) {
      clearSearchResults();
    }

    // Update URL with generation parameter
    router.replace(`/${lang}/?generation=${generation}`);
  };

  const handleSearch = (query: string) => {
    updateQuery(query);
    search(query);
  };

  const handleSearchClear = () => {
    if (filters.types && filters.types.length > 0) {
      // タイプフィルタがアクティブな場合、クエリを空にしてタイプフィルタで再検索
      updateQuery("");
      search("", { types: filters.types });
    } else {
      // タイプフィルタがない場合は通常のクリア
      clearSearchResults();
    }
  };

  const handleBackToGeneration = () => {
    // Clear both search results and filters
    clearSearchResults();
    clearAllFilters();
  };

  const handleTypeFilter = (types: string[]) => {
    // Update filters first
    updateFilters({ types: types as PokemonTypeName[] });

    // Expand header when type filter is activated
    if (types.length > 0 && headerState === "shrink") {
      setHeaderState("visible");
    }

    // If no types selected, clear search mode and show all pokemon
    if (types.length === 0) {
      clearSearchResults();
      return;
    }

    // Apply type filter - use current search query or empty string
    search(searchQuery || "", { types: types as PokemonTypeName[] });
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

  // Handle scroll for header shrink/expand
  const handleScroll = useCallback(
    (event: { scrollTop: number }) => {
      // Don't shrink header when type filter is active
      if (filters.types && filters.types.length > 0) {
        return;
      }

      // react-window passes a different event structure
      const currentScrollY = event.scrollTop || 0;

      // Only shrink after scrolling down 100px
      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        // Scrolling down
        setHeaderState("shrink");
      } else if (
        currentScrollY < lastScrollYRef.current ||
        currentScrollY <= 50
      ) {
        // Scrolling up or near top
        setHeaderState("visible");
      }

      lastScrollYRef.current = currentScrollY;
    },
    [filters.types],
  );

  // Remove the old scroll event listener useEffect since we'll handle scroll directly

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

  // Preload Generation hook for background loading
  // usePreloadGeneration(currentGeneration);

  if (error) {
    return (
      <>
        {/* Sidebar Navigation */}
        <Suspense fallback={<div>Loading sidebar...</div>}>
          <Sidebar
            lang={lang}
            dictionary={dictionary}
            currentGeneration={currentGeneration}
            onGenerationChange={handleGenerationChange}
          />
        </Suspense>

        {/* Main Content */}
        <div className="flex flex-col h-screen overflow-hidden">
          <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
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
        dictionary={dictionary}
        onComplete={handleLoadingComplete}
      />
    );
  }

  return (
    <>
      {/* Sidebar Navigation */}
      <Suspense fallback={<div>Loading sidebar...</div>}>
        <Sidebar
          lang={lang}
          dictionary={dictionary}
          currentGeneration={currentGeneration}
          onGenerationChange={handleGenerationChange}
        />
      </Suspense>

      {/* Main Content */}
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
          {/* Sticky Generation Header */}
          <GenerationHeader
            currentGeneration={currentGeneration}
            lang={lang}
            dictionary={dictionary}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            onSearchClear={handleSearchClear}
            searchLoading={isSearching}
            searchSuggestions={searchSuggestions}
            showTypeFilter={true}
            selectedTypes={filters.types}
            onTypeFilter={handleTypeFilter}
            isShrinked={headerState === "shrink"}
            onMouseEnter={() => setHeaderState("visible")}
          />

          {/* Pokemon Grid */}
          <div className="flex-1 flex flex-col relative">
            {/* Inline loading indicator for initial load when no Pokemon data */}
            {loading && pokemons.length === 0 && !generationSwitching && (
              <PokemonLoadingIndicator
                lang={lang}
                currentGeneration={currentGeneration}
                generationRange={generationRange}
                totalCount={totalCount}
              />
            )}

            {/* Pokemon Grid - show search results or normal generation view */}
            {isSearchMode ? (
              // Search Results
              hasResults ? (
                <SearchResults
                  searchResults={searchResults}
                  onSearchClear={handleSearchClear}
                  onPokemonClick={handlePokemonClick}
                  isSearching={isSearching}
                  lang={lang}
                  currentGeneration={currentGeneration}
                  onScroll={handleScroll}
                  dictionary={dictionary}
                />
              ) : (
                // No Search Results
                <NoSearchResults
                  onBackToGeneration={handleBackToGeneration}
                  dictionary={dictionary}
                />
              )
            ) : (
              // Normal Generation View
              pokemons.length > 0 && (
                <div className="flex-1 overflow-auto">
                  <PokemonGrid
                    ref={pokemonGridRef}
                    pokemons={pokemons}
                    onPokemonClick={handlePokemonClick}
                    loading={loading}
                    isFiltering={false}
                    isAutoLoading={false}
                    hasNextPage={hasNextPage}
                    onLoadMore={loadMore}
                    language={lang as Locale}
                    priority={true}
                    currentGeneration={currentGeneration}
                    onScroll={handleScroll}
                  />
                </div>
              )
            )}

            {/* Generation Switching Overlay */}
            <GenerationSwitchingOverlay
              lang={lang}
              currentGeneration={currentGeneration}
              generationRange={generationRange}
              isVisible={generationSwitching}
            />
          </div>

          {/* Progress Footer - Show based on loading state */}
          {pokemons.length > 0 && (
            <PokemonProgressFooter
              ref={completionFooterRef}
              lang={lang}
              loading={loading}
              hasNextPage={hasNextPage}
              showCompletionFooter={showCompletionFooter}
              loadedCount={loadedCount}
              totalCount={totalCount}
              currentGeneration={currentGeneration}
              generationRange={generationRange}
              onCloseCompletion={() => {
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
            />
          )}
        </div>
      </div>
    </>
  );
}

export function PokemonListClient({
  dictionary,
  lang,
  initialPokemon = [],
}: PokemonListClientProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PokemonListContent
        dictionary={dictionary}
        lang={lang}
        initialPokemon={initialPokemon}
      />
    </Suspense>
  );
}
