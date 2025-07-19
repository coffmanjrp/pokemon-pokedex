import { PokemonSyncService } from './pokemonSyncService';

async function syncAllPokemon() {
  console.log('🔄 Starting full Pokemon sync with evolution chain data...');
  
  try {
    const syncService = new PokemonSyncService();
    
    // Sync all generations
    const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    
    for (const generation of generations) {
      console.log(`\n📦 Syncing Generation ${generation}...`);
      await syncService.syncPokemonByGeneration(generation);
      console.log(`✅ Generation ${generation} sync completed!`);
    }
    
    console.log('\n🎉 All Pokemon sync completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during sync:', error);
    process.exit(1);
  }
}

syncAllPokemon();