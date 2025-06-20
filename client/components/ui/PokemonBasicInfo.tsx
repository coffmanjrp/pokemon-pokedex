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

// Helper function to get previous/next Pokemon ID
const getPrevNextPokemonId = (currentId: number) => {
  const prevId = currentId > 1 ? currentId - 1 : 1025; // Loop to last Pokemon
  const nextId = currentId < 1025 ? currentId + 1 : 1; // Loop to first Pokemon
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

  // Type colors for stat bars (matching reference design colors)
  const typeColors: Record<string, string> = {
    hp: 'bg-red-400',
    attack: 'bg-green-400', 
    defense: 'bg-red-300',
    'special-attack': 'bg-green-400',
    'special-defense': 'bg-green-400', 
    speed: 'bg-red-300',
  };

  const maxBaseStat = 150; // Fixed max for consistent bar scaling

  return (
    <div className="bg-gray-50">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-8">
        {/* Left Side - Pokemon Image (3/5 columns) */}
        <div className="lg:col-span-3 flex items-center justify-center relative">
          <div className="relative">
            {/* Pokemon Image with Navigation Arrows */}
            <div className="w-96 h-96 flex items-center justify-center relative">
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
              
              {/* Previous Pokemon Navigation */}
              <Link
                href={`/${language}/pokemon/${prevId}`}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <svg 
                  className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              
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
              
              {/* Next Pokemon Navigation */}
              <Link
                href={`/${language}/pokemon/${nextId}`}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <svg 
                  className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Information Panel (2/5 columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'ja' ? displayName : displayName.charAt(0).toUpperCase() + displayName.slice(1)}
              <span className="text-xl text-gray-500 ml-2">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
            </h1>
            <div className="mb-4">
              <PokemonTypes types={pokemon.types} size="md" />
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
                    className="px-3 py-1 rounded-full text-xs font-medium text-white transition-transform hover:scale-105"
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

          {/* Story Section */}
          {description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'en' ? 'Story' : 'ストーリー'}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
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
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  !isShiny
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {language === 'en' ? 'Normal' : 'ノーマル'}
              </button>
              <button
                onClick={() => setIsShiny(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  isShiny
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {language === 'en' ? 'Shiny' : 'シャイニー'}
              </button>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
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
            <div className="text-center col-span-2">
              <div className="text-xs text-gray-500 mb-1">
                {language === 'en' ? 'Abilities' : '特性'}
              </div>
              <div className="text-sm font-semibold flex flex-col gap-1">
                {pokemon.abilities && pokemon.abilities.length > 0 ? (
                  pokemon.abilities.slice(0, 2).map((abilitySlot, index) => (
                    <span key={index} className={abilitySlot.isHidden ? 'text-yellow-600' : ''}>
                      {getAbilityName(abilitySlot.ability.name, language)}
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

          {/* Stats Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Stats' : 'ステータス'}
            </h3>
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
                        <div className="bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              typeColors[statName] || 'bg-gray-400'
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

          {/* Navigation Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <Link
                href={`/${language}/pokemon/${prevId}`}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>#{prevId.toString().padStart(3, '0')}</span>
              </Link>
              
              <span className="text-gray-400 text-xs">
                #{pokemon.id.toString().padStart(3, '0')} / 1025
              </span>
              
              <Link
                href={`/${language}/pokemon/${nextId}`}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span>#{nextId.toString().padStart(3, '0')}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}