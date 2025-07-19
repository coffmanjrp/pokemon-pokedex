import { PokemonSyncService } from './pokemonSyncService';

async function testSinglePokemonSync() {
  console.log('🧪 Testing single Pokemon sync with evolution chain...');
  
  try {
    const syncService = new PokemonSyncService();
    
    // Sync Bulbasaur (ID: 1) which has evolution chain
    await syncService.syncSinglePokemon(1);
    
    console.log('✅ Single Pokemon sync completed!');
    console.log('Now check if evolution chain data is included in species_data');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testSinglePokemonSync();