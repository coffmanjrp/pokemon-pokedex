'use client';

import { Pokemon } from '@/types/pokemon';
import { Dictionary, Locale } from '@/lib/dictionaries';
import { PokemonDetailHeader } from '@/components/ui/PokemonDetailHeader';
import { PokemonTopNavigationTabs } from '@/components/ui/PokemonTopNavigationTabs';

interface PokemonDetailClientProps {
  pokemon: Pokemon;
  dictionary: Dictionary;
  lang: Locale;
}

export default function PokemonDetailClient({ pokemon, dictionary, lang }: PokemonDetailClientProps) {
  return (
    <>
      <PokemonDetailHeader language={lang} />
      
      {/* Top Navigation Tabs with Content */}
      <PokemonTopNavigationTabs 
        pokemon={pokemon} 
        dictionary={dictionary} 
        lang={lang} 
      />
    </>
  );
}