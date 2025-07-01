"use client";

import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";
import { Locale } from "@/lib/dictionaries";

interface PokemonVersionToggleProps {
  isShiny: boolean;
  onToggle: (isShiny: boolean) => void;
  language: Locale;
}

export function PokemonVersionToggle({
  isShiny,
  onToggle,
  language,
}: PokemonVersionToggleProps) {
  const { dictionary } = useAppSelector((state) => state.ui);

  const fallback = getFallbackText(language);

  const text = {
    versions: dictionary?.ui.pokemonDetails.versions || fallback,
    normal: dictionary?.ui.pokemonDetails.normal || fallback,
    shiny: dictionary?.ui.pokemonDetails.shiny || fallback,
  };
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {text.versions}
      </h3>
      <div className="flex gap-2">
        <button
          onClick={() => onToggle(false)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
            !isShiny
              ? "bg-blue-100 text-blue-800 border-blue-200 shadow-sm hover:shadow-md"
              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:shadow-sm"
          }`}
        >
          {text.normal}
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
            isShiny
              ? "bg-yellow-100 text-yellow-800 border-yellow-200 shadow-sm hover:shadow-md"
              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:shadow-sm"
          }`}
        >
          {text.shiny}
        </button>
      </div>
    </div>
  );
}
