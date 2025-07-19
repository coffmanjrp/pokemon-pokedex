import { supabase } from './supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testEvolutionDetails() {
  console.log('🔍 Testing evolution details for Bulbasaur evolution chain...\n');
  
  try {
    // Get evolution chain for Bulbasaur
    const { data: chainData, error: chainError } = await supabase
      .from('evolution_chains')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (chainError) {
      console.error('❌ Error fetching evolution chain:', chainError);
      return;
    }
    
    const evolutionData = chainData?.chain_data;
    const chain = evolutionData?.chain;
    
    console.log('📊 Evolution chain structure:');
    
    // Check first evolution (Bulbasaur -> Ivysaur)
    if (chain && chain.evolvesTo && chain.evolvesTo.length > 0) {
      const firstEvolution = chain.evolvesTo[0];
      console.log('\n1️⃣ First evolution (Bulbasaur -> Ivysaur):');
      console.log('- Evolution name:', firstEvolution.name);
      console.log('- Evolution details:', JSON.stringify(firstEvolution.evolutionDetails, null, 2));
      console.log('- MinLevel:', firstEvolution.evolutionDetails?.[0]?.minLevel);
      console.log('- min_level:', firstEvolution.evolutionDetails?.[0]?.min_level);
      
      // Check second evolution (Ivysaur -> Venusaur)
      if (firstEvolution.evolvesTo && firstEvolution.evolvesTo.length > 0) {
        const secondEvolution = firstEvolution.evolvesTo[0];
        console.log('\n2️⃣ Second evolution (Ivysaur -> Venusaur):');
        console.log('- Evolution name:', secondEvolution.name);
        console.log('- Evolution details:', JSON.stringify(secondEvolution.evolutionDetails, null, 2));
      }
    }
    
    // Test with Charmander chain
    const { data: charmanderChain, error: charmanderError } = await supabase
      .from('evolution_chains')
      .select('*')
      .eq('id', 4)
      .single();
      
    if (!charmanderError && charmanderChain) {
      const charChain = charmanderChain.chain_data?.chain;
      console.log('\n\n🔥 Charmander evolution chain:');
      
      if (charChain && charChain.evolvesTo && charChain.evolvesTo.length > 0) {
        const firstEvo = charChain.evolvesTo[0];
        console.log('\n1️⃣ Charmander -> Charmeleon:');
        console.log('- Evolution details:', JSON.stringify(firstEvo.evolutionDetails, null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testEvolutionDetails().catch(console.error);