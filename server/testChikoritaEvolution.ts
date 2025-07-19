import { supabase } from './src/sync/supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function testChikoritaEvolution() {
  console.log('🔍 Testing evolution chain query for Chikorita #152...\n');
  
  // Step 1: Get Pokemon data
  const { data: pokemonData, error: pokemonError } = await supabase
    .from('pokemon')
    .select('id, name, species_data')
    .eq('id', 152)
    .single();
  
  if (pokemonError) {
    console.error('❌ Error fetching Pokemon:', pokemonError);
    return;
  }
  
  console.log('✅ Pokemon data retrieved');
  console.log('Species data structure:', JSON.stringify(pokemonData?.species_data, null, 2).substring(0, 500));
  
  // Check both formats
  const speciesData = pokemonData?.species_data as any;
  console.log('\nChecking evolution_chain formats:');
  console.log('snake_case (evolution_chain):', speciesData?.evolution_chain);
  console.log('camelCase (evolutionChain):', speciesData?.evolutionChain);
}

// Run the test
testChikoritaEvolution().catch(console.error);
EOF < /dev/null