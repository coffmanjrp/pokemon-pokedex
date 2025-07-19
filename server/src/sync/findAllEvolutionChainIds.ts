import * as dotenv from 'dotenv';
import * as path from 'path';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function findAllEvolutionChainIds() {
  console.log('🔍 Finding all evolution chain IDs from PokeAPI...\n');
  
  try {
    // First, get the total count of evolution chains
    const countResponse = await fetch('https://pokeapi.co/api/v2/evolution-chain?limit=1');
    const countData = await countResponse.json() as any;
    const totalCount = countData.count;
    
    console.log(`📊 Total evolution chains in PokeAPI: ${totalCount}`);
    
    // Fetch all evolution chain URLs
    const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain?limit=${totalCount}`);
    const data = await response.json() as any;
    
    // Extract chain IDs
    const chainIds: number[] = [];
    data.results.forEach((chain: any) => {
      const matches = chain.url.match(/evolution-chain\/(\d+)\//);
      if (matches) {
        chainIds.push(parseInt(matches[1]));
      }
    });
    
    // Sort chain IDs
    chainIds.sort((a, b) => a - b);
    
    console.log(`\n📈 Found ${chainIds.length} evolution chains`);
    console.log(`📍 ID Range: ${chainIds[0]} - ${chainIds[chainIds.length - 1]}`);
    
    // Group by ranges
    const gen1Chains = chainIds.filter(id => id <= 78);
    const gen2PlusChains = chainIds.filter(id => id > 78);
    
    console.log(`\n🔸 Gen 1 chains (ID <= 78): ${gen1Chains.length}`);
    console.log(`🔸 Gen 2+ chains (ID > 78): ${gen2PlusChains.length}`);
    
    if (gen2PlusChains.length > 0) {
      console.log(`\n📋 Gen 2+ evolution chain IDs:`);
      console.log(gen2PlusChains.join(', '));
      
      // Show some samples
      console.log(`\n🔍 Sample Gen 2+ chains (first 10):`);
      for (let i = 0; i < Math.min(10, gen2PlusChains.length); i++) {
        const chainId = gen2PlusChains[i];
        try {
          const chainResponse = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${chainId}/`);
          const chainData = await chainResponse.json() as any;
          const basePokemon = chainData.chain?.species?.name || 'Unknown';
          console.log(`  Chain ${chainId}: ${basePokemon}`);
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
          console.log(`  Chain ${chainId}: Error fetching`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run
findAllEvolutionChainIds().catch(console.error);