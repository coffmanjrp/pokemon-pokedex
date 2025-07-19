import { PokemonSyncService } from './pokemonSyncService';

async function syncGeneration2() {
  console.log('🔄 Starting Generation 2 Pokemon sync with evolution chain data...');
  
  try {
    const syncService = new PokemonSyncService();
    
    await syncService.syncGeneration(2);
    
    console.log('\n🎉 Generation 2 Pokemon sync completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during sync:', error);
    process.exit(1);
  }
}

syncGeneration2();