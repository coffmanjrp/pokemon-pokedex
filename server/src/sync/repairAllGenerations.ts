import { PokemonSyncService } from './pokemonSyncService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Repair all generations' Pokemon evolution chain URLs
 * Process in batches with proper rate limiting
 */
async function repairAllGenerations() {
  console.log('🔧 Starting comprehensive Pokemon evolution chain repair...');
  console.log('This will re-sync all Pokemon to ensure they have correct evolution_chain URLs.\n');

  const syncService = new PokemonSyncService();

  // Define generations with their ranges
  const generations = [
    { gen: 1, start: 1, end: 151, name: 'Generation 1 (Kanto)' },
    { gen: 2, start: 152, end: 251, name: 'Generation 2 (Johto)' },
    { gen: 3, start: 252, end: 386, name: 'Generation 3 (Hoenn)' },
    { gen: 4, start: 387, end: 493, name: 'Generation 4 (Sinnoh)' },
    { gen: 5, start: 494, end: 649, name: 'Generation 5 (Unova)' },
    { gen: 6, start: 650, end: 721, name: 'Generation 6 (Kalos)' },
    { gen: 7, start: 722, end: 809, name: 'Generation 7 (Alola)' },
    { gen: 8, start: 810, end: 905, name: 'Generation 8 (Galar)' },
    { gen: 9, start: 906, end: 1025, name: 'Generation 9 (Paldea)' },
  ];

  const stats = {
    totalProcessed: 0,
    totalSuccess: 0,
    totalErrors: 0,
    skipped: 0,
  };

  // Process each generation
  for (const generation of generations) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Processing ${generation.name}`);
    console.log(`   Range: #${generation.start} - #${generation.end}`);
    console.log('='.repeat(60));

    const genStats = {
      processed: 0,
      success: 0,
      errors: 0,
    };

    // Process in batches of 10 to avoid rate limits
    const batchSize = 10;
    const totalPokemon = generation.end - generation.start + 1;
    const totalBatches = Math.ceil(totalPokemon / batchSize);

    for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
      const batchStart = generation.start + (batchNum * batchSize);
      const batchEnd = Math.min(batchStart + batchSize - 1, generation.end);
      
      console.log(`\n  Batch ${batchNum + 1}/${totalBatches}: Pokemon #${batchStart}-${batchEnd}`);

      // Process each Pokemon in the batch
      for (let id = batchStart; id <= batchEnd; id++) {
        try {
          process.stdout.write(`    #${id}... `);
          await syncService.syncSinglePokemon(id);
          process.stdout.write('✅\n');
          genStats.success++;
          genStats.processed++;
        } catch (error: any) {
          if (error.message?.includes('404')) {
            process.stdout.write('⏭️  (not found)\n');
            stats.skipped++;
          } else {
            process.stdout.write('❌\n');
            console.error(`      Error: ${error.message}`);
            genStats.errors++;
          }
          genStats.processed++;
        }
      }

      // Rate limit pause between batches
      if (batchNum < totalBatches - 1) {
        process.stdout.write('  ⏸️  Pausing for rate limit...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Generation summary
    console.log(`\n  ${generation.name} Summary:`);
    console.log(`  ✅ Success: ${genStats.success}`);
    console.log(`  ❌ Errors: ${genStats.errors}`);
    console.log(`  📊 Total processed: ${genStats.processed}`);

    // Update total stats
    stats.totalProcessed += genStats.processed;
    stats.totalSuccess += genStats.success;
    stats.totalErrors += genStats.errors;

    // Longer pause between generations
    if (generation.gen < 9) {
      console.log('\n⏸️  Pausing before next generation...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('🎉 REPAIR PROCESS COMPLETED!');
  console.log('='.repeat(60));
  console.log(`📊 Final Statistics:`);
  console.log(`   ✅ Successfully synced: ${stats.totalSuccess} Pokemon`);
  console.log(`   ❌ Errors encountered: ${stats.totalErrors}`);
  console.log(`   ⏭️  Skipped (not found): ${stats.skipped}`);
  console.log(`   📊 Total processed: ${stats.totalProcessed}`);
  console.log('\nAll Pokemon should now have correct evolution_chain URLs in their species_data.');
  console.log('Evolution chains should display correctly for all generations! 🚀');
}

// Run the repair process
repairAllGenerations().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});