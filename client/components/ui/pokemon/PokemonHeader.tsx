'use client';

import { Pokemon } from '@/types/pokemon';
import { 
  getPokemonDisplayId,
  shouldDisplayFormSeparately,
  getPokemonBaseName,
  getPokemonFormName
} from '@/lib/pokemonUtils';
import { PokemonTypes } from './PokemonTypes';

interface PokemonHeaderProps {
  pokemon: Pokemon;
  displayName: string;
  language: 'en' | 'ja';
}

export function PokemonHeader({ pokemon, displayName, language }: PokemonHeaderProps) {
  const displayId = getPokemonDisplayId(pokemon);
  const shouldSeparateForm = shouldDisplayFormSeparately(pokemon);
  const baseName = shouldSeparateForm ? getPokemonBaseName(pokemon, language) : displayName;
  const formName = shouldSeparateForm ? getPokemonFormName(pokemon, language) : null;

  return (
    <div className="mb-3">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">
        {baseName}
        <span className="text-2xl text-gray-500 ml-3">
          #{displayId.toString().padStart(3, '0')}
        </span>
      </h1>
      {formName && (
        <div className="mb-2">
          <span className="text-2xl font-medium text-gray-600">
            {formName}
          </span>
        </div>
      )}
      <div>
        <PokemonTypes 
          types={pokemon.types} 
          size="lg" 
          className="flex gap-2 justify-start mb-2" 
          language={language} 
        />
      </div>
    </div>
  );
}