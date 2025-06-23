'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Pokemon } from '@/types/pokemon';
import { 
  getPokemonName, 
  getPokemonDescription, 
  getPokemonGenus, 
  getPokemonWeaknesses,
  isPokemonVariant,
  getPrevNextPokemonId
} from '@/lib/pokemonUtils';
import { PokemonNavigation } from './pokemon/PokemonNavigation';
import { PokemonHeader } from './pokemon/PokemonHeader';
import { PokemonImageDisplay } from './pokemon/PokemonImageDisplay';
import { PokemonVersionToggle } from './pokemon/PokemonVersionToggle';
import { PokemonStorySection } from './pokemon/PokemonStorySection';
import { PokemonBasicInfoGrid } from './pokemon/PokemonBasicInfoGrid';
import { PokemonWeaknessSection } from './pokemon/PokemonWeaknessSection';
import { PokemonStatsSection } from './pokemon/PokemonStatsSection';

interface PokemonBasicInfoProps {
  pokemon: Pokemon;
  language: 'en' | 'ja';
}

function PokemonBasicInfoContent({ pokemon, language }: PokemonBasicInfoProps) {
  const [isShiny, setIsShiny] = useState(false);
  const searchParams = useSearchParams();
  const fromGeneration = searchParams.get('from');
  
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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-8 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Left Side - Pokemon Image (3/5 columns) */}
        <div className="lg:col-span-3 flex flex-col relative">
          {/* Pokemon Header - Name, Number, Form, Types */}
          <PokemonHeader
            pokemon={pokemon}
            displayName={displayName}
            language={language}
          />

          {/* Pokemon Image Container */}
          <PokemonImageDisplay
            pokemon={pokemon}
            displayName={displayName}
            isShiny={isShiny}
          />
        </div>

        {/* Right Side - Information Panel (2/5 columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* Story Section */}
          <PokemonStorySection
            description={description}
            language={language}
          />

          {/* Versions Section - Normal/Shiny Toggle */}
          <PokemonVersionToggle
            isShiny={isShiny}
            onToggle={setIsShiny}
            language={language}
          />

          {/* Basic Info Grid */}
          <PokemonBasicInfoGrid
            pokemon={pokemon}
            genus={genus}
            language={language}
          />

          {/* Weaknesses Section */}
          <PokemonWeaknessSection
            weaknesses={weaknesses}
            language={language}
          />

          {/* Stats Section */}
          <PokemonStatsSection
            pokemon={pokemon}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}

export function PokemonBasicInfo({ pokemon, language }: PokemonBasicInfoProps) {
  return (
    <Suspense fallback={<div>Loading Pokemon details...</div>}>
      <PokemonBasicInfoContent pokemon={pokemon} language={language} />
    </Suspense>
  );
}