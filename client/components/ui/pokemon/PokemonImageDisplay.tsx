"use client";

import Image from "next/image";
import { Pokemon } from "@/types/pokemon";
import { getPokemonSpriteUrl, getPrimaryTypeColor } from "@/lib/pokemonUtils";

interface PokemonImageDisplayProps {
  pokemon: Pokemon;
  displayName: string;
  isShiny: boolean;
}

export function PokemonImageDisplay({
  pokemon,
  displayName,
  isShiny,
}: PokemonImageDisplayProps) {
  const primaryTypeColor = getPrimaryTypeColor(pokemon);

  return (
    <div className="flex items-center justify-center flex-1">
      <div className="relative">
        {/* Pokemon Image with Background */}
        <div className="w-72 h-72 md:w-96 md:h-96 flex items-center justify-center relative">
          {/* Background circle with type color */}
          <div
            className="absolute inset-0 rounded-full opacity-20 blur-3xl transform scale-150"
            style={{
              backgroundColor: primaryTypeColor,
            }}
          />
          <div
            className="absolute inset-4 rounded-full opacity-10"
            style={{
              backgroundColor: primaryTypeColor,
            }}
          />

          {/* Pokemon Image */}
          <div className="relative w-full h-full z-10">
            <Image
              src={getPokemonSpriteUrl(pokemon, isShiny)}
              alt={`${displayName} ${isShiny ? "(Shiny)" : ""}`}
              fill
              className="object-contain drop-shadow-lg transition-opacity duration-300"
              sizes="384px"
              priority={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
