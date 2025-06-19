'use client';

import { useAppSelector } from '@/store/hooks';
import { Pokemon } from '@/types/pokemon';
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
}

export default function PokemonDetailClient({ pokemon }: PokemonDetailClientProps) {
  const { language } = useAppSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-gray-50">
      <PokemonDetailHeader language={language} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <PokemonBasicInfo pokemon={pokemon} language={language} />

        {/* Description Section */}
        {pokemon.species && (
          <PokemonDetailSection title={language === 'en' ? 'Pokédex Entry' : 'ポケモン図鑑'}>
            <PokemonDescription
              pokemon={pokemon}
              language={language}
            />
          </PokemonDetailSection>
        )}

        {/* Stats Section */}
        <PokemonDetailSection title={language === 'en' ? 'Base Stats' : '基礎ステータス'}>
          <PokemonStats stats={pokemon.stats} />
        </PokemonDetailSection>

        {/* Moves Section */}
        {pokemon.moves && pokemon.moves.length > 0 && (
          <PokemonDetailSection title={language === 'en' ? 'Moves' : '覚える技'}>
            <PokemonMoves moves={pokemon.moves} language={language} />
          </PokemonDetailSection>
        )}

        {/* Game History Section */}
        {pokemon.gameIndices && pokemon.gameIndices.length > 0 && (
          <PokemonDetailSection title={language === 'en' ? 'Game History' : 'ゲーム出現履歴'}>
            <PokemonGameHistory
              gameIndices={pokemon.gameIndices}
              generation={pokemon.species?.generation}
              language={language}
            />
          </PokemonDetailSection>
        )}

        <PokemonSpritesGallery pokemon={pokemon} language={language} />
      </div>
    </div>
  );
}