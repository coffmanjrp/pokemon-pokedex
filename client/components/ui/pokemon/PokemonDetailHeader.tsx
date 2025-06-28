"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";

interface PokemonDetailHeaderProps {
  language: "en" | "ja";
}

function PokemonDetailHeaderContent({ language }: PokemonDetailHeaderProps) {
  const searchParams = useSearchParams();
  const fromGeneration = searchParams.get("from");
  const { dictionary } = useAppSelector((state) => state.ui);

  const fallback = getFallbackText(language);
  const headerText = dictionary?.ui.navigation.home || fallback;

  // If we have a generation parameter, construct the URL to go back to that generation
  const backUrl =
    fromGeneration && fromGeneration.startsWith("generation-")
      ? `/${language}/?generation=${fromGeneration.split("-")[1]}`
      : `/${language}/`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-4">
      <Link
        href={backUrl}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 active:text-gray-700 transition-colors text-sm font-medium py-2 px-1 -mx-1 touch-manipulation"
        style={{ minHeight: "44px" }} // Ensure touch target size
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {headerText}
      </Link>
    </div>
  );
}

export function PokemonDetailHeader({ language }: PokemonDetailHeaderProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8 pb-4">
          Loading...
        </div>
      }
    >
      <PokemonDetailHeaderContent language={language} />
    </Suspense>
  );
}
