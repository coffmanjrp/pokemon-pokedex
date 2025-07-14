import { useLazyQuery, ApolloError } from "@apollo/client";
import { GET_POKEMON_EVOLUTION } from "@/graphql/queries";
import { EvolutionDetail } from "@/types/pokemon";
import { useEffect } from "react";

interface UsePokemonEvolutionResult {
  evolutionChain: EvolutionDetail | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
}

export function usePokemonEvolution(
  pokemonId: string,
  enabled: boolean = true,
): UsePokemonEvolutionResult {
  const [fetchEvolution, { data, loading, error, refetch }] = useLazyQuery(
    GET_POKEMON_EVOLUTION,
    {
      variables: { id: pokemonId },
      fetchPolicy: "cache-first",
    },
  );

  useEffect(() => {
    if (enabled && pokemonId) {
      fetchEvolution();
    }
  }, [enabled, pokemonId, fetchEvolution]);

  return {
    evolutionChain: data?.pokemon?.species?.evolutionChain?.chain,
    loading,
    error,
    refetch: refetch || (() => {}),
  };
}
