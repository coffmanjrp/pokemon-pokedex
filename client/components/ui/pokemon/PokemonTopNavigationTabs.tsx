"use client";

import { Pokemon } from "@/types/pokemon";
import { Locale } from "@/lib/dictionaries";
import { PokemonBasicInfo } from "./PokemonBasicInfo";
import { PokemonSpritesGallery } from "./sprites/PokemonSpritesGallery";
import { PokemonEvolutionChain } from "./evolution/PokemonEvolutionChain";

interface PokemonTopNavigationTabsProps {
  pokemon: Pokemon;
  lang: Locale;
}

export function PokemonTopNavigationTabs({
  pokemon,
  lang,
}: PokemonTopNavigationTabsProps) {
  const renderTabContent = () => {
    return (
      <div className="space-y-8">
        {/* Pokemon Basic Info - Hero Section */}
        <PokemonBasicInfo pokemon={pokemon} language={lang as Locale} />

        {/* Evolution Chain Section - Between Hero and Sprites */}
        {pokemon.species?.evolutionChain?.chain && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
              <PokemonEvolutionChain
                evolutionChain={pokemon.species.evolutionChain.chain}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* Sprites Gallery with embedded tabs */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-4 md:pb-8">
          <PokemonSpritesGallery pokemon={pokemon} language={lang as Locale} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Direct Content - About tab content only */}
      {renderTabContent()}
    </div>
  );
}
