"use client";

import { useMemo } from "react";
import { Pokemon } from "@/types/pokemon";
import { Locale } from "@/lib/dictionaries";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";
import { collectSprites, createSpriteCategories } from "@/lib/spriteCollector";
import { SpriteGrid } from "./SpriteGrid";

interface SpritesTabProps {
  pokemon: Pokemon;
  language: Locale;
}

export function SpritesTab({ pokemon, language }: SpritesTabProps) {
  const { dictionary } = useAppSelector((state) => state.ui);
  const fallback = getFallbackText(language);

  // Memoize sprite collection to prevent unnecessary recalculations
  const sprites = useMemo(
    () => collectSprites(pokemon, dictionary, fallback),
    [pokemon, dictionary, fallback],
  );

  // Memoize categories to prevent unnecessary recalculations
  const categories = useMemo(
    () => createSpriteCategories(sprites, dictionary, fallback),
    [sprites, dictionary, fallback],
  );

  const noSpritesMessage =
    dictionary?.ui.pokemonDetails.noSpritesAvailable || fallback;

  return (
    <SpriteGrid
      sprites={sprites}
      categories={categories}
      pokemonName={pokemon.name}
      language={language}
      noSpritesMessage={noSpritesMessage}
    />
  );
}
