"use client";

import { Dictionary, Locale, interpolate } from "@/lib/dictionaries";
import { GENERATIONS } from "@/lib/data/generations";

interface GenerationHeaderProps {
  currentGeneration: number;
  lang: Locale;
  dictionary: Dictionary;
  className?: string;
}

export function GenerationHeader({
  currentGeneration,
  lang,
  dictionary,
  className = "",
}: GenerationHeaderProps) {
  // Get generation range info
  const generationRange = GENERATIONS.find(
    (gen) => gen.id === currentGeneration,
  );

  if (!generationRange) {
    return null;
  }

  return (
    <header
      className={`flex-shrink-0 bg-gray-50 border-b border-gray-200 shadow-sm z-30 ${className}`}
    >
      <div className="relative px-4 md:px-6 py-3">
        <h1 className="text-sm md:text-base font-bold text-gray-700 text-center lg:text-left lg:ml-0">
          {interpolate(dictionary.ui.generation.displayTemplate, {
            region:
              generationRange.region[
                lang as keyof typeof generationRange.region
              ] || generationRange.region.en,
            number: currentGeneration,
          })}
        </h1>
      </div>
    </header>
  );
}
