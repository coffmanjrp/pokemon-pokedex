"use client";

import { PokemonGrid } from "../../components/ui/pokemon/PokemonGrid";
import { AnimatedLoadingScreen } from "../../components/ui/animation/AnimatedLoadingScreen";
import { Sidebar } from "../../components/layout/Sidebar";
import { PokemonLoadingIndicator } from "../../components/ui/pokemon/PokemonLoadingIndicator";
import { PokemonProgressFooter } from "../../components/ui/pokemon/PokemonProgressFooter";
import { GenerationSwitchingOverlay } from "../../components/ui/pokemon/GenerationSwitchingOverlay";
import { usePokemonList } from "../../hooks/usePokemonList";
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
    if (!currentDictionary) {
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

  // Preload Generation hook for background loading
  // usePreloadGeneration(currentGeneration);

  if (error) {
    return (
      <>
        {/* Sidebar Navigation */}
        <Suspense fallback={<div>Loading sidebar...</div>}>
          <Sidebar
            lang={lang}
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
        language={lang}
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
          currentGeneration={currentGeneration}
          onGenerationChange={handleGenerationChange}
        />
      </Suspense>

      {/* Main Content */}
      <div className="flex flex-col h-screen overflow-auto">
        <div className="flex-1 transition-all duration-300 ease-in-out">
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
                  language={lang}
                  priority={true}
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
