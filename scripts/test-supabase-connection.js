#!/usr/bin/env node

/**
 * Test script for Supabase connection
 * Run this after setting up your database schema
 * 
 * Usage: node scripts/test-supabase-connection.js
 */

require('dotenv').config({ path: './client/.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in client/.env.local');
  process.exit(1);
}

console.log('🔧 Testing Supabase connection...');
console.log(`📍 URL: ${supabaseUrl}`);
console.log(`🔑 Using anon key: ${supabaseAnonKey.substring(0, 20)}...`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n1️⃣ Testing basic connection...');
    
    // Test 1: Check if tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('pokemon')
      .select('count', { count: 'exact', head: true });
    
    if (tablesError) {
      if (tablesError.message.includes('relation "public.pokemon" does not exist')) {
        console.error('❌ Pokemon table not found!');
        console.error('Please run the SQL scripts in the Supabase SQL Editor first.');
        return;
      }
      throw tablesError;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log(`✅ Pokemon table exists (${tables} records)`);

    // Test 2: Check other tables
    console.log('\n2️⃣ Checking all tables...');
    
    const tablesToCheck = ['pokemon', 'evolution_chains', 'pokemon_forms'];
    for (const table of tablesToCheck) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error(`❌ Error checking ${table}:`, error.message);
      } else {
        console.log(`✅ Table '${table}' exists (${count || 0} records)`);
      }
    }

    // Test 3: Test read permission
    console.log('\n3️⃣ Testing read permissions...');
    const { data: readTest, error: readError } = await supabase
      .from('pokemon')
      .select('id, name')
      .limit(1);
    
    if (readError) {
      console.error('❌ Read permission test failed:', readError.message);
    } else {
      console.log('✅ Read permissions working correctly');
      if (readTest && readTest.length > 0) {
        console.log(`   Sample data: ${JSON.stringify(readTest[0])}`);
      }
    }

    // Test 4: Test write permission (should fail with anon key)
    console.log('\n4️⃣ Testing write permissions (should fail with anon key)...');
    const { error: writeError } = await supabase
      .from('pokemon')
      .insert({ id: 99999, name: 'test-pokemon', generation: 1 });
    
    if (writeError) {
      if (writeError.message.includes('new row violates row-level security policy')) {
        console.log('✅ Write protection working correctly (RLS is active)');
      } else {
        console.log('⚠️  Write failed with unexpected error:', writeError.message);
      }
    } else {
      console.error('❌ WARNING: Write succeeded with anon key! Check RLS policies.');
    }

    // Test 5: Check if RLS is enabled
    console.log('\n5️⃣ Checking Row Level Security status...');
    const { data: rlsStatus, error: rlsError } = await supabase.rpc('check_rls_status');
    
    if (rlsError) {
      // This RPC function might not exist, which is fine
      console.log('ℹ️  Cannot check RLS status via RPC (this is normal)');
    } else {
      console.log('RLS Status:', rlsStatus);
    }

    console.log('\n✅ All connection tests completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Implement data sync scripts to populate the database');
    console.log('2. Install Supabase SDK in the client: npm install @supabase/supabase-js');
    console.log('3. Start migrating GraphQL queries to Supabase queries');

  } catch (error) {
    console.error('\n❌ Connection test failed!');
    console.error('Error:', error.message);
    console.error('\n🔍 Troubleshooting steps:');
    console.error('1. Check if your Supabase project is active');
    console.error('2. Verify your environment variables are correct');
    console.error('3. Ensure you have run the SQL scripts in Supabase SQL Editor');
    console.error('4. Check Supabase dashboard for any error logs');
  }
}

// Run the test
testConnection();