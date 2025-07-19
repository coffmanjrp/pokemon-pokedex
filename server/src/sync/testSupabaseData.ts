import { supabase } from './supabaseClient';

async function testSupabaseData() {
  try {
    // Check a sample Pokemon's species_data
    const { data, error } = await supabase
      .from('pokemon')
      .select('id, name, species_data')
      .eq('id', 1) // Bulbasaur
      .single();

    if (error) {
      console.error('Error fetching Pokemon:', error);
      return;
    }

    console.log('Pokemon data:', JSON.stringify(data, null, 2));
    
    // Check if evolution_chain exists in species_data
    const evolutionChain = data?.species_data?.evolution_chain;
    console.log('\nEvolution chain info:', evolutionChain);

    // Check a few more Pokemon
    const { data: sampleData } = await supabase
      .from('pokemon')
      .select('id, name, species_data')
      .in('id', [1, 4, 7, 25])
      .limit(5);

    console.log('\nSample Pokemon species data:');
    sampleData?.forEach((pokemon: any) => {
      const hasEvolution = !!pokemon.species_data?.evolution_chain;
      console.log(`- ${pokemon.name} (ID: ${pokemon.id}): Has evolution chain: ${hasEvolution}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

testSupabaseData();