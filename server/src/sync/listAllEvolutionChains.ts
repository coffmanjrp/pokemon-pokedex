import { supabase } from './supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function listAllEvolutionChains() {
  console.log('🔍 Listing all unique evolution chain IDs...\n');
  
  try {
    // Get all Pokemon with evolution chains
    const { data: pokemonData, error } = await supabase
      .from('pokemon')
      .select('id, name, species_data')
      .not('species_data->evolution_chain', 'is', null)
      .order('id');

    if (error) throw error;

    // Collect all unique evolution chain IDs
    const chainIdMap = new Map<number, { minPokemonId: number, maxPokemonId: number, count: number }>();

    pokemonData?.forEach((pokemon: any) => {
      const evolutionChainUrl = pokemon.species_data?.evolution_chain?.url;
      if (evolutionChainUrl) {
        const matches = evolutionChainUrl.match(/evolution-chain\/(\d+)\//);
        if (matches) {
          const chainId = parseInt(matches[1]);
          
          if (!chainIdMap.has(chainId)) {
            chainIdMap.set(chainId, {
              minPokemonId: pokemon.id,
              maxPokemonId: pokemon.id,
              count: 1
            });
          } else {
            const existing = chainIdMap.get(chainId)!;
            existing.minPokemonId = Math.min(existing.minPokemonId, pokemon.id);
            existing.maxPokemonId = Math.max(existing.maxPokemonId, pokemon.id);
            existing.count++;
          }
        }
      }
    });

    // Get synced chains
    const { data: syncedChains, error: syncedError } = await supabase
      .from('evolution_chains')
      .select('id')
      .order('id');

    if (syncedError) throw syncedError;

    const syncedIds = new Set(syncedChains?.map(c => c.id) || []);

    // Sort chain IDs
    const sortedChainIds = Array.from(chainIdMap.entries()).sort((a, b) => a[0] - b[0]);

    console.log('📊 Evolution Chain IDs and their Pokemon ranges:\n');
    console.log('Chain ID | Min Pokemon | Max Pokemon | Count | Synced');
    console.log('---------|-------------|-------------|-------|--------');

    let unsyncedIds: number[] = [];
    
    sortedChainIds.forEach(([chainId, info]) => {
      const synced = syncedIds.has(chainId) ? '✅' : '❌';
      console.log(
        `${chainId.toString().padEnd(8)} | ${info.minPokemonId.toString().padEnd(11)} | ${info.maxPokemonId.toString().padEnd(11)} | ${info.count.toString().padEnd(5)} | ${synced}`
      );
      
      if (!syncedIds.has(chainId)) {
        unsyncedIds.push(chainId);
      }
    });

    console.log(`\n📈 Total unique evolution chains: ${chainIdMap.size}`);
    console.log(`✅ Synced: ${syncedIds.size}`);
    console.log(`⏳ Unsynced: ${unsyncedIds.length}`);
    
    if (unsyncedIds.length > 0) {
      console.log(`\n❌ Unsynced chain IDs: ${unsyncedIds.join(', ')}`);
    }
    
    // Check for chains beyond Gen 1
    const gen2PlusChains = sortedChainIds.filter(([chainId, info]) => chainId > 78);
    if (gen2PlusChains.length > 0) {
      console.log(`\n🔍 Evolution chains beyond Gen 1 (ID > 78):`);
      gen2PlusChains.forEach(([chainId, info]) => {
        const synced = syncedIds.has(chainId) ? '✅' : '❌';
        console.log(`  Chain ${chainId}: Pokemon ${info.minPokemonId}-${info.maxPokemonId} (${info.count} Pokemon) ${synced}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run
listAllEvolutionChains().catch(console.error);