'use client';

import { Pokemon } from '@/types/pokemon';
import { getPokemonDescription, getPokemonGenus, getVersionName } from '@/lib/pokemonUtils';

interface PokemonDescriptionProps {
  pokemon: Pokemon;
  language: 'en' | 'ja';
}

export function PokemonDescription({ pokemon, language }: PokemonDescriptionProps) {
  const description = getPokemonDescription(pokemon, language);
  const genus = getPokemonGenus(pokemon, language);
  
  if (!description && !genus) {
    return (
      <div className="text-gray-500 text-center py-4">
        {language === 'en' ? 'No description available' : '説明がありません'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category/Genus */}
      {genus && (
        <div className="text-center">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {genus}
          </span>
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="bg-gray-50 rounded-lg p-6">
          <blockquote className="text-gray-700 leading-relaxed italic">
            &ldquo;{description}&rdquo;
          </blockquote>
        </div>
      )}

      {/* Multiple descriptions if available */}
      {pokemon.species?.flavorTextEntries && pokemon.species.flavorTextEntries.length > 1 && (
        <details className="group">
          <summary className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium">
            {language === 'en' 
              ? `View all descriptions (${pokemon.species.flavorTextEntries.length} versions)`
              : `すべての説明を表示 (${pokemon.species.flavorTextEntries.length} バージョン)`
            }
          </summary>
          <div className="mt-4 space-y-3">
            {pokemon.species.flavorTextEntries
              .filter(entry => entry.language.name === (language === 'en' ? 'en' : 'ja') || 
                             (language === 'ja' && entry.language.name === 'ja-Hrkt'))
              .map((entry, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {entry.flavorText.replace(/\f/g, ' ').replace(/\n/g, ' ')}
                  </p>
                  <footer className="mt-2 text-xs text-gray-500">
                    — {getVersionName(entry.version.name, language)}
                  </footer>
                </div>
              ))}
          </div>
        </details>
      )}
    </div>
  );
}