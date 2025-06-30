"use client";

import { getStatName } from "@/lib/pokemonUtils";
import { Locale } from "@/lib/dictionaries";

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
  // Individual stat colors for better visual distinction
  const statColors: Record<string, string> = {
    hp: "bg-red-500", // HP: Red (health/life)
    attack: "bg-orange-500", // Attack: Orange (physical power)
    defense: "bg-blue-500", // Defense: Blue (protection/stability)
    "special-attack": "bg-purple-500", // Sp. Attack: Purple (magical power)
    "special-defense": "bg-green-500", // Sp. Defense: Green (resilience)
    speed: "bg-yellow-500", // Speed: Yellow (lightning/quickness)
  };

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
            className={`h-2 rounded-full transition-all duration-500 shadow-sm ${
              statColors[statName] || "bg-gray-400"
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
