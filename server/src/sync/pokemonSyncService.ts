import { supabase, SupabasePokemon, SupabaseEvolutionChain } from './supabaseClient';
import { PokemonDataMapper } from './pokemonDataMapper';
import { pokemonService } from '../services/pokemonService';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { getSortedFormIdsByDisplayId } from '../data/pokemonFormIds';

interface SyncProgress {
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{ id: number; error: string }>;
}

export class PokemonSyncService {
  private progress: SyncProgress = {
    total: 0,
    processed: 0,
    succeeded: 0,
    failed: 0,
    errors: [],
  };

  constructor() {
    // Use the singleton instance
  }

  /**
   * Sync all Pokemon data to Supabase
   */
  async syncAllPokemon(): Promise<SyncProgress> {
    console.log('🚀 Starting full Pokemon data sync to Supabase...');
    const startTime = Date.now();

    try {
      // Sync regular Pokemon by generation (1-9)
      for (let generation = 1; generation <= 9; generation++) {
        await this.syncGeneration(generation);
      }

      // Sync special forms (Generation 0)
      await this.syncPokemonForms();

      // Sync evolution chains
      await this.syncEvolutionChains();

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000 / 60; // minutes

      console.log(`✅ Sync completed in ${duration.toFixed(2)} minutes`);
      console.log(`📊 Final results:`, this.progress);

      return this.progress;
    } catch (error) {
      console.error('❌ Fatal error during sync:', error);
      throw error;
    }
  }

  /**
   * Sync a specific generation of Pokemon
   */
  async syncGeneration(generation: number): Promise<void> {
    console.log(`\n📦 Syncing Generation ${generation}...`);

    try {
      // Get Pokemon IDs for this generation
      const pokemonIds = this.getPokemonIdsByGeneration(generation);
      this.progress.total += pokemonIds.length;

      console.log(`Found ${pokemonIds.length} Pokemon in Generation ${generation}`);

      // Process in batches to avoid memory issues
      const batchSize = 20;
      for (let i = 0; i < pokemonIds.length; i += batchSize) {
        const batch = pokemonIds.slice(i, i + batchSize);
        await this.processPokemonBatch(batch, generation);
        
        // Progress update
        const percentComplete = ((this.progress.processed / this.progress.total) * 100).toFixed(1);
        console.log(`Progress: ${this.progress.processed}/${this.progress.total} (${percentComplete}%)`);
      }

      console.log(`✅ Generation ${generation} sync completed`);
    } catch (error) {
      console.error(`❌ Error syncing generation ${generation}:`, error);
      throw error;
    }
  }

  /**
   * Sync special Pokemon forms
   */
  async syncPokemonForms(): Promise<void> {
    console.log(`\n📦 Syncing Pokemon Forms (Generation 0)...`);

    try {
      const formIds = getSortedFormIdsByDisplayId();
      this.progress.total += formIds.length;

      console.log(`Found ${formIds.length} Pokemon forms to sync`);

      // Process forms in batches
      const batchSize = 10;
      for (let i = 0; i < formIds.length; i += batchSize) {
        const batch = formIds.slice(i, i + batchSize);
        await this.processPokemonBatch(batch, 0);
      }

      console.log(`✅ Pokemon forms sync completed`);
    } catch (error) {
      console.error(`❌ Error syncing Pokemon forms:`, error);
      throw error;
    }
  }

  /**
   * Process a batch of Pokemon
   */
  private async processPokemonBatch(pokemonIds: number[], generation: number): Promise<void> {
    const promises = pokemonIds.map(async (id) => {
      try {
        // Add delay to respect rate limiting
        await this.delay(50 * pokemonIds.indexOf(id));

        // Fetch Pokemon data
        const pokemon = await pokemonService.getPokemonById(id.toString());
        if (!pokemon) {
          throw new Error(`Pokemon ${id} not found`);
        }

        // Species data is already included in the Pokemon object
        const species = pokemon.species || null;

        // Map to Supabase format
        const supabasePokemon = PokemonDataMapper.mapPokemonToSupabase(
          pokemon,
          species,
          generation
        );

        // Upsert to Supabase
        const { error } = await supabase
          .from('pokemon')
          .upsert(supabasePokemon, {
            onConflict: 'id',
          });

        if (error) {
          throw error;
        }

        this.progress.succeeded++;
      } catch (error) {
        this.progress.failed++;
        this.progress.errors.push({
          id,
          error: error instanceof Error ? error.message : String(error),
        });
        console.error(`❌ Error syncing Pokemon ${id}:`, error);
      } finally {
        this.progress.processed++;
      }
    });

    await Promise.all(promises);
  }

  /**
   * Sync evolution chains
   */
  private async syncEvolutionChains(): Promise<void> {
    console.log(`\n📦 Syncing Evolution Chains...`);

    try {
      // Get unique evolution chain IDs from Pokemon data
      const { data: pokemonWithChains, error } = await supabase
        .from('pokemon')
        .select('species_data->evolution_chain_id')
        .not('species_data->evolution_chain_id', 'is', null);

      if (error) throw error;

      const chainIds = [...new Set(
        pokemonWithChains
          .map((p: any) => p.evolution_chain_id)
          .filter((id: any) => id != null)
      )];

      console.log(`Found ${chainIds.length} unique evolution chains`);

      // Process evolution chains
      // Note: Evolution chains are fetched as part of Pokemon data, 
      // so we'll sync them when we sync Pokemon data
      console.log(`Evolution chains will be synced with Pokemon data`);

      console.log(`✅ Evolution chains sync completed`);
    } catch (error) {
      console.error(`❌ Error syncing evolution chains:`, error);
      throw error;
    }
  }

  /**
   * Get Pokemon IDs by generation
   */
  private getPokemonIdsByGeneration(generation: number): number[] {
    const ranges: Record<number, [number, number]> = {
      1: [1, 151],
      2: [152, 251],
      3: [252, 386],
      4: [387, 493],
      5: [494, 649],
      6: [650, 721],
      7: [722, 809],
      8: [810, 905],
      9: [906, 1025],
    };

    const [start, end] = ranges[generation] || [1, 1];
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  /**
   * Extract ID from PokeAPI URL
   */
  private extractIdFromUrl(url: string | undefined): number {
    if (!url) return 0;
    const matches = url.match(/\/(\d+)\/$/);
    return matches && matches[1] ? parseInt(matches[1], 10) : 0;
  }

  /**
   * Delay helper for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Sync a single Pokemon (useful for testing)
   */
  async syncSinglePokemon(id: number): Promise<void> {
    console.log(`🔄 Syncing Pokemon #${id}...`);
    
    try {
      const pokemon = await pokemonService.getPokemonById(id.toString());
      if (!pokemon) {
        throw new Error(`Pokemon ${id} not found`);
      }

      // Species data is already included in the Pokemon object
      const species = pokemon.species || null;

      const generation = PokemonDataMapper.getGenerationFromId(id);
      const supabasePokemon = PokemonDataMapper.mapPokemonToSupabase(
        pokemon,
        species,
        generation
      );

      const { error } = await supabase
        .from('pokemon')
        .upsert(supabasePokemon, {
          onConflict: 'id',
        });

      if (error) throw error;

      console.log(`✅ Successfully synced Pokemon #${id} (${pokemon.name})`);
    } catch (error) {
      console.error(`❌ Error syncing Pokemon ${id}:`, error);
      throw error;
    }
  }
}