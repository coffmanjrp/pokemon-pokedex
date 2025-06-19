'use client';

import { Pokemon } from '@/types/pokemon';
import { Dictionary, Locale } from '@/lib/dictionaries';
import { PokemonBasicInfo } from '@/components/ui/PokemonBasicInfo';
import { PokemonDetailTabs } from '@/components/ui/PokemonDetailTabs';
import { PokemonSpritesGallery } from '@/components/ui/PokemonSpritesGallery';
import { PokemonDetailHeader } from '@/components/ui/PokemonDetailHeader';
import { PokemonEvolutionChain } from '@/components/ui/PokemonEvolutionChain';

interface PokemonDetailClientProps {
  pokemon: Pokemon;
  dictionary: Dictionary;
  lang: Locale;
}

export default function PokemonDetailClient({ pokemon, dictionary, lang }: PokemonDetailClientProps) {
  // Remove background gradient effect - we'll apply it locally to the image area instead

  return (
    <>
      <PokemonDetailHeader language={lang} />

      {/* New Layout - Full Screen */}
      <PokemonBasicInfo pokemon={pokemon} language={lang} />

      {/* Bottom Sections */}
      <div className="max-w-7xl mx-auto px-8 pb-8">
        {/* Evolution Chain Section */}
        {pokemon.species?.evolutionChain?.chain && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {dictionary.ui.pokemonDetails.evolutionChain}
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <PokemonEvolutionChain 
                evolutionChain={pokemon.species.evolutionChain.chain} 
                dictionary={dictionary}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* Tabbed Content: Description, Moves, Game History */}
        <PokemonDetailTabs 
          pokemon={pokemon} 
          dictionary={dictionary} 
          language={lang} 
        />

        <div className="mt-8">
          <PokemonSpritesGallery pokemon={pokemon} language={lang} />
        </div>
      </div>
    </>
  );
}