'use client';

import { Pokemon } from '@/types/pokemon';
import { PokemonCard } from './PokemonCard';
import { cn } from '@/lib/utils';

interface PokemonGridProps {
  pokemons: Pokemon[];
  onPokemonClick?: (pokemon: Pokemon) => void;
  className?: string;
  loading?: boolean;
}

export function PokemonGrid({ 
  pokemons, 
  onPokemonClick, 
  className,
  loading = false 
}: PokemonGridProps) {
  if (loading && pokemons.length === 0) {
    return (
      <div className={cn(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        'gap-6 p-6',
        className
      )}>
        {Array.from({ length: 20 }).map((_, index) => (
          <PokemonCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (pokemons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No Pokémon found</h3>
        <p className="text-center max-w-md">
          Try adjusting your search or filter criteria to find the Pokémon you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
      'gap-6 p-6',
      className
    )}>
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          onClick={onPokemonClick}
        />
      ))}
      
      {loading && (
        <>
          {Array.from({ length: 10 }).map((_, index) => (
            <PokemonCardSkeleton key={`skeleton-${index}`} />
          ))}
        </>
      )}
    </div>
  );
}

function PokemonCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white border-2 border-gray-200 shadow-lg animate-pulse">
      {/* Pokemon ID Skeleton */}
      <div className="absolute top-3 right-3 z-10">
        <div className="h-6 w-12 bg-gray-300 rounded-full" />
      </div>

      {/* Pokemon Image Skeleton */}
      <div className="relative h-48 flex items-center justify-center p-4">
        <div className="w-32 h-32 bg-gray-300 rounded-full" />
      </div>

      {/* Pokemon Info Skeleton */}
      <div className="p-4 pt-0">
        {/* Name Skeleton */}
        <div className="h-6 bg-gray-300 rounded mb-2 mx-auto w-3/4" />

        {/* Types Skeleton */}
        <div className="flex gap-1 justify-center mb-3">
          <div className="h-6 w-16 bg-gray-300 rounded-full" />
          <div className="h-6 w-16 bg-gray-300 rounded-full" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="h-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 rounded" />
        </div>

        {/* HP Bar Skeleton */}
        <div className="space-y-1">
          <div className="h-3 bg-gray-300 rounded w-1/3" />
          <div className="h-2 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}