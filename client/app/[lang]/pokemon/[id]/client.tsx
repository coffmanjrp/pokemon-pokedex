'use client';

import { Pokemon } from '@/types/pokemon';
import { Locale } from '@/lib/dictionaries';
import { PokemonDetailHeader } from '@/components/ui/pokemon/PokemonDetailHeader';
import { PokemonTopNavigationTabs } from '@/components/ui/pokemon/PokemonTopNavigationTabs';
import { useBackgroundPreload } from '@/hooks/useBackgroundPreload';

interface PokemonDetailClientProps {
  pokemon: Pokemon;
  lang: Locale;
}

export default function PokemonDetailClient({ pokemon, lang }: PokemonDetailClientProps) {
  // Background preload nearby Pokemon
  const { preloadStatus, isPreloading } = useBackgroundPreload({
    currentPokemonId: parseInt(pokemon.id),
    enabled: true,
    delay: 3000, // Start after 3 seconds (while user views details)
    maxConcurrent: 2, // Maximum 2 concurrent requests
    priority: 'low' // Low priority
  });

  return (
    <>
      <PokemonDetailHeader language={lang} />
      
      {/* Top Navigation Tabs with Content */}
      <PokemonTopNavigationTabs 
        pokemon={pokemon} 
        lang={lang} 
      />
      
      {/* Debug indicator (removed in production) */}
      {process.env.NODE_ENV === 'development' && isPreloading && (
        <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm">
          Preloading: {preloadStatus.completed}/{preloadStatus.total}
        </div>
      )}
    </>
  );
}