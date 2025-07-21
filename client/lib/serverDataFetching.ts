import {
  getPokemonById,
  getPokemonByGeneration,
  getPokemonForms,
} from "@/lib/supabase/pokemon";
import { getEvolutionChainForPokemon } from "@/lib/supabase/evolution";
import type { EvolutionChain } from "@/types/pokemon";

// Server-side utility for fetching Pokemon detail (Supabase only)
export async function fetchPokemonDetail(id: number) {
  try {
    const pokemon = await getPokemonById(id);
    let evolutionChain: EvolutionChain | null = null;

    if (pokemon) {
      try {
        evolutionChain = await getEvolutionChainForPokemon(id);
      } catch (error) {
        console.log(
          "[ServerDataFetching] Failed to fetch evolution chain:",
          error,
        );
      }
    }

    return { pokemon, evolutionChain };
  } catch (error) {
    console.error("Error fetching from Supabase:", error);
    throw error;
  }
}

// Server-side utility for fetching Pokemon list by generation (Supabase only)
export async function fetchPokemonByGeneration(generation: number) {
  try {
    if (generation === 0) {
      return await getPokemonForms();
    } else {
      return await getPokemonByGeneration(generation);
    }
  } catch (error) {
    console.error("Error fetching from Supabase:", error);
    throw error;
  }
}

// Helper to determine data source (always Supabase now)
export function getDataSource(): "supabase" {
  return "supabase";
}
