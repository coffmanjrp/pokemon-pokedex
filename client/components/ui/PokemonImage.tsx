'use client';

import Image from 'next/image';
import { Pokemon } from '@/types/pokemon';

interface PokemonImageProps {
  pokemon: Pokemon;
  className?: string;
}

export function PokemonImage({ pokemon, className = "relative w-32 h-32 group-hover:scale-110 transition-transform duration-300" }: PokemonImageProps) {
  const getImageUrl = () => {
    return (
      pokemon.sprites.other?.officialArtwork?.frontDefault ||
      pokemon.sprites.other?.home?.frontDefault ||
      pokemon.sprites.frontDefault ||
      '/placeholder-pokemon.png'
    );
  };

  return (
    <div className={className}>
      <Image
        src={getImageUrl()}
        alt={pokemon.name}
        fill
        className="object-contain drop-shadow-lg"
        sizes="(max-width: 768px) 128px, 128px"
        priority={false}
      />
    </div>
  );
}