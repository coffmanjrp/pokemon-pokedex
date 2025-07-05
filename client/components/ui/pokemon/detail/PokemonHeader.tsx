"use client";

import { Pokemon } from "@/types/pokemon";
import {
  getPokemonDisplayId,
  shouldDisplayFormSeparately,
  getPokemonBaseName,
  getPokemonFormName,
} from "@/lib/pokemonUtils";
import { PokemonTypes } from "./PokemonTypes";
import { Locale, Dictionary } from "@/lib/dictionaries";
import { PokemonClassificationBadge } from "./PokemonClassificationBadge";

interface PokemonHeaderProps {
  pokemon: Pokemon;
  displayName: string;
  language: Locale;
  dictionary: Dictionary;
}

export function PokemonHeader({
  pokemon,
  displayName,
  language,
  dictionary,
}: PokemonHeaderProps) {
  const displayId = getPokemonDisplayId(pokemon);
  const shouldSeparateForm = shouldDisplayFormSeparately(pokemon);
  const baseName = shouldSeparateForm
    ? getPokemonBaseName(pokemon, language)
    : displayName;
  const formName = shouldSeparateForm
    ? getPokemonFormName(pokemon, language)
    : null;

  return (
    <div className="mb-3">
      <div className="flex items-start justify-between mb-3">
        <h1 className="text-4xl font-bold text-gray-900">
          {baseName}
          <span className="text-2xl text-gray-500 ml-3">
            #{displayId.toString().padStart(3, "0")}
          </span>
        </h1>

        {/* Special Pokemon Classification Badge */}
        <div className="flex-shrink-0 ml-4">
          <PokemonClassificationBadge
            pokemon={pokemon}
            dictionary={dictionary}
            size="lg"
          />
        </div>
      </div>

      {formName && (
        <div className="mb-2">
          <span className="text-2xl font-medium text-gray-600">{formName}</span>
        </div>
      )}
      <div>
        <PokemonTypes
          types={pokemon.types}
          dictionary={dictionary}
          size="lg"
          className="flex gap-2 justify-start mb-2"
        />
      </div>
    </div>
  );
}
