"use client";

import { Pokemon } from "@/types/pokemon";
import { Dictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";

interface PokemonClassificationBadgeProps {
  pokemon: Pokemon;
  dictionary: Dictionary;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PokemonClassificationBadge({
  pokemon,
  dictionary,
  size = "md",
  className,
}: PokemonClassificationBadgeProps) {
  // Check for special Pokemon classification
  const isBaby = pokemon.species?.isBaby === true;
  const isLegendary = pokemon.species?.isLegendary === true;
  const isMythical = pokemon.species?.isMythical === true;
  const isSpecialPokemon = isBaby || isLegendary || isMythical;

  // Don't render if not a special Pokemon or missing translations
  if (!isSpecialPokemon || !dictionary?.ui?.classifications) {
    return null;
  }

  // Size-based styling
  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-2 py-1.5 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-bold text-white shadow-lg",
        sizeStyles[size],
        isBaby && "bg-pink-500",
        isLegendary && "bg-yellow-500",
        isMythical && "bg-purple-500",
        className,
      )}
    >
      {isBaby && dictionary.ui.classifications.baby}
      {isLegendary && dictionary.ui.classifications.legendary}
      {isMythical && dictionary.ui.classifications.mythical}
    </span>
  );
}
