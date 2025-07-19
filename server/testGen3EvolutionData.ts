import { supabase } from './src/sync/supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function testGen3EvolutionData() {
  console.log('🔍 Testing Gen 3 Pokemon species_data for evolution chains...\n');
  
  // Test Gen 3 starters and their evolutions
  const testCases = [
    { id: 252, name: 'Treecko', expectedChainId: 126 },
    { id: 253, name: 'Grovyle', expectedChainId: 126 },
    { id: 254, name: 'Sceptile', expectedChainId: 126 },
    { id: 255, name: 'Torchic', expectedChainId: 127 },
    { id: 256, name: 'Combusken', expectedChainId: 127 },
    { id: 257, name: 'Blaziken', expectedChainId: 127 },
    { id: 258, name: 'Mudkip', expectedChainId: 128 },
    { id: 259, name: 'Marshtomp', expectedChainId: 128 },
  ];
  
  console.log('Current state of Gen 3 Pokemon species_data:\n');
  
  for (const testCase of testCases) {
    console.log(`\n📊 Pokemon #${testCase.id} (${testCase.name}):`);
    
    // Get Pokemon data
    const { data: pokemonData, error: pokemonError } = await supabase
      .from('pokemon')
      .select('id, name, species_data')
      .eq('id', testCase.id)
      .single();
    
    if (pokemonError) {
      console.error(`❌ Error fetching Pokemon:`, pokemonError);
      continue;
    }
    
    // Check both snake_case and camelCase formats
    const speciesData = pokemonData?.species_data as any;
    const evolutionChainUrl = speciesData?.evolution_chain?.url || speciesData?.evolutionChain?.url;
    
    console.log(`- species_data.evolution_chain: ${speciesData?.evolution_chain ? '✅ Present' : '❌ Missing'}`);
    console.log(`- species_data.evolutionChain: ${speciesData?.evolutionChain ? '✅ Present' : '❌ Missing'}`);
    console.log(`- Evolution chain URL: ${evolutionChainUrl || 'NOT FOUND'}`);
    
    if (evolutionChainUrl) {
      const chainId = evolutionChainUrl.split('/').slice(-2, -1)[0];
      console.log(`- Extracted chain ID: ${chainId}`);
      console.log(`- Expected chain ID: ${testCase.expectedChainId}`);
      console.log(`- Match: ${chainId === testCase.expectedChainId.toString() ? '✅' : '❌'}`);
    }
    
    // Check if evolution chain exists in database
    const { data: chainData, error: chainError } = await supabase
      .from('evolution_chains')
      .select('id')
      .eq('id', testCase.expectedChainId)
      .single();
    
    console.log(`- Evolution chain ${testCase.expectedChainId} in DB: ${chainData ? '✅ Exists' : '❌ Missing'}`);
  }
  
  console.log('\n\n📋 Summary:');
  console.log('If evolution_chain URLs are missing, we need to re-sync these Pokemon.');
  console.log('The fix in pokemonSyncService.ts should now properly save evolution_chain URLs.');
}

// Run the test
testGen3EvolutionData().catch(console.error);