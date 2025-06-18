'use client';

import { PokemonTypeName, POKEMON_TYPE_COLORS } from '@/types/pokemon';
import { Checkbox } from './Checkbox';

interface TypeFilterProps {
  selectedTypes: PokemonTypeName[];
  onTypeToggle: (type: PokemonTypeName) => void;
}

const POKEMON_TYPES: PokemonTypeName[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export function TypeFilter({ selectedTypes, onTypeToggle }: TypeFilterProps) {
  const formatTypeName = (type: PokemonTypeName) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pokemon Types</h3>
      <div className="grid grid-cols-2 gap-3">
        {POKEMON_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type);
          const typeColor = POKEMON_TYPE_COLORS[type];

          return (
            <Checkbox
              key={type}
              id={`type-${type}`}
              checked={isSelected}
              onChange={() => onTypeToggle(type)}
              label={formatTypeName(type)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              style={{
                backgroundColor: isSelected ? `${typeColor}15` : undefined,
                borderColor: isSelected ? typeColor : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}