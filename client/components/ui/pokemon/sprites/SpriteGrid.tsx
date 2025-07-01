"use client";

import { useState } from "react";
import { SpriteInfo, SpriteCategory } from "@/lib/spriteCollector";
import { SpriteCard } from "./SpriteCard";
import { DataEmptyState } from "../../common/DataEmptyState";
import { Locale } from "@/lib/dictionaries";

interface SpriteGridProps {
  sprites: SpriteInfo[];
  categories: SpriteCategory[];
  pokemonName: string;
  language: Locale;
  noSpritesMessage: string;
}

export function SpriteGrid({
  sprites,
  categories,
  pokemonName,
  language,
  noSpritesMessage,
}: SpriteGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("official");

  // Filter sprites based on selected category
  const filteredSprites =
    selectedCategory === "all"
      ? sprites
      : sprites.filter((sprite) => sprite.category === selectedCategory);

  // Determine grid layout based on category
  const getGridClassName = () => {
    if (selectedCategory === "official") {
      return "grid-cols-1 md:grid-cols-2";
    }
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

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
        <div className={`grid gap-4 ${getGridClassName()}`}>
          {filteredSprites.map((sprite, index) => (
            <SpriteCard
              key={index}
              sprite={sprite}
              pokemonName={pokemonName}
              selectedCategory={selectedCategory}
            />
          ))}
        </div>
      ) : (
        <DataEmptyState
          type="sprites"
          language={language}
          customMessage={noSpritesMessage}
        />
      )}
    </div>
  );
}
