"use client";

import { useLayoutEffect } from "react";
import { Pokemon } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { PokemonDetailHeader } from "@/components/ui/pokemon/detail/PokemonDetailHeader";
import { PokemonTopNavigationTabs } from "@/components/ui/pokemon/detail/PokemonTopNavigationTabs";
import { useBackgroundPreload } from "@/hooks/useBackgroundPreload";
import { useAppDispatch } from "@/store/hooks";
import { setLanguage, setDictionary } from "@/store/slices/uiSlice";

interface PokemonDetailClientProps {
  pokemon: Pokemon;
  lang: Locale;
  dictionary: Dictionary;
}

export default function PokemonDetailClient({
  pokemon,
  lang,
  dictionary,
}: PokemonDetailClientProps) {
  const dispatch = useAppDispatch();

  // Synchronously initialize Redux state before any rendering to prevent hydration mismatch
  useLayoutEffect(() => {
    // Always ensure dictionary is set immediately
    dispatch(setDictionary(dictionary));
    dispatch(setLanguage(lang));
  }, [lang, dictionary, dispatch]);

  // Background preload nearby Pokemon
  const { preloadStatus, isPreloading } = useBackgroundPreload({
    currentPokemonId: parseInt(pokemon.id),
    enabled: true,
    delay: 3000, // Start after 3 seconds (while user views details)
    maxConcurrent: 2, // Maximum 2 concurrent requests
    priority: "low", // Low priority
  });

  return (
    <>
      <PokemonDetailHeader language={lang as Locale} dictionary={dictionary} />

      {/* Top Navigation Tabs with Content */}
      <PokemonTopNavigationTabs
        pokemon={pokemon}
        lang={lang}
        dictionary={dictionary}
      />

      {/* Debug indicator (removed in production) */}
      {process.env.NODE_ENV === "development" && isPreloading && (
        <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm">
          Preloading: {preloadStatus.completed}/{preloadStatus.total}
        </div>
      )}
    </>
  );
}
