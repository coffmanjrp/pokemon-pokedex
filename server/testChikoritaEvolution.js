const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testChikoritaEvolution() {
  console.log('🔍 Testing Chikorita evolution chain...\n');
  
  // Test evolution chain 79 directly
  const { data: chainData, error: chainError } = await supabase
    .from('evolution_chains')
    .select('*')
    .eq('id', 79)
    .single();
  
  if (chainError) {
    console.error('❌ Error fetching evolution chain 79:', chainError);
  } else {
    console.log('✅ Evolution chain 79 found\!');
    console.log('Chain data structure:', Object.keys(chainData.chain_data));
    console.log('Has chain property?', \!\!chainData.chain_data.chain);
  }
}

testChikoritaEvolution();
EOF < /dev/null