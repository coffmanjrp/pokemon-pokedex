import { PokemonSyncService } from './pokemonSyncService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Repair Gen 9 Pokemon evolution chain URLs only
 */
async function repairGen9() {
  console.log('🔧 Repairing Gen 9 (Paldea) Pokemon evolution chain links...\n');

  const syncService = new PokemonSyncService();

  // Gen 9 starters and first few Pokemon
  const gen9Pokemon = [
    906, 907, 908, // Sprigatito line
    909, 910, 911, // Fuecoco line
    912, 913, 914, // Quaxly line
    915, 916, 917, 918, 919, 920 // Additional Gen 9 Pokemon
  ];

  let successCount = 0;
  let errorCount = 0;

  console.log('🚀 Starting Gen 9 repair process...\n');

  for (const id of gen9Pokemon) {
    try {
      console.log(`📍 Syncing Pokemon #${id}...`);
      await syncService.syncSinglePokemon(id);
      console.log(`  ✅ Successfully synced Pokemon #${id}`);
      successCount++;
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error: any) {
      if (error.message?.includes('404')) {
        console.log(`  ⏭️  Pokemon #${id} not found (might not be released yet)`);
      } else {
        console.error(`  ❌ Error syncing Pokemon #${id}:`, error.message);
        errorCount++;
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Gen 9 Repair Summary:');
  console.log(`✅ Successfully synced: ${successCount} Pokemon`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('\nGen 9 starters should now have evolution chains!');
}

// Run the repair process
repairGen9().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});