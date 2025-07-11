"use client";

import { Dictionary } from "@/lib/dictionaries";
import { getStatColor } from "@/lib/data/statColors";

interface PokemonStatBarProps {
  statName: string;
  baseStat: number;
  dictionary: Dictionary;
  maxBaseStat?: number;
}

export function PokemonStatBar({
  statName,
  baseStat,
  dictionary,
  maxBaseStat = 150,
}: PokemonStatBarProps) {
  const percentage = (baseStat / maxBaseStat) * 100;

  // Get stat name from dictionary system
  const getStatDisplayName = (statName: string): string => {
    const statKey = statName.toLowerCase();
    return (
      dictionary.ui.stats[statKey as keyof typeof dictionary.ui.stats] ||
      statName
    );
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-xs text-gray-600 text-right">
        {getStatDisplayName(statName)}
      </div>
      <div className="text-sm font-semibold w-8 text-right">{baseStat}</div>
      <div className="flex-1">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 shadow-sm ${getStatColor(
              statName,
            )}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
