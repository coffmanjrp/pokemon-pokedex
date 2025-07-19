import { supabase } from './src/sync/supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function testAllGenerations() {
  console.log('🔍 Testing all generation starters for evolution chains...\n');
  
  // Test one starter from each generation
  const testCases = [
    { id: 1, name: 'Bulbasaur', gen: 1 },
    { id: 152, name: 'Chikorita', gen: 2 },
    { id: 252, name: 'Treecko', gen: 3 },
    { id: 387, name: 'Turtwig', gen: 4 },
    { id: 495, name: 'Snivy', gen: 5 },
    { id: 650, name: 'Chespin', gen: 6 },
    { id: 722, name: 'Rowlet', gen: 7 },
    { id: 810, name: 'Grookey', gen: 8 },
    { id: 906, name: 'Sprigatito', gen: 9 },
  ];
  
  const results = { success: 0, missing: 0 };
  
  for (const testCase of testCases) {
    console.log(`\n📊 Gen ${testCase.gen} - #${testCase.id} (${testCase.name}):`);
    
    // Get Pokemon data
    const { data: pokemonData, error: pokemonError } = await supabase
      .from('pokemon')
      .select('id, name, species_data')
      .eq('id', testCase.id)
      .single();
    
    if (pokemonError) {
      console.error(`❌ Error fetching Pokemon:`, pokemonError.message);
      results.missing++;
      continue;
    }
    
    // Check evolution_chain in species_data
    const speciesData = pokemonData?.species_data as any;
    const evolutionChainUrl = speciesData?.evolution_chain?.url;
    
    if (evolutionChainUrl) {
      console.log(`✅ Evolution chain URL found: ${evolutionChainUrl}`);
      results.success++;
    } else {
      console.log(`❌ Evolution chain URL missing`);
      results.missing++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`✅ Generations with evolution chains: ${results.success}`);
  console.log(`❌ Generations missing evolution chains: ${results.missing}`);
  
  if (results.missing > 0) {
    console.log('\n⚠️  Some generations still need repair.');
  } else {
    console.log('\n🎉 All generations have evolution chains!');
  }
}

// Run the test
testAllGenerations().catch(console.error);