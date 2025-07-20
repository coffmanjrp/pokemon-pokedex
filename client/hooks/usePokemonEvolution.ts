import { useLazyQuery, ApolloError } from "@apollo/client";
import { GET_POKEMON_EVOLUTION } from "@/graphql/queries";
import { EvolutionDetail } from "@/types/pokemon";
import { useEffect } from "react";
import { useSupabasePokemonEvolution } from "@/hooks/supabase/usePokemonEvolution";

interface UsePokemonEvolutionResult {
  evolutionChain: EvolutionDetail | undefined;
  loading: boolean;
  error: ApolloError | Error | undefined;
  refetch: () => void;
}

export function usePokemonEvolution(
  pokemonId: string,
  enabled: boolean = true,
): UsePokemonEvolutionResult {
  // Check if Supabase mode is enabled
  const useSupabase =
    process.env.NEXT_PUBLIC_USE_SUPABASE_FOR_DETAIL === "true";

  // GraphQL hook
  const [
    fetchEvolution,
    {
      data,
      loading: graphqlLoading,
      error: graphqlError,
      refetch: graphqlRefetch,
    },
  ] = useLazyQuery(GET_POKEMON_EVOLUTION, {
    variables: { id: pokemonId },
    fetchPolicy: "cache-first",
  });

  // Supabase hook
  const {
    evolutionChain: supabaseEvolutionChain,
    loading: supabaseLoading,
    error: supabaseError,
    refetch: supabaseRefetch,
  } = useSupabasePokemonEvolution(pokemonId, enabled && useSupabase);

  useEffect(() => {
    if (enabled && pokemonId && !useSupabase) {
      fetchEvolution();
    }
  }, [enabled, pokemonId, fetchEvolution, useSupabase]);

  // Return appropriate data based on mode
  if (useSupabase) {
    return {
      evolutionChain: supabaseEvolutionChain,
      loading: supabaseLoading,
      error: supabaseError,
      refetch: supabaseRefetch,
    };
  }

  return {
    evolutionChain: data?.pokemon?.species?.evolutionChain?.chain,
    loading: graphqlLoading,
    error: graphqlError,
    refetch: graphqlRefetch || (() => {}),
  };
}
