'use client';

import { Pokemon } from '@/types/pokemon';
import Image from 'next/image';

interface PokemonSpritesGalleryProps {
  pokemon: Pokemon;
  language: 'en' | 'ja';
}

export function PokemonSpritesGallery({ pokemon, language }: PokemonSpritesGalleryProps) {
  return (
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
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <Image 
                    src={pokemon.sprites.other.officialArtwork.frontDefault} 
                    alt={`${pokemon.name} official artwork`}
                    fill
                    className="object-contain"
                    sizes="192px"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Official Artwork' : '公式アートワーク'}
                </div>
              </div>
            )}
            {pokemon.sprites.other?.officialArtwork?.frontShiny && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <Image 
                    src={pokemon.sprites.other.officialArtwork.frontShiny} 
                    alt={`${pokemon.name} shiny official artwork`}
                    fill
                    className="object-contain"
                    sizes="192px"
                  />
                </div>
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
              <div className="relative w-24 h-24 mx-auto mb-2">
                <Image 
                  src={pokemon.sprites.frontDefault} 
                  alt={`${pokemon.name} front`}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Front' : '正面'}
              </div>
            </div>
          )}
          {pokemon.sprites.backDefault && (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <Image 
                  src={pokemon.sprites.backDefault} 
                  alt={`${pokemon.name} back`}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Back' : '背面'}
              </div>
            </div>
          )}
          {pokemon.sprites.frontShiny && (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <Image 
                  src={pokemon.sprites.frontShiny} 
                  alt={`${pokemon.name} shiny front`}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Shiny Front' : '色違い正面'}
              </div>
            </div>
          )}
          {pokemon.sprites.backShiny && (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <Image 
                  src={pokemon.sprites.backShiny} 
                  alt={`${pokemon.name} shiny back`}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Shiny Back' : '色違い背面'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}