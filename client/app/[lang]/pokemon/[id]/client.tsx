"use client";

import { useLayoutEffect } from "react";
import { Pokemon } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { PokemonDetailHeader } from "@/components/ui/pokemon/detail/PokemonDetailHeader";
import { PokemonTopNavigationTabs } from "@/components/ui/pokemon/detail/PokemonTopNavigationTabs";
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

  return (
    <>
      <PokemonDetailHeader language={lang as Locale} dictionary={dictionary} />

      {/* Top Navigation Tabs with Content */}
      <PokemonTopNavigationTabs
        pokemon={pokemon}
        lang={lang}
        dictionary={dictionary}
      />
    </>
  );
}
