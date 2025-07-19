import { PokemonSyncService } from './pokemonSyncService';

async function testSinglePokemonSync() {
  const pokemonId = process.argv[2] ? parseInt(process.argv[2]) : 1;
  console.log(`🧪 Testing single Pokemon sync for Pokemon #${pokemonId}...`);
  
  try {
    const syncService = new PokemonSyncService();
    
    // Sync the specified Pokemon
    await syncService.syncSinglePokemon(pokemonId);
    
    console.log(`✅ Single Pokemon sync completed for Pokemon #${pokemonId}!`);
    console.log('Now check if evolution chain data is included in species_data');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testSinglePokemonSync();