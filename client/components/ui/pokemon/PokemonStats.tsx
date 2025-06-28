"use client";

import { PokemonStat } from "@/types/pokemon";
import { getStatName } from "@/lib/pokemonUtils";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";

interface PokemonStatsProps {
  stats: PokemonStat[];
}

// Individual stat colors for better visual distinction
const statColors: Record<string, string> = {
  hp: "bg-red-500", // HP: Red (health/life)
  attack: "bg-orange-500", // Attack: Orange (physical power)
  defense: "bg-blue-500", // Defense: Blue (protection/stability)
  "special-attack": "bg-purple-500", // Sp. Attack: Purple (magical power)
  "special-defense": "bg-green-500", // Sp. Defense: Green (resilience)
  speed: "bg-yellow-500", // Speed: Yellow (lightning/quickness)
};

export function PokemonStats({ stats }: PokemonStatsProps) {
  const { language, dictionary } = useAppSelector((state) => state.ui);

  const fallback = getFallbackText(language);
  const noStatsText = dictionary?.ui.error.pokemonNotFound || fallback;

  if (!stats || stats.length === 0) {
    return <div className="text-gray-500 text-center py-4">{noStatsText}</div>;
  }

  const maxBaseStat = Math.max(...stats.map((stat) => stat.baseStat));

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
                      statColors[statName] || "bg-gray-400"
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
            {language === "en" ? "Total" : "合計"}
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
