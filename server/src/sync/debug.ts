#!/usr/bin/env node

import { supabase } from './supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function inspectPokemon(id: number) {
  console.log(`🔍 Inspecting Pokemon #${id} in Supabase...`);
  
  const { data, error } = await supabase
    .from('pokemon')
    .select('id, name, species_data')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('❌ Error fetching Pokemon:', error);
    return;
  }
  
  if (!data) {
    console.log('❌ Pokemon not found');
    return;
  }
  
  console.log(`\n📋 Pokemon #${data.id}: ${data.name}`);
  console.log('\n📊 Species Data:');
  console.log(JSON.stringify(data.species_data, null, 2));
  
  // Check specifically for evolution_chain
  if (data.species_data?.evolution_chain) {
    console.log('\n✅ Evolution chain found:', data.species_data.evolution_chain);
  } else if (data.species_data?.evolutionChain) {
    console.log('\n✅ Evolution chain found (camelCase):', data.species_data.evolutionChain);
  } else {
    console.log('\n❌ No evolution chain found in species_data');
  }
}

// Get Pokemon ID from command line
const pokemonId = parseInt(process.argv[2] || '1') || 1;
inspectPokemon(pokemonId).catch(console.error);