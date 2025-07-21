"use client";

import { Locale, Dictionary } from "@/lib/dictionaries";
import { usePokemonEvolution } from "@/hooks/usePokemonEvolution";
import { PokemonEvolutionChain } from "./PokemonEvolutionChain";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import { Pokemon } from "@/types/pokemon";
import { shouldUseCardEvolutionLayout } from "@/lib/data/branchEvolutionChains";

interface PokemonEvolutionChainWrapperProps {
  pokemonId: string;
  lang: Locale;
  dictionary: Dictionary;
  isActive?: boolean;
  pokemon?: Pokemon; // Current Pokemon data for fallback display
}

export function PokemonEvolutionChainWrapper({
  pokemonId,
  lang,
  dictionary,
  isActive = false,
  pokemon,
}: PokemonEvolutionChainWrapperProps) {
  const { evolutionChain, loading, error, refetch } = usePokemonEvolution(
    pokemonId,
    isActive,
  );

  // Debug logging
  console.log("[Evolution Wrapper] Component state:", {
    pokemonId,
    isActive,
    loading,
    hasEvolutionChain: !!evolutionChain,
    hasError: !!error,
  });

  // Log detailed error information for debugging
  if (error) {
    console.log("[Evolution] Error loading evolution chain:", {
      pokemonId,
      error: error.message || error,
      graphQLErrors: "graphQLErrors" in error ? error.graphQLErrors : undefined,
      networkError: "networkError" in error ? error.networkError : undefined,
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {dictionary.ui.pokemonDetails.evolutionChain}
      </h2>

      {loading && isActive ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">
            {dictionary?.ui.error.evolutionChainError ||
              "Error loading evolution data"}
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="text-sm text-gray-500 mb-4">
              <p>Pokemon ID: {pokemonId}</p>
              <p>Error: {error.message || "Unknown error"}</p>
            </div>
          )}
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {dictionary?.ui.error.tryAgain || "Try Again"}
          </button>
        </div>
      ) : !evolutionChain && pokemon && pokemon.species ? (
        // Show single Pokemon if no evolution chain exists
        <PokemonEvolutionChain
          evolutionChain={{
            id: pokemon.id,
            name: pokemon.name,
            sprites: pokemon.sprites,
            types: pokemon.types,
            species: pokemon.species,
            evolvesTo: [],
          }}
          lang={lang}
          dictionary={dictionary}
          variant={
            pokemon && shouldUseCardEvolutionLayout(pokemon)
              ? "card"
              : "default"
          }
        />
      ) : !evolutionChain ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">
            {dictionary?.ui.emptyStates.evolution ||
              "No evolution data available"}
          </p>
          <p className="text-sm text-gray-400">
            {dictionary?.ui.emptyStates.evolutionSoon ||
              "Evolution data will be available soon"}
          </p>
        </div>
      ) : (
        <PokemonEvolutionChain
          evolutionChain={evolutionChain}
          lang={lang}
          dictionary={dictionary}
          variant={
            pokemon && shouldUseCardEvolutionLayout(pokemon)
              ? "card"
              : "default"
          }
        />
      )}
    </div>
  );
}
