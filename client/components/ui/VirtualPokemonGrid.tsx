'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';
import { PokemonCard } from './PokemonCard';

interface VirtualPokemonGridProps {
  pokemons: Pokemon[];
  onPokemonClick: (pokemon: Pokemon) => void;
  loading?: boolean;
  isFiltering?: boolean;
  isAutoLoading?: boolean;
  estimateSize?: number;
  overscan?: number;
}

export function VirtualPokemonGrid({
  pokemons,
  onPokemonClick,
  loading = false,
  isFiltering = false,
  isAutoLoading = false,
  estimateSize = 350, // Estimated height of each card
  overscan = 10 // Increased for smoother scrolling
}: VirtualPokemonGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Calculate how many columns we can fit based on screen size
  const getColumns = () => {
    if (typeof window === 'undefined') return 3;
    const width = window.innerWidth;
    if (width < 640) return 1; // mobile
    if (width < 768) return 2; // sm
    if (width < 1024) return 3; // md
    if (width < 1280) return 4; // lg
    return 5; // xl - large desktop
  };

  const [columns, setColumns] = useState(() => getColumns());

  // Update columns on window resize
  useEffect(() => {
    const handleResize = () => {
      setColumns(getColumns());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    overscan,
  });

  if (loading && pokemons.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 animate-pulse rounded-xl h-80"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-[80vh] overflow-auto" // Fixed height container for virtual scrolling
      style={{
        contain: 'strict', // CSS containment for better performance
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          if (!row) return null;

          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6 h-full">
                {row.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={onPokemonClick}
                    className="h-80" // Fixed height for consistent virtual scrolling
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading indicator for infinite scroll */}
      {(loading || isAutoLoading) && pokemons.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

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