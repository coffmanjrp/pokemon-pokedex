"use client";

import { getTypeColorFromName, getTypeName } from "@/lib/pokemonUtils";
import { Dictionary } from "@/lib/dictionaries";

interface PokemonWeaknessSectionProps {
  weaknesses: string[];
  dictionary: Dictionary;
}

export function PokemonWeaknessSection({
  weaknesses,
  dictionary,
}: PokemonWeaknessSectionProps) {
  // Use dictionary directly from props to ensure server/client consistency
  const text = {
    weaknesses: dictionary.ui.pokemonDetails.weaknesses,
    noMajorWeaknesses: dictionary.ui.pokemonDetails.noMajorWeaknesses,
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
              {getTypeName(weaknessType, dictionary)}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">{text.noMajorWeaknesses}</div>
      )}
    </div>
  );
}
