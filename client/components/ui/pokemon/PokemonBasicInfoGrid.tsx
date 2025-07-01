"use client";

import { Pokemon } from "@/types/pokemon";
import { getAbilityName, getGenderDisplayElement } from "@/lib/pokemonUtils";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";
import { Locale } from "@/lib/dictionaries";

interface PokemonBasicInfoGridProps {
  pokemon: Pokemon;
  genus: string | null;
  language: Locale;
}

export function PokemonBasicInfoGrid({
  pokemon,
  genus,
  language,
}: PokemonBasicInfoGridProps) {
  const { dictionary } = useAppSelector((state) => state.ui);

  const fallback = getFallbackText(language);

  const text = {
    height: dictionary?.ui.pokemonDetails.height || fallback,
    weight: dictionary?.ui.pokemonDetails.weight || fallback,
    abilities: dictionary?.ui.pokemonDetails.abilities || fallback,
    hidden: dictionary?.ui.pokemonDetails.hidden || fallback,
    category: dictionary?.ui.pokemonDetails.category || fallback,
    gender: dictionary?.ui.pokemonDetails.gender || fallback,
    defaultSpecies: dictionary?.ui.pokemonDetails.defaultSpecies || fallback,
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
              <span className="text-blue-600 font-bold">♂</span>{" "}
              <span className="text-pink-600 font-bold">♀</span>
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
