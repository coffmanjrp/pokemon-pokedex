"use client";

import { Dictionary } from "@/lib/dictionaries";

interface NoSearchResultsProps {
  onBackToGeneration: () => void;
  dictionary: Dictionary;
}

export function NoSearchResults({
  onBackToGeneration,
  dictionary,
}: NoSearchResultsProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center py-16 text-gray-500">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">
          {dictionary.ui.search.noResults || "No Pokémon found"}
        </h3>
        <p className="text-gray-600 max-w-md">
          {dictionary.ui.search.noResultsDescription ||
            "Try adjusting your search terms or filters"}
        </p>
        <button
          onClick={onBackToGeneration}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {dictionary.ui.navigation.back || "Back"}
        </button>
      </div>
    </div>
  );
}
