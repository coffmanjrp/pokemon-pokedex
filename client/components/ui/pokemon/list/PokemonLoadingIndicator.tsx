"use client";

import { Locale, interpolate } from "@/lib/dictionaries";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";

interface PokemonLoadingIndicatorProps {
  lang: Locale;
  currentGeneration: number;
  generationRange: {
    region: { en: string; ja: string; "zh-Hant": string; "zh-Hans": string };
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
  const { dictionary } = useAppSelector((state) => state.ui);
  const fallback = getFallbackText(lang);

  // Helper function to get region name for current language
  const getRegionName = () => {
    switch (lang) {
      case "en":
        return generationRange.region.en;
      case "ja":
        return generationRange.region.ja;
      case "zh-Hant":
        return generationRange.region["zh-Hant"];
      case "zh-Hans":
        return generationRange.region["zh-Hans"];
      default:
        return generationRange.region.en;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-lg font-medium text-gray-700">
          {interpolate(dictionary?.ui.loading.loadingRegion || fallback, {
            region: getRegionName(),
          })}
        </span>
      </div>

      {/* Progress Bar for Generation Loading */}
      <div className="w-full max-w-md mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>
            {interpolate(dictionary?.ui.loading.generationLabel || fallback, {
              number: currentGeneration,
            })}
          </span>
          <span className="font-medium">
            {interpolate(dictionary?.ui.loading.pokemonCount || fallback, {
              current: 0,
              total: totalCount,
            })}
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
        {interpolate(dictionary?.ui.loading.rangeLabel || fallback, {
          min: generationRange.min,
          max: generationRange.max,
        })}
      </p>
    </div>
  );
}
