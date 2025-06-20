'use client';

import { useState } from 'react';
import { Pokemon } from '@/types/pokemon';
import { Locale } from '@/lib/dictionaries';
import { PokemonBasicInfo } from './PokemonBasicInfo';
import { PokemonSpritesGallery } from './PokemonSpritesGallery';
import { PokemonEvolutionChain } from './PokemonEvolutionChain';
import { PokemonMoves } from './PokemonMoves';
import { PokemonDescription } from './PokemonDescription';
import { PokemonGameHistory } from './PokemonGameHistory';

interface PokemonTopNavigationTabsProps {
  pokemon: Pokemon;
  lang: Locale;
}

type TopTabType = 'about' | 'moves' | 'description' | 'gameHistory';

interface TopTabInfo {
  id: TopTabType;
  label: string;
  available: boolean;
}

export function PokemonTopNavigationTabs({ pokemon, lang }: PokemonTopNavigationTabsProps) {
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
      id: 'description',
      label: lang === 'en' ? 'Description' : '説明',
      available: !!(pokemon.species?.flavorTextEntries && pokemon.species.flavorTextEntries.length > 0)
    },
    {
      id: 'gameHistory',
      label: lang === 'en' ? 'Game History' : 'ゲーム履歴',
      available: !!(pokemon.gameIndices && pokemon.gameIndices.length > 0)
    }
  ];

  const renderTabContent = () => {
    switch (activeTopTab) {
      case 'about':
        return (
          <div className="space-y-8">
            {/* Pokemon Basic Info - Hero Section */}
            <PokemonBasicInfo pokemon={pokemon} language={lang} />
            
            {/* Evolution Chain Section - Between Hero and Sprites */}
            {pokemon.species?.evolutionChain?.chain && (
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8">
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                  <PokemonEvolutionChain 
                    evolutionChain={pokemon.species.evolutionChain.chain} 
                    lang={lang}
                  />
                </div>
              </div>
            )}

            {/* Sprites Gallery */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-4 md:pb-8">
              <PokemonSpritesGallery pokemon={pokemon} language={lang} />
            </div>
          </div>
        );
      
      case 'moves':
        return (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-8">
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
      
      case 'description':
        return (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {lang === 'en' ? 'Description' : '説明'}
              </h2>
              <PokemonDescription
                pokemon={pokemon}
                language={lang}
              />
            </div>
          </div>
        );
      
      case 'gameHistory':
        return (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {lang === 'en' ? 'Game History' : 'ゲーム履歴'}
              </h2>
              <PokemonGameHistory
                gameIndices={pokemon.gameIndices}
                generation={pokemon.species?.generation}
                language={lang}
              />
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
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-0 overflow-x-auto" aria-label="Top Navigation">
            {topTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTopTab(tab.id)}
                disabled={!tab.available}
                className={`px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
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