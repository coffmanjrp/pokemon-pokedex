import { supabase } from './supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testEvolutionQuery() {
  console.log('🔍 Testing evolution chain query for Pokemon #1...\n');
  
  // Step 1: Get Pokemon data
  const { data: pokemonData, error: pokemonError } = await supabase
    .from('pokemon')
    .select('id, name, species_data')
    .eq('id', 1)
    .single();
  
  if (pokemonError) {
    console.error('❌ Error fetching Pokemon:', pokemonError);
    return;
  }
  
  console.log('✅ Pokemon data retrieved');
  console.log('Species data evolution_chain:', pokemonData?.species_data?.evolution_chain);
  
  // Step 2: Extract evolution chain ID
  const evolutionChainUrl = pokemonData?.species_data?.evolution_chain?.url;
  if (!evolutionChainUrl) {
    console.error('❌ No evolution chain URL found');
    return;
  }
  
  const evolutionChainId = evolutionChainUrl.split('/').slice(-2, -1)[0];
  console.log('\n📊 Evolution chain ID:', evolutionChainId);
  
  // Step 3: Get evolution chain data
  const { data: chainData, error: chainError } = await supabase
    .from('evolution_chains')
    .select('*')
    .eq('id', parseInt(evolutionChainId))
    .single();
  
  if (chainError) {
    console.error('❌ Error fetching evolution chain:', chainError);
    return;
  }
  
  console.log('\n✅ Evolution chain retrieved');
  console.log('Chain data (first 200 chars):', JSON.stringify(chainData?.chain_data).substring(0, 200) + '...');
}

// Run the test
testEvolutionQuery().catch(console.error);