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
import { usePokemonListUnified } from "../../hooks/usePokemonListUnified";
// import { useNavigationCache } from "../../hooks/useNavigationCache";
import { usePokemonSearch } from "../../hooks/usePokemonSearch";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  setSelectedPokemon,
  setCurrentGeneration,
} from "../../store/slices/pokemonSlice";
import { setLanguage, setDictionary } from "../../store/slices/uiSlice";
import { setReturnFromDetail } from "../../store/slices/navigationSlice";
import {
  getScrollPositionForGeneration,
  getReturnFromDetailFlag,
} from "../../lib/utils/scrollStorage";
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

  // Navigation cache restoration - comment out for now to isolate the issue
  // const navigationCache = useNavigationCache();
  // const restoreFromURL = navigationCache?.restoreFromURL;

  // Initialize generation from URL parameter on first load
  const generationFromURL = (() => {
    const generationParam = searchParams.get("generation");
    if (generationParam) {
      const generation = parseInt(generationParam, 10);
      if (generation >= 0 && generation <= 9) {
        return generation;
      }
    }
    return 1;
  })();

  // Header visibility state
  const [headerState, setHeaderState] = useState<"visible" | "shrink">(
    "visible",
  );
  const lastScrollYRef = useRef(0);

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
    currentGeneration,
  } = usePokemonListUnified({
    generation: generationFromURL, // Use URL generation for initial load
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
    searchScope,
    updateSearchScope,
  } = usePokemonSearch();

  const [showLoadingScreen, setShowLoadingScreen] = useState(
    initialPokemon.length === 0,
  );
  const [initialLoadComplete, setInitialLoadComplete] = useState(
    initialPokemon.length > 0,
  );
  const [showCompletionFooter, setShowCompletionFooter] = useState(false);
  const completionFooterRef = useRef<HTMLElement>(null);
  const pokemonGridRef = useRef<PokemonGridHandle>(null);

  // Sync language and dictionary from server props to Redux store
  useEffect(() => {
    try {
      if (currentLanguage !== lang) {
        dispatch(setLanguage(lang));
      }
      // Update dictionary when language changes or when dictionary is not set
      if (!currentDictionary || currentLanguage !== lang) {
        dispatch(setDictionary(dictionary));
      }
    } catch (error) {
      console.error("Error in language/dictionary sync:", error);
    }
  }, [lang, currentLanguage, dictionary, currentDictionary, dispatch]);

  // Handle initial loading completion
  useEffect(() => {
    try {
      if (!loading && pokemons.length > 0 && !initialLoadComplete) {
        setInitialLoadComplete(true);
        // End loading immediately after data fetch completion
        setShowLoadingScreen(false);
      }
    } catch (error) {
      console.error("Error in initial loading completion:", error);
    }
  }, [loading, pokemons.length, initialLoadComplete]);

  // Check if returning from detail page and restore scroll position
  useEffect(() => {
    try {
      if (!loading && pokemons.length > 0) {
        const fromParam = searchParams.get("from");
        const generationParam = searchParams.get("generation");
        const hasReturnFlag = getReturnFromDetailFlag();

        if (process.env.NODE_ENV === "development") {
          console.log("[PokemonListClient] Checking scroll restoration:", {
            fromParam,
            generationParam,
            hasReturnFlag,
            currentGeneration,
            pokemonCount: pokemons.length,
            hasGridRef: !!pokemonGridRef.current,
          });
        }

        // Check if user is returning from detail page (either with "from" parameter or return flag)
        if (
          (fromParam && fromParam.startsWith("generation-")) ||
          (generationParam && hasReturnFlag)
        ) {
          // Extract generation number from "generation-X" format or from generationParam
          const generationFromParam = fromParam
            ? parseInt(fromParam.replace("generation-", ""))
            : parseInt(generationParam || "1");

          if (generationFromParam === currentGeneration) {
            // Check session storage for scroll position
            const scrollData =
              getScrollPositionForGeneration(currentGeneration);

            if (scrollData && scrollData.timestamp > Date.now() - 1800000) {
              if (process.env.NODE_ENV === "development") {
                console.log(
                  "[PokemonListClient] Scroll data found:",
                  scrollData,
                );
              }

              // Multiple retry attempts for virtual scroll readiness
              const attemptRestore = (attempt: number = 1) => {
                if (process.env.NODE_ENV === "development") {
                  console.log(
                    `[PokemonListClient] Restore attempt ${attempt}:`,
                    {
                      hasGridRef: !!pokemonGridRef.current,
                    },
                  );
                }

                let restorationSucceeded = false;

                if (
                  scrollData.pokemonIndex !== undefined &&
                  pokemonGridRef.current
                ) {
                  // Use index-based scrolling for virtual grid
                  if (process.env.NODE_ENV === "development") {
                    console.log(
                      "[PokemonListClient] Calling scrollToItem with index:",
                      scrollData.pokemonIndex,
                    );
                  }
                  pokemonGridRef.current.scrollToItem(scrollData.pokemonIndex);
                  restorationSucceeded = true;
                } else if (scrollData.scrollTop !== undefined) {
                  // Use scroll position for standard grid
                  if (process.env.NODE_ENV === "development") {
                    console.log(
                      "[PokemonListClient] Using window.scrollTo with position:",
                      scrollData.scrollTop,
                    );
                  }
                  window.scrollTo({
                    top: scrollData.scrollTop,
                    behavior: "auto",
                  });
                  restorationSucceeded = true;
                }

                // If restoration didn't succeed and we have more attempts
                if (!restorationSucceeded && attempt < 5) {
                  setTimeout(() => attemptRestore(attempt + 1), 300 * attempt);
                  return;
                }

                // Clean up URL parameters only if restoration succeeded
                if (restorationSucceeded) {
                  if (process.env.NODE_ENV === "development") {
                    console.log(
                      "[PokemonListClient] Scroll restoration succeeded",
                    );
                  }

                  try {
                    dispatch(setReturnFromDetail(false));
                  } catch (error) {
                    console.error(
                      "Error dispatching setReturnFromDetail:",
                      error,
                    );
                  }

                  // Clear the return flag from session storage
                  sessionStorage.removeItem("pokemon-return-from-detail");

                  // Only remove "from" parameter if it exists
                  if (fromParam) {
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.delete("from");
                    router.replace(newUrl.pathname + newUrl.search, {
                      scroll: false,
                    });
                  }
                }
              };

              // Start restore attempts with initial delay
              setTimeout(() => attemptRestore(1), 500);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in scroll restoration effect:", error);
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
    // Update Redux state to ensure consistency
    try {
      dispatch(setCurrentGeneration(generation));
    } catch (error) {
      console.error("Error dispatching setCurrentGeneration:", error);
    }
    changeGeneration(generation);
    // Update URL with new generation
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("generation", generation.toString());
    router.push(`/${lang}?${newSearchParams.toString()}`);
    // Reset completion footer when generation changes
    setShowCompletionFooter(false);
    // Generation change doesn't show loading screen, only inline loading indicators

    // Clear search when changing generations
    if (isSearchMode) {
      clearSearchResults();
    }

    // Reset scroll position to top when changing generations
    if (pokemonGridRef.current) {
      pokemonGridRef.current.scrollToTop();
    } else {
      // Fallback to window.scrollTo if grid ref is not available
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    // Clear stored scroll position for the new generation to ensure fresh start
    if (typeof window !== "undefined") {
      const scrollKey = `pokemon-scroll-positions`;
      try {
        const storedPositions = sessionStorage.getItem(scrollKey);
        if (storedPositions) {
          const positions = JSON.parse(storedPositions);
          if (positions[generation]) {
            delete positions[generation];
            sessionStorage.setItem(scrollKey, JSON.stringify(positions));
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Failed to clear scroll position:", error);
        }
      }
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

  // Manage completion footer visibility
  useEffect(() => {
    try {
      const isActive = loading || hasNextPage;

      if (!isActive && pokemons.length > 0) {
        // Show completion state when all loading is done
        setShowCompletionFooter(true);

        // Auto-hide after 5 seconds
        const timer = setTimeout(() => {
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
            setShowCompletionFooter(false);
          }
        }, 5000);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Error in completion footer effect:", error);
    }
  }, [loading, hasNextPage, pokemons.length]);

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
    try {
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
    } catch (error) {
      console.error("Error in completion footer animation:", error);
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
            searchScope={searchScope}
            onSearchScopeChange={updateSearchScope}
            showSearchScopeToggle={true}
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
              <div className="flex-1 overflow-auto">
                {pokemons.length > 0 && (
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
                )}
              </div>
            )}

            {/* Generation Switching Overlay */}
            <GenerationSwitchingOverlay
              lang={lang}
              currentGeneration={currentGeneration}
              generationRange={generationRange}
              isVisible={generationSwitching}
            />
          </div>

          {/* Progress Footer - Always show when we have Pokemon */}
          {pokemons.length > 0 && (
            <PokemonProgressFooter
              ref={completionFooterRef}
              lang={lang}
              loading={loading}
              hasNextPage={hasNextPage}
              isActive={loading || hasNextPage}
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
