'use client';

import { useAppSelector } from '@/store/hooks';
import { Pokemon } from '@/types/pokemon';
import { PokemonImage } from '@/components/ui/PokemonImage';
import { PokemonTypes } from '@/components/ui/PokemonTypes';
import { PokemonStats } from '@/components/ui/PokemonStats';
import Link from 'next/link';

interface PokemonDetailClientProps {
  pokemon: Pokemon;
}

export default function PokemonDetailClient({ pokemon }: PokemonDetailClientProps) {
  const { language } = useAppSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {language === 'en' ? 'Back to Pokedex' : 'ポケモン図鑑に戻る'}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Pokemon Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Pokemon Image */}
            <div className="flex-shrink-0">
              <div className="w-64 h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <PokemonImage
                  pokemon={pokemon}
                  size="xl"
                  className="w-full h-full object-contain"
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

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'en' ? 'Base Stats' : '基礎ステータス'}
          </h2>
          <PokemonStats stats={pokemon.stats} />
        </div>

        {/* Sprites Gallery */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'en' ? 'Sprites & Artwork' : 'スプライト・アートワーク'}
          </h2>
          
          {/* Official Artwork */}
          {(pokemon.sprites.other?.officialArtwork?.frontDefault || pokemon.sprites.other?.home?.frontDefault) && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {language === 'en' ? 'Official Artwork' : '公式アートワーク'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pokemon.sprites.other?.officialArtwork?.frontDefault && (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <img 
                      src={pokemon.sprites.other.officialArtwork.frontDefault} 
                      alt={`${pokemon.name} official artwork`}
                      className="w-48 h-48 mx-auto mb-4 object-contain"
                    />
                    <div className="text-sm text-gray-600">
                      {language === 'en' ? 'Official Artwork' : '公式アートワーク'}
                    </div>
                  </div>
                )}
                {pokemon.sprites.other?.officialArtwork?.frontShiny && (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <img 
                      src={pokemon.sprites.other.officialArtwork.frontShiny} 
                      alt={`${pokemon.name} shiny official artwork`}
                      className="w-48 h-48 mx-auto mb-4 object-contain"
                    />
                    <div className="text-sm text-gray-600">
                      {language === 'en' ? 'Shiny Official Artwork' : '色違い公式アートワーク'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Game Sprites */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {language === 'en' ? 'Game Sprites' : 'ゲームスプライト'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pokemon.sprites.frontDefault && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <img 
                    src={pokemon.sprites.frontDefault} 
                    alt={`${pokemon.name} front`}
                    className="w-24 h-24 mx-auto mb-2"
                  />
                  <div className="text-sm text-gray-600">
                    {language === 'en' ? 'Front' : '正面'}
                  </div>
                </div>
              )}
              {pokemon.sprites.backDefault && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <img 
                    src={pokemon.sprites.backDefault} 
                    alt={`${pokemon.name} back`}
                    className="w-24 h-24 mx-auto mb-2"
                  />
                  <div className="text-sm text-gray-600">
                    {language === 'en' ? 'Back' : '背面'}
                  </div>
                </div>
              )}
              {pokemon.sprites.frontShiny && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <img 
                    src={pokemon.sprites.frontShiny} 
                    alt={`${pokemon.name} shiny front`}
                    className="w-24 h-24 mx-auto mb-2"
                  />
                  <div className="text-sm text-gray-600">
                    {language === 'en' ? 'Shiny Front' : '色違い正面'}
                  </div>
                </div>
              )}
              {pokemon.sprites.backShiny && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <img 
                    src={pokemon.sprites.backShiny} 
                    alt={`${pokemon.name} shiny back`}
                    className="w-24 h-24 mx-auto mb-2"
                  />
                  <div className="text-sm text-gray-600">
                    {language === 'en' ? 'Shiny Back' : '色違い背面'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}