"use client";

import { useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { PokemonDescription } from "./PokemonDescription";
import { PokemonMoves } from "./PokemonMoves";
import { PokemonGameHistory } from "./PokemonGameHistory";

interface PokemonDetailTabsProps {
  pokemon: Pokemon;
  dictionary: Dictionary;
  language: Locale;
}

type TabType = "description" | "moves" | "gameHistory";

interface TabInfo {
  id: TabType;
  label: string;
  icon: string;
  count?: number;
}

export function PokemonDetailTabs({
  pokemon,
  dictionary,
  language,
}: PokemonDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("description");

  // Helper function to check if flavor text entry matches current language
  const isValidLanguageEntry = (entryLanguageName: string): boolean => {
    switch (language) {
      case "en":
        return entryLanguageName === "en";
      case "ja":
        return entryLanguageName === "ja" || entryLanguageName === "ja-Hrkt";
      case "zh-Hant":
        return entryLanguageName === "zh-Hant";
      case "zh-Hans":
        return entryLanguageName === "zh-Hans";
      default:
        return entryLanguageName === "en";
    }
  };

  // Define available tabs based on data availability
  const availableTabs: TabInfo[] = [];

  // Description tab
  if (
    pokemon.species?.flavorTextEntries &&
    pokemon.species.flavorTextEntries.length > 0
  ) {
    availableTabs.push({
      id: "description",
      label: dictionary.ui.pokemonDetails.description,
      icon: "📖",
      count: pokemon.species.flavorTextEntries.filter((entry) =>
        isValidLanguageEntry(entry.language.name),
      ).length,
    });
  }

  // Moves tab
  if (pokemon.moves && pokemon.moves.length > 0) {
    availableTabs.push({
      id: "moves",
      label: dictionary.ui.pokemonDetails.moves,
      icon: "⚔️",
      count: pokemon.moves.length,
    });
  }

  // Game History tab
  if (pokemon.gameIndices && pokemon.gameIndices.length > 0) {
    availableTabs.push({
      id: "gameHistory",
      label: dictionary.ui.pokemonDetails.gameHistory,
      icon: "🎮",
      count: pokemon.gameIndices.length,
    });
  }

  // Set default active tab to first available
  if (
    availableTabs.length > 0 &&
    !availableTabs.find((tab) => tab.id === activeTab)
  ) {
    const firstTab = availableTabs[0];
    if (firstTab) {
      setActiveTab(firstTab.id);
    }
  }

  if (availableTabs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center py-8 text-gray-500">
          {dictionary.ui.pokemonDetails.noAdditionalInfo}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-0" aria-label="Tabs">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === "description" && pokemon.species?.flavorTextEntries && (
          <PokemonDescription pokemon={pokemon} language={language as Locale} />
        )}

        {activeTab === "moves" && pokemon.moves && (
          <PokemonMoves moves={pokemon.moves} language={language as Locale} />
        )}

        {activeTab === "gameHistory" &&
          pokemon.gameIndices &&
          pokemon.species?.generation && (
            <PokemonGameHistory
              gameIndices={pokemon.gameIndices}
              generation={pokemon.species.generation}
              language={language as Locale}
            />
          )}
      </div>
    </div>
  );
}
