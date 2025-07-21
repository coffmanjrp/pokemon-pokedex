import { EnrichedEvolutionSyncService } from './enrichedEvolutionSyncService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function syncEnrichedEvolutions() {
  console.log('🚀 Enriched Evolution Chain Sync');
  console.log('📍 Supabase URL:', process.env['SUPABASE_URL']);
  console.log('🔑 Using service role key');
  console.log('⚠️  Note: This will fetch detailed data for each Pokemon in the evolution chains');
  console.log('⏱️  Estimated time: 2-3 minutes for Generation 1');
  console.log('');

  const syncService = new EnrichedEvolutionSyncService();
  
  try {
    const startTime = Date.now();
    
    await syncService.syncEnrichedEvolutionChains();
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000 / 60; // minutes
    
    console.log(`\n✅ Enriched evolution chains sync completed in ${duration.toFixed(2)} minutes!`);
  } catch (error) {
    console.error('\n❌ Enriched evolution chains sync failed:', error);
    process.exit(1);
  }
}

// Run the sync
syncEnrichedEvolutions().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});