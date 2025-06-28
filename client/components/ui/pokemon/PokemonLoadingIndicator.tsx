"use client";

import { Locale } from "@/lib/dictionaries";

interface PokemonLoadingIndicatorProps {
  lang: Locale;
  currentGeneration: number;
  generationRange: {
    region: { en: string; ja: string };
    min: number;
    max: number;
  };
  totalCount: number;
}

export function PokemonLoadingIndicator({
  lang,
  currentGeneration,
  generationRange,
  totalCount,
}: PokemonLoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-lg font-medium text-gray-700">
          {lang === "ja"
            ? `${generationRange.region.ja}のポケモンを読み込み中...`
            : `Loading ${generationRange.region.en} Pokémon...`}
        </span>
      </div>

      {/* Progress Bar for Generation Loading */}
      <div className="w-full max-w-md mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>
            {lang === "ja"
              ? `第${currentGeneration}世代`
              : `Generation ${currentGeneration}`}
          </span>
          <span className="font-medium">
            {lang === "ja" ? `0/${totalCount}匹` : `0/${totalCount} Pokémon`}
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full animate-pulse shadow-sm"
            style={{ width: "25%" }}
          ></div>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        {lang === "ja"
          ? `範囲: #${generationRange.min}-#${generationRange.max}`
          : `Range: #${generationRange.min}-#${generationRange.max}`}
      </p>
    </div>
  );
}
