import { useLazyQuery, ApolloError } from "@apollo/client";
import { GET_POKEMON_EVOLUTION } from "@/graphql/queries";
import { EvolutionDetail } from "@/types/pokemon";
import { useEffect, useState } from "react";
import { getEvolutionChainForPokemon } from "@/lib/supabase/evolution";

interface UsePokemonEvolutionResult {
  evolutionChain: EvolutionDetail | undefined;
  loading: boolean;
  error: ApolloError | Error | undefined;
  refetch: () => void;
}

interface EvolutionChainData {
  chain?: EvolutionDetail;
}

// No transformation needed - enriched data already matches GraphQL structure
async function transformEvolutionChain(
  evolutionChain: EvolutionChainData,
): Promise<EvolutionDetail | null> {
  // Check if we have the chain data
  const chainNode = evolutionChain?.chain;
  if (!chainNode) {
    console.log("[Supabase Evolution] No chain node found in evolution data");
    return null;
  }

  // Data is already in the correct format from our enriched sync
  return chainNode as EvolutionDetail;
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

  // Supabase state
  const [supabaseEvolutionChain, setSupabaseEvolutionChain] = useState<
    EvolutionDetail | undefined
  >();
  const [supabaseLoading, setSupabaseLoading] = useState(false);
  const [supabaseError, setSupabaseError] = useState<Error | undefined>();

  const fetchSupabaseEvolution = async () => {
    if (!enabled || !pokemonId || !useSupabase) return;

    setSupabaseLoading(true);
    setSupabaseError(undefined);

    try {
      console.log(
        `[Supabase Evolution] Fetching evolution for Pokemon ${pokemonId}`,
      );

      // Get raw evolution chain data
      const rawChain = await getEvolutionChainForPokemon(parseInt(pokemonId));

      if (!rawChain) {
        console.log(
          `[Supabase Evolution] No evolution chain found for Pokemon ${pokemonId}`,
        );
        setSupabaseEvolutionChain(undefined);
        return;
      }

      console.log(`[Supabase Evolution] Raw chain data received:`, rawChain);

      // Transform to match GraphQL structure
      const transformed = await transformEvolutionChain(rawChain);

      console.log(`[Supabase Evolution] Transformed chain:`, transformed);

      if (transformed) {
        setSupabaseEvolutionChain(transformed);
      } else {
        throw new Error("Failed to transform evolution chain data");
      }
    } catch (err) {
      console.error("[Supabase Evolution] Error:", err);
      setSupabaseError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setSupabaseLoading(false);
    }
  };

  useEffect(() => {
    if (enabled && pokemonId) {
      if (useSupabase) {
        fetchSupabaseEvolution();
      } else {
        fetchEvolution();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, pokemonId, useSupabase]);

  // Return appropriate data based on mode
  if (useSupabase) {
    return {
      evolutionChain: supabaseEvolutionChain,
      loading: supabaseLoading,
      error: supabaseError,
      refetch: fetchSupabaseEvolution,
    };
  }

  return {
    evolutionChain: data?.pokemon?.species?.evolutionChain?.chain,
    loading: graphqlLoading,
    error: graphqlError,
    refetch: graphqlRefetch || (() => {}),
  };
}
