import { supabase } from './supabaseClient';

/**
 * Update evolution_chain_id for all Pokemon that have evolution chains in their species_data
 */
export async function updateEvolutionChainIds() {
  console.log('🚀 Starting evolution_chain_id update...');
  
  try {
    // First, let's check if the column exists
    const { error: tableError } = await supabase
      .from('pokemon')
      .select('evolution_chain_id')
      .limit(1);
    
    if (tableError && tableError.message.includes('column "evolution_chain_id" does not exist')) {
      console.error('❌ evolution_chain_id column does not exist.');
      console.log('Please run the SQL migration first:');
      console.log('\n--- SQL to run in Supabase Dashboard ---');
      console.log(`
ALTER TABLE pokemon 
ADD COLUMN IF NOT EXISTS evolution_chain_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_pokemon_evolution_chain_id 
ON pokemon(evolution_chain_id);

COMMENT ON COLUMN pokemon.evolution_chain_id IS 'Direct reference to evolution_chains.id for faster lookups';
      `);
      console.log('--- End of SQL ---\n');
      return;
    }
    
    // Get all Pokemon with species_data containing evolution chain URLs
    const { data: pokemonList, error: selectError } = await supabase
      .from('pokemon')
      .select('id, species_data')
      .or('species_data->evolution_chain.not.is.null,species_data->evolutionChain.not.is.null');
    
    if (selectError) {
      console.error('❌ Error fetching Pokemon:', selectError);
      return;
    }
    
    console.log(`Found ${pokemonList?.length || 0} Pokemon with evolution chain data`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    // Process each Pokemon
    for (const pokemon of pokemonList || []) {
      try {
        const speciesData = pokemon.species_data as any;
        const evolutionChainUrl = speciesData?.evolution_chain?.url || speciesData?.evolutionChain?.url;
        
        if (evolutionChainUrl) {
          // Extract ID from URL
          const matches = evolutionChainUrl.match(/evolution-chain\/(\d+)\//);
          if (matches && matches[1]) {
            const evolutionChainId = parseInt(matches[1]);
            
            // Update the Pokemon with the evolution_chain_id
            const { error: updateError } = await supabase
              .from('pokemon')
              .update({ evolution_chain_id: evolutionChainId })
              .eq('id', pokemon.id);
            
            if (updateError) {
              console.error(`❌ Error updating Pokemon ${pokemon.id}:`, updateError);
              errorCount++;
            } else {
              updatedCount++;
              if (updatedCount % 50 === 0) {
                console.log(`Progress: ${updatedCount} Pokemon updated...`);
              }
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error processing Pokemon ${pokemon.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n✅ Update completed!`);
    console.log(`   - Updated: ${updatedCount} Pokemon`);
    console.log(`   - Errors: ${errorCount}`);
    
    // Verify the update
    const { data: verifyData, error: verifyError } = await supabase
      .from('pokemon')
      .select('id')
      .not('evolution_chain_id', 'is', null);
    
    if (!verifyError) {
      console.log(`   - Total Pokemon with evolution_chain_id: ${verifyData?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run if called directly
if (require.main === module) {
  updateEvolutionChainIds();
}