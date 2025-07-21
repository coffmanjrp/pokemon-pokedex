/**
 * Utility functions for handling branch evolution chains
 */

import { BRANCH_EVOLUTION_CHAIN_IDS } from "@/lib/data/branchEvolutionChainIds";

/**
 * Get evolution chain ID from Pokemon data
 * Handles both direct evolution_chain_id and extraction from species URL
 */
export function getEvolutionChainId(pokemon: {
  evolution_chain_id?: number;
  species?: {
    evolutionChain?: { url?: string };
    evolution_chain?: { url?: string };
  };
}): number | null {
  // Direct evolution_chain_id field (if using Supabase with optimized schema)
  if (pokemon.evolution_chain_id) {
    return pokemon.evolution_chain_id;
  }

  // Extract from species.evolution_chain URL
  if (pokemon.species?.evolutionChain?.url) {
    const match = pokemon.species.evolutionChain.url.match(/\/(\d+)\/$/);
    return match && match[1] ? parseInt(match[1], 10) : null;
  }

  // Alternative path for GraphQL response
  if (pokemon.species?.evolution_chain?.url) {
    const match = pokemon.species.evolution_chain.url.match(/\/(\d+)\/$/);
    return match && match[1] ? parseInt(match[1], 10) : null;
  }

  return null;
}

/**
 * Determine if a Pokemon should use card layout for evolution display
 */
export function shouldUseCardEvolutionLayout(pokemon: {
  evolution_chain_id?: number;
  species?: {
    evolutionChain?: { url?: string };
    evolution_chain?: { url?: string };
  };
}): boolean {
  const chainId = getEvolutionChainId(pokemon);
  return chainId ? BRANCH_EVOLUTION_CHAIN_IDS.includes(chainId) : false;
}
