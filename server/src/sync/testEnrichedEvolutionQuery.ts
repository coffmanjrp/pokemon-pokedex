import { supabase } from './supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testEnrichedEvolutionQuery() {
  console.log('🔍 Testing enriched evolution chain query for Pokemon #1 (Bulbasaur)...\n');
  
  try {
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
    
    console.log('\n✅ Evolution chain retrieved successfully!');
    
    // Check if we have enriched data
    const evolutionData = chainData?.chain_data;
    const chain = evolutionData?.chain;
    
    if (chain && chain.id && chain.sprites) {
      console.log('\n🎉 Evolution chain has enriched data structure!');
      console.log('First Pokemon in chain:');
      console.log('- ID:', chain.id);
      console.log('- Name:', chain.name);
      console.log('- Has sprites:', !!chain.sprites);
      console.log('- Has types:', Array.isArray(chain.types) && chain.types.length > 0);
      console.log('- Has species names:', Array.isArray(chain.species?.names));
      console.log('- Evolution details:', chain.evolutionDetails);
      
      if (chain.evolvesTo && chain.evolvesTo.length > 0) {
        console.log('\nFirst evolution:', chain.evolvesTo[0]?.name);
        console.log('- Has enriched data:', !!(chain.evolvesTo[0]?.sprites && chain.evolvesTo[0]?.types));
        
        if (chain.evolvesTo[0]?.evolvesTo?.length > 0) {
          console.log('\nSecond evolution:', chain.evolvesTo[0].evolvesTo[0]?.name);
          console.log('- Has enriched data:', !!(chain.evolvesTo[0].evolvesTo[0]?.sprites && chain.evolvesTo[0].evolvesTo[0]?.types));
        }
      }
    } else {
      console.log('\n⚠️  Evolution chain is still using raw PokeAPI format');
      console.log('Chain structure:', JSON.stringify(chain, null, 2).substring(0, 500) + '...');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testEnrichedEvolutionQuery().catch(console.error);