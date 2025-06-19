'use client';

import { useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';
import { Dictionary, Locale } from '@/lib/dictionaries';
import { getTypeBackgroundGradient } from '@/lib/pokemonUtils';
import { PokemonBasicInfo } from '@/components/ui/PokemonBasicInfo';
import { PokemonDetailTabs } from '@/components/ui/PokemonDetailTabs';
import { PokemonSpritesGallery } from '@/components/ui/PokemonSpritesGallery';
import { PokemonDetailHeader } from '@/components/ui/PokemonDetailHeader';
import { PokemonDetailSection } from '@/components/ui/PokemonDetailSection';
import { PokemonEvolutionChain } from '@/components/ui/PokemonEvolutionChain';

interface PokemonDetailClientProps {
  pokemon: Pokemon;
  dictionary: Dictionary;
  lang: Locale;
}

export default function PokemonDetailClient({ pokemon, dictionary, lang }: PokemonDetailClientProps) {
  const backgroundGradient = getTypeBackgroundGradient(pokemon);

  // Apply background to the parent container that includes layout margins/padding
  useEffect(() => {
    // Look for the layout container with min-h-screen class
    const layoutContainer = document.querySelector('.min-h-screen') as HTMLElement;
    
    if (layoutContainer) {
      // Store original classes and background
      const originalClasses = layoutContainer.className;
      
      // Remove bg-gray-50 class and apply type background
      layoutContainer.classList.remove('bg-gray-50');
      layoutContainer.style.background = backgroundGradient;
      
      // Cleanup on unmount
      return () => {
        layoutContainer.className = originalClasses;
        layoutContainer.style.background = '';
      };
    }
  }, [backgroundGradient]);

  return (
    <>
      <PokemonDetailHeader language={lang} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <PokemonBasicInfo pokemon={pokemon} language={lang} />

        {/* Evolution Chain Section */}
        {pokemon.species?.evolutionChain?.chain && (
          <PokemonDetailSection title={dictionary.ui.pokemonDetails.evolutionChain}>
            <PokemonEvolutionChain 
              evolutionChain={pokemon.species.evolutionChain.chain} 
              dictionary={dictionary}
              lang={lang}
            />
          </PokemonDetailSection>
        )}

        {/* Tabbed Content: Description, Moves, Game History */}
        <PokemonDetailTabs 
          pokemon={pokemon} 
          dictionary={dictionary} 
          language={lang} 
        />

        <PokemonSpritesGallery pokemon={pokemon} language={lang} />
      </div>
    </>
  );
}