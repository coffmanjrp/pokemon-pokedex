"use client";

import { Locale, interpolate } from "@/lib/dictionaries";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";

interface GenerationSwitchingOverlayProps {
  lang: Locale;
  currentGeneration: number;
  generationRange: {
    region: {
      en: string;
      ja: string;
      "zh-Hant": string;
      "zh-Hans": string;
      es: string;
      ko: string;
      fr: string;
    };
    min: number;
    max: number;
  };
  isVisible: boolean;
}

export function GenerationSwitchingOverlay({
  lang,
  currentGeneration,
  generationRange,
  isVisible,
}: GenerationSwitchingOverlayProps) {
  const { dictionary } = useAppSelector((state) => state.ui);
  const fallback = getFallbackText(lang);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 lg:left-80 right-0 bottom-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 mb-1">
            {interpolate(
              dictionary?.ui.generationSwitching.switchingTo || fallback,
              {
                region:
                  generationRange.region[
                    lang as keyof typeof generationRange.region
                  ] || generationRange.region.en,
              },
            )}
          </p>
          <p className="text-sm text-gray-500">
            {interpolate(
              dictionary?.ui.generationSwitching.generationRange || fallback,
              {
                number: currentGeneration,
                min: generationRange.min,
                max: generationRange.max,
              },
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
