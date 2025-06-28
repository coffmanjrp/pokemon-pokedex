"use client";

import { Pokemon } from "@/types/pokemon";
import { PokemonStatBar } from "./PokemonStatBar";
import { getPokemonDisplayId } from "@/lib/pokemonUtils";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";

interface PokemonStatsSectionProps {
  pokemon: Pokemon;
  language: "en" | "ja";
}

export function PokemonStatsSection({
  pokemon,
  language,
}: PokemonStatsSectionProps) {
  const displayId = getPokemonDisplayId(pokemon);
  const { dictionary } = useAppSelector((state) => state.ui);

  const fallback = getFallbackText(language);

  const text = {
    stats: dictionary?.ui.pokemonDetails.stats || fallback,
    total: dictionary?.ui.stats.total || fallback,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{text.stats}</h3>
        {pokemon.stats && pokemon.stats.length > 0 && (
          <div className="bg-blue-100 border border-blue-200 rounded-lg px-3 py-2">
            <div className="text-xs text-blue-600 font-medium mb-1">
              {text.total}
            </div>
            <div className="text-lg font-bold text-blue-800">
              {pokemon.stats.reduce((total, stat) => total + stat.baseStat, 0)}
            </div>
          </div>
        )}
      </div>

      {pokemon.stats && pokemon.stats.length > 0 ? (
        <div className="space-y-3">
          {pokemon.stats.map((pokemonStat, index) => (
            <PokemonStatBar
              key={index}
              statName={pokemonStat.stat.name}
              baseStat={pokemonStat.baseStat}
              language={language}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-4 text-sm">
          {language === "en" ? "No stats available" : "ステータスがありません"}
        </div>
      )}

      {/* Pokemon Number Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <span className="text-gray-400 text-xs">
            #{displayId.toString().padStart(3, "0")} / 1025
          </span>
        </div>
      </div>
    </div>
  );
}
