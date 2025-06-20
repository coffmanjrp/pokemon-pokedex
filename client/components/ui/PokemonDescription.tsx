'use client';

import { Pokemon } from '@/types/pokemon';
import { getPokemonDescription, getVersionName } from '@/lib/pokemonUtils';
import { DataEmptyState } from './DataEmptyState';

interface PokemonDescriptionProps {
  pokemon: Pokemon;
  language: 'en' | 'ja';
}

export function PokemonDescription({ pokemon, language }: PokemonDescriptionProps) {
  const description = getPokemonDescription(pokemon, language);
  
  if (!pokemon.species?.flavorTextEntries || pokemon.species.flavorTextEntries.length === 0) {
    return <DataEmptyState type="descriptions" language={language} />;
  }

  // Filter entries for the current language
  const languageEntries = pokemon.species.flavorTextEntries
    .filter(entry => entry.language.name === (language === 'en' ? 'en' : 'ja') || 
                   (language === 'ja' && entry.language.name === 'ja-Hrkt'))
    .filter(entry => entry.flavorText && entry.flavorText.trim().length > 0);

  if (languageEntries.length === 0) {
    return (
      <DataEmptyState 
        type="descriptions" 
        language={language}
        customMessage={language === 'en' ? 'No descriptions available in this language' : 'この言語での説明がありません'}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Current/Latest Description */}
      {description && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="text-sm font-medium text-blue-800 mb-2">
                {language === 'en' ? 'Latest Description' : '最新の説明'}
              </div>
              <blockquote className="text-gray-700 leading-relaxed">
                &ldquo;{description}&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      )}

      {/* All Historical Descriptions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'en' 
            ? `All Descriptions (${languageEntries.length} versions)`
            : `すべての説明 (${languageEntries.length} バージョン)`
          }
        </h3>
        <div className="space-y-3">
          {languageEntries.map((entry, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <p className="text-gray-700 leading-relaxed mb-3">
                {entry.flavorText.replace(/\f/g, ' ').replace(/\n/g, ' ')}
              </p>
              <footer className="flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium">
                  {getVersionName(entry.version.name, language)}
                </span>
                <span className="text-gray-400 text-xs">
                  {language === 'en' ? 'Version' : 'バージョン'} {index + 1}
                </span>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}