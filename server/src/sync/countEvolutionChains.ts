import { supabase } from './supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function countEvolutionChains() {
  console.log('🔍 Counting evolution chains by generation...\n');
  
  try {
    // Get all Pokemon with evolution chains
    const { data: pokemonData, error } = await supabase
      .from('pokemon')
      .select('id, name, species_data')
      .not('species_data->evolution_chain', 'is', null)
      .order('id');

    if (error) throw error;

    // Group by generation
    const generationMap: Record<number, Set<number>> = {
      1: new Set(), // 1-151
      2: new Set(), // 152-251
      3: new Set(), // 252-386
      4: new Set(), // 387-493
      5: new Set(), // 494-649
      6: new Set(), // 650-721
      7: new Set(), // 722-809
      8: new Set(), // 810-905
      9: new Set(), // 906-1025
    };

    // Map evolution chain IDs to generations
    pokemonData?.forEach((pokemon: any) => {
      const evolutionChainUrl = pokemon.species_data?.evolution_chain?.url;
      if (evolutionChainUrl) {
        const matches = evolutionChainUrl.match(/evolution-chain\/(\d+)\//);
        if (matches) {
          const chainId = parseInt(matches[1]);
          
          // Determine generation based on Pokemon ID
          let generation = 0;
          if (pokemon.id <= 151) generation = 1;
          else if (pokemon.id <= 251) generation = 2;
          else if (pokemon.id <= 386) generation = 3;
          else if (pokemon.id <= 493) generation = 4;
          else if (pokemon.id <= 649) generation = 5;
          else if (pokemon.id <= 721) generation = 6;
          else if (pokemon.id <= 809) generation = 7;
          else if (pokemon.id <= 905) generation = 8;
          else if (pokemon.id <= 1025) generation = 9;
          
          if (generation > 0) {
            const genSet = generationMap[generation];
            if (genSet) {
              genSet.add(chainId);
            }
          }
        }
      }
    });

    // Check which chains are already synced
    const { data: syncedChains, error: syncedError } = await supabase
      .from('evolution_chains')
      .select('id');

    if (syncedError) throw syncedError;

    const syncedIds = new Set(syncedChains?.map(c => c.id) || []);

    // Display results
    console.log('📊 Evolution Chains by Generation:\n');
    let totalChains = 0;
    let totalSynced = 0;

    for (let gen = 1; gen <= 9; gen++) {
      const chainSet = generationMap[gen];
      if (!chainSet) continue;
      
      const chains = Array.from(chainSet);
      const syncedCount = chains.filter(id => syncedIds.has(id)).length;
      totalChains += chains.length;
      totalSynced += syncedCount;
      
      console.log(`Generation ${gen}: ${chains.length} chains (${syncedCount} synced)`);
      if (chains.length > 0 && syncedCount < chains.length) {
        const unsynced = chains.filter(id => !syncedIds.has(id));
        console.log(`  Unsynced chain IDs: ${unsynced.join(', ')}`);
      }
    }

    console.log(`\n📈 Total: ${totalChains} unique chains across all generations`);
    console.log(`✅ Synced: ${totalSynced} chains`);
    console.log(`⏳ Remaining: ${totalChains - totalSynced} chains`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the count
countEvolutionChains().catch(console.error);