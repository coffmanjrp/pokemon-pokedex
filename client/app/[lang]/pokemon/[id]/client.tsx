'use client';

import { Pokemon } from '@/types/pokemon';
import { Locale } from '@/lib/dictionaries';
import { PokemonDetailHeader } from '@/components/ui/PokemonDetailHeader';
import { PokemonTopNavigationTabs } from '@/components/ui/PokemonTopNavigationTabs';

interface PokemonDetailClientProps {
  pokemon: Pokemon;
  lang: Locale;
}

export default function PokemonDetailClient({ pokemon, lang }: PokemonDetailClientProps) {
  return (
    <>
      <PokemonDetailHeader language={lang} />
      
      {/* Top Navigation Tabs with Content */}
      <PokemonTopNavigationTabs 
        pokemon={pokemon} 
        lang={lang} 
      />
    </>
  );
}