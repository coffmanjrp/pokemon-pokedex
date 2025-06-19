'use client';

import { Pokemon } from '@/types/pokemon';
import { PokemonCard } from './PokemonCard';
import { PokemonCardSkeleton } from './PokemonCardSkeleton';
import { EmptyState } from './EmptyState';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';

interface PokemonGridProps {
  pokemons: Pokemon[];
  onPokemonClick?: (pokemon: Pokemon) => void;
  className?: string;
  loading?: boolean;
  isFiltering?: boolean;
  isAutoLoading?: boolean;
}

export function PokemonGrid({ 
  pokemons, 
  onPokemonClick, 
  className,
  loading = false,
  isFiltering = false,
  isAutoLoading = false
}: PokemonGridProps) {
  const { language } = useAppSelector((state) => state.ui);
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

  if (pokemons.length === 0 && !isAutoLoading) {
    return (
      <EmptyState
        icon="🔍"
        title={language === 'en' ? "No Pokémon found" : "ポケモンが見つかりません"}
        description={language === 'en' 
          ? "Try adjusting your search or filter criteria to find the Pokémon you're looking for."
          : "検索条件やフィルターを調整してください。"
        }
      />
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
      
      {loading && !isFiltering && (
        <>
          {Array.from({ length: 10 }).map((_, index) => (
            <PokemonCardSkeleton key={`skeleton-${index}`} />
          ))}
        </>
      )}
    </div>
  );
}