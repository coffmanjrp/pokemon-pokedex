"use client";

import { forwardRef } from "react";
import { Locale } from "@/lib/dictionaries";

interface PokemonProgressFooterProps {
  lang: Locale;
  loading: boolean;
  hasNextPage: boolean;
  showCompletionFooter: boolean;
  loadedCount: number;
  totalCount: number;
  currentGeneration: number;
  generationRange: {
    region: { en: string; ja: string; "zh-Hant": string; "zh-Hans": string };
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
  if (loading) {
    return (
      <footer className="fixed bottom-0 left-0 lg:left-80 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Loading indicator and text */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-blue-600"></div>
              <span className="text-xs md:text-sm font-medium text-gray-700">
                {lang === "ja"
                  ? `さらに読み込み中...`
                  : lang === "zh-Hant"
                    ? `載入更多...`
                    : lang === "zh-Hans"
                      ? `加载更多...`
                      : `Loading more...`}
              </span>
            </div>

            {/* Right side - Progress info */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <span className="text-xs md:text-sm text-gray-600 hidden sm:block">
                {lang === "ja"
                  ? `${loadedCount}/${totalCount}匹`
                  : lang === "zh-Hant" || lang === "zh-Hans"
                    ? `${loadedCount}/${totalCount}隻`
                    : `${loadedCount}/${totalCount}`}
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
                {lang === "ja"
                  ? `${generationRange.region.ja}の全ポケモンを表示完了！`
                  : lang === "zh-Hant"
                    ? `所有${generationRange.region["zh-Hant"]}寶可夢載入完成！`
                    : lang === "zh-Hans"
                      ? `所有${generationRange.region["zh-Hans"]}宝可梦加载完成！`
                      : `All ${generationRange.region.en} Pokémon loaded!`}
              </span>
            </div>

            {/* Right side - Complete progress info and close button */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <span className="text-xs md:text-sm text-green-600 hidden sm:block">
                {lang === "ja"
                  ? `${totalCount}/${totalCount}匹`
                  : lang === "zh-Hant" || lang === "zh-Hans"
                    ? `${totalCount}/${totalCount}隻`
                    : `${totalCount}/${totalCount}`}
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
                  aria-label={
                    lang === "ja"
                      ? "閉じる"
                      : lang === "zh-Hant"
                        ? "關閉"
                        : lang === "zh-Hans"
                          ? "关闭"
                          : "Close"
                  }
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
              {lang === "ja"
                ? `第${currentGeneration}世代 (#${generationRange.min}-#${generationRange.max})`
                : lang === "zh-Hant" || lang === "zh-Hans"
                  ? `第${currentGeneration}世代 (#${generationRange.min}-#${generationRange.max})`
                  : `Generation ${currentGeneration} (#${generationRange.min}-#${generationRange.max})`}
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return null;
});
