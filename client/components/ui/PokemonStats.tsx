'use client';

import { Pokemon } from '@/types/pokemon';

interface PokemonStatsProps {
  pokemon: Pokemon;
}

export function PokemonStats({ pokemon }: PokemonStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
      <div className="flex justify-between">
        <span>Height:</span>
        <span className="font-semibold">{(pokemon.height / 10).toFixed(1)}m</span>
      </div>
      <div className="flex justify-between">
        <span>Weight:</span>
        <span className="font-semibold">{(pokemon.weight / 10).toFixed(1)}kg</span>
      </div>
    </div>
  );
}