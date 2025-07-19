import { PokemonSyncService } from './pokemonSyncService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Repair Gen 4+ Pokemon evolution chain URLs
 * (Gen 1-3 are already working correctly)
 */
async function repairGen4Plus() {
  console.log('🔧 Repairing Gen 4+ Pokemon evolution chain links...');
  console.log('Gen 1-3 are already working, so focusing on Gen 4 and beyond.\n');

  const syncService = new PokemonSyncService();

  // Define generations to repair (4+)
  const generations = [
    { gen: 4, start: 387, end: 493, name: 'Generation 4 (Sinnoh)' },
    { gen: 5, start: 494, end: 649, name: 'Generation 5 (Unova)' },
    { gen: 6, start: 650, end: 721, name: 'Generation 6 (Kalos)' },
    { gen: 7, start: 722, end: 809, name: 'Generation 7 (Alola)' },
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
    const batchSize = 20;
    const totalPokemon = generation.end - generation.start + 1;
    const totalBatches = Math.ceil(totalPokemon / batchSize);

    for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
      const batchStart = generation.start + (batchNum * batchSize);
      const batchEnd = Math.min(batchStart + batchSize - 1, generation.end);
      
      console.log(`\n  Batch ${batchNum + 1}/${totalBatches}: #${batchStart}-${batchEnd}`);

      const promises = [];
      
      // Process batch in parallel with controlled concurrency
      for (let id = batchStart; id <= batchEnd; id++) {
        promises.push(
          syncService.syncSinglePokemon(id)
            .then(() => {
              genStats.success++;
              return { id, status: '✅' };
            })
            .catch((error: any) => {
              if (error.message?.includes('404')) {
                stats.skipped++;
                return { id, status: '⏭️' };
              }
              genStats.errors++;
              return { id, status: '❌', error: error.message };
            })
        );
      }

      // Wait for batch to complete
      const results = await Promise.all(promises);
      
      // Display results
      results.forEach(result => {
        if (result.status === '❌' && 'error' in result) {
          console.log(`    #${result.id}: ${result.status} ${result.error}`);
        } else {
          process.stdout.write(`    #${result.id}: ${result.status} `);
        }
      });
      console.log(); // New line after batch

      // Rate limit pause
      if (batchNum < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    // Generation summary
    console.log(`\n  ${generation.name} Complete:`);
    console.log(`  ✅ Success: ${genStats.success}`);
    console.log(`  ❌ Errors: ${genStats.errors}`);

    stats.totalSuccess += genStats.success;
    stats.totalErrors += genStats.errors;

    // Pause between generations
    if (generation.gen < 9) {
      console.log('\n⏸️  Pausing before next generation...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(50));
  console.log('🎉 REPAIR PROCESS COMPLETED!');
  console.log('='.repeat(50));
  console.log(`📊 Final Statistics:`);
  console.log(`   ✅ Successfully synced: ${stats.totalSuccess} Pokemon`);
  console.log(`   ❌ Errors: ${stats.totalErrors}`);
  console.log(`   ⏭️  Skipped (not found): ${stats.skipped}`);
  console.log('\nGen 4+ Pokemon should now display evolution chains correctly! 🚀');
}

// Run the repair process
repairGen4Plus().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});