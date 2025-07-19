import { supabase } from './supabaseClient';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function checkPokemonCount() {
  console.log('🔍 Checking Pokemon count in database...\n');
  
  try {
    // Get count by generation
    const generations = [
      { gen: 1, min: 1, max: 151 },
      { gen: 2, min: 152, max: 251 },
      { gen: 3, min: 252, max: 386 },
      { gen: 4, min: 387, max: 493 },
      { gen: 5, min: 494, max: 649 },
      { gen: 6, min: 650, max: 721 },
      { gen: 7, min: 722, max: 809 },
      { gen: 8, min: 810, max: 905 },
      { gen: 9, min: 906, max: 1025 },
    ];

    console.log('📊 Pokemon count by generation:\n');
    let totalCount = 0;

    for (const { gen, min, max } of generations) {
      const { count, error } = await supabase
        .from('pokemon')
        .select('*', { count: 'exact', head: true })
        .gte('id', min)
        .lte('id', max);

      if (error) throw error;

      console.log(`Generation ${gen}: ${count || 0} Pokemon (expected: ${max - min + 1})`);
      totalCount += count || 0;
    }

    // Check forms and special Pokemon
    const { count: formCount, error: formError } = await supabase
      .from('pokemon')
      .select('*', { count: 'exact', head: true })
      .gt('id', 10000);

    if (formError) throw formError;

    console.log(`\nSpecial Forms (ID > 10000): ${formCount || 0} Pokemon`);
    totalCount += formCount || 0;

    console.log(`\n📈 Total Pokemon in database: ${totalCount}`);

    // Get min and max IDs
    const { data: minMax, error: minMaxError } = await supabase
      .from('pokemon')
      .select('id')
      .order('id', { ascending: true })
      .limit(1);

    const { data: maxData, error: maxError } = await supabase
      .from('pokemon')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    if (!minMaxError && !maxError && minMax && maxData) {
      console.log(`\n📍 ID Range: ${minMax[0]?.id} - ${maxData[0]?.id}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run
checkPokemonCount().catch(console.error);