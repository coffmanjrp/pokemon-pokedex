import { PokemonSyncService } from './pokemonSyncService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Repair Gen 8 and 9 Pokemon evolution chain URLs
 */
async function repairGen8And9() {
  console.log('🔧 Repairing Gen 8 and 9 Pokemon evolution chain links...\n');

  const syncService = new PokemonSyncService();

  // Define generations to repair
  const generations = [
    { gen: 8, start: 810, end: 905, name: 'Generation 8 (Galar)' },
    { gen: 9, start: 906, end: 1025, name: 'Generation 9 (Paldea)' },
  ];

  const stats = {
    totalSuccess: 0,
    totalErrors: 0,
    skipped: 0,
  };

  // Process each generation
  for (const generation of generations) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📦 Processing ${generation.name}`);
    console.log(`   Range: #${generation.start} - #${generation.end}`);

    const genStats = {
      success: 0,
      errors: 0,
    };

    // Process in smaller batches to avoid timeouts
    const batchSize = 10;
    const totalPokemon = generation.end - generation.start + 1;
    const totalBatches = Math.ceil(totalPokemon / batchSize);

    for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
      const batchStart = generation.start + (batchNum * batchSize);
      const batchEnd = Math.min(batchStart + batchSize - 1, generation.end);
      
      console.log(`\n  Batch ${batchNum + 1}/${totalBatches}: #${batchStart}-${batchEnd}`);

      // Process each Pokemon individually with better error handling
      for (let id = batchStart; id <= batchEnd; id++) {
        try {
          process.stdout.write(`    #${id}... `);
          await syncService.syncSinglePokemon(id);
          process.stdout.write('✅\n');
          genStats.success++;
        } catch (error: any) {
          if (error.message?.includes('404')) {
            process.stdout.write('⏭️  (not found)\n');
            stats.skipped++;
          } else if (error.message?.includes('fetch failed')) {
            process.stdout.write('🔄 (retrying)... ');
            // Retry once after a delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
              await syncService.syncSinglePokemon(id);
              process.stdout.write('✅\n');
              genStats.success++;
            } catch (retryError: any) {
              process.stdout.write('❌\n');
              console.error(`      Error: ${retryError.message}`);
              genStats.errors++;
            }
          } else {
            process.stdout.write('❌\n');
            console.error(`      Error: ${error.message}`);
            genStats.errors++;
          }
        }
      }

      // Rate limit pause between batches
      if (batchNum < totalBatches - 1) {
        console.log('  ⏸️  Pausing for rate limit...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Generation summary
    console.log(`\n  ${generation.name} Complete:`);
    console.log(`  ✅ Success: ${genStats.success}`);
    console.log(`  ❌ Errors: ${genStats.errors}`);

    stats.totalSuccess += genStats.success;
    stats.totalErrors += genStats.errors;
  }

  // Final summary
  console.log('\n' + '='.repeat(50));
  console.log('🎉 REPAIR PROCESS COMPLETED!');
  console.log('='.repeat(50));
  console.log(`📊 Final Statistics:`);
  console.log(`   ✅ Successfully synced: ${stats.totalSuccess} Pokemon`);
  console.log(`   ❌ Errors: ${stats.totalErrors}`);
  console.log(`   ⏭️  Skipped (not found): ${stats.skipped}`);
  console.log('\nGen 8 and 9 Pokemon should now display evolution chains correctly! 🚀');
}

// Run the repair process
repairGen8And9().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});