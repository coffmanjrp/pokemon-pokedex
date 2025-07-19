import { supabase } from './src/sync/supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function testPokemonEvolutionMapping() {
  console.log('🔍 Testing Pokemon to Evolution Chain mapping...\n');
  
  // Test cases: Gen 1 and Gen 2 starters
  const testCases = [
    { id: 1, name: 'Bulbasaur', expectedChainId: 1 },
    { id: 4, name: 'Charmander', expectedChainId: 2 },
    { id: 7, name: 'Squirtle', expectedChainId: 3 },
    { id: 152, name: 'Chikorita', expectedChainId: 79 },
    { id: 155, name: 'Cyndaquil', expectedChainId: 80 },
    { id: 158, name: 'Totodile', expectedChainId: 81 },
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📊 Testing Pokemon #${testCase.id} (${testCase.name}):`);
    
    // Step 1: Get Pokemon data
    const { data: pokemonData, error: pokemonError } = await supabase
      .from('pokemon')
      .select('id, name, species_data')
      .eq('id', testCase.id)
      .single();
    
    if (pokemonError) {
      console.error(`❌ Error fetching Pokemon:`, pokemonError);
      continue;
    }
    
    // Step 2: Check evolution_chain in species_data
    const evolutionChainUrl = pokemonData?.species_data?.evolution_chain?.url;
    console.log(`Evolution chain URL: ${evolutionChainUrl || 'NOT FOUND'}`);
    
    if (\!evolutionChainUrl) {
      console.error('❌ No evolution chain URL in species_data');
      continue;
    }
    
    // Step 3: Extract chain ID
    const chainId = evolutionChainUrl.split('/').slice(-2, -1)[0];
    console.log(`Extracted chain ID: ${chainId}`);
    console.log(`Expected chain ID: ${testCase.expectedChainId}`);
    console.log(`Match: ${chainId === testCase.expectedChainId.toString() ? '✅' : '❌'}`);
    
    // Step 4: Check if evolution chain exists
    const { data: chainData, error: chainError } = await supabase
      .from('evolution_chains')
      .select('id')
      .eq('id', parseInt(chainId))
      .single();
    
    if (chainError) {
      console.error(`❌ Evolution chain ${chainId} not found in database`);
    } else {
      console.log(`✅ Evolution chain ${chainId} exists in database`);
    }
  }
}

// Run the test
testPokemonEvolutionMapping().catch(console.error);
EOF < /dev/null