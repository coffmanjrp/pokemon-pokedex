/**
 * Evolution chain IDs for Pokemon with branching evolutions
 * These Pokemon have multiple evolution paths and benefit from card-style layout
 */
export const BRANCH_EVOLUTION_CHAIN_IDS = [
  18, // Oddish → Gloom → Vileplume/Bellossom
  26, // Poliwag → Poliwhirl → Poliwrath/Politoed
  33, // Slowpoke → Slowbro/Slowking (+ Galarian forms)
  47, // Tyrogue → Hitmonlee/Hitmonchan/Hitmontop
  58, // Scyther → Scizor/Kleavor
  67, // Eevee → Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon, Glaceon, Sylveon
  103, // Dunsparce → Dudunsparce(2 forms/3 segment)
  135, // Wurmple → Silcoon/Cascoon → Beautifly/Dustox
  140, // Ralts → Kirlia → Gardevoir/Gallade
  144, // Nincada → Ninjask/Shedinja
  186, // Snorunt → Glalie/Froslass
  188, // Clamperl → Huntail/Gorebyss
  213, // Burmy → Wormadam(3 forms)/Mothim
  383, // Rockruff → Lycanroc(3 forms)
  413, // Cosmog → Cosmoem → Solgaleo/Lunala
  442, // Applin → Flapple/Appletun
  446, // Toxel → Toxtricity(2 forms)
  470, // Kubfu → Urshifu(Single Strike/Rapid Strike)
  485, // Tandemaus → Maushold(Family of Three/Family of Four)
  490, // Charcadet → Armarouge/Ceruledge
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
