import { PokemonSyncService } from './pokemonSyncService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Repair script to re-sync all Pokemon with correct evolution_chain URLs
 * This fixes the issue where Gen 3+ Pokemon were missing evolution_chain data
 * due to the property name mismatch (evolutionChain vs evolution_chain)
 */
async function repairEvolutionChainLinks() {
  console.log('🔧 Starting Pokemon evolution chain repair process...');
  console.log('This will re-sync all Pokemon to ensure they have correct evolution_chain URLs.\n');

  const syncService = new PokemonSyncService();

  // Define batches for all generations
  const batches = [
    { start: 1, end: 151, name: 'Generation 1' },
    { start: 152, end: 251, name: 'Generation 2' },
    { start: 252, end: 386, name: 'Generation 3' },
    { start: 387, end: 493, name: 'Generation 4' },
    { start: 494, end: 649, name: 'Generation 5' },
    { start: 650, end: 721, name: 'Generation 6' },
    { start: 722, end: 809, name: 'Generation 7' },
    { start: 810, end: 905, name: 'Generation 8' },
    { start: 906, end: 1025, name: 'Generation 9' },
  ];

  let totalFixed = 0;
  let totalErrors = 0;

  for (const batch of batches) {
    console.log(`\n📦 Processing ${batch.name} (IDs ${batch.start}-${batch.end})...`);
    
    try {
      // Process in smaller chunks to avoid rate limits
      const chunkSize = 20;
      let processedInBatch = 0;
      
      for (let i = batch.start; i <= batch.end; i += chunkSize) {
        const end = Math.min(i + chunkSize - 1, batch.end);
        console.log(`  Processing Pokemon ${i}-${end}...`);
        
        // Sync each Pokemon individually to ensure evolution_chain is properly set
        for (let id = i; id <= end; id++) {
          try {
            await syncService.syncSinglePokemon(id);
            processedInBatch++;
          } catch (error: any) {
            if (error.message?.includes('404')) {
              // Skip Pokemon that don't exist (like some form IDs)
              continue;
            }
            console.error(`    ❌ Error syncing Pokemon ${id}:`, error.message);
            totalErrors++;
          }
        }
        
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log(`  ✅ Processed ${processedInBatch} Pokemon in ${batch.name}`);
      totalFixed += processedInBatch;
      
    } catch (error) {
      console.error(`\n❌ Error processing ${batch.name}:`, error);
      totalErrors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Repair process completed!');
  console.log(`✅ Successfully processed: ${totalFixed} Pokemon`);
  console.log(`❌ Errors encountered: ${totalErrors}`);
  console.log('\nAll Pokemon should now have correct evolution_chain URLs in their species_data.');
  console.log('Gen 3+ Pokemon should now display evolution chains correctly.');
}

// Run the repair process
repairEvolutionChainLinks().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});