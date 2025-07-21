import React from "react";
import Image from "next/image";
import { EvolutionDetail } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { getPokemonName } from "@/lib/pokemonUtils";
import { getTypeColor } from "@/lib/utils";

interface EvolutionCardProps {
  pokemon: EvolutionDetail;
  dictionary: Dictionary;
  lang: Locale;
  size?: "sm" | "md" | "lg";
  showId?: boolean;
}

export function EvolutionCard({
  pokemon,
  dictionary,
  lang,
  size = "md",
  showId = true,
}: EvolutionCardProps) {
  const sizeConfig = {
    sm: { card: "w-24", image: 64, text: "text-xs" },
    md: { card: "w-32", image: 96, text: "text-sm" },
    lg: { card: "w-40", image: 128, text: "text-base" },
  };

  const config = sizeConfig[size];
  const pokemonName = getPokemonName(pokemon, lang, dictionary);
  const typeColor = pokemon.types?.[0]
    ? getTypeColor(pokemon.types[0].type.name)
    : "gray";

  return (
    <div
      className={`${config.card} bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2`}
      style={{ borderColor: typeColor }}
    >
      <div className="p-2 text-center">
        {showId && (
          <div className={`${config.text} text-gray-500 mb-1`}>
            #{pokemon.id.padStart(3, "0")}
          </div>
        )}
        <div
          className="relative mx-auto mb-2"
          style={{ width: config.image, height: config.image }}
        >
          {pokemon.sprites?.frontDefault ? (
            <Image
              src={pokemon.sprites.frontDefault}
              alt={pokemonName}
              width={config.image}
              height={config.image}
              className="pixelated"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded" />
          )}
        </div>
        <div className={`${config.text} font-medium`}>{pokemonName}</div>
        <div className="flex gap-1 justify-center mt-1">
          {pokemon.types?.map((typeSlot) => (
            <span
              key={typeSlot.type.name}
              className={`px-2 py-0.5 rounded text-white ${config.text}`}
              style={{ backgroundColor: getTypeColor(typeSlot.type.name) }}
            >
              {dictionary.ui.types[
                typeSlot.type.name as keyof typeof dictionary.ui.types
              ] || typeSlot.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
