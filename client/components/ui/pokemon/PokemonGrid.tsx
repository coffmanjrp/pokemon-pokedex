"use client";

import { useRef, useState, useEffect } from "react";
import { Pokemon } from "@/types/pokemon";
import { PokemonCard } from "./PokemonCard";
import { Locale } from "@/lib/dictionaries";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";

interface PokemonGridProps {
  pokemons: Pokemon[];
  onPokemonClick: (pokemon: Pokemon) => void;
  loading?: boolean;
  isFiltering?: boolean;
  isAutoLoading?: boolean;
  estimateSize?: number;
  overscan?: number;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  language?: Locale;
  priority?: boolean;
}

export function PokemonGrid({
  pokemons,
  onPokemonClick,
  loading = false,
  isFiltering = false,
  priority = false,
  language = "en",
}: PokemonGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { dictionary } = useAppSelector((state) => state.ui);
  const fallback = getFallbackText(language);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (loading && pokemons.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 px-3 sm:px-4 py-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 animate-pulse rounded-xl h-72 sm:h-80"
          />
        ))}
      </div>
    );
  }

  // Don't render virtual scrolling until mounted to avoid SSR issues
  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 px-3 sm:px-4 py-4">
        {pokemons.slice(0, 12).map((pokemon, index) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={onPokemonClick}
            className="h-72 sm:h-80" // Slightly smaller on mobile
            priority={index < 5} // Priority for first 5 cards in initial render
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="w-full"
      style={{
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 px-3 sm:px-4 py-4 pb-20">
        {pokemons.map((pokemon, index) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={onPokemonClick}
            className="h-72 sm:h-80"
            priority={priority && index < 5}
          />
        ))}
      </div>

      {/* Show message when filtering */}
      {isFiltering && pokemons.length === 0 && !loading && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-4">🔍</div>
          <p>{dictionary?.ui.search.noFilterResults || fallback}</p>
        </div>
      )}
    </div>
  );
}
