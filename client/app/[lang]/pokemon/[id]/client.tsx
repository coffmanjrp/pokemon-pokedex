'use client';

import { Pokemon } from '@/types/pokemon';
import { Dictionary, Locale } from '@/lib/dictionaries';
import { PokemonBasicInfo } from '@/components/ui/PokemonBasicInfo';
import { PokemonStats } from '@/components/ui/PokemonStats';
import { PokemonDescription } from '@/components/ui/PokemonDescription';
import { PokemonMoves } from '@/components/ui/PokemonMoves';
import { PokemonGameHistory } from '@/components/ui/PokemonGameHistory';
import { PokemonSpritesGallery } from '@/components/ui/PokemonSpritesGallery';
import { PokemonDetailHeader } from '@/components/ui/PokemonDetailHeader';
import { PokemonDetailSection } from '@/components/ui/PokemonDetailSection';

interface PokemonDetailClientProps {
  pokemon: Pokemon;
  dictionary: Dictionary;
  lang: Locale;
}

export default function PokemonDetailClient({ pokemon, dictionary, lang }: PokemonDetailClientProps) {
  return (
    <>
      <PokemonDetailHeader language={lang} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <PokemonBasicInfo pokemon={pokemon} language={lang} />

        {/* Description Section */}
        {pokemon.species && (
          <PokemonDetailSection title={dictionary.ui.pokemonDetails.description}>
            <PokemonDescription
              pokemon={pokemon}
              language={lang}
            />
          </PokemonDetailSection>
        )}

        {/* Stats Section */}
        <PokemonDetailSection title={dictionary.ui.pokemonDetails.stats}>
          <PokemonStats stats={pokemon.stats} />
        </PokemonDetailSection>

        {/* Moves Section */}
        {pokemon.moves && pokemon.moves.length > 0 && (
          <PokemonDetailSection title={dictionary.ui.pokemonDetails.moves}>
            <PokemonMoves moves={pokemon.moves} language={lang} />
          </PokemonDetailSection>
        )}

        {/* Game History Section */}
        {pokemon.gameIndices && pokemon.gameIndices.length > 0 && (
          <PokemonDetailSection title={dictionary.ui.pokemonDetails.gameHistory}>
            <PokemonGameHistory
              gameIndices={pokemon.gameIndices}
              generation={pokemon.species?.generation}
              language={lang}
            />
          </PokemonDetailSection>
        )}

        <PokemonSpritesGallery pokemon={pokemon} language={lang} />
      </div>
    </>
  );
}