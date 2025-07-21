import { supabase } from './supabaseClient';
import { pokemonService } from '../services/pokemonService';
import { getSortedFormIdsByDisplayId } from '../data/pokemonFormIds';
import { COMPLETE_FORM_MAPPINGS } from '../data/completeFormMappings';

interface FormSyncData {
  id: number;
  pokemon_id: number;
  form_name: string;
  form_data: Record<string, unknown>;
  is_regional_variant: boolean;
  is_mega_evolution: boolean;
  is_gigantamax: boolean;
}

/**
 * Service for syncing Pokemon forms to the pokemon_forms table
 */
export class PokemonFormsSyncService {
  private progress = {
    total: 0,
    processed: 0,
    succeeded: 0,
    failed: 0,
    errors: [] as { id: number; error: string }[],
  };

  /**
   * Sync all Pokemon forms to pokemon_forms table
   */
  async syncAllForms(): Promise<void> {
    console.log('📦 Syncing Pokemon Forms to pokemon_forms table...');

    try {
      const formIds = getSortedFormIdsByDisplayId();
      this.progress.total = formIds.length;

      console.log(`Found ${formIds.length} Pokemon forms to sync`);

      // Process forms in batches
      const batchSize = 5;
      for (let i = 0; i < formIds.length; i += batchSize) {
        const batch = formIds.slice(i, i + batchSize);
        await this.processFormBatch(batch);
        
        // Progress update
        const percentComplete = ((this.progress.processed / this.progress.total) * 100).toFixed(1);
        console.log(`Progress: ${this.progress.processed}/${this.progress.total} (${percentComplete}%)`);
      }

      console.log(`✅ Pokemon forms sync completed`);
      console.log(`   Succeeded: ${this.progress.succeeded}`);
      console.log(`   Failed: ${this.progress.failed}`);
      
      if (this.progress.errors.length > 0) {
        console.log('\n❌ Failed forms:');
        this.progress.errors.forEach(err => {
          console.log(`   - Form ${err.id}: ${err.error}`);
        });
      }
    } catch (error) {
      console.error('❌ Error syncing Pokemon forms:', error);
      throw error;
    }
  }

  /**
   * Process a batch of forms
   */
  private async processFormBatch(formIds: number[]): Promise<void> {
    const promises = formIds.map(async (formId) => {
      try {
        await this.syncSingleForm(formId);
        this.progress.succeeded++;
      } catch (error) {
        this.progress.failed++;
        this.progress.errors.push({
          id: formId,
          error: error instanceof Error ? error.message : String(error),
        });
        console.error(`❌ Error syncing form ${formId}:`, error);
      } finally {
        this.progress.processed++;
      }
    });

    await Promise.all(promises);
  }

  /**
   * Sync a single Pokemon form
   */
  private async syncSingleForm(formId: number): Promise<void> {
    // Fetch Pokemon data from PokeAPI
    const pokemon = await pokemonService.getPokemonById(formId.toString());
    if (!pokemon) {
      throw new Error(`Pokemon form ${formId} not found`);
    }

    // Get base Pokemon ID from mapping
    const mapping = COMPLETE_FORM_MAPPINGS.find(m => m.formId === formId);
    if (!mapping) {
      throw new Error(`No mapping found for form ${formId}`);
    }

    // Extract form name from Pokemon name (part after hyphen)
    // e.g., "lucario-mega" → "mega", "pikachu-original-cap" → "original-cap"
    const formName = pokemon.name.includes('-') 
      ? pokemon.name.split('-').slice(1).join('-')
      : mapping.formName; // Fallback to mapping if no hyphen

    // Prepare form data for Supabase
    const formData: FormSyncData = {
      id: formId,
      pokemon_id: mapping.basePokemonId,
      form_name: formName,
      form_data: {
        name: pokemon.name,
        types: pokemon.types,
        sprites: pokemon.sprites,
        stats: pokemon.stats,
        abilities: pokemon.abilities,
        height: pokemon.height,
        weight: pokemon.weight,
      },
      is_regional_variant: ['alolan', 'galarian', 'hisuian', 'paldean'].includes(mapping.category),
      is_mega_evolution: mapping.category === 'mega',
      is_gigantamax: mapping.category === 'gigantamax',
    };

    // Upsert to pokemon_forms table
    const { error } = await supabase
      .from('pokemon_forms')
      .upsert(formData, {
        onConflict: 'id',
      });

    if (error) {
      throw error;
    }

    console.log(`✅ Synced form #${formId} (${pokemon.name}) -> Pokemon #${mapping.basePokemonId}`);
  }

  /**
   * Get the base Pokemon ID for a form
   */
  private getBasePokemonId(formId: number): number {
    const mapping = COMPLETE_FORM_MAPPINGS.find(m => m.formId === formId);
    return mapping?.basePokemonId || 0;
  }
}

export const pokemonFormsSyncService = new PokemonFormsSyncService();