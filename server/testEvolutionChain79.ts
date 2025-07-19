import { supabase } from './src/sync/supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function testEvolutionChain79() {
  console.log('🔍 Testing evolution chain 79 structure...\n');
  
  const { data, error } = await supabase
    .from('evolution_chains')
    .select('*')
    .eq('id', 79)
    .single();
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log('✅ Evolution chain 79 found\!');
  console.log('\n📊 Chain data structure:');
  console.log('Top-level keys:', Object.keys(data.chain_data));
  console.log('Has "chain" property?', \!\!data.chain_data.chain);
  console.log('Has "id" property?', \!\!data.chain_data.id);
  console.log('Has "url" property?', \!\!data.chain_data.url);
  
  if (data.chain_data.chain) {
    console.log('\n📋 Chain object keys:', Object.keys(data.chain_data.chain));
    console.log('Chain name:', data.chain_data.chain.name);
    console.log('Chain ID:', data.chain_data.chain.id);
  }
}

testEvolutionChain79().catch(console.error);
