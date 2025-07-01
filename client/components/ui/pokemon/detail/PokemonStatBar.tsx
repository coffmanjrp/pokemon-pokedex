"use client";

import { getStatName } from "@/lib/pokemonUtils";
import { Locale } from "@/lib/dictionaries";
import { getStatColor } from "@/lib/data/statColors";

interface PokemonStatBarProps {
  statName: string;
  baseStat: number;
  language: Locale;
  maxBaseStat?: number;
}

export function PokemonStatBar({
  statName,
  baseStat,
  language,
  maxBaseStat = 150,
}: PokemonStatBarProps) {
  const percentage = (baseStat / maxBaseStat) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-xs text-gray-600 text-right">
        {getStatName(statName, language)}
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
