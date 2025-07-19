import { EnrichedEvolutionSyncService } from './enrichedEvolutionSyncService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function syncGen2PlusEvolutions() {
  console.log('🚀 Generation 2+ Evolution Chain Sync');
  console.log('📍 Supabase URL:', process.env['SUPABASE_URL']);
  console.log('🔑 Using service role key');
  console.log('⚠️  Note: This will sync evolution chains ID 79-549');
  console.log('⏱️  Estimated time: 30-45 minutes for 463 chains');
  console.log('');

  const syncService = new EnrichedEvolutionSyncService();
  
  try {
    const startTime = Date.now();
    
    // Sync in batches to avoid timeouts
    const batches = [
      { start: 79, end: 150 },   // Gen 2
      { start: 151, end: 250 },  // Gen 3
      { start: 251, end: 350 },  // Gen 4-5
      { start: 351, end: 450 },  // Gen 6-7
      { start: 451, end: 549 },  // Gen 8-9
    ];
    
    for (const batch of batches) {
      console.log(`\n🔄 Syncing batch: ID ${batch.start} to ${batch.end}`);
      await syncService.syncEnrichedEvolutionChains(batch.start, batch.end);
      
      // Short break between batches
      console.log('⏸️  Taking a 5-second break...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000 / 60; // minutes
    
    console.log(`\n✅ Generation 2+ evolution chains sync completed in ${duration.toFixed(2)} minutes!`);
  } catch (error) {
    console.error('\n❌ Generation 2+ evolution chains sync failed:', error);
    process.exit(1);
  }
}

// Run the sync
syncGen2PlusEvolutions().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});