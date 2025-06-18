'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearFilters } from '@/store/slices/pokemonSlice';
import { Badge } from './Badge';
import { POKEMON_TYPE_COLORS, PokemonTypeName } from '@/types/pokemon';

interface FilterSummaryProps {
  resultCount: number;
  totalCount: number;
}

export function FilterSummary({ resultCount, totalCount }: FilterSummaryProps) {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.pokemon);
  const { language } = useAppSelector((state) => state.ui);

  const hasActiveFilters = filters.types.length > 0 || filters.generation !== null || filters.search.length > 0;

  if (!hasActiveFilters) return null;

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const getGenerationName = (gen: number) => {
    const regions = {
      1: 'Kanto', 2: 'Johto', 3: 'Hoenn', 4: 'Sinnoh', 5: 'Unova',
      6: 'Kalos', 7: 'Alola', 8: 'Galar', 9: 'Paldea'
    };
    return regions[gen as keyof typeof regions] || `Gen ${gen}`;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mx-6 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-blue-900">
          <span className="font-semibold">
            {language === 'en' 
              ? `Showing ${resultCount.toLocaleString()} of ${totalCount.toLocaleString()} Pokémon`
              : `${totalCount.toLocaleString()}匹中${resultCount.toLocaleString()}匹のポケモンを表示`
            }
          </span>
        </div>
        <button
          onClick={handleClearFilters}
          className="text-xs text-blue-600 hover:text-blue-800 underline font-medium"
        >
          {language === 'en' ? 'Clear all filters' : 'すべてのフィルターをクリア'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Search Filter */}
        {filters.search && (
          <Badge className="bg-blue-100 text-blue-800 text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            &quot;{filters.search}&quot;
          </Badge>
        )}

        {/* Type Filters */}
        {filters.types.map((type) => {
          const typeName = type.name as PokemonTypeName;
          const typeColor = POKEMON_TYPE_COLORS[typeName] || '#68A090';
          
          return (
            <Badge 
              key={type.name} 
              className="text-white text-xs"
              style={{ backgroundColor: typeColor }}
            >
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </Badge>
          );
        })}

        {/* Generation Filter */}
        {filters.generation && (
          <Badge className="bg-purple-100 text-purple-800 text-xs">
            {language === 'en' 
              ? `${getGenerationName(filters.generation)} (Gen ${filters.generation})`
              : `第${filters.generation}世代 (${getGenerationName(filters.generation)})`
            }
          </Badge>
        )}
      </div>
    </div>
  );
}