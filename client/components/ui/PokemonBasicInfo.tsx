'use client';

import { useState } from 'react';
import { Pokemon } from '@/types/pokemon';
import { 
  getPokemonName, 
  getAbilityName, 
  getPokemonDescription, 
  getPokemonGenus, 
  getStatName,
  getPokemonWeaknesses,
  getPokemonSpriteUrl,
  getTypeName,
  getTypeColorFromName,
  getPrimaryTypeColor
} from '@/lib/pokemonUtils';
import { PokemonTypes } from './PokemonTypes';
import Image from 'next/image';
import Link from 'next/link';

interface PokemonBasicInfoProps {
  pokemon: Pokemon;
  language: 'en' | 'ja';
}

// Helper function to get previous/next Pokemon ID and basic info
const getPrevNextPokemonId = (currentId: number): { prevId: number | null; nextId: number | null } => {
  const prevId = currentId > 1 ? currentId - 1 : null; // No previous for first Pokemon
  const nextId = currentId < 1025 ? currentId + 1 : null; // No next for last Pokemon
  return { prevId, nextId };
};


export function PokemonBasicInfo({ pokemon, language }: PokemonBasicInfoProps) {
  const [isShiny, setIsShiny] = useState(false);
  
  const displayName = getPokemonName(pokemon, language);
  const description = getPokemonDescription(pokemon, language);
  const genus = getPokemonGenus(pokemon, language);
  const weaknesses = getPokemonWeaknesses(pokemon);
  const primaryTypeColor = getPrimaryTypeColor(pokemon);
  const { prevId, nextId } = getPrevNextPokemonId(parseInt(pokemon.id));

  // Individual stat colors for better visual distinction
  const statColors: Record<string, string> = {
    hp: 'bg-red-500',           // HP: Red (health/life)
    attack: 'bg-orange-500',    // Attack: Orange (physical power)
    defense: 'bg-blue-500',     // Defense: Blue (protection/stability)
    'special-attack': 'bg-purple-500',   // Sp. Attack: Purple (magical power)
    'special-defense': 'bg-green-500',   // Sp. Defense: Green (resilience)
    speed: 'bg-yellow-500',     // Speed: Yellow (lightning/quickness)
  };

  const maxBaseStat = 150; // Fixed max for consistent bar scaling

  return (
    <div className="bg-gray-50 relative">
      {/* Page-level Navigation - Previous Pokemon */}
      {prevId && (
        <Link
          href={`/${language}/pokemon/${prevId}`}
          className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-30 group hover:scale-110 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <svg 
              className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="text-lg text-gray-500 font-medium text-center">
              #{prevId.toString().padStart(3, '0')}
            </div>
          </div>
        </Link>
      )}

      {/* Page-level Navigation - Next Pokemon */}
      {nextId && (
        <Link
          href={`/${language}/pokemon/${nextId}`}
          className="hidden md:block fixed right-4 top-1/2 -translate-y-1/2 z-30 group hover:scale-110 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <div className="text-lg text-gray-500 font-medium text-center">
              #{nextId.toString().padStart(3, '0')}
            </div>
            <svg 
              className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-8 p-4 md:p-8 px-4 md:px-16">
        {/* Left Side - Pokemon Image (3/5 columns) */}
        <div className="lg:col-span-3 flex flex-col relative">
          {/* Pokemon Header - Name, Number, Types */}
          <div className="mb-3">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {language === 'ja' ? displayName : displayName.charAt(0).toUpperCase() + displayName.slice(1)}
              <span className="text-2xl text-gray-500 ml-3">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
            </h1>
            <div>
              <PokemonTypes types={pokemon.types} size="lg" className="flex gap-2 justify-start mb-2" language={language} />
            </div>
          </div>

          {/* Pokemon Image Container */}
          <div className="flex items-center justify-center flex-1">
            <div className="relative">
              {/* Pokemon Image with Navigation Arrows */}
              <div className="w-72 h-72 md:w-96 md:h-96 flex items-center justify-center relative">
                {/* Background circle with type color */}
                <div 
                  className="absolute inset-0 rounded-full opacity-20 blur-3xl transform scale-150"
                  style={{
                    backgroundColor: primaryTypeColor,
                  }}
                />
                <div 
                  className="absolute inset-4 rounded-full opacity-10"
                  style={{
                    backgroundColor: primaryTypeColor,
                  }}
                />
                
                {/* Pokemon Image */}
                <div className="relative w-full h-full z-10">
                  <Image
                    src={getPokemonSpriteUrl(pokemon, isShiny)}
                    alt={`${displayName} ${isShiny ? '(Shiny)' : ''}`}
                    fill
                    className="object-contain drop-shadow-lg transition-opacity duration-300"
                    sizes="384px"
                    priority={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Information Panel (2/5 columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          {/* Story Section */}
          {description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'en' ? 'Story' : '説明'}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                {description}
              </p>
            </div>
          )}

          {/* Versions Section - Normal/Shiny Toggle */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {language === 'en' ? 'Versions' : 'バージョン'}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsShiny(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  !isShiny
                    ? 'bg-blue-100 text-blue-800 border-blue-200 shadow-sm hover:shadow-md'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:shadow-sm'
                }`}
              >
                {language === 'en' ? 'Normal' : '通常'}
              </button>
              <button
                onClick={() => setIsShiny(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  isShiny
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200 shadow-sm hover:shadow-md'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:shadow-sm'
                }`}
              >
                {language === 'en' ? 'Shiny' : '色違い'}
              </button>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 bg-gray-50 p-3 md:p-4 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">
                {language === 'en' ? 'Height' : '高さ'}
              </div>
              <div className="text-sm font-semibold">
                {(pokemon.height / 10).toFixed(1)}m
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">
                {language === 'en' ? 'Category' : '分類'}
              </div>
              <div className="text-sm font-semibold">
                {genus || (language === 'en' ? 'Lizard' : 'とかげ')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">
                {language === 'en' ? 'Gender' : '性別'}
              </div>
              <div className="text-sm font-semibold">
                ♂ ♀
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">
                {language === 'en' ? 'Weight' : '重さ'}
              </div>
              <div className="text-sm font-semibold">
                {(pokemon.weight / 10).toFixed(1)}kg
              </div>
            </div>
            <div className="text-center col-span-2 md:col-span-2">
              <div className="text-xs text-gray-500 mb-1">
                {language === 'en' ? 'Abilities' : '特性'}
              </div>
              <div className="text-sm font-semibold flex flex-col gap-1">
                {pokemon.abilities && pokemon.abilities.length > 0 ? (
                  pokemon.abilities.slice(0, 2).map((abilitySlot, index) => (
                    <span key={index} className={abilitySlot.isHidden ? 'text-yellow-600' : ''}>
                      {getAbilityName(abilitySlot.ability, language)}
                      {abilitySlot.isHidden && (
                        <span className="text-xs text-yellow-500 ml-1">
                          ({language === 'en' ? 'Hidden' : '隠れ特性'})
                        </span>
                      )}
                    </span>
                  ))
                ) : (
                  '-'
                )}
              </div>
            </div>
          </div>

          {/* Weaknesses Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {language === 'en' ? 'Weaknesses' : '弱点'}
            </h3>
            {weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {weaknesses.map((weaknessType) => (
                  <span
                    key={weaknessType}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-md"
                    style={{
                      backgroundColor: getTypeColorFromName(weaknessType),
                    }}
                  >
                    {getTypeName(weaknessType, language)}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                {language === 'en' ? 'No major weaknesses' : '特に弱点なし'}
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'en' ? 'Stats' : 'ステータス'}
              </h3>
              {pokemon.stats && pokemon.stats.length > 0 && (
                <div className="bg-blue-100 border border-blue-200 rounded-lg px-3 py-2">
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    {language === 'en' ? 'Total' : '合計'}
                  </div>
                  <div className="text-lg font-bold text-blue-800">
                    {pokemon.stats.reduce((total, stat) => total + stat.baseStat, 0)}
                  </div>
                </div>
              )}
            </div>
            {pokemon.stats && pokemon.stats.length > 0 ? (
              <div className="space-y-3">
                {pokemon.stats.map((pokemonStat, index) => {
                  const statName = pokemonStat.stat.name;
                  const percentage = (pokemonStat.baseStat / maxBaseStat) * 100;
                  
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-16 text-xs text-gray-600">
                        {getStatName(statName, language)}
                      </div>
                      <div className="text-sm font-semibold w-8 text-right">
                        {pokemonStat.baseStat}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 shadow-sm ${
                              statColors[statName] || 'bg-gray-400'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4 text-sm">
                {language === 'en' ? 'No stats available' : 'ステータスがありません'}
              </div>
            )}
          </div>

          {/* Pokemon Number Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <span className="text-gray-400 text-xs">
                #{pokemon.id.toString().padStart(3, '0')} / 1025
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}