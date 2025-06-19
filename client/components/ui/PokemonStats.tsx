'use client';

import { PokemonStat } from '@/types/pokemon';
import { getStatName } from '@/lib/pokemonUtils';
import { useAppSelector } from '@/store/hooks';

interface PokemonStatsProps {
  stats: PokemonStat[];
}

// Type colors for visual variety
const typeColors: Record<string, string> = {
  hp: 'bg-red-100 text-red-800',
  attack: 'bg-orange-100 text-orange-800',
  defense: 'bg-blue-100 text-blue-800',
  'special-attack': 'bg-purple-100 text-purple-800',
  'special-defense': 'bg-green-100 text-green-800',
  speed: 'bg-yellow-100 text-yellow-800',
};

export function PokemonStats({ stats }: PokemonStatsProps) {
  const { language } = useAppSelector((state) => state.ui);
  
  if (!stats || stats.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        {language === 'en' ? 'No stats available' : 'ステータスがありません'}
      </div>
    );
  }

  const maxBaseStat = Math.max(...stats.map(stat => stat.baseStat));

  return (
    <div className="space-y-4">
      {stats.map((pokemonStat, index) => {
        const statName = pokemonStat.stat.name;
        const percentage = (pokemonStat.baseStat / maxBaseStat) * 100;
        
        return (
          <div key={index} className="flex items-center gap-4">
            <div className="w-24 text-sm font-medium text-gray-700">
              {getStatName(statName, language)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      typeColors[statName] ? typeColors[statName].split(' ')[0] : 'bg-gray-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800 w-8 text-right">
                  {pokemonStat.baseStat}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Total stats */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-24 text-sm font-bold text-gray-900">
            {language === 'en' ? 'Total' : '合計'}
          </div>
          <div className="flex-1">
            <span className="text-lg font-bold text-gray-900">
              {stats.reduce((total, stat) => total + stat.baseStat, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}