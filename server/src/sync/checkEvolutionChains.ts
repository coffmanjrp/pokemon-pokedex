import { supabase } from './supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function checkEvolutionChains() {
  console.log('🔍 Checking evolution chains in Supabase...');
  
  // Count total evolution chains
  const { count, error: countError } = await supabase
    .from('evolution_chains')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.error('❌ Error counting evolution chains:', countError);
    return;
  }
  
  console.log(`\n📊 Total evolution chains: ${count}`);
  
  // Get a sample evolution chain (Bulbasaur's chain)
  const { data: sampleChain, error: sampleError } = await supabase
    .from('evolution_chains')
    .select('*')
    .eq('id', 1)
    .single();
  
  if (sampleError) {
    console.error('❌ Error fetching sample chain:', sampleError);
    return;
  }
  
  if (sampleChain) {
    console.log('\n📋 Sample Evolution Chain (ID: 1):');
    console.log('Chain structure:', JSON.stringify(sampleChain.chain_data, null, 2).substring(0, 500) + '...');
  }
}

// Run the check
checkEvolutionChains().catch(console.error);