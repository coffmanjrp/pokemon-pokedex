import { PokemonSyncService } from './pokemonSyncService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function syncEvolutionChains() {
  console.log('🔧 Evolution Chain Sync Runner');
  console.log('📍 Supabase URL:', process.env['SUPABASE_URL']);
  console.log('🔑 Using service role key');
  console.log('');

  const syncService = new PokemonSyncService();
  
  try {
    // Use private method via type assertion (for testing)
    await (syncService as any).syncEvolutionChains();
    console.log('\n✅ Evolution chains sync completed successfully!');
  } catch (error) {
    console.error('\n❌ Evolution chains sync failed:', error);
    process.exit(1);
  }
}

// Run the sync
syncEvolutionChains().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});