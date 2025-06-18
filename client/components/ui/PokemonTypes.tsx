'use client';

import { Pokemon, POKEMON_TYPE_COLORS, PokemonTypeName } from '@/types/pokemon';
import { Badge } from './Badge';

interface PokemonTypesProps {
  types: Pokemon['types'];
  className?: string;
}

export function PokemonTypes({ types, className = "flex gap-1 justify-center mb-3" }: PokemonTypesProps) {
  const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className={className}>
      {types.map((typeInfo) => {
        const typeName = typeInfo.type.name as PokemonTypeName;
        const typeColor = POKEMON_TYPE_COLORS[typeName] || '#68A090';

        return (
          <Badge
            key={typeInfo.type.id}
            style={{ backgroundColor: typeColor }}
          >
            {formatName(typeInfo.type.name)}
          </Badge>
        );
      })}
    </div>
  );
}