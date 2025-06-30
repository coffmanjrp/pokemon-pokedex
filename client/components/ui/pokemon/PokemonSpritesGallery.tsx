"use client";

import { useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { PokemonMoves } from "./PokemonMoves";
import { PokemonDescription } from "./PokemonDescription";
import { PokemonGameHistory } from "./PokemonGameHistory";
import { InfoCard } from "../common/InfoCard";
import { TabNavigation } from "../common/TabNavigation";
import { DataEmptyState } from "../common/DataEmptyState";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";
import { Locale } from "@/lib/dictionaries";

interface PokemonSpritesGalleryProps {
  pokemon: Pokemon;
  language: Locale;
}

interface SpriteInfo {
  url: string;
  label: string;
  category: string;
}

type ContentTabType = "sprites" | "description" | "moves" | "gameHistory";

export function PokemonSpritesGallery({
  pokemon,
  language,
}: PokemonSpritesGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("official");
  const [activeContentTab, setActiveContentTab] =
    useState<ContentTabType>("sprites");
  const { dictionary } = useAppSelector((state) => state.ui);

  const fallback = getFallbackText(language);

  const text = {
    artwork: dictionary?.ui.pokemonDetails.artwork || fallback,
    description: dictionary?.ui.pokemonDetails.description || fallback,
    moves: dictionary?.ui.pokemonDetails.moves || fallback,
    gameHistory: dictionary?.ui.pokemonDetails.gameHistory || fallback,
    officialArtwork: dictionary?.ui.pokemonDetails.officialArtwork || fallback,
    pokemonHome: dictionary?.ui.pokemonDetails.pokemonHome || fallback,
    gameSprites: dictionary?.ui.pokemonDetails.gameSprites || fallback,
    animated: dictionary?.ui.pokemonDetails.animated || fallback,
    dreamWorld: dictionary?.ui.pokemonDetails.dreamWorld || fallback,
    showdown: dictionary?.ui.pokemonDetails.showdown || fallback,
    icons: dictionary?.ui.pokemonDetails.icons || fallback,
    noSpritesAvailable:
      dictionary?.ui.pokemonDetails.noSpritesAvailable || fallback,
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

  // Helper function to create sprite info objects
  const createSpriteInfo = (
    url: string | undefined,
    labelEn: string,
    labelJa: string,
    category: string,
  ): SpriteInfo | null => {
    if (!url) return null;
    return { url, label: language === "en" ? labelEn : labelJa, category };
  };

  // Collect all available sprites
  const allSprites: SpriteInfo[] = [];

  // Official Artwork
  if (pokemon.sprites.other?.officialArtwork?.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.officialArtwork.frontDefault,
        "Official Artwork",
        "公式アートワーク",
        "official",
      )!,
    );
  }

  if (pokemon.sprites.other?.officialArtwork?.frontShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.officialArtwork.frontShiny,
        "Shiny Official Artwork",
        "色違い公式アートワーク",
        "official",
      )!,
    );
  }

  // Home Sprites
  if (pokemon.sprites.other?.home?.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.home.frontDefault,
        "Home Front",
        "HOME正面",
        "home",
      )!,
    );
  }

  if (pokemon.sprites.other?.home?.frontShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.home.frontShiny,
        "Home Shiny Front",
        "HOME色違い正面",
        "home",
      )!,
    );
  }

  if (pokemon.sprites.other?.home?.frontFemale) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.home.frontFemale,
        "Home Female",
        "HOME♀",
        "home",
      )!,
    );
  }

  if (pokemon.sprites.other?.home?.frontShinyFemale) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.home.frontShinyFemale,
        "Home Shiny Female",
        "HOME色違い♀",
        "home",
      )!,
    );
  }

  // Dream World Sprites
  if (pokemon.sprites.other?.dreamWorld?.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.dreamWorld.frontDefault,
        "Dream World",
        "ポケモンドリームワールド",
        "dreamWorld",
      )!,
    );
  }

  if (pokemon.sprites.other?.dreamWorld?.frontFemale) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.dreamWorld.frontFemale,
        "Dream World Female",
        "ポケモンドリームワールド♀",
        "dreamWorld",
      )!,
    );
  }

  // Showdown Sprites
  if (pokemon.sprites.other?.showdown?.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.showdown.frontDefault,
        "Showdown Front",
        "Showdown正面",
        "showdown",
      )!,
    );
  }

  if (pokemon.sprites.other?.showdown?.backDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.showdown.backDefault,
        "Showdown Back",
        "Showdown背面",
        "showdown",
      )!,
    );
  }

  if (pokemon.sprites.other?.showdown?.frontShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.showdown.frontShiny,
        "Showdown Shiny Front",
        "Showdown色違い正面",
        "showdown",
      )!,
    );
  }

  if (pokemon.sprites.other?.showdown?.backShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.showdown.backShiny,
        "Showdown Shiny Back",
        "Showdown色違い背面",
        "showdown",
      )!,
    );
  }

  // Default Game Sprites
  if (pokemon.sprites.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.frontDefault,
        "Game Front",
        "ゲーム正面",
        "game",
      )!,
    );
  }

  if (pokemon.sprites.backDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.backDefault,
        "Game Back",
        "ゲーム背面",
        "game",
      )!,
    );
  }

  if (pokemon.sprites.frontShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.frontShiny,
        "Game Shiny Front",
        "ゲーム色違い正面",
        "game",
      )!,
    );
  }

  if (pokemon.sprites.backShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.backShiny,
        "Game Shiny Back",
        "ゲーム色違い背面",
        "game",
      )!,
    );
  }

  if (pokemon.sprites.frontFemale) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.frontFemale,
        "Game Female Front",
        "ゲーム♀正面",
        "game",
      )!,
    );
  }

  if (pokemon.sprites.backFemale) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.backFemale,
        "Game Female Back",
        "ゲーム♀背面",
        "game",
      )!,
    );
  }

  // Generation V Animated Sprites
  if (
    pokemon.sprites.versions?.generationV?.blackWhite?.animated?.frontDefault
  ) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationV.blackWhite.animated.frontDefault,
        "Animated Front (Gen V)",
        "アニメーション正面 (第5世代)",
        "animated",
      )!,
    );
  }

  if (
    pokemon.sprites.versions?.generationV?.blackWhite?.animated?.backDefault
  ) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationV.blackWhite.animated.backDefault,
        "Animated Back (Gen V)",
        "アニメーション背面 (第5世代)",
        "animated",
      )!,
    );
  }

  if (pokemon.sprites.versions?.generationV?.blackWhite?.animated?.frontShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationV.blackWhite.animated.frontShiny,
        "Animated Shiny Front (Gen V)",
        "アニメーション色違い正面 (第5世代)",
        "animated",
      )!,
    );
  }

  if (pokemon.sprites.versions?.generationV?.blackWhite?.animated?.backShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationV.blackWhite.animated.backShiny,
        "Animated Shiny Back (Gen V)",
        "アニメーション色違い背面 (第5世代)",
        "animated",
      )!,
    );
  }

  // Generation VII Icons
  if (pokemon.sprites.versions?.generationVII?.icons?.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationVII.icons.frontDefault,
        "Icon (Gen VII)",
        "アイコン (第7世代)",
        "icons",
      )!,
    );
  }

  if (pokemon.sprites.versions?.generationVII?.icons?.frontFemale) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationVII.icons.frontFemale,
        "Female Icon (Gen VII)",
        "♀アイコン (第7世代)",
        "icons",
      )!,
    );
  }

  // Generation VI Sprites
  if (pokemon.sprites.versions?.generationVI?.xy?.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationVI.xy.frontDefault,
        "X/Y Front",
        "X/Y正面",
        "xy",
      )!,
    );
  }

  if (pokemon.sprites.versions?.generationVI?.xy?.frontShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationVI.xy.frontShiny,
        "X/Y Shiny Front",
        "X/Y色違い正面",
        "xy",
      )!,
    );
  }

  // Categories for filtering
  const categories = [
    {
      id: "official",
      label: text.officialArtwork,
    },
    { id: "home", label: text.pokemonHome },
    {
      id: "game",
      label: text.gameSprites,
    },
    {
      id: "animated",
      label: text.animated,
    },
    {
      id: "dreamWorld",
      label: text.dreamWorld,
    },
    {
      id: "showdown",
      label: text.showdown,
    },
    { id: "xy", label: language === "en" ? "X/Y" : "X/Y" },
    { id: "icons", label: text.icons },
  ].filter((category) =>
    allSprites.some((sprite) => sprite.category === category.id),
  );

  const filteredSprites =
    selectedCategory === "all"
      ? allSprites
      : allSprites.filter((sprite) => sprite.category === selectedCategory);

  const renderTabContent = () => {
    switch (activeContentTab) {
      case "sprites":
        return (
          <div>
            {/* Category Filter Tabs */}
            {categories.length > 1 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sprites Grid */}
            {filteredSprites.length > 0 ? (
              <div
                className={`grid gap-4 ${
                  selectedCategory === "official"
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                }`}
              >
                {filteredSprites.map((sprite, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 text-center"
                  >
                    <div
                      className={`relative mx-auto mb-3 ${
                        selectedCategory === "official"
                          ? "w-48 h-48"
                          : selectedCategory === "animated"
                            ? "w-32 h-32"
                            : "w-24 h-24"
                      }`}
                    >
                      <Image
                        src={sprite.url}
                        alt={`${pokemon.name} ${sprite.label}`}
                        fill
                        className="object-contain"
                        sizes={
                          selectedCategory === "official"
                            ? "192px"
                            : selectedCategory === "animated"
                              ? "128px"
                              : "96px"
                        }
                        unoptimized={selectedCategory === "animated"} // For animated GIFs
                      />
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {sprite.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DataEmptyState
                type="sprites"
                language={language}
                customMessage={text.noSpritesAvailable}
              />
            )}
          </div>
        );

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
