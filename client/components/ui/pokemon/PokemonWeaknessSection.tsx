"use client";

import { getTypeColorFromName, getTypeName } from "@/lib/pokemonUtils";

interface PokemonWeaknessSectionProps {
  weaknesses: string[];
  language: "en" | "ja";
}

export function PokemonWeaknessSection({
  weaknesses,
  language,
}: PokemonWeaknessSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {language === "en" ? "Weaknesses" : "弱点"}
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
        <div className="text-sm text-gray-500">
          {language === "en" ? "No major weaknesses" : "特に弱点なし"}
        </div>
      )}
    </div>
  );
}
