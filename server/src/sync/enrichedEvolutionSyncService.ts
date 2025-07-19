import { supabase } from './supabaseClient';
import fetch from 'node-fetch';

interface EnrichedEvolutionNode {
  id: string;
  name: string;
  sprites: {
    frontDefault: string | null;
    frontShiny?: string | null;
    backDefault?: string | null;
    backShiny?: string | null;
    other: {
      officialArtwork: {
        frontDefault: string | null;
        frontShiny?: string | null;
      };
      home?: {
        frontDefault: string | null;
        frontShiny?: string | null;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      id: string;
      name: string;
      url: string;
    };
  }>;
  species: {
    id: string;
    name: string;
    names: Array<{
      name: string;
      language: {
        name: string;
        url: string;
      };
    }>;
  };
  evolutionDetails: any[];
  forms?: any[];
  evolvesTo: EnrichedEvolutionNode[];
}

export class EnrichedEvolutionSyncService {
  private static readonly RATE_LIMIT_DELAY = 100; // ms between API calls

  /**
   * Sync evolution chains with enriched data matching GraphQL structure
   */
  async syncEnrichedEvolutionChains(): Promise<void> {
    console.log('\n🔄 Starting enriched evolution chain sync...');

    try {
      // Get unique evolution chain IDs
      const chainIds = await this.getEvolutionChainIds();
      console.log(`Found ${chainIds.length} unique evolution chains to sync`);

      let syncedCount = 0;
      let failedCount = 0;

      // Process each evolution chain
      for (const chainId of chainIds) {
        try {
          console.log(`\n📊 Processing evolution chain ${chainId}...`);
          
          // Fetch raw evolution chain
          const rawChain = await this.fetchEvolutionChain(chainId);
          
          // Transform to enriched structure
          const enrichedChain = await this.transformToEnrichedStructure(rawChain);
          
          // Store enriched data
          await this.storeEnrichedEvolutionChain(chainId, enrichedChain);
          
          syncedCount++;
          console.log(`✅ Successfully synced enriched evolution chain ${chainId}`);
        } catch (error) {
          failedCount++;
          console.error(`❌ Failed to sync evolution chain ${chainId}:`, error);
        }

        // Rate limiting
        await this.delay(EnrichedEvolutionSyncService.RATE_LIMIT_DELAY);
      }

      console.log(`\n✅ Enriched evolution chains sync completed: ${syncedCount} synced, ${failedCount} failed`);
    } catch (error) {
      console.error('❌ Fatal error during enriched evolution chain sync:', error);
      throw error;
    }
  }

