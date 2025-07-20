-- Pokemon Pokedex Database Schema for Supabase
-- Version: 1.0.0
-- Description: Main schema for storing Pokemon data migrated from PokeAPI

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS evolution_chains CASCADE;
DROP TABLE IF EXISTS pokemon CASCADE;

-- Main Pokemon table
-- Stores core Pokemon data with JSONB columns for complex nested structures
CREATE TABLE pokemon (
  -- Basic identification
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  
  -- Physical attributes
  height INTEGER,
  weight INTEGER,
  base_experience INTEGER,
  
  -- Complex data stored as JSONB for flexibility
  types JSONB NOT NULL DEFAULT '[]'::jsonb,
  stats JSONB NOT NULL DEFAULT '[]'::jsonb,
  abilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  sprites JSONB NOT NULL DEFAULT '{}'::jsonb,
  moves JSONB DEFAULT '[]'::jsonb, -- Can be NULL to save space if not needed
  
  -- Species information (includes names, genera, classification flags)
  species_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Form information
  form_data JSONB DEFAULT '{}'::jsonb, -- For Pokemon forms (IDs 10000+)
  
  -- Generation for filtering
  generation INTEGER NOT NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_generation CHECK (generation >= 0 AND generation <= 9),
  CONSTRAINT valid_id CHECK (id > 0)
);

-- Evolution chains table
-- Stores complete evolution chain data separately for better performance
CREATE TABLE evolution_chains (
  id INTEGER PRIMARY KEY,
  chain_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: pokemon_forms table has been removed
-- All Pokemon forms (Mega, Regional, Gigantamax, etc.) are now stored 
-- directly in the pokemon table with IDs in the 10000+ range

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_pokemon_updated_at 
  BEFORE UPDATE ON pokemon
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evolution_chains_updated_at 
  BEFORE UPDATE ON evolution_chains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE pokemon IS 'Main Pokemon data table storing all Pokemon with their attributes';
COMMENT ON COLUMN pokemon.types IS 'Array of Pokemon types with slot information';
COMMENT ON COLUMN pokemon.stats IS 'Array of base stats (HP, Attack, Defense, etc.)';
COMMENT ON COLUMN pokemon.abilities IS 'Array of abilities with hidden flag and slot';
COMMENT ON COLUMN pokemon.sprites IS 'All sprite URLs including shiny and special artwork';
COMMENT ON COLUMN pokemon.moves IS 'Array of all moves the Pokemon can learn';
COMMENT ON COLUMN pokemon.species_data IS 'Species information including names, genera, and classification flags';
COMMENT ON COLUMN pokemon.generation IS 'Generation number (0 for forms, 1-9 for regular Pokemon)';
COMMENT ON COLUMN pokemon.form_data IS 'Form-specific data for Pokemon with IDs 10000+ (Mega, Regional, etc.)';

COMMENT ON TABLE evolution_chains IS 'Complete evolution chain data for each evolutionary family';

-- Sample JSONB structure documentation
/*
Types structure:
[
  {
    "slot": 1,
    "type": {
      "id": 12,
      "name": "grass",
      "url": "https://pokeapi.co/api/v2/type/12/"
    }
  }
]

Stats structure:
[
  {
    "base_stat": 45,
    "effort": 0,
    "stat": {
      "id": 1,
      "name": "hp",
      "url": "https://pokeapi.co/api/v2/stat/1/"
    }
  }
]

Species data structure:
{
  "id": 1,
  "name": "bulbasaur",
  "names": [
    {
      "name": "Bulbasaur",
      "language": {
        "name": "en",
        "url": "..."
      }
    }
  ],
  "genera": [...],
  "gender_rate": 1,
  "has_gender_differences": false,
  "is_baby": false,
  "is_legendary": false,
  "is_mythical": false
}
*/