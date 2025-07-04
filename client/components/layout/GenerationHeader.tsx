"use client";

import { Dictionary, Locale, interpolate } from "@/lib/dictionaries";
import { GENERATIONS } from "@/lib/data/generations";
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import { TYPE_COLORS, POKEMON_TYPES } from "@/lib/data/index";

interface GenerationHeaderProps {
  currentGeneration: number;
  lang: Locale;
  dictionary: Dictionary;
  className?: string;
  onSearch?: (query: string) => void;
  onSearchClear?: () => void;
  showSearch?: boolean;
  searchLoading?: boolean;
  searchSuggestions?: string[];
  showTypeFilter?: boolean;
  selectedTypes?: string[];
  onTypeFilter?: (types: string[]) => void;
}

export function GenerationHeader({
  currentGeneration,
  lang,
  dictionary,
  className = "",
  onSearch,
  onSearchClear,
  showSearch = true,
  searchLoading = false,
  searchSuggestions = [],
  showTypeFilter = false,
  selectedTypes = [],
  onTypeFilter,
}: GenerationHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Get generation range info
  const generationRange = GENERATIONS.find(
    (gen) => gen.id === currentGeneration,
  );

  if (!generationRange) {
    return null;
  }

  const handleSearch = (query: string) => {
    onSearch?.(query);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    onSearchClear?.();
  };

  const handleTypeToggle = (type: string) => {
    if (!onTypeFilter) return;

    const newTypes = selectedTypes?.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...(selectedTypes || []), type];

    onTypeFilter(newTypes);
  };

  const clearTypeFilter = () => {
    onTypeFilter?.([]);
  };

  return (
    <header
      className={`flex-shrink-0 bg-gray-50 border-b border-gray-200 shadow-sm z-30 ${className}`}
    >
      <div className="relative px-4 md:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Generation Title */}
          <h1 className="text-sm md:text-base font-bold text-gray-700 text-center lg:text-left lg:ml-0 flex-shrink-0">
            {interpolate(dictionary.ui.generation.displayTemplate, {
              region:
                generationRange.region[
                  lang as keyof typeof generationRange.region
                ] || generationRange.region.en,
              number: currentGeneration,
            })}
          </h1>

          {/* Search Bar */}
          {showSearch && (
            <div className="flex-1 max-w-md lg:max-w-sm xl:max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                onClear={handleSearchClear}
                dictionary={dictionary}
                loading={searchLoading}
                showSuggestions={true}
                suggestions={searchSuggestions}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Type Filter Section */}
        {showTypeFilter && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">
                {dictionary.ui.filters?.filterByType || "Filter by type:"}
              </span>

              {POKEMON_TYPES.map((type) => {
                const isSelected = selectedTypes?.includes(type);
                const typeColor =
                  TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "#6B7280";
                const typeLabel =
                  dictionary.ui.types?.[
                    type as keyof typeof dictionary.ui.types
                  ] || type;

                // Helper function to determine if color is light or dark for text contrast
                const isLightColor = (hex: string) => {
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                  return brightness > 155;
                };

                const lightColor = isLightColor(typeColor);

                return (
                  <button
                    key={type}
                    onClick={() => handleTypeToggle(type)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 border shadow-sm ${
                      isSelected
                        ? "shadow-md transform scale-105 border-opacity-30"
                        : "hover:shadow-md hover:transform hover:scale-105 border-opacity-20"
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? typeColor
                        : `${typeColor}20`,
                      borderColor: typeColor,
                      color: isSelected
                        ? lightColor
                          ? "#374151"
                          : "#ffffff"
                        : "#374151",
                    }}
                  >
                    {typeLabel}
                  </button>
                );
              })}

              {selectedTypes && selectedTypes.length > 0 && (
                <button
                  onClick={clearTypeFilter}
                  className="px-2 py-1 text-xs text-red-600 hover:text-red-800 underline"
                >
                  {dictionary.ui.filters?.clear || "Clear"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
