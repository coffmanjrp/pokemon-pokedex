"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Pokemon } from "@/types/pokemon";
import {
  getPokemonName,
  getPokemonDescription,
  getPokemonGenus,
  getPokemonWeaknesses,
  isPokemonVariant,
  getPrevNextPokemonId,
} from "@/lib/pokemonUtils";
import { PokemonNavigation } from "./PokemonNavigation";
import { PokemonHeader } from "./PokemonHeader";
import { PokemonImageDisplay } from "./PokemonImageDisplay";
import { PokemonVersionToggle } from "./PokemonVersionToggle";
import { PokemonStorySection } from "./PokemonStorySection";
import { PokemonBasicInfoGrid } from "./PokemonBasicInfoGrid";
import { PokemonWeaknessSection } from "./PokemonWeaknessSection";
import { PokemonStatsSection } from "./PokemonStatsSection";
import { Locale, Dictionary } from "@/lib/dictionaries";

interface PokemonBasicInfoProps {
  pokemon: Pokemon;
  language: Locale;
  dictionary: Dictionary;
}

function PokemonBasicInfoContent({
  pokemon,
  language,
  dictionary,
}: PokemonBasicInfoProps) {
  const [isShiny, setIsShiny] = useState(false);
  const searchParams = useSearchParams();
  const fromGeneration = searchParams.get("from");

  const displayName = getPokemonName(pokemon, language);
  const isVariant = isPokemonVariant(pokemon);
  const description = getPokemonDescription(pokemon, language);
  const genus = getPokemonGenus(pokemon, language);
  const weaknesses = getPokemonWeaknesses(pokemon);
  const { prevId, nextId } = getPrevNextPokemonId(parseInt(pokemon.id));

  return (
    <div className="bg-gray-50 relative">
      {/* Page-level Navigation */}
      <PokemonNavigation
        prevId={prevId}
        nextId={nextId}
        language={language}
        fromGeneration={fromGeneration}
        isVariant={isVariant}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-8 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        {/* Left Side - Pokemon Image (3/5 columns) */}
        <div className="lg:col-span-3 flex flex-col relative order-1 lg:order-1">
          {/* Pokemon Header - Name, Number, Form, Types */}
          <PokemonHeader
            pokemon={pokemon}
            displayName={displayName}
            language={language}
            dictionary={dictionary}
          />

          {/* Pokemon Image Container */}
          <PokemonImageDisplay
            pokemon={pokemon}
            displayName={displayName}
            isShiny={isShiny}
          />
        </div>

        {/* Right Side - Information Panel (2/5 columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 order-2 lg:order-2">
          {/* Story Section */}
          <PokemonStorySection
            description={description}
            dictionary={dictionary}
          />

          {/* Versions Section - Normal/Shiny Toggle */}
          <PokemonVersionToggle
            isShiny={isShiny}
            onToggle={setIsShiny}
            dictionary={dictionary}
          />

          {/* Basic Info Grid */}
          <PokemonBasicInfoGrid
            pokemon={pokemon}
            genus={genus}
            language={language}
            dictionary={dictionary}
          />

          {/* Weaknesses Section */}
          <PokemonWeaknessSection
            weaknesses={weaknesses}
            dictionary={dictionary}
          />

          {/* Stats Section */}
          <PokemonStatsSection pokemon={pokemon} dictionary={dictionary} />
        </div>
      </div>
    </div>
  );
}

export function PokemonBasicInfo({
  pokemon,
  language,
  dictionary,
}: PokemonBasicInfoProps) {
  return (
    <Suspense fallback={<div>Loading Pokemon details...</div>}>
      <PokemonBasicInfoContent
        pokemon={pokemon}
        language={language}
        dictionary={dictionary}
      />
    </Suspense>
  );
}
