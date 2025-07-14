"use client";

import { Locale } from "@/lib/dictionaries";
import { usePokemonMoves } from "@/hooks/usePokemonMoves";
import { PokemonMoves } from "./PokemonMoves";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import { useAppSelector } from "@/store/hooks";

interface PokemonMovesWrapperProps {
  pokemonId: string;
  language: Locale;
  isActive?: boolean;
}

export function PokemonMovesWrapper({
  pokemonId,
  language,
  isActive = false,
}: PokemonMovesWrapperProps) {
  const { moves, loading, error, refetch } = usePokemonMoves(
    pokemonId,
    isActive,
  );
  // Get dictionary from Redux store - must be called at top level
  const { dictionary } = useAppSelector((state) => state.ui);

  if (loading && isActive) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    console.error("Error loading moves:", {
      pokemonId,
      error: error.message || error,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError,
    });

    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">
          {dictionary?.ui.error.movesError || "Error loading moves data"}
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

  return <PokemonMoves moves={moves || []} language={language} />;
}
