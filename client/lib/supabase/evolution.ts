import { supabase, handleSupabaseError } from "@/lib/supabase";
import type { EvolutionChain } from "@/types/pokemon";
import type { Database } from "@/types/supabase";

// Transform Supabase evolution data to match our EvolutionChain type
function transformSupabaseEvolution(
  data: Database["public"]["Tables"]["evolution_chains"]["Row"],
): EvolutionChain {
  return data.chain_data as EvolutionChain;
}

// Get evolution chain by ID
export async function getEvolutionChainById(id: number) {
  try {
    const { data, error } = await supabase
      .from("evolution_chains")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching evolution chain:", error);
      throw new Error(handleSupabaseError(error));
    }

    return data ? transformSupabaseEvolution(data) : null;
  } catch (error) {
    console.error("Error in getEvolutionChainById:", error);
    throw error;
  }
}

// Get evolution chain for a Pokemon
export async function getEvolutionChainForPokemon(pokemonId: number) {
  try {
    // First, get the Pokemon to find its species evolution chain ID
    const { data: pokemonData, error: pokemonError } = await supabase
      .from("pokemon")
      .select("species_data")
      .eq("id", pokemonId)
      .single();

    if (pokemonError) {
      console.error("Error fetching Pokemon species data:", pokemonError);
      throw new Error(handleSupabaseError(pokemonError));
    }

    const evolutionChainId = pokemonData?.species_data?.evolution_chain?.url
      ?.split("/")
      .slice(-2, -1)[0];

    if (!evolutionChainId) {
      return null;
    }

    return getEvolutionChainById(parseInt(evolutionChainId));
  } catch (error) {
    console.error("Error in getEvolutionChainForPokemon:", error);
    throw error;
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
      console.error("Error fetching all evolution chains:", error);
      throw new Error(handleSupabaseError(error));
    }

    return data?.map(transformSupabaseEvolution) || [];
  } catch (error) {
    console.error("Error in getAllEvolutionChains:", error);
    throw error;
  }
}
