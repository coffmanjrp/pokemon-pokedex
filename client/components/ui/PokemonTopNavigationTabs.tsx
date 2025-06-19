'use client';

import { useState } from 'react';
import { Pokemon } from '@/types/pokemon';
import { Dictionary, Locale } from '@/lib/dictionaries';
import { PokemonBasicInfo } from './PokemonBasicInfo';
import { PokemonDetailTabs } from './PokemonDetailTabs';
import { PokemonSpritesGallery } from './PokemonSpritesGallery';
import { PokemonEvolutionChain } from './PokemonEvolutionChain';
import { PokemonMoves } from './PokemonMoves';

interface PokemonTopNavigationTabsProps {
  pokemon: Pokemon;
  dictionary: Dictionary;
  lang: Locale;
}

type TopTabType = 'about' | 'moves' | 'episodes' | 'cards';

interface TopTabInfo {
  id: TopTabType;
  label: string;
  available: boolean;
}

export function PokemonTopNavigationTabs({ pokemon, dictionary, lang }: PokemonTopNavigationTabsProps) {
  const [activeTopTab, setActiveTopTab] = useState<TopTabType>('about');

  // Define top-level tabs
  const topTabs: TopTabInfo[] = [
    {
      id: 'about',
      label: lang === 'en' ? 'About' : 'について',
      available: true
    },
    {
      id: 'moves',
      label: lang === 'en' ? 'Moves' : 'わざ',
      available: !!(pokemon.moves && pokemon.moves.length > 0)
    },
    {
      id: 'episodes',
      label: lang === 'en' ? 'Episodes' : 'エピソード',
      available: false // Placeholder for future implementation
    },
    {
      id: 'cards',
      label: lang === 'en' ? 'Cards' : 'カード',
      available: false // Placeholder for future implementation
    }
  ];

  const renderTabContent = () => {
    switch (activeTopTab) {
      case 'about':
        return (
          <div className="space-y-8">
            {/* Pokemon Basic Info - Hero Section */}
            <PokemonBasicInfo pokemon={pokemon} language={lang} />
            
            {/* Evolution Chain Section */}
            {pokemon.species?.evolutionChain?.chain && (
              <div className="max-w-7xl mx-auto px-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {dictionary.ui.pokemonDetails.evolutionChain}
                  </h2>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <PokemonEvolutionChain 
                      evolutionChain={pokemon.species.evolutionChain.chain} 
                      dictionary={dictionary}
                      lang={lang}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Description and Game History Tabs */}
            <div className="max-w-7xl mx-auto px-8">
              <PokemonDetailTabs 
                pokemon={pokemon} 
                dictionary={dictionary} 
                language={lang} 
              />
            </div>

            {/* Sprites Gallery */}
            <div className="max-w-7xl mx-auto px-8 pb-8">
              <PokemonSpritesGallery pokemon={pokemon} language={lang} />
            </div>
          </div>
        );
      
      case 'moves':
        return (
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {lang === 'en' ? 'Moves' : 'わざ'}
              </h2>
              <PokemonMoves 
                moves={pokemon.moves} 
                language={lang} 
              />
            </div>
          </div>
        );
      
      case 'episodes':
        return (
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center py-8 text-gray-500">
                {lang === 'en' 
                  ? 'Episode information coming soon...' 
                  : 'エピソード情報は準備中です...'}
              </div>
            </div>
          </div>
        );
      
      case 'cards':
        return (
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center py-8 text-gray-500">
                {lang === 'en' 
                  ? 'Trading card information coming soon...' 
                  : 'トレーディングカード情報は準備中です...'}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-0" aria-label="Top Navigation">
            {topTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTopTab(tab.id)}
                disabled={!tab.available}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTopTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : tab.available
                    ? 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    : 'border-transparent text-gray-300 cursor-not-allowed'
                } ${!tab.available ? 'opacity-50' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}