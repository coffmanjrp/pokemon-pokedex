"use client";

import { PokemonGrid } from "./PokemonGrid";
import { PokemonCard } from "./PokemonCard";
import { Pokemon } from "@/types/pokemon";
import { Dictionary, Locale, interpolate } from "@/lib/dictionaries";
import { SearchResult } from "@/store/slices/searchSlice";
import { SearchScope } from "@/types/search";
import { useAppSelector } from "@/store/hooks";
import { GENERATIONS } from "@/lib/data/generations";

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
  const { searchScope } = useAppSelector((state) => state.search);

  // Group results by generation for all generations search
  const resultsByGeneration =
    searchScope === SearchScope.ALL_GENERATIONS
      ? searchResults.reduce(
          (acc, result) => {
            const genId = result.generation ?? 1;
            if (!acc[genId]) {
              acc[genId] = [];
            }
            acc[genId].push(result);
            return acc;
          },
          {} as Record<number, SearchResult[]>,
        )
      : null;

  return (
    <div className="flex-1 flex flex-col">
      {/* Search Results Header */}
      <div className="px-4 md:px-6 py-3 bg-blue-50 border-b border-blue-200 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-blue-800">
            {interpolate(
              dictionary.ui.filters?.showingResults ||
                "Showing {{count}} results",
              { count: searchResults.length },
            )}
          </p>
          {searchScope === SearchScope.ALL_GENERATIONS &&
            resultsByGeneration && (
              <span className="text-xs text-blue-600">
                ({Object.keys(resultsByGeneration).length}{" "}
                {dictionary.ui.navigation?.generationsTitle?.toLowerCase() ||
                  "generations"}
                )
              </span>
            )}
        </div>
        <button
          onClick={onSearchClear}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {dictionary.ui.search.clearSearch || "Clear search"}
        </button>
      </div>

      {/* Pokemon Grid */}
      <div
        className="flex-1 overflow-auto"
        onScroll={(e) => onScroll({ scrollTop: e.currentTarget.scrollTop })}
      >
        {searchScope === SearchScope.ALL_GENERATIONS && resultsByGeneration ? (
          // All generations search: show grouped by generation
          <div className="p-4 md:p-6 space-y-6">
            {Object.entries(resultsByGeneration)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([genId, results]) => {
                const generation = GENERATIONS.find(
                  (g) => g.id === parseInt(genId),
                );
                if (!generation) return null;

                return (
                  <div key={genId} className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 px-2">
                      {generation.name[lang as keyof typeof generation.name] ||
                        generation.name.en}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        ({results.length})
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                      {results.map((result) => (
                        <PokemonCard
                          key={result.pokemon.id}
                          pokemon={result.pokemon}
                          onClick={() => onPokemonClick(result.pokemon)}
                          priority={true}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          // Current generation search: normal grid
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
        )}
      </div>
    </div>
  );
}