  /**
   * Get all unique evolution chain IDs from Pokemon data
   */
  private async getEvolutionChainIds(): Promise<number[]> {
    const { data: pokemonWithChains, error } = await supabase
      .from('pokemon')
      .select('id, species_data')
      .not('species_data->evolution_chain', 'is', null);

    if (error) throw error;

    const chainIds = [...new Set(
      pokemonWithChains
        .map((p: any) => {
          const evolutionChainUrl = p.species_data?.evolution_chain?.url;
          if (!evolutionChainUrl) return null;
          
          const matches = evolutionChainUrl.match(/evolution-chain\/(\d+)\//);
          return matches ? parseInt(matches[1]) : null;
        })
        .filter((id: any) => id != null)
    )] as number[];

    return chainIds;
  }

  /**
   * Fetch raw evolution chain from PokeAPI
   */
  private async fetchEvolutionChain(chainId: number): Promise<any> {
    const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${chainId}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Transform raw evolution chain to enriched structure matching GraphQL
   */
  private async transformToEnrichedStructure(rawChain: any): Promise<EnrichedEvolutionNode> {
    return this.transformNode(rawChain.chain);
  }

  /**
   * Recursively transform evolution node with enriched Pokemon data
   */
  private async transformNode(node: any): Promise<EnrichedEvolutionNode> {
    // Extract Pokemon ID from species URL
    const speciesUrl = node.species?.url || '';
    const speciesId = this.extractIdFromUrl(speciesUrl);

    // Fetch full Pokemon data
    const pokemonData = await this.fetchPokemonData(speciesId);
    const speciesData = await this.fetchSpeciesData(speciesId);

    // Build enriched node
    const enrichedNode: EnrichedEvolutionNode = {
      id: speciesId,
      name: node.species?.name || '',
      sprites: {
        frontDefault: pokemonData?.sprites?.front_default || null,
        frontShiny: pokemonData?.sprites?.front_shiny || null,
        backDefault: pokemonData?.sprites?.back_default || null,
        backShiny: pokemonData?.sprites?.back_shiny || null,
        other: {
          officialArtwork: {
            frontDefault: pokemonData?.sprites?.other?.['official-artwork']?.front_default || null,
            frontShiny: pokemonData?.sprites?.other?.['official-artwork']?.front_shiny || null,
          },
          home: {
            frontDefault: pokemonData?.sprites?.other?.home?.front_default || null,
            frontShiny: pokemonData?.sprites?.other?.home?.front_shiny || null,
          }
        }
      },
      types: pokemonData?.types?.map((t: any) => ({
        slot: t.slot,
        type: {
          id: this.extractIdFromUrl(t.type.url),
          name: t.type.name,
          url: t.type.url
        }
      })) || [],
      species: {
        id: speciesId,
        name: speciesData?.name || node.species?.name || '',
        names: speciesData?.names || []
      },
      evolutionDetails: (node.evolution_details || []).map((detail: any) => ({
        minLevel: detail.min_level,
        item: detail.item,
        trigger: detail.trigger,
        timeOfDay: detail.time_of_day,
        location: detail.location,
        knownMove: detail.known_move,
        minHappiness: detail.min_happiness,
        minBeauty: detail.min_beauty,
        minAffection: detail.min_affection,
        needsOverworldRain: detail.needs_overworld_rain,
        partySpecies: detail.party_species,
        partyType: detail.party_type,
        relativePhysicalStats: detail.relative_physical_stats,
        tradeSpecies: detail.trade_species,
        turnUpsideDown: detail.turn_upside_down,
        gender: detail.gender,
        heldItem: detail.held_item,
        knownMoveType: detail.known_move_type,
      })),
      forms: [], // Will be populated if forms exist
      evolvesTo: []
    };

    // Check for forms
    if (speciesData?.varieties && speciesData.varieties.length > 1) {
      enrichedNode.forms = await this.fetchPokemonForms(speciesData.varieties);
    }

    // Recursively process evolutions
    if (node.evolves_to && node.evolves_to.length > 0) {
      for (const evolution of node.evolves_to) {
        const evolvedNode = await this.transformNode(evolution);
        enrichedNode.evolvesTo.push(evolvedNode);
        
        // Rate limiting between Pokemon fetches
        await this.delay(EnrichedEvolutionSyncService.RATE_LIMIT_DELAY);
      }
    }

    return enrichedNode;
  }

  /**
   * Fetch Pokemon data from PokeAPI
   */
  private async fetchPokemonData(pokemonId: string): Promise<any> {
    if (!pokemonId) return null;

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
      if (!response.ok) {
        console.warn(`Failed to fetch Pokemon ${pokemonId}: ${response.status}`);
        return null;
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching Pokemon ${pokemonId}:`, error);
      return null;
    }
  }

  /**
   * Fetch species data from PokeAPI
   */
  private async fetchSpeciesData(speciesId: string): Promise<any> {
    if (!speciesId) return null;

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesId}/`);
      if (!response.ok) {
        console.warn(`Failed to fetch species ${speciesId}: ${response.status}`);
        return null;
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching species ${speciesId}:`, error);
      return null;
    }
  }

  /**
   * Fetch Pokemon forms data
   */
  private async fetchPokemonForms(varieties: any[]): Promise<any[]> {
    const forms = [];
    
    for (const variety of varieties) {
      if (variety.is_default) continue; // Skip default form
      
      const pokemonId = this.extractIdFromUrl(variety.pokemon.url);
      const formData = await this.fetchPokemonData(pokemonId);
      
      if (formData) {
        forms.push({
          id: pokemonId,
          name: formData.name,
          formName: formData.forms?.[0]?.name || '',
          sprites: {
            frontDefault: formData.sprites?.front_default || null,
            other: {
              officialArtwork: {
                frontDefault: formData.sprites?.other?.['official-artwork']?.front_default || null
              }
            }
          },
          types: formData.types?.map((t: any) => ({
            slot: t.slot,
            type: {
              id: this.extractIdFromUrl(t.type.url),
              name: t.type.name,
              url: t.type.url
            }
          })) || [],
          isRegionalVariant: formData.name.includes('-alola') || formData.name.includes('-galar') || formData.name.includes('-hisui') || formData.name.includes('-paldea'),
          isMegaEvolution: formData.name.includes('-mega'),
          isDynamax: formData.name.includes('-gmax')
        });
      }
      
      await this.delay(EnrichedEvolutionSyncService.RATE_LIMIT_DELAY);
    }
    
    return forms;
  }

  /**
   * Store enriched evolution chain in Supabase
   */
  private async storeEnrichedEvolutionChain(chainId: number, enrichedChain: EnrichedEvolutionNode): Promise<void> {
    const { error } = await supabase
      .from('evolution_chains')
      .upsert({
        id: chainId,
        chain_data: {
          id: chainId.toString(),
          url: `https://pokeapi.co/api/v2/evolution-chain/${chainId}/`,
          chain: enrichedChain
        }
      }, {
        onConflict: 'id'
      });

    if (error) throw error;
  }

  /**
   * Extract ID from PokeAPI URL
   */
  private extractIdFromUrl(url: string | undefined): string {
    if (!url) return '';
    const matches = url.match(/\/(\d+)\/$/);
    return matches && matches[1] ? matches[1] : '';
  }

  /**
   * Delay helper for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}