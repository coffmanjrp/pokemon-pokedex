import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { SupabasePokemon } from './supabaseClient';

/**
 * Maps GraphQL Pokemon data to Supabase table structure
 */
export class PokemonDataMapper {
  /**
   * Map Pokemon data from GraphQL/PokeAPI to Supabase format
   */
  static mapPokemonToSupabase(
    pokemon: Pokemon,
    species: PokemonSpecies | null,
    generation: number,
    evolutionChainId?: number | null
  ): SupabasePokemon {
    return {
      id: parseInt(pokemon.id, 10),
      name: pokemon.name,
      height: pokemon.height || null,
      weight: pokemon.weight || null,
      base_experience: pokemon.baseExperience || null,
      types: pokemon.types || [],
      stats: pokemon.stats || [],
      abilities: pokemon.abilities || [],
      sprites: pokemon.sprites || {},
      moves: pokemon.moves || [],
      species_data: this.mapSpeciesData(species),
      form_data: this.mapFormData(pokemon),
      generation,
      evolution_chain_id: evolutionChainId || null,
    };
  }

  /**
   * Map species data including localized names and classification
   */
  private static mapSpeciesData(species: PokemonSpecies | null) {
    if (!species) {
      return {
        id: null,
        name: null,
        names: [],
        genera: [],
        gender_rate: -1,
        has_gender_differences: false,
        is_baby: false,
        is_legendary: false,
        is_mythical: false,
      };
    }

    return {
      id: species.id,
      name: species.name,
      names: species.names || [],
      genera: species.genera || [],
      gender_rate: species.genderRate ?? -1,
      has_gender_differences: species.hasGenderDifferences || false,
      is_baby: species.isBaby || false,
      is_legendary: species.isLegendary || false,
      is_mythical: species.isMythical || false,
      flavor_text_entries: species.flavorTextEntries || [],
      generation: species.generation || null,
      evolution_chain: species.evolutionChain || null,
    };
  }

  /**
   * Map form data for special Pokemon forms
   */
  private static mapFormData(pokemon: Pokemon) {
    const formData: any = {
      form_name: pokemon.formName || null,
      is_regional_variant: pokemon.isRegionalVariant || false,
      is_mega_evolution: pokemon.isMegaEvolution || false,
      is_dynamax: pokemon.isDynamax || false,
    };

    // Note: forms array is not part of the Pokemon type in the current schema
    
    return formData;
  }

  /**
   * Map evolution chain data
   */
  static mapEvolutionChain(chainId: number, chainData: any) {
    return {
      id: chainId,
      chain_data: this.cleanEvolutionChainData(chainData),
    };
  }

  /**
   * Clean and simplify evolution chain data structure
   */
  private static cleanEvolutionChainData(chain: any): any {
    if (!chain) return null;

    const cleanChain = (node: any): any => {
      const cleaned: any = {
        id: node.id,
        name: node.name,
        sprites: node.sprites,
        types: node.types,
        species: {
          id: node.species?.id,
          name: node.species?.name,
          names: node.species?.names,
        },
        evolution_details: node.evolution_details || [],
      };

      if (node.evolves_to && node.evolves_to.length > 0) {
        cleaned.evolves_to = node.evolves_to.map((evo: any) => cleanChain(evo));
      }

      return cleaned;
    };

    return cleanChain(chain);
  }

  /**
   * Determine generation from Pokemon ID
   */
  static getGenerationFromId(id: number): number {
    if (id >= 10000) return 0; // Special forms
    if (id <= 151) return 1;
    if (id <= 251) return 2;
    if (id <= 386) return 3;
    if (id <= 493) return 4;
    if (id <= 649) return 5;
    if (id <= 721) return 6;
    if (id <= 809) return 7;
    if (id <= 905) return 8;
    if (id <= 1025) return 9;
    return 9; // Default to latest generation
  }

  /**
   * Extract base Pokemon ID from form ID
   */
  static getBasePokemonIdFromFormId(formId: number): number | null {
    // This is a simplified version - you might need to implement
    // the actual logic based on your pokemonFormIds.ts file
    if (formId < 10000) return null;
    
    // Common patterns for form IDs
    // Mega evolutions: 10033-10090
    if (formId >= 10033 && formId <= 10090) {
      // Map to base Pokemon (this is simplified, you need actual mapping)
      return Math.floor((formId - 10033) / 2) + 1;
    }
    
    // Regional forms have different patterns
    // This needs to be implemented based on your actual data
    return null;
  }
}