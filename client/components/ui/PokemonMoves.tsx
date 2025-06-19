'use client';

import { useState } from 'react';
import { PokemonMove } from '@/types/pokemon';
import { getMoveLearnMethodName, formatMoveName } from '@/lib/pokemonUtils';

interface PokemonMovesProps {
  moves?: PokemonMove[];
  language: 'en' | 'ja';
}

type LearnMethod = 'level-up' | 'machine' | 'egg' | 'tutor' | 'other';

export function PokemonMoves({ moves, language }: PokemonMovesProps) {
  const [selectedMethod, setSelectedMethod] = useState<LearnMethod>('level-up');
  const [selectedGeneration, setSelectedGeneration] = useState<string>('latest');

  if (!moves || moves.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        {language === 'en' ? 'No moves data available' : '技データがありません'}
      </div>
    );
  }

  // Group moves by learn method
  const movesByMethod = moves.reduce((acc, move) => {
    move.versionGroupDetails.forEach(detail => {
      const method = detail.moveLearnMethod.name as LearnMethod;
      if (!acc[method]) {
        acc[method] = [];
      }
      
      // Check if move already exists for this method
      const existing = acc[method].find(m => m.move.name === move.move.name);
      if (!existing) {
        acc[method].push({
          ...move,
          versionGroupDetails: [detail]
        });
      } else {
        // Add version group detail if not already present
        const hasDetail = existing.versionGroupDetails.some(
          d => d.versionGroup.name === detail.versionGroup.name
        );
        if (!hasDetail) {
          existing.versionGroupDetails.push(detail);
        }
      }
    });
    return acc;
  }, {} as Record<LearnMethod, PokemonMove[]>);

  // Get available generations
  const getAvailableGenerations = () => {
    const generations = new Set<string>();
    moves.forEach(move => {
      move.versionGroupDetails.forEach(detail => {
        generations.add(detail.versionGroup.name);
      });
    });
    return Array.from(generations).sort();
  };

  const availableGenerations = getAvailableGenerations();

  // Filter moves by selected generation
  const filterByGeneration = (pokemonMoves: PokemonMove[]) => {
    if (selectedGeneration === 'latest') {
      return pokemonMoves;
    }
    
    return pokemonMoves.filter(move =>
      move.versionGroupDetails.some(detail =>
        detail.versionGroup.name === selectedGeneration
      )
    );
  };


  const methodTabs: LearnMethod[] = ['level-up', 'machine', 'egg', 'tutor'];
  const availableMethods = methodTabs.filter(method => movesByMethod[method]?.length > 0);

  const currentMoves = filterByGeneration(movesByMethod[selectedMethod] || []);

  return (
    <div className="space-y-6">
      {/* Method Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {availableMethods.map((method) => (
            <button
              key={method}
              onClick={() => setSelectedMethod(method)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedMethod === method
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {getMoveLearnMethodName(method, language)}
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {movesByMethod[method]?.length || 0}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Generation Filter */}
      {availableGenerations.length > 1 && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            {language === 'en' ? 'Generation:' : '世代:'}
          </label>
          <select
            value={selectedGeneration}
            onChange={(e) => setSelectedGeneration(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="latest">
              {language === 'en' ? 'All Generations' : 'すべての世代'}
            </option>
            {availableGenerations.map(gen => (
              <option key={gen} value={gen}>
                {gen.charAt(0).toUpperCase() + gen.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Moves List */}
      {currentMoves.length > 0 ? (
        <div className="grid gap-3">
          {currentMoves
            .sort((a, b) => {
              // Sort level-up moves by level
              if (selectedMethod === 'level-up') {
                const levelA = a.versionGroupDetails[0]?.levelLearnedAt || 0;
                const levelB = b.versionGroupDetails[0]?.levelLearnedAt || 0;
                return levelA - levelB;
              }
              // Sort others alphabetically
              return a.move.name.localeCompare(b.move.name);
            })
            .map((move, index) => (
              <div
                key={`${move.move.name}-${index}`}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {formatMoveName(move.move.name)}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      {selectedMethod === 'level-up' && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {language === 'en' ? 'Level' : 'Lv.'} {move.versionGroupDetails[0]?.levelLearnedAt || '-'}
                        </span>
                      )}
                      <span className="text-gray-500">
                        {move.versionGroupDetails.map(detail => 
                          detail.versionGroup.name.charAt(0).toUpperCase() + detail.versionGroup.name.slice(1)
                        ).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {language === 'en' 
            ? `No ${getMoveLearnMethodName(selectedMethod, language).toLowerCase()} moves found`
            : `${getMoveLearnMethodName(selectedMethod, language)}の技は見つかりませんでした`
          }
        </div>
      )}
    </div>
  );
}