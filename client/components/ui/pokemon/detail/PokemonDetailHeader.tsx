"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Locale, Dictionary } from "@/lib/dictionaries";
import { HiChevronLeft } from "react-icons/hi2";
import { setReturnFromDetailFlag } from "@/lib/utils/scrollStorage";

interface PokemonDetailHeaderProps {
  language: Locale;
  dictionary: Dictionary;
}

function PokemonDetailHeaderContent({
  language,
  dictionary,
}: PokemonDetailHeaderProps) {
  const searchParams = useSearchParams();
  const fromGeneration = searchParams.get("from");

  // If we have a generation parameter, construct the URL to go back to that generation
  const backUrl =
    fromGeneration && fromGeneration.startsWith("generation-")
      ? `/${language}/?generation=${fromGeneration.split("-")[1]}&from=${fromGeneration}`
      : `/${language}/`;

  // Use dictionary directly from props to ensure server/client consistency
  const headerText = dictionary.ui.navigation.home;

  const handleBackClick = () => {
    // Set flag to indicate returning from detail page
    setReturnFromDetailFlag(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-4">
      <Link
        href={backUrl}
        onClick={handleBackClick}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 active:text-gray-700 transition-colors text-sm font-medium py-2 px-1 -mx-1 touch-manipulation"
        style={{ minHeight: "44px" }} // Ensure touch target size
      >
        <HiChevronLeft className="w-5 h-5 mr-2" />
        {headerText}
      </Link>
    </div>
  );
}

export function PokemonDetailHeader({
  language,
  dictionary,
}: PokemonDetailHeaderProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-4">
          <div
            className="inline-flex items-center text-gray-600 text-sm font-medium py-2 px-1 -mx-1"
            style={{ minHeight: "44px" }}
          >
            <HiChevronLeft className="w-5 h-5 mr-2" />
            {dictionary.ui.navigation.home}
          </div>
        </div>
      }
    >
      <PokemonDetailHeaderContent language={language} dictionary={dictionary} />
    </Suspense>
  );
}
