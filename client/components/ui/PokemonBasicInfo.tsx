'use client';

import { Pokemon } from '@/types/pokemon';
import { getPokemonName, getAbilityName, getPokemonDescription, getPokemonGenus, getStatName } from '@/lib/pokemonUtils';
import { PokemonImage } from './PokemonImage';
import { PokemonTypes } from './PokemonTypes';

interface PokemonBasicInfoProps {
  pokemon: Pokemon;
  language: 'en' | 'ja';
}

export function PokemonBasicInfo({ pokemon, language }: PokemonBasicInfoProps) {
  const displayName = getPokemonName(pokemon, language);
  const description = getPokemonDescription(pokemon, language);
  const genus = getPokemonGenus(pokemon, language);

  // Type colors for stat bars
  const typeColors: Record<string, string> = {
    hp: 'bg-red-500',
    attack: 'bg-orange-500',
    defense: 'bg-blue-500',
    'special-attack': 'bg-purple-500',
    'special-defense': 'bg-green-500',
    speed: 'bg-yellow-500',
  };

  const maxBaseStat = pokemon.stats ? Math.max(...pokemon.stats.map(stat => stat.baseStat)) : 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <div className="flex flex-col xl:flex-row items-start gap-8">
        {/* Pokemon Image */}
        <div className="flex-shrink-0">
          <div className="w-64 h-64 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
            <PokemonImage
              pokemon={pokemon}
              size="xl"
              priority={true}
            />
          </div>
        </div>

        {/* Pokemon Info */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm font-medium text-gray-500">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
              {genus && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {genus}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'ja' ? displayName : displayName.charAt(0).toUpperCase() + displayName.slice(1)}
            </h1>
            <PokemonTypes types={pokemon.types} size="lg" />
          </div>

          {/* Latest Description */}
          {description && (
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <blockquote className="text-gray-700 leading-relaxed italic text-sm">
                  &ldquo;{description}&rdquo;
                </blockquote>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Physical Stats & Abilities */}
            <div className="space-y-6">
              {/* Physical Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'en' ? 'Physical Stats' : '基本情報'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">
                      {language === 'en' ? 'Height' : '高さ'}
                    </div>
                    <div className="text-xl font-semibold">
                      {(pokemon.height / 10).toFixed(1)} m
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">
                      {language === 'en' ? 'Weight' : '重さ'}
                    </div>
                    <div className="text-xl font-semibold">
                      {(pokemon.weight / 10).toFixed(1)} kg
                    </div>
                  </div>
                </div>
              </div>

              {/* Abilities */}
              {pokemon.abilities && pokemon.abilities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {language === 'en' ? 'Abilities' : '特性'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map((pokemonAbility, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          pokemonAbility.isHidden 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {getAbilityName(pokemonAbility.ability.name, language)}
                        {pokemonAbility.isHidden && (
                          <span className="ml-1 text-xs">
                            ({language === 'en' ? 'Hidden' : '隠れ特性'})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Battle Stats */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Base Stats' : '種族値'}
              </h3>
              {pokemon.stats && pokemon.stats.length > 0 ? (
                <div className="space-y-3">
                  {pokemon.stats.map((pokemonStat, index) => {
                    const statName = pokemonStat.stat.name;
                    const percentage = (pokemonStat.baseStat / maxBaseStat) * 100;
                    
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-20 text-sm font-medium text-gray-700 text-right">
                          {getStatName(statName, language)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  typeColors[statName] || 'bg-gray-400'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-800 w-10 text-right">
                              {pokemonStat.baseStat}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Total stats */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-sm font-bold text-gray-900 text-right">
                        {language === 'en' ? 'Total' : '合計'}
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-bold text-gray-900">
                          {pokemon.stats.reduce((total, stat) => total + stat.baseStat, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4 text-sm">
                  {language === 'en' ? 'No stats available' : 'ステータスがありません'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}