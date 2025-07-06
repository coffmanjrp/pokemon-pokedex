"use client";

import { PokemonGrid } from "./PokemonGrid";
import { Pokemon } from "@/types/pokemon";
import { Dictionary, Locale, interpolate } from "@/lib/dictionaries";
import { SearchResult } from "@/store/slices/searchSlice";

interface SearchResultsProps {
  searchResults: SearchResult[];
  onSearchClear: () => void;
  onPokemonClick: (pokemon: Pokemon) => void;
  isSearching: boolean;
  lang: Locale;
  currentGeneration: number;
  onScroll: (event: { scrollTop: number }) => void;
  dictionary: Dictionary;
}

export function SearchResults({
  searchResults,
  onSearchClear,
  onPokemonClick,
  isSearching,
  lang,
  currentGeneration,
  onScroll,
  dictionary,
}: SearchResultsProps) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Search Results Header */}
      <div className="px-4 md:px-6 py-3 bg-blue-50 border-b border-blue-200 flex-shrink-0 flex items-center justify-between">
        <p className="text-sm text-blue-800">
          {interpolate(
            dictionary.ui.filters?.showingResults ||
              "Showing {{count}} results",
            { count: searchResults.length },
          )}
        </p>
        <button
          onClick={onSearchClear}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {dictionary.ui.search.clearSearch || "Clear search"}
        </button>
      </div>

      {/* Pokemon Grid */}
      <div className="flex-1 overflow-auto">
        <PokemonGrid
          pokemons={searchResults.map((result) => result.pokemon)}
          onPokemonClick={onPokemonClick}
          loading={isSearching}
          isFiltering={true}
          isAutoLoading={false}
          hasNextPage={false}
          language={lang}
          priority={true}
          currentGeneration={currentGeneration}
          onScroll={onScroll}
        />
      </div>
    </div>
  );
}
