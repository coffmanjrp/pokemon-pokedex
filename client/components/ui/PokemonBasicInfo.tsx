'use client';

import { Pokemon } from '@/types/pokemon';
import { PokemonImage } from './PokemonImage';
import { PokemonTypes } from './PokemonTypes';

interface PokemonBasicInfoProps {
  pokemon: Pokemon;
  language: 'en' | 'ja';
}

export function PokemonBasicInfo({ pokemon, language }: PokemonBasicInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <div className="flex flex-col lg:flex-row items-start gap-8">
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
        <div className="flex-1">
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm font-medium text-gray-500">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 capitalize">
              {pokemon.name}
            </h1>
            <PokemonTypes types={pokemon.types} size="lg" />
          </div>

          {/* Basic Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
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

          {/* Base Experience */}
          {pokemon.baseExperience && (
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  {language === 'en' ? 'Base Experience' : '基礎経験値'}
                </div>
                <div className="text-xl font-semibold">
                  {pokemon.baseExperience}
                </div>
              </div>
            </div>
          )}

          {/* Abilities */}
          {pokemon.abilities && pokemon.abilities.length > 0 && (
            <div className="mb-6">
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
                    {pokemonAbility.ability.name}
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
      </div>
    </div>
  );
}