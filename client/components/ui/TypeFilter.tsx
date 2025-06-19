'use client';

import { PokemonTypeName, POKEMON_TYPE_COLORS } from '@/types/pokemon';
import { Locale } from '@/lib/dictionaries';
import { getTypeName } from '@/lib/pokemonUtils';
import { Checkbox } from './Checkbox';

interface TypeFilterProps {
  selectedTypes: PokemonTypeName[];
  onTypeToggle: (type: PokemonTypeName) => void;
  lang?: Locale;
}

const POKEMON_TYPES: PokemonTypeName[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export function TypeFilter({ selectedTypes, onTypeToggle, lang = 'en' }: TypeFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {lang === 'en' ? 'Pokemon Types' : 'ポケモンタイプ'}
      </h3>
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
              label={getTypeName(type, lang)}
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