import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Validate environment variables
const supabaseUrl = process.env['SUPABASE_URL'];
const supabaseServiceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env'
  );
}

// Create Supabase client with service role key for full access
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Type definitions for our Supabase tables
export interface SupabasePokemon {
  id: number;
  name: string;
  height: number | null;
  weight: number | null;
  base_experience: number | null;
  types: any;
  stats: any;
  abilities: any;
  sprites: any;
  moves?: any;
  species_data: any;
  form_data?: any;
  generation: number;
}

export interface SupabaseEvolutionChain {
  id: number;
  chain_data: any;
}

export interface SupabasePokemonForm {
  id: number;
  pokemon_id: number;
  form_name: string;
  form_data: any;
  is_regional_variant: boolean;
  is_mega_evolution: boolean;
  is_gigantamax: boolean;
}