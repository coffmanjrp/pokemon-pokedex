"use client";

import { forwardRef } from "react";
import { Locale, interpolate } from "@/lib/dictionaries";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";

interface PokemonProgressFooterProps {
  lang: Locale;
  loading: boolean;
  hasNextPage: boolean;
  showCompletionFooter: boolean;
  loadedCount: number;
  totalCount: number;
  currentGeneration: number;
  generationRange: {
    region: {
      en: string;
      ja: string;
      "zh-Hant": string;
      "zh-Hans": string;
      es: string;
    };
    min: number;
    max: number;
  };
  onCloseCompletion?: () => void;
}

export const PokemonProgressFooter = forwardRef<
  HTMLElement,
  PokemonProgressFooterProps
>(function PokemonProgressFooter(
  {
    lang,
    loading,
    hasNextPage,
    showCompletionFooter,
    loadedCount,
    totalCount,
    currentGeneration,
    generationRange,
    onCloseCompletion,
  },
  ref,
) {
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
      case "es":
        return generationRange.region.es;
      default:
        return generationRange.region.en;
    }
  };
  if (loading) {
    return (
      <footer className="fixed bottom-0 left-0 lg:left-80 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Loading indicator and text */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-blue-600"></div>
              <span className="text-xs md:text-sm font-medium text-gray-700">
                {dictionary?.ui.loading.loadingMoreProgress || fallback}
              </span>
            </div>

            {/* Right side - Progress info */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <span className="text-xs md:text-sm text-gray-600 hidden sm:block">
                {interpolate(dictionary?.ui.loading.pokemonCount || fallback, {
                  current: loadedCount,
                  total: totalCount,
                })}
              </span>
              <div className="w-16 md:w-20 bg-gray-200 rounded-full h-1.5 md:h-2">
                <div
                  className="bg-blue-600 h-1.5 md:h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(loadedCount / totalCount) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs font-medium text-blue-600 min-w-[2rem] md:min-w-[2.5rem]">
                {Math.round((loadedCount / totalCount) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (!hasNextPage && showCompletionFooter) {
    return (
      <footer
        ref={ref}
        className="fixed bottom-0 left-0 lg:left-80 right-0 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200 shadow-lg z-40"
      >
        <div className="px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Success indicator and text */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="text-lg md:text-xl">🎉</div>
              <span className="text-xs md:text-sm font-medium text-green-700">
                {interpolate(
                  dictionary?.ui.loading.allRegionPokemonLoaded || fallback,
                  { region: getRegionName() },
                )}
              </span>
            </div>

            {/* Right side - Complete progress info and close button */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <span className="text-xs md:text-sm text-green-600 hidden sm:block">
                {interpolate(dictionary?.ui.loading.pokemonCount || fallback, {
                  current: totalCount,
                  total: totalCount,
                })}
              </span>
              <div className="w-16 md:w-20 bg-green-200 rounded-full h-1.5 md:h-2">
                <div className="bg-green-600 h-1.5 md:h-2 rounded-full w-full shadow-sm"></div>
              </div>
              <span className="text-xs font-medium text-green-600 min-w-[2rem] md:min-w-[2.5rem]">
                100%
              </span>
              {onCloseCompletion && (
                <button
                  onClick={onCloseCompletion}
                  className="ml-2 p-1 text-green-500 hover:text-green-700 hover:bg-green-100 rounded-full transition-colors duration-200"
                  aria-label={dictionary?.ui.loading.close || fallback}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Generation info */}
          <div className="mt-2 pt-2 border-t border-green-200">
            <p className="text-xs text-green-600 text-center">
              {interpolate(dictionary?.ui.loading.generationInfo || fallback, {
                number: currentGeneration,
                region: getRegionName(),
                min: generationRange.min,
                max: generationRange.max,
              })}
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return null;
});
