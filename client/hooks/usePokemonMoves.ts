import { useLazyQuery, ApolloError } from "@apollo/client";
import { GET_POKEMON_MOVES } from "@/graphql/queries";
import { PokemonMove } from "@/types/pokemon";
import { useEffect } from "react";

interface UsePokemonMovesResult {
  moves: PokemonMove[] | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
}

export function usePokemonMoves(
  pokemonId: string,
  enabled: boolean = true,
): UsePokemonMovesResult {
  const [fetchMoves, { data, loading, error, refetch }] = useLazyQuery(
    GET_POKEMON_MOVES,
    {
      variables: { id: pokemonId },
      fetchPolicy: "cache-first",
    },
  );

  useEffect(() => {
    if (enabled && pokemonId) {
      fetchMoves();
    }
  }, [enabled, pokemonId, fetchMoves]);

  return {
    moves: data?.pokemon?.moves,
    loading,
    error,
    refetch: refetch || (() => {}),
  };
}
