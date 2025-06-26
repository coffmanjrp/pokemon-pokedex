"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useMemo, useState, useEffect } from "react";
import { Pokemon } from "@/types/pokemon";
import { PokemonCard } from "./PokemonCard";

interface VirtualPokemonGridProps {
  pokemons: Pokemon[];
  onPokemonClick: (pokemon: Pokemon) => void;
  loading?: boolean;
  isFiltering?: boolean;
  isAutoLoading?: boolean;
  estimateSize?: number;
  overscan?: number;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  language?: "en" | "ja";
  priority?: boolean;
}

export function VirtualPokemonGrid({
  pokemons,
  onPokemonClick,
  loading = false,
  isFiltering = false,
  // isAutoLoading = false,
  estimateSize = 350, // Estimated height of each card
  // overscan = 2, // Further reduced for Generation 1 performance
  // hasNextPage = false,
  // onLoadMore,
  // language = 'en',
  priority = false,
}: VirtualPokemonGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate how many columns we can fit based on screen size
  const getColumns = () => {
    if (typeof window === "undefined") return 3;
    const width = window.innerWidth;
    if (width < 640) return 1; // mobile
    if (width < 768) return 2; // sm
    if (width < 1024) return 3; // md
    if (width < 1280) return 4; // lg
    return 5; // xl - large desktop
  };

  const [columns, setColumns] = useState(() => getColumns());

  // Debounced resize handler for better performance
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setColumns(getColumns());
      }, 150); // 150ms debounce
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Group Pokemon into rows
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < pokemons.length; i += columns) {
      result.push(pokemons.slice(i, i + columns));
    }
    return result;
  }, [pokemons, columns]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5, // 無限スクロール用にoverscanを増加
  });

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
      className="h-full w-full overflow-auto" // Full height and width
      style={{
        contain: "strict", // CSS containment for better performance
        WebkitOverflowScrolling: "touch", // iOS Safari smooth scrolling
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
          paddingBottom: "64px", // Footer height space
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          if (!row) return null;

          return (
            <div
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 px-3 sm:px-4 py-4 h-full">
                {row.map((pokemon, cardIndex) => {
                  // Calculate global index for priority loading
                  const globalIndex = virtualRow.index * columns + cardIndex;
                  // Priority for first visible row only (faster initial load)
                  const shouldPrioritize = priority && globalIndex < columns;

                  return (
                    <PokemonCard
                      key={pokemon.id}
                      pokemon={pokemon}
                      onClick={onPokemonClick}
                      className="h-72 sm:h-80" // Responsive height for consistent virtual scrolling
                      priority={shouldPrioritize}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show message when filtering */}
      {isFiltering && pokemons.length === 0 && !loading && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-4">🔍</div>
          <p>フィルター条件に一致するポケモンが見つかりません</p>
        </div>
      )}
    </div>
  );
}
