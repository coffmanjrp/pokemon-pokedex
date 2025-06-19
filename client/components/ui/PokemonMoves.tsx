'use client';

import { useState } from 'react';
import { PokemonMove, POKEMON_TYPE_COLORS, PokemonTypeName } from '@/types/pokemon';
import { getMoveLearnMethodName, formatMoveName, getTypeName } from '@/lib/pokemonUtils';

interface PokemonMovesProps {
  moves?: PokemonMove[];
  language: 'en' | 'ja';
}

type LearnMethod = 'level-up' | 'machine' | 'egg' | 'tutor' | 'other';

export function PokemonMoves({ moves, language }: PokemonMovesProps) {
  const [selectedMethod, setSelectedMethod] = useState<LearnMethod>('level-up');
  if (!moves || moves.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        {language === 'en' ? 'No moves data available' : '技データがありません'}
      </div>
    );
  }

  // Group moves by learn method (simplified - no generation filtering)
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
        // Update level if this is a level-up move with a higher level
        const existingLevel = existing.versionGroupDetails[0]?.levelLearnedAt || 0;
        const newLevel = detail.levelLearnedAt || 0;
        if (method === 'level-up' && newLevel > existingLevel) {
          existing.versionGroupDetails[0] = detail;
        }
      }
    });
    return acc;
  }, {} as Record<LearnMethod, PokemonMove[]>);

  // Get damage class display name
  const getDamageClassName = (damageClass: string) => {
    const damageClassMap = {
      'physical': language === 'en' ? 'Physical' : '物理',
      'special': language === 'en' ? 'Special' : '特殊',
      'status': language === 'en' ? 'Status' : '変化'
    };
    return damageClassMap[damageClass as keyof typeof damageClassMap] || damageClass;
  };

  // Get type color for styling
  const getTypeColor = (typeName: string): string => {
    return POKEMON_TYPE_COLORS[typeName as PokemonTypeName] || '#68D391';
  };


  const methodTabs: LearnMethod[] = ['level-up', 'machine', 'egg', 'tutor'];
  const availableMethods = methodTabs.filter(method => movesByMethod[method]?.length > 0);

  const currentMoves = movesByMethod[selectedMethod] || [];

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
                <div className="space-y-3">
                  {/* Header with move name and level */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900 text-lg">
                        {formatMoveName(move.move.name)}
                      </h4>
                      {selectedMethod === 'level-up' && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {language === 'en' ? 'Level' : 'Lv.'} {move.versionGroupDetails[0]?.levelLearnedAt || '-'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Move details */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                    {/* Type */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">
                        {language === 'en' ? 'Type:' : 'タイプ:'}
                      </span>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getTypeColor(move.move.type.name) }}
                      >
                        {getTypeName(move.move.type.name, language)}
                      </span>
                    </div>
                    
                    {/* Damage Class */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">
                        {language === 'en' ? 'Category:' : '分類:'}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {getDamageClassName(move.move.damageClass.name)}
                      </span>
                    </div>
                    
                    {/* Power */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">
                        {language === 'en' ? 'Power:' : '威力:'}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {move.move.power || '-'}
                      </span>
                    </div>
                    
                    {/* Accuracy */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">
                        {language === 'en' ? 'Accuracy:' : '命中:'}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {move.move.accuracy || '-'}
                      </span>
                    </div>
                    
                    {/* PP */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">PP:</span>
                      <span className="text-gray-900 font-medium">
                        {move.move.pp || '-'}
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