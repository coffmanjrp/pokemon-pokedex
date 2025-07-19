import { supabase } from './supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function checkSyncedChains() {
  console.log('🔍 Checking synced evolution chains...\n');
  
  try {
    // Get total count
    const { count: totalCount, error: countError } = await supabase
      .from('evolution_chains')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    console.log(`📊 Total evolution chains in database: ${totalCount}`);

    // Get count by ranges
    const ranges = [
      { name: 'Gen 1', min: 1, max: 78 },
      { name: 'Gen 2', min: 79, max: 150 },
      { name: 'Gen 3', min: 151, max: 250 },
      { name: 'Gen 4-5', min: 251, max: 350 },
      { name: 'Gen 6-7', min: 351, max: 450 },
      { name: 'Gen 8-9', min: 451, max: 549 },
    ];

    for (const range of ranges) {
      const { count, error } = await supabase
        .from('evolution_chains')
        .select('*', { count: 'exact', head: true })
        .gte('id', range.min)
        .lte('id', range.max);

      if (error) throw error;

      console.log(`${range.name} (ID ${range.min}-${range.max}): ${count} chains`);
    }

    // Check some specific Gen 2 chains
    console.log('\n🔍 Checking specific Gen 2 chains:');
    const gen2Chains = [79, 80, 81]; // Chikorita, Cyndaquil, Totodile
    
    for (const chainId of gen2Chains) {
      const { data, error } = await supabase
        .from('evolution_chains')
        .select('id, chain_data')
        .eq('id', chainId)
        .single();

      if (error) {
        console.log(`❌ Chain ${chainId}: Not found`);
      } else {
        const basePokemon = data?.chain_data?.chain?.name || 'Unknown';
        console.log(`✅ Chain ${chainId}: ${basePokemon}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run
checkSyncedChains().catch(console.error);