"use client";

import { useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { PokemonMoves } from "../detail/PokemonMoves";
import { PokemonDescription } from "../detail/PokemonDescription";
import { PokemonGameHistory } from "../detail/PokemonGameHistory";
import { InfoCard } from "../../common/InfoCard";
import { TabNavigation } from "../../common/TabNavigation";
import { SpritesTab } from "./SpritesTab";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";
import { Locale } from "@/lib/dictionaries";

interface PokemonSpritesGalleryProps {
  pokemon: Pokemon;
  language: Locale;
}

type ContentTabType = "sprites" | "description" | "moves" | "gameHistory";

export function PokemonSpritesGallery({
  pokemon,
  language,
}: PokemonSpritesGalleryProps) {
  const [activeContentTab, setActiveContentTab] =
    useState<ContentTabType>("sprites");
  const { dictionary } = useAppSelector((state) => state.ui);

  const fallback = getFallbackText(language);

  const text = {
    artwork: dictionary?.ui.pokemonDetails.artwork || fallback,
    description: dictionary?.ui.pokemonDetails.description || fallback,
    moves: dictionary?.ui.pokemonDetails.moves || fallback,
    gameHistory: dictionary?.ui.pokemonDetails.gameHistory || fallback,
    noMovesData: dictionary?.ui.pokemonDetails.noMovesData || fallback,
    noGameHistoryData:
      dictionary?.ui.pokemonDetails.noGameHistoryData || fallback,
  };

  // Define content tabs
  const contentTabs = [
    {
      id: "sprites" as ContentTabType,
      label: text.artwork,
      icon: "🖼️",
    },
    {
      id: "description" as ContentTabType,
      label: text.description,
      icon: "📖",
    },
    {
      id: "moves" as ContentTabType,
      label: text.moves,
      icon: "⚔️",
      count: pokemon.moves ? pokemon.moves.length : 0,
    },
    {
      id: "gameHistory" as ContentTabType,
      label: text.gameHistory,
      icon: "🎮",
      count: pokemon.gameIndices ? pokemon.gameIndices.length : 0,
    },
  ].filter((tab) => {
    if (tab.id === "sprites") return true;
    if (tab.id === "description")
      return !!(
        pokemon.species?.flavorTextEntries &&
        pokemon.species.flavorTextEntries.length > 0
      );
    if (tab.id === "moves")
      return !!(pokemon.moves && pokemon.moves.length > 0);
    if (tab.id === "gameHistory")
      return !!(pokemon.gameIndices && pokemon.gameIndices.length > 0);
    return false;
  });

  const renderTabContent = () => {
    switch (activeContentTab) {
      case "sprites":
        return <SpritesTab pokemon={pokemon} language={language} />;

      case "description":
        return <PokemonDescription pokemon={pokemon} language={language} />;

      case "moves":
        return pokemon.moves ? (
          <PokemonMoves moves={pokemon.moves} language={language} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            {text.noMovesData}
          </div>
        );

      case "gameHistory":
        return pokemon.gameIndices && pokemon.species?.generation ? (
          <PokemonGameHistory
            gameIndices={pokemon.gameIndices}
            generation={pokemon.species.generation}
            language={language}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            {text.noGameHistoryData}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <InfoCard size="lg" className="overflow-hidden">
      <TabNavigation
        tabs={contentTabs}
        activeTab={activeContentTab}
        onTabChange={setActiveContentTab}
        variant="underline"
        className="mb-6"
      />

      {/* Tab Content */}
      {renderTabContent()}
    </InfoCard>
  );
}
