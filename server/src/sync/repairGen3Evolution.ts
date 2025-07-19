import { PokemonSyncService } from './pokemonSyncService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Focused repair script for Gen 3 Pokemon evolution chain URLs
 */
async function repairGen3Evolution() {
  console.log('🔧 Repairing Gen 3 Pokemon evolution chain links...');
  console.log('This will re-sync Gen 3 starters to fix missing evolution_chain URLs.\n');

  const syncService = new PokemonSyncService();

  // Focus on Gen 3 starters first
  const gen3Starters = [
    { id: 252, name: 'Treecko' },
    { id: 253, name: 'Grovyle' },
    { id: 254, name: 'Sceptile' },
    { id: 255, name: 'Torchic' },
    { id: 256, name: 'Combusken' },
    { id: 257, name: 'Blaziken' },
    { id: 258, name: 'Mudkip' },
    { id: 259, name: 'Marshtomp' },
    { id: 260, name: 'Swampert' },
  ];

  let successCount = 0;
  let errorCount = 0;

  console.log('🚀 Starting re-sync process...\n');

  for (const pokemon of gen3Starters) {
    try {
      console.log(`📍 Re-syncing #${pokemon.id} ${pokemon.name}...`);
      await syncService.syncSinglePokemon(pokemon.id);
      console.log(`  ✅ Successfully synced ${pokemon.name}`);
      successCount++;
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error(`  ❌ Error syncing ${pokemon.name}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Repair Summary:');
  console.log(`✅ Successfully synced: ${successCount} Pokemon`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('\nNow check if Gen 3 evolution chains display correctly!');
}

// Run the repair process
repairGen3Evolution().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});