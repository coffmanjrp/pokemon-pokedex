import Image from "next/image";
import React from "react";
import { EvolutionDetail, PokemonTypeSlot } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { getTypeName, getEvolutionPokemonName } from "@/lib/pokemonUtils";
import { POKEMON_TYPE_COLORS } from "@/types/pokemon";

interface EvolutionCardProps {
  pokemon: EvolutionDetail;
  lang: Locale;
  onClick: (e: React.MouseEvent, pokemon: EvolutionDetail) => void;
  dictionary: Dictionary | null;
  fallback: string;
}

export function EvolutionCard({
  pokemon,
  lang,
  onClick,
  dictionary,
  fallback,
}: EvolutionCardProps) {
  const pokemonName = getEvolutionPokemonName(pokemon, lang);
  const pokemonId = pokemon.id || "0";
  const imageUrl =
    pokemon.sprites?.other?.officialArtwork?.frontDefault ||
    pokemon.sprites?.frontDefault;

  return (
    <div
      onClick={(e) => onClick(e, pokemon)}
      className="group flex flex-col items-center p-3 md:p-4 bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-105 hover:-translate-y-1 transition-all duration-200 border border-gray-100 hover:border-blue-200 cursor-pointer"
    >
      {/* Pokemon Image */}
      <div className="relative w-24 h-24 md:w-28 md:h-28 mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={pokemonName}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-xs">
              {dictionary?.ui.pokemonDetails.noImage || fallback}
            </span>
          </div>
        )}
      </div>

      {/* Pokemon Info */}
      <div className="text-center">
        <p className="text-sm text-gray-500 font-medium">
          #{pokemonId.padStart(3, "0")}
        </p>
        <p className="font-semibold text-gray-900">{pokemonName}</p>

        {/* Types */}
        <div className="flex gap-1 mt-2 justify-center">
          {pokemon.types &&
            pokemon.types.map((typeInfo: PokemonTypeSlot) => (
              <span
                key={typeInfo.type.name}
                className="px-2 py-1 rounded-full text-xs font-medium text-white"
                style={{
                  backgroundColor:
                    POKEMON_TYPE_COLORS[
                      typeInfo.type.name as keyof typeof POKEMON_TYPE_COLORS
                    ],
                }}
              >
                {dictionary
                  ? getTypeName(typeInfo.type.name, dictionary)
                  : typeInfo.type.name}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
