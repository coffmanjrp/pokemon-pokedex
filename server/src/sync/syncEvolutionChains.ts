import { PokemonSyncService } from './pokemonSyncService';

async function syncEvolutionChains() {
  console.log('🚀 Starting evolution chain sync...');
  
  try {
    const syncService = new PokemonSyncService();
    
    // Use reflection to call the private method
    // This is a workaround for standalone evolution sync
    const result = await (syncService as any).syncEvolutionChains();
    
    console.log('✅ Evolution chain sync completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing evolution chains:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  syncEvolutionChains();
}

export { syncEvolutionChains };