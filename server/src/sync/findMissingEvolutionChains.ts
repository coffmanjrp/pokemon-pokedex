import { supabase } from './supabaseClient';

/**
 * Find Pokemon that are missing evolution_chain_id
 */
export async function findMissingEvolutionChains() {
  console.log('🔍 Finding Pokemon with missing evolution chains...\n');
  
  try {
    // Get all Pokemon without evolution_chain_id
    const { data: missingPokemon, error } = await supabase
      .from('pokemon')
      .select('id, name, generation, species_data')
      .is('evolution_chain_id', null)
      .order('id');
    
    if (error) {
      console.error('❌ Error fetching Pokemon:', error);
      return;
    }
    
    console.log(`Found ${missingPokemon?.length || 0} Pokemon without evolution_chain_id:\n`);
    
    // Group by generation for better visibility
    const byGeneration: Record<number, typeof missingPokemon> = {};
    
    missingPokemon?.forEach(pokemon => {
      if (!byGeneration[pokemon.generation]) {
        byGeneration[pokemon.generation] = [];
      }
      byGeneration[pokemon.generation]!.push(pokemon);
    });
    
    // Display results by generation
    Object.keys(byGeneration)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .forEach(gen => {
        const genPokemon = byGeneration[parseInt(gen)];
        if (!genPokemon) return;
        
        console.log(`\nGeneration ${gen}: ${genPokemon.length} Pokemon`);
        console.log('─'.repeat(40));
        
        genPokemon.forEach(p => {
          // Check if species_data has evolution chain URL
          const speciesData = p.species_data as any;
          const hasEvolutionUrl = !!(speciesData?.evolution_chain?.url || speciesData?.evolutionChain?.url);
          
          console.log(`  #${p.id.toString().padStart(4, '0')} ${p.name.padEnd(20)} ${hasEvolutionUrl ? '⚠️  Has URL but no ID' : '❌ No evolution data'}`);
        });
      });
    
    // Summary statistics
    console.log('\n' + '═'.repeat(50));
    console.log('📊 Summary:');
    console.log('─'.repeat(50));
    
    const totalPokemon = await supabase
      .from('pokemon')
      .select('id', { count: 'exact', head: true });
    
    const withEvolutionId = await supabase
      .from('pokemon')
      .select('id', { count: 'exact', head: true })
      .not('evolution_chain_id', 'is', null);
    
    console.log(`Total Pokemon: ${totalPokemon.count}`);
    console.log(`With evolution_chain_id: ${withEvolutionId.count}`);
    console.log(`Missing evolution_chain_id: ${missingPokemon?.length || 0}`);
    console.log(`Coverage: ${((withEvolutionId.count || 0) / (totalPokemon.count || 1) * 100).toFixed(1)}%`);
    
    // Check which ones have URLs but no ID (can be fixed with update script)
    const fixableCount = missingPokemon?.filter(p => {
      const speciesData = p.species_data as any;
      return !!(speciesData?.evolution_chain?.url || speciesData?.evolutionChain?.url);
    }).length || 0;
    
    console.log(`\n⚠️  Can be fixed with update script: ${fixableCount} Pokemon`);
    console.log(`❌ Need PokeAPI sync: ${(missingPokemon?.length || 0) - fixableCount} Pokemon`);
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run if called directly
if (require.main === module) {
  findMissingEvolutionChains();
}