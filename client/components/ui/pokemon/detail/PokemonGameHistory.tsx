"use client";

import { GameIndex, Generation } from "@/types/pokemon";
import { getGenerationName } from "@/lib/pokemonUtils";
import { getGenerationByGame } from "@/lib/data/generations";
import { DataEmptyState } from "../../common/DataEmptyState";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";
import { Locale } from "@/lib/dictionaries";

interface PokemonGameHistoryProps {
  gameIndices?: GameIndex[];
  generation?: Generation;
  language: Locale;
}

export function PokemonGameHistory({
  gameIndices,
  generation,
  language,
}: PokemonGameHistoryProps) {
  const { dictionary } = useAppSelector((state) => state.ui);

  // Use consistent fallback text based on props language for server/client consistency
  const text = {
    originGeneration:
      dictionary?.ui.pokemonDetails.originGeneration ||
      getFallbackText(language),
    gameAppearances:
      dictionary?.ui.pokemonDetails.gameAppearances ||
      getFallbackText(language),
    remakes: dictionary?.ui.pokemonDetails.remakes || getFallbackText(language),
    otherGames:
      dictionary?.ui.pokemonDetails.otherGames || getFallbackText(language),
    totalAppearances:
      dictionary?.ui.pokemonDetails.totalAppearances ||
      getFallbackText(language),
    generations:
      dictionary?.ui.pokemonDetails.generations || getFallbackText(language),
  };
  if (!gameIndices || gameIndices.length === 0) {
    return <DataEmptyState type="games" language={language} />;
  }

  // Game version display names using dictionary system
  const getGameDisplayName = (version: string) => {
    if (!dictionary) {
      return version.charAt(0).toUpperCase() + version.slice(1);
    }

    const versionKey = version
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "") as keyof typeof dictionary.ui.gameVersions;

    if (dictionary.ui.gameVersions[versionKey]) {
      return dictionary.ui.gameVersions[versionKey];
    }

    // Fallback: capitalize the English name
    return version.charAt(0).toUpperCase() + version.slice(1);
  };

  // Group games by generation/era using unified data
  const groupGamesByEra = () => {
    const eras: Record<string, GameIndex[]> = {};

    gameIndices.forEach((gameIndex) => {
      const version = gameIndex.version.name;
      const generationData = getGenerationByGame(version);

      let era: string;
      if (generationData) {
        // Use generation data for consistent naming
        const genName = generationData.name[language];
        const regionName = generationData.region[language];

        // Check if it's a remake
        const isRemake = generationData.remakes?.includes(version);
        if (isRemake) {
          era = `${genName} (${text.remakes})`;
        } else {
          era = `${genName} (${regionName})`;
        }
      } else {
        // Fallback for unrecognized games
        era = text.otherGames;
      }

      if (!eras[era]) {
        eras[era] = [];
      }
      eras[era]?.push(gameIndex);
    });

    return eras;
  };

  const gamesByEra = groupGamesByEra();

  return (
    <div className="space-y-6">
      {/* Generation Info */}
      {generation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            {text.originGeneration}
          </h4>
          <p className="text-blue-800">
            {getGenerationName(generation.name, language)}
          </p>
        </div>
      )}

      {/* Game Appearances by Era */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">{text.gameAppearances}</h4>

        {Object.entries(gamesByEra).map(([era, games]) => (
          <div
            key={era}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h5 className="font-medium text-gray-800">{era}</h5>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {games.map((gameIndex, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {getGameDisplayName(gameIndex.version.name)}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      #{gameIndex.gameIndex.toString().padStart(3, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{text.totalAppearances}</span>
          <span className="ml-2">{gameIndices.length}</span>
          <span className="ml-4 font-medium">{text.generations}</span>
          <span className="ml-2">{Object.keys(gamesByEra).length}</span>
        </div>
      </div>
    </div>
  );
}
