'use client';

import { Pokemon, POKEMON_TYPE_COLORS, PokemonTypeName } from '@/types/pokemon';
import { getTypeName } from '@/lib/pokemonUtils';
import { useAppSelector } from '@/store/hooks';
import { Badge } from './Badge';

interface PokemonTypesProps {
  types: Pokemon['types'];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  language?: 'en' | 'ja';
}

export function PokemonTypes({ types, size = 'md', className, language: propLanguage }: PokemonTypesProps) {
  const { language: storeLanguage } = useAppSelector((state) => state.ui);
  const language = propLanguage || storeLanguage;

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'flex gap-1 justify-center mb-2';
      case 'lg':
        return 'flex gap-2 justify-center mb-4';
      default:
        return 'flex gap-1 justify-center mb-3';
    }
  };

  const defaultClassName = getSizeClass();

  return (
    <div className={className || defaultClassName}>
      {types.map((typeInfo) => {
        const typeName = typeInfo.type.name as PokemonTypeName;
        const typeColor = POKEMON_TYPE_COLORS[typeName] || '#68A090';
        const displayName = getTypeName(typeInfo.type.name, language);

        return (
          <Badge
            key={typeInfo.type.id}
            style={{ backgroundColor: typeColor }}
            className={size === 'lg' ? 'px-3 py-1 text-sm' : ''}
          >
            {displayName}
          </Badge>
        );
      })}
    </div>
  );
}