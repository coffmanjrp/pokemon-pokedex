import { supabase, handleSupabaseError } from "@/lib/supabase";
import type { EvolutionChain } from "@/types/pokemon";
import type { Database } from "@/types/supabase";

// Transform Supabase evolution data to match our EvolutionChain type
function transformSupabaseEvolution(
  data: Database["public"]["Tables"]["evolution_chains"]["Row"],
): EvolutionChain {
  // Type assertion after validation
  return data.chain_data as unknown as EvolutionChain;
}

// Get evolution chain by ID
export async function getEvolutionChainById(id: number) {
  try {
    console.log(`[Evolution] Fetching evolution chain with ID: ${id}`);

    const { data, error } = await supabase
      .from("evolution_chains")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // Log error details quietly
      console.log(`[Evolution] Error fetching evolution chain ${id}:`, {
        code: error.code,
        message: error.message,
        details: error.details,
      });

      // Check if the evolution chain doesn't exist
      if (error.code === "PGRST116") {
        console.log(`[Evolution] Evolution chain ${id} not found in database`);
        return null;
      }

      // For now, return null instead of throwing error when evolution chain is missing
      console.log(`[Evolution] Evolution chain ${id} not available yet`);
      return null;
    }

    console.log(`[Evolution] Retrieved evolution chain data:`, data);
    return data ? transformSupabaseEvolution(data) : null;
  } catch (error) {
    console.log(
      "[Evolution] Unexpected error in getEvolutionChainById:",
      error,
    );
    return null;
  }
}

// Get evolution chain for a Pokemon
export async function getEvolutionChainForPokemon(pokemonId: number) {
  try {
    console.log(
      `[Evolution] Fetching evolution chain for Pokemon ID: ${pokemonId}`,
    );

    // First, get the Pokemon to find its species evolution chain ID
    const { data: pokemonData, error: pokemonError } = await supabase
      .from("pokemon")
      .select("species_data")
      .eq("id", pokemonId)
      .single();

    if (pokemonError) {
      console.log(
        `[Evolution] Error fetching Pokemon species data for ID ${pokemonId}:`,
        pokemonError,
      );
      return null;
    }

    console.log(`[Evolution] Species data:`, pokemonData?.species_data);

    // Type assertion to access nested properties
    const speciesData = pokemonData?.species_data as Record<string, unknown>;
    const evolutionChain = speciesData?.evolution_chain as
      | { url?: string }
      | undefined;
    const evolutionChainUrl = evolutionChain?.url;

    if (!evolutionChainUrl) {
      console.log(
        `[Evolution] No evolution chain URL found for Pokemon ${pokemonId}`,
      );
      return null;
    }

    const evolutionChainId = evolutionChainUrl.split("/").slice(-2, -1)[0];

    if (!evolutionChainId) {
      console.log(
        `[Evolution] Could not extract evolution chain ID from URL: ${evolutionChainUrl}`,
      );
      return null;
    }

    console.log(`[Evolution] Found evolution chain ID: ${evolutionChainId}`);
    return getEvolutionChainById(parseInt(evolutionChainId));
  } catch (error) {
    console.log(
      "[Evolution] Unexpected error in getEvolutionChainForPokemon:",
      error,
    );
    return null;
  }
}

// Get all evolution chains (for caching purposes)
export async function getAllEvolutionChains() {
  try {
    const { data, error } = await supabase
      .from("evolution_chains")
      .select("*")
      .order("id");

    if (error) {
      console.log("[Evolution] Error fetching all evolution chains:", error);
      throw new Error(handleSupabaseError(error));
    }

    return data?.map(transformSupabaseEvolution) || [];
  } catch (error) {
    console.log("[Evolution] Error in getAllEvolutionChains:", error);
    throw error;
  }
}
