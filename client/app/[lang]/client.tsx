"use client";

import { PokemonGrid } from "../../components/ui/pokemon/list/PokemonGrid";
import { AnimatedLoadingScreen } from "../../components/ui/animation/AnimatedLoadingScreen";
import { Sidebar } from "../../components/layout/Sidebar";
import { GenerationHeader } from "../../components/layout/GenerationHeader";
import { PokemonLoadingIndicator } from "../../components/ui/pokemon/list/PokemonLoadingIndicator";
import { PokemonProgressFooter } from "../../components/ui/pokemon/list/PokemonProgressFooter";
import { GenerationSwitchingOverlay } from "../../components/ui/pokemon/list/GenerationSwitchingOverlay";
import { usePokemonList } from "../../hooks/usePokemonList";
import { useNavigationCache } from "../../hooks/useNavigationCache";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setSelectedPokemon } from "../../store/slices/pokemonSlice";
import { setLanguage, setDictionary } from "../../store/slices/uiSlice";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pokemon } from "@/types/pokemon";
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
      if (generation >= 1 && generation <= 9) {
        return generation;
      }
    }
    return 1;
  });

  // Track if cache restoration has been attempted to prevent infinite loops
  const cacheRestoredRef = useRef(false);

  // Restore from cache after component mount to avoid setState during render
  useEffect(() => {
    if (cacheRestoredRef.current) return; // Prevent multiple executions

    const generationParam = searchParams.get("generation");
    if (generationParam) {
      const generation = parseInt(generationParam, 10);
      if (generation >= 1 && generation <= 9) {
        // Try to restore from cache
        if (restoreFromURL()) {
          console.log(
            `Generation ${generation} restored from cache on initial load`,
          );
        }
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

  const [showLoadingScreen, setShowLoadingScreen] = useState(
    initialPokemon.length === 0,
  );
  const [initialLoadComplete, setInitialLoadComplete] = useState(
    initialPokemon.length > 0,
  );
  const [showCompletionFooter, setShowCompletionFooter] = useState(true);
  const completionFooterRef = useRef<HTMLElement>(null);

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
          <div className="flex-1 transition-all duration-300 ease-in-out">
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
      <div className="flex flex-col h-screen overflow-auto">
        <div className="flex-1 transition-all duration-300 ease-in-out">
          {/* Sticky Generation Header */}
          <GenerationHeader
            currentGeneration={currentGeneration}
            lang={lang}
            dictionary={dictionary}
          />

          {/* Pokemon Grid */}
          <div className="flex-1 overflow-hidden relative">
            {/* Inline loading indicator for initial load when no Pokemon data */}
            {loading && pokemons.length === 0 && !generationSwitching && (
              <PokemonLoadingIndicator
                lang={lang}
                currentGeneration={currentGeneration}
                generationRange={generationRange}
                totalCount={totalCount}
              />
            )}

            {/* Pokemon Grid - show when we have Pokemon (overlay will handle generation switching) */}
            {pokemons.length > 0 && (
              <div className="flex-1 overflow-auto">
                <PokemonGrid
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
                />
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
