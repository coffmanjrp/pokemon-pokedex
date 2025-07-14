"use client";

import { forwardRef, useEffect, useRef } from "react";
import { Locale, interpolate } from "@/lib/dictionaries";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";
import { HiXMark } from "react-icons/hi2";
import { gsap } from "gsap";

interface PokemonProgressFooterProps {
  lang: Locale;
  loading?: boolean; // Keep for compatibility but not used internally
  hasNextPage?: boolean; // Keep for compatibility but not used internally
  isActive: boolean; // New prop to control footer visibility
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
      ko: string;
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
    isActive,
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
  const progressBarRef = useRef<HTMLDivElement>(null);
  const previousProgress = useRef(0);
  const footerContentRef = useRef<HTMLDivElement>(null);
  const isCompleted = !isActive && showCompletionFooter;

  // Helper function to get region name for current language
  const getRegionName = () => {
    switch (lang) {
      case "ja":
        return generationRange.region.ja;
      default:
        return generationRange.region.en;
    }
  };

  // Animate progress bar on loadedCount change
  useEffect(() => {
    if (progressBarRef.current && isActive) {
      const currentProgress = (loadedCount / totalCount) * 100;

      gsap.fromTo(
        progressBarRef.current,
        {
          width: `${previousProgress.current}%`,
        },
        {
          width: `${currentProgress}%`,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            previousProgress.current = currentProgress;
          },
        },
      );
    }
  }, [loadedCount, totalCount, isActive]);

  // Animate state transitions
  useEffect(() => {
    if (footerContentRef.current) {
      if (isCompleted) {
        // Animate to completion state
        gsap.to(footerContentRef.current, {
          backgroundColor: "rgb(240 253 244)", // green-50
          borderColor: "rgb(187 247 208)", // green-200
          duration: 0.5,
          ease: "power2.inOut",
        });
      } else {
        // Animate to loading state
        gsap.to(footerContentRef.current, {
          backgroundColor: "rgb(255 255 255)", // white
          borderColor: "rgb(229 231 235)", // gray-200
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    }
  }, [isCompleted]);

  return (
    <footer
      ref={ref}
      className="fixed bottom-0 left-0 lg:left-80 right-0 shadow-lg z-40"
      style={{
        display: isActive || isCompleted ? "block" : "none",
      }}
    >
      <div
        ref={footerContentRef}
        className="border-t"
        style={{
          backgroundColor: isCompleted
            ? "rgb(240 253 244)"
            : "rgb(255 255 255)",
          borderColor: isCompleted ? "rgb(187 247 208)" : "rgb(229 231 235)",
        }}
      >
        <div className="px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Loading/Success indicator and text */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {isActive ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-blue-600"></div>
                  <span className="text-xs md:text-sm font-medium text-gray-700">
                    {dictionary?.ui.loading.loadingMoreProgress || fallback}
                  </span>
                </>
              ) : (
                <>
                  <div className="text-lg md:text-xl">🎉</div>
                  <span className="text-xs md:text-sm font-medium text-green-700">
                    {interpolate(
                      dictionary?.ui.loading.allRegionPokemonLoaded || fallback,
                      { region: getRegionName() },
                    )}
                  </span>
                </>
              )}
            </div>

            {/* Right side - Progress info */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <span
                className={`text-xs md:text-sm hidden sm:block ${isCompleted ? "text-green-600" : "text-gray-600"}`}
              >
                {interpolate(dictionary?.ui.loading.pokemonCount || fallback, {
                  current: isCompleted ? totalCount : loadedCount,
                  total: totalCount,
                })}
              </span>
              <div
                className={`w-16 md:w-20 rounded-full h-1.5 md:h-2 overflow-hidden ${isCompleted ? "bg-green-200" : "bg-gray-200"}`}
              >
                <div
                  ref={progressBarRef}
                  className={`h-1.5 md:h-2 rounded-full ${isCompleted ? "bg-green-600" : "bg-blue-600"}`}
                  style={{
                    width: isCompleted ? "100%" : "0%",
                  }}
                ></div>
              </div>
              <span
                className={`text-xs font-medium min-w-[2rem] md:min-w-[2.5rem] ${isCompleted ? "text-green-600" : "text-blue-600"}`}
              >
                {isCompleted
                  ? 100
                  : Math.round((loadedCount / totalCount) * 100)}
                %
              </span>
              {isCompleted && onCloseCompletion && (
                <button
                  onClick={onCloseCompletion}
                  className="ml-2 p-1 text-green-500 hover:text-green-700 hover:bg-green-100 rounded-full transition-colors duration-200"
                  aria-label={dictionary?.ui.loading.close || fallback}
                >
                  <HiXMark className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Generation info - Hide for Generation 0 and only show when completed */}
          {isCompleted && currentGeneration !== 0 && (
            <div className="mt-2 pt-2 border-t border-green-200">
              <p className="text-xs text-green-600 text-center">
                {interpolate(
                  dictionary?.ui.loading.generationInfo || fallback,
                  {
                    number: currentGeneration,
                    region: getRegionName(),
                    min: generationRange.min,
                    max: generationRange.max,
                  },
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
});
