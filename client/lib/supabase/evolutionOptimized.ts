import { supabase } from "@/lib/supabase";
import type { EvolutionChain } from "@/types/pokemon";

/**
 * Get evolution chain for a Pokemon using the optimized evolution_chain_id
 * This function leverages the foreign key relationship for better performance
 */
export async function getEvolutionChainOptimized(pokemonId: number) {
  try {
    // Use Supabase's join capability to fetch both Pokemon and evolution chain in one query
    const { data, error } = await supabase
      .from("pokemon")
      .select(
        `
        id,
        name,
        evolution_chain_id,
        evolution_chain:evolution_chains!evolution_chain_id (
          id,
          chain_data
        )
      `,
      )
      .eq("id", pokemonId)
      .single();

    if (error) {
      console.log(
        `[Evolution] Error fetching Pokemon with evolution chain:`,
        error,
      );
      return null;
    }

    // If no evolution chain is linked, return null
    if (!data?.evolution_chain) {
      console.log(
        `[Evolution] No evolution chain found for Pokemon ${pokemonId}`,
      );
      return null;
    }

    // Transform the data to match our EvolutionChain type
    const evolutionChain = data.evolution_chain as unknown as {
      id: number;
      chain_data: Record<string, unknown>;
    };

    return {
      id: evolutionChain.id.toString(),
      url: `https://pokeapi.co/api/v2/evolution-chain/${evolutionChain.id}/`,
      chain: evolutionChain.chain_data.chain || evolutionChain.chain_data,
    } as EvolutionChain;
  } catch (error) {
    console.log(
      "[Evolution] Unexpected error in getEvolutionChainOptimized:",
      error,
    );
    return null;
  }
}

/**
 * Get all Pokemon in an evolution chain
 * This leverages the foreign key to find all related Pokemon
 */
export async function getPokemonInEvolutionChain(evolutionChainId: number) {
  try {
    const { data, error } = await supabase
      .from("pokemon")
      .select(
        `
        id,
        name,
        sprites,
        types,
        species_data
      `,
      )
      .eq("evolution_chain_id", evolutionChainId)
      .order("id");

    if (error) {
      console.log(
        `[Evolution] Error fetching Pokemon in evolution chain ${evolutionChainId}:`,
        error,
      );
      return [];
    }

    return data || [];
  } catch (error) {
    console.log(
      "[Evolution] Unexpected error in getPokemonInEvolutionChain:",
      error,
    );
    return [];
  }
}

/**
 * Check if evolution chain data exists for a Pokemon
 * This is a lightweight check using the foreign key
 */
export async function hasEvolutionChain(pokemonId: number): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("pokemon")
      .select("evolution_chain_id")
      .eq("id", pokemonId)
      .single();

    if (error) {
      return false;
    }

    return data?.evolution_chain_id !== null;
  } catch (error) {
    console.log("[Evolution] Error checking evolution chain existence:", error);
    return false;
  }
}

/**
 * Get evolution chains for multiple Pokemon at once
 * Useful for batch operations
 */
export async function getEvolutionChainsForPokemonBatch(pokemonIds: number[]) {
  try {
    const { data, error } = await supabase
      .from("pokemon")
      .select(
        `
        id,
        evolution_chain_id,
        evolution_chain:evolution_chains!evolution_chain_id (
          id,
          chain_data
        )
      `,
      )
      .in("id", pokemonIds)
      .not("evolution_chain_id", "is", null);

    if (error) {
      console.log("[Evolution] Error fetching batch evolution chains:", error);
      return new Map<number, EvolutionChain>();
    }

    // Create a map for easy lookup
    const evolutionMap = new Map<number, EvolutionChain>();

    data?.forEach((pokemon) => {
      if (pokemon.evolution_chain) {
        const chain = pokemon.evolution_chain as unknown as {
          id: number;
          chain_data: Record<string, unknown>;
        };

        evolutionMap.set(pokemon.id, {
          id: chain.id.toString(),
          url: `https://pokeapi.co/api/v2/evolution-chain/${chain.id}/`,
          chain: chain.chain_data.chain || chain.chain_data,
        } as EvolutionChain);
      }
    });

    return evolutionMap;
  } catch (error) {
    console.log("[Evolution] Unexpected error in batch fetch:", error);
    return new Map<number, EvolutionChain>();
  }
}

/**
 * Get evolution chain for a Pokemon form (Generation 0)
 * This function uses the pokemon_forms relationship to find the base Pokemon's evolution chain
 */
export async function getEvolutionChainForForm(formId: number) {
  try {
    console.log(
      `[Evolution] Fetching evolution chain for form Pokemon ${formId}`,
    );

    // Query pokemon_forms table to get the base Pokemon ID and its evolution chain
    const { data, error } = await supabase
      .from("pokemon_forms")
      .select(
        `
        id,
        pokemon_id,
        form_name,
        pokemon:pokemon!pokemon_id (
          id,
          name,
          evolution_chain_id,
          evolution_chain:evolution_chains!evolution_chain_id (
            id,
            chain_data
          )
        )
      `,
      )
      .eq("id", formId)
      .single();

    if (error) {
      console.log(`[Evolution] Error fetching form's evolution chain:`, error);
      return null;
    }

    // Check if we have the base Pokemon and its evolution chain
    const basePokemon = data?.pokemon as unknown as {
      id: number;
      name: string;
      evolution_chain_id: number | null;
      evolution_chain?: {
        id: number;
        chain_data: Record<string, unknown>;
      };
    };

    if (!basePokemon?.evolution_chain) {
      console.log(
        `[Evolution] No evolution chain found for form Pokemon ${formId}'s base Pokemon`,
      );
      return null;
    }

    // Transform the data to match our EvolutionChain type
    const evolutionChain = basePokemon.evolution_chain;

    return {
      id: evolutionChain.id.toString(),
      url: `https://pokeapi.co/api/v2/evolution-chain/${evolutionChain.id}/`,
      chain: evolutionChain.chain_data.chain || evolutionChain.chain_data,
      // Include metadata about the form
      formMetadata: {
        formId,
        formName: data.form_name,
        basePokemonId: basePokemon.id,
        basePokemonName: basePokemon.name,
      },
    } as EvolutionChain & {
      formMetadata?: {
        formId: number;
        formName: string;
        basePokemonId: number;
        basePokemonName: string;
      };
    };
  } catch (error) {
    console.log(
      "[Evolution] Unexpected error in getEvolutionChainForForm:",
      error,
    );
    return null;
  }
}
