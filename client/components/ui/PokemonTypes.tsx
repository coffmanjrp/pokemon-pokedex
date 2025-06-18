'use client';

import { Pokemon, POKEMON_TYPE_COLORS, PokemonTypeName } from '@/types/pokemon';
import { Badge } from './Badge';

interface PokemonTypesProps {
  types: Pokemon['types'];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PokemonTypes({ types, size = 'md', className }: PokemonTypesProps) {
  const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

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

        return (
          <Badge
            key={typeInfo.type.id}
            style={{ backgroundColor: typeColor }}
            className={size === 'lg' ? 'px-3 py-1 text-sm' : ''}
          >
            {formatName(typeInfo.type.name)}
          </Badge>
        );
      })}
    </div>
  );
}