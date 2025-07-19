#!/usr/bin/env node

/**
 * Pokemon Data Sync Runner
 * 
 * This script syncs Pokemon data from PokeAPI to Supabase
 * 
 * Usage:
 *   npm run sync:all      - Sync all Pokemon data
 *   npm run sync:pokemon  - Sync single Pokemon by ID
 *   npm run sync:gen      - Sync specific generation
 */

import { PokemonSyncService } from './pokemonSyncService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const syncService = new PokemonSyncService();

async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];

  console.log('🔧 Pokemon Sync Runner');
  console.log('📍 Supabase URL:', process.env['SUPABASE_URL']);
  console.log('🔑 Using service role key');
  console.log('');

  try {
    switch (command) {
      case 'all':
        console.log('📋 Syncing all Pokemon data...');
        console.log('⚠️  This will take approximately 2-3 hours');
        console.log('');
        
        const result = await syncService.syncAllPokemon();
        console.log('\n📊 Sync Summary:');
        console.log(`Total: ${result.total}`);
        console.log(`Succeeded: ${result.succeeded}`);
        console.log(`Failed: ${result.failed}`);
        
        if (result.errors.length > 0) {
          console.log('\n❌ Errors:');
          result.errors.forEach(err => {
            console.log(`  - Pokemon ${err.id}: ${err.error}`);
          });
        }
        break;

      case 'pokemon':
        if (!arg) {
          console.error('❌ Please provide a Pokemon ID');
          console.log('Usage: npm run sync:pokemon <id>');
          process.exit(1);
        }
        
        const pokemonId = parseInt(arg, 10);
        if (isNaN(pokemonId)) {
          console.error('❌ Invalid Pokemon ID');
          process.exit(1);
        }
        
        await syncService.syncSinglePokemon(pokemonId);
        break;

      case 'gen':
        if (!arg) {
          console.error('❌ Please provide a generation number (1-9)');
          console.log('Usage: npm run sync:gen <generation>');
          process.exit(1);
        }
        
        const generation = parseInt(arg, 10);
        if (isNaN(generation) || generation < 1 || generation > 9) {
          console.error('❌ Invalid generation number. Must be 1-9');
          process.exit(1);
        }
        
        await syncService.syncGeneration(generation);
        break;

      case 'forms':
        console.log('📋 Syncing Pokemon forms...');
        await syncService.syncPokemonForms();
        break;

      case 'test':
        const testId = arg ? parseInt(arg) : 25;
        console.log(`🧪 Running test sync with Pokemon #${testId}...`);
        await syncService.syncSinglePokemon(testId);
        console.log('\n✅ Test sync completed successfully!');
        break;

      default:
        console.log('Available commands:');
        console.log('  npm run sync:all      - Sync all Pokemon data');
        console.log('  npm run sync:pokemon <id>  - Sync single Pokemon');
        console.log('  npm run sync:gen <1-9>     - Sync specific generation');
        console.log('  npm run sync:forms    - Sync Pokemon forms only');
        console.log('  npm run sync:test     - Test sync with Pikachu');
        process.exit(0);
    }

    console.log('\n✅ Sync completed successfully!');
  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    process.exit(1);
  }
}

// Run the sync
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});