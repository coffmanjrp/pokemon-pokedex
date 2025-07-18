"use client";

import { Locale, Dictionary } from "@/lib/dictionaries";
import { usePokemonEvolution } from "@/hooks/usePokemonEvolution";
import { PokemonEvolutionChain } from "./PokemonEvolutionChain";
import { LoadingSpinner } from "../../common/LoadingSpinner";

interface PokemonEvolutionChainWrapperProps {
  pokemonId: string;
  lang: Locale;
  dictionary: Dictionary;
  isActive?: boolean;
}

export function PokemonEvolutionChainWrapper({
  pokemonId,
  lang,
  dictionary,
  isActive = false,
}: PokemonEvolutionChainWrapperProps) {
  const { evolutionChain, loading, error, refetch } = usePokemonEvolution(
    pokemonId,
    isActive,
  );

  if (loading && isActive) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    // Log detailed error information for debugging
    console.error("Error loading evolution chain:", {
      pokemonId,
      error: error.message || error,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError,
    });

    return (
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
    );
  }

  if (!evolutionChain) {
    return null;
  }

  return (
    <PokemonEvolutionChain
      evolutionChain={evolutionChain}
      lang={lang}
      dictionary={dictionary}
    />
  );
}
