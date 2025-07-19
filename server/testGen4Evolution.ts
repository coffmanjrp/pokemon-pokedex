import { supabase } from './src/sync/supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function testGen4Evolution() {
  console.log('🔍 Testing Gen 4 Pokemon evolution chains...\n');
  
  // Test Gen 4 starters
  const testCases = [
    { id: 387, name: 'Turtwig' },
    { id: 390, name: 'Chimchar' },
    { id: 393, name: 'Piplup' },
  ];
  
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
    
    // Check evolution_chain in species_data
    const speciesData = pokemonData?.species_data as any;
    const evolutionChainUrl = speciesData?.evolution_chain?.url;
    
    console.log(`- species_data.evolution_chain: ${speciesData?.evolution_chain ? '✅ Present' : '❌ Missing'}`);
    console.log(`- Evolution chain URL: ${evolutionChainUrl || 'NOT FOUND'}`);
    
    if (evolutionChainUrl) {
      const chainId = evolutionChainUrl.split('/').slice(-2, -1)[0];
      console.log(`- Evolution chain ID: ${chainId}`);
      
      // Check if evolution chain exists in database
      const { data: chainData, error: chainError } = await supabase
        .from('evolution_chains')
        .select('id')
        .eq('id', parseInt(chainId))
        .single();
      
      console.log(`- Evolution chain ${chainId} in DB: ${chainData ? '✅ Exists' : '❌ Missing'}`);
    }
  }
  
  console.log('\n✅ If all three starters show evolution_chain URLs, Gen 4+ repair was successful!');
}

// Run the test
testGen4Evolution().catch(console.error);