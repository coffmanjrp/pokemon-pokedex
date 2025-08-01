"use client";

import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Pokemon } from "@/types/pokemon";
import { PokemonCard } from "./PokemonCard";
import {
  VirtualPokemonGrid,
  VirtualPokemonGridHandle,
} from "./VirtualPokemonGrid";
import { Locale } from "@/lib/dictionaries";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";
import { useRouter } from "next/navigation";

export interface PokemonGridHandle {
  scrollToItem: (index: number) => void;
  scrollToTop: () => void;
}

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
  currentGeneration?: number;
  onScroll?: (event: { scrollTop: number }) => void;
}

export const PokemonGrid = forwardRef<PokemonGridHandle, PokemonGridProps>(
  (
    {
      pokemons,
      onPokemonClick,
      loading = false,
      isFiltering = false,
      priority = false,
      language = "en",
      currentGeneration,
      onScroll,
    },
    ref,
  ) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const virtualGridRef = useRef<VirtualPokemonGridHandle>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [useVirtualScroll, setUseVirtualScroll] = useState(false);
    const { dictionary } = useAppSelector((state) => state.ui);
    const fallback = getFallbackText(language);
    const router = useRouter();

    // Batch prefetch visible Pokemon detail pages
    useEffect(() => {
      if (!isMounted || pokemons.length === 0) return;

      const prefetchVisiblePokemon = () => {
        // Prefetch first 12 Pokemon (initial visible batch)
        const visiblePokemon = pokemons.slice(0, 12);

        visiblePokemon.forEach((pokemon) => {
          const detailUrl = `/${language}/pokemon/${pokemon.id}${currentGeneration ? `?from=generation-${currentGeneration}` : ""}`;
          router.prefetch(detailUrl);
        });
      };

      // Prefetch after a short delay to avoid blocking initial render
      const timeoutId = setTimeout(prefetchVisiblePokemon, 1000);

      return () => clearTimeout(timeoutId);
    }, [isMounted, pokemons, language, currentGeneration, router]);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Enable virtual scroll for large datasets
    useEffect(() => {
      // Enable virtual scroll when we have more than 10 Pokemon
      const shouldUseVirtual = pokemons.length > 10;
      setUseVirtualScroll(shouldUseVirtual);
    }, [pokemons.length]);

    // Expose methods to parent component
    useImperativeHandle(
      ref,
      () => ({
        scrollToItem: (index: number) => {
          if (process.env.NODE_ENV === "development") {
            console.log("[PokemonGrid] scrollToItem called:", {
              index,
              useVirtualScroll,
              hasVirtualGridRef: !!virtualGridRef.current,
              hasParentRef: !!parentRef.current,
            });
          }

          if (useVirtualScroll && virtualGridRef.current) {
            // Delegate to virtual grid
            virtualGridRef.current.scrollToItem(index);
          } else if (parentRef.current) {
            // For standard grid, find the element and scroll to it
            const gridElement = parentRef.current.querySelector(".grid");
            if (gridElement) {
              const children = gridElement.children;
              if (children[index]) {
                if (process.env.NODE_ENV === "development") {
                  console.log(
                    "[PokemonGrid] Scrolling to element in standard grid",
                  );
                }
                children[index].scrollIntoView({
                  behavior: "auto",
                  block: "center",
                });
              } else if (process.env.NODE_ENV === "development") {
                console.warn(
                  `[PokemonGrid] Child element at index ${index} not found`,
                );
              }
            }
          } else {
            // Fallback: try to calculate scroll position based on index
            if (process.env.NODE_ENV === "development") {
              console.log("[PokemonGrid] Using fallback scroll calculation");
            }

            // Approximate scroll position based on grid layout
            const columns =
              window.innerWidth < 640
                ? 1
                : window.innerWidth < 768
                  ? 2
                  : window.innerWidth < 1024
                    ? 3
                    : window.innerWidth < 1280
                      ? 4
                      : 5;
            const rowHeight = window.innerWidth < 640 ? 300 : 337;
            const row = Math.floor(index / columns);
            const approximateScrollTop = row * rowHeight;

            window.scrollTo({
              top: approximateScrollTop,
              behavior: "auto",
            });
          }
        },
        scrollToTop: () => {
          if (useVirtualScroll && virtualGridRef.current) {
            virtualGridRef.current.scrollToTop();
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        },
      }),
      [useVirtualScroll],
    );

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
              lang={language}
              pokemonIndex={index}
              {...(currentGeneration !== undefined && { currentGeneration })}
            />
          ))}
        </div>
      );
    }

    // Use virtual scrolling for large datasets
    if (useVirtualScroll && isMounted) {
      return (
        <div className="w-full h-full">
          <VirtualPokemonGrid
            ref={virtualGridRef}
            pokemons={pokemons}
            onPokemonClick={onPokemonClick}
            language={language}
            priority={priority}
            {...(onScroll && { onScroll })}
            {...(currentGeneration !== undefined && { currentGeneration })}
          />

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

    // Standard grid for smaller datasets
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
              lang={language}
              pokemonIndex={index}
              {...(currentGeneration !== undefined && { currentGeneration })}
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
  },
);

PokemonGrid.displayName = "PokemonGrid";

// Export PokemonCard as a static property for external use
(PokemonGrid as unknown as { PokemonCard: typeof PokemonCard }).PokemonCard =
  PokemonCard;
