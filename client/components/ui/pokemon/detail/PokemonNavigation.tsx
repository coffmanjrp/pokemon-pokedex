"use client";

import Link from "next/link";
import { Locale } from "@/lib/dictionaries";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

interface PokemonNavigationProps {
  prevId: number | null;
  nextId: number | null;
  language: Locale;
  fromGeneration?: string | null;
  isVariant: boolean;
}

export function PokemonNavigation({
  prevId,
  nextId,
  language,
  fromGeneration,
  isVariant,
}: PokemonNavigationProps) {
  // Helper function to create navigation URL with generation parameter
  const createNavigationUrl = (pokemonId: number) => {
    const baseUrl = `/${language}/pokemon/${pokemonId}`;
    return fromGeneration ? `${baseUrl}?from=${fromGeneration}` : baseUrl;
  };

  // Don't render navigation for variant Pokemon
  if (isVariant) {
    return null;
  }

  return (
    <>
      {/* Previous Pokemon */}
      {prevId && (
        <Link
          href={createNavigationUrl(prevId)}
          className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-30 group hover:scale-110 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <HiChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
            <div className="text-lg text-gray-500 font-medium text-center">
              #{prevId.toString().padStart(3, "0")}
            </div>
          </div>
        </Link>
      )}

      {/* Next Pokemon */}
      {nextId && (
        <Link
          href={createNavigationUrl(nextId)}
          className="hidden md:block fixed right-4 top-1/2 -translate-y-1/2 z-30 group hover:scale-110 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <div className="text-lg text-gray-500 font-medium text-center">
              #{nextId.toString().padStart(3, "0")}
            </div>
            <HiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
          </div>
        </Link>
      )}
    </>
  );
}
