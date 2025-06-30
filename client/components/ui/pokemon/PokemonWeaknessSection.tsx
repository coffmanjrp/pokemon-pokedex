"use client";

import { getTypeColorFromName, getTypeName } from "@/lib/pokemonUtils";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";
import { Locale } from "@/lib/dictionaries";

interface PokemonWeaknessSectionProps {
  weaknesses: string[];
  language: Locale;
}

export function PokemonWeaknessSection({
  weaknesses,
  language,
}: PokemonWeaknessSectionProps) {
  const { dictionary } = useAppSelector((state) => state.ui);

  const fallback = getFallbackText(language);

  const text = {
    weaknesses: dictionary?.ui.pokemonDetails.weaknesses || fallback,
    noMajorWeaknesses:
      dictionary?.ui.pokemonDetails.noMajorWeaknesses || fallback,
  };
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {text.weaknesses}
      </h3>
      {weaknesses.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {weaknesses.map((weaknessType) => (
            <span
              key={weaknessType}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-md"
              style={{
                backgroundColor: getTypeColorFromName(weaknessType),
              }}
            >
              {getTypeName(weaknessType, language)}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">{text.noMajorWeaknesses}</div>
      )}
    </div>
  );
}
