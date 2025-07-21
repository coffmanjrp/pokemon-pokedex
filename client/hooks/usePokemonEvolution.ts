import { useEffect, useState } from "react";
import type { EvolutionDetail } from "@/types/pokemon";

interface UsePokemonEvolutionResult {
  evolutionChain: EvolutionDetail | undefined;
  loading: boolean;
  error: Error | undefined;
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
  // Supabase state
  const [evolutionChain, setEvolutionChain] = useState<
    EvolutionDetail | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const fetchEvolution = async () => {
    if (!enabled || !pokemonId) return;

    setLoading(true);
    setError(undefined);

    try {
      console.log(
        `[Supabase Evolution] Fetching evolution for Pokemon ${pokemonId}`,
      );

      // Dynamic import to avoid circular dependency in development
      const { getEvolutionChainOptimized, getEvolutionChainForForm } =
        await import("@/lib/supabase/evolutionOptimized");

      const pokemonIdNum = parseInt(pokemonId);
      let rawChain;

      // Check if this is a Generation 0 form Pokemon (ID >= 10000)
      if (pokemonIdNum >= 10000) {
        console.log(
          `[Supabase Evolution] Detected Generation 0 form Pokemon ${pokemonIdNum}, using form-specific query`,
        );
        rawChain = await getEvolutionChainForForm(pokemonIdNum);
      } else {
        // Get raw evolution chain data using optimized query for regular Pokemon
        rawChain = await getEvolutionChainOptimized(pokemonIdNum);
      }

      if (!rawChain) {
        console.log(
          `[Supabase Evolution] No evolution chain found for Pokemon ${pokemonId}`,
        );
        setEvolutionChain(undefined);
        return;
      }

      console.log(`[Supabase Evolution] Raw chain data received:`, rawChain);

      // Transform to match GraphQL structure
      const transformed = await transformEvolutionChain(rawChain);

      console.log(`[Supabase Evolution] Transformed chain:`, transformed);

      if (transformed) {
        setEvolutionChain(transformed);
      } else {
        throw new Error("Failed to transform evolution chain data");
      }
    } catch (err) {
      console.error("[Supabase Evolution] Error:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvolution();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, pokemonId]);

  return {
    evolutionChain,
    loading,
    error,
    refetch: fetchEvolution,
  };
}
