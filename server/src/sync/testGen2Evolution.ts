import { EnrichedEvolutionSyncService } from './enrichedEvolutionSyncService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testGen2Evolution() {
  console.log('🧪 Testing Gen 2 evolution chain sync...');
  console.log('📍 Testing with Chikorita evolution chain (ID: 79)');
  console.log('');

  const syncService = new EnrichedEvolutionSyncService();
  
  try {
    // Sync just one chain to test
    await syncService.syncEnrichedEvolutionChains(79, 79);
    
    console.log('\n✅ Test sync completed successfully!');
    console.log('Now check if Gen 2 evolution chains display correctly.');
  } catch (error) {
    console.error('\n❌ Test sync failed:', error);
    process.exit(1);
  }
}

// Run the test
testGen2Evolution().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});