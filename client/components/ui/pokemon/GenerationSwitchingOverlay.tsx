"use client";

import { Locale } from "@/lib/dictionaries";

interface GenerationSwitchingOverlayProps {
  lang: Locale;
  currentGeneration: number;
  generationRange: {
    region: { en: string; ja: string };
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
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 lg:left-80 right-0 bottom-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 mb-1">
            {lang === "ja"
              ? `${generationRange.region.ja}に切り替え中...`
              : `Switching to ${generationRange.region.en}...`}
          </p>
          <p className="text-sm text-gray-500">
            {lang === "ja"
              ? `第${currentGeneration}世代 (#${generationRange.min}-#${generationRange.max})`
              : `Generation ${currentGeneration} (#${generationRange.min}-#${generationRange.max})`}
          </p>
        </div>
      </div>
    </div>
  );
}
