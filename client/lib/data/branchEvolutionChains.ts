/**
 * Evolution chain IDs for Pokemon with branching evolutions
 * These Pokemon have multiple evolution paths and benefit from card-style layout
 */
export const BRANCH_EVOLUTION_CHAIN_IDS = [
  67, // Eevee → Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon, Glaceon, Sylveon
  26, // Poliwag → Poliwhirl → Poliwrath/Politoed
  33, // Slowpoke → Slowbro/Slowking (+ Galarian forms)
  140, // Ralts → Kirlia → Gardevoir/Gallade
  47, // Tyrogue → Hitmonlee/Hitmonchan/Hitmontop
  144, // Nincada → Ninjask/Shedinja
  186, // Snorunt → Glalie/Froslass
  188, // Clamperl → Huntail/Gorebyss
  15, // Wurmple → Silcoon/Cascoon → Beautifly/Dustox - needs verification
  206, // Burmy → Wormadam(3 forms)/Mothim - needs verification
  300, // Applin → Flapple/Appletun - needs verification
  361, // Toxel → Toxtricity(2 forms) - needs verification
  441, // Rockruff → Lycanroc(3 forms) - needs verification
  530, // Charcadet → Armarouge/Ceruledge - needs verification
];

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
