"use client";

import { Pokemon } from "@/types/pokemon";
import { getAbilityName, getGenderDisplayElement } from "@/lib/pokemonUtils";
import { Locale, Dictionary } from "@/lib/dictionaries";
import { FaMars, FaVenus } from "react-icons/fa";

interface PokemonBasicInfoGridProps {
  pokemon: Pokemon;
  genus: string | null;
  language: Locale;
  dictionary: Dictionary;
}

export function PokemonBasicInfoGrid({
  pokemon,
  genus,
  language,
  dictionary,
}: PokemonBasicInfoGridProps) {
  // Use dictionary directly from props to ensure server/client consistency
  const text = {
    height: dictionary.ui.pokemonDetails.height,
    weight: dictionary.ui.pokemonDetails.weight,
    abilities: dictionary.ui.pokemonDetails.abilities,
    hidden: dictionary.ui.pokemonDetails.hidden,
    category: dictionary.ui.pokemonDetails.category,
    gender: dictionary.ui.pokemonDetails.gender,
    defaultSpecies: dictionary.ui.pokemonDetails.defaultSpecies,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 bg-gray-50 p-3 md:p-4 rounded-lg">
      <div className="text-center">
        <div className="text-xs text-gray-500 mb-1">{text.height}</div>
        <div className="text-sm font-semibold">
          {(pokemon.height / 10).toFixed(1)}m
        </div>
      </div>

      <div className="text-center">
        <div className="text-xs text-gray-500 mb-1">{text.category}</div>
        <div className="text-sm font-semibold">
          {genus || text.defaultSpecies}
        </div>
      </div>

      <div className="text-center">
        <div className="text-xs text-gray-500 mb-1">{text.gender}</div>
        <div className="text-sm font-semibold">
          {pokemon.species?.genderRate !== undefined &&
          pokemon.species.genderRate !== null ? (
            getGenderDisplayElement(pokemon.species.genderRate, language)
          ) : (
            <>
              <FaMars className="text-blue-600 font-bold inline mr-1" />
              <FaVenus className="text-pink-600 font-bold inline" />
            </>
          )}
        </div>
      </div>

      <div className="text-center">
        <div className="text-xs text-gray-500 mb-1">{text.weight}</div>
        <div className="text-sm font-semibold">
          {(pokemon.weight / 10).toFixed(1)}kg
        </div>
      </div>

      <div className="text-center col-span-2 md:col-span-2">
        <div className="text-xs text-gray-500 mb-1">{text.abilities}</div>
        <div className="text-sm font-semibold flex flex-col gap-1">
          {pokemon.abilities && pokemon.abilities.length > 0
            ? pokemon.abilities.slice(0, 2).map((abilitySlot, index) => (
                <span
                  key={index}
                  className={abilitySlot.isHidden ? "text-yellow-600" : ""}
                >
                  {getAbilityName(abilitySlot.ability, language)}
                  {abilitySlot.isHidden && (
                    <span className="text-xs text-yellow-500 ml-1">
                      ({text.hidden})
                    </span>
                  )}
                </span>
              ))
            : "-"}
        </div>
      </div>
    </div>
  );
}
