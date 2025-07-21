# Supabase Database Setup Guide

This directory contains SQL scripts for setting up the Pokemon Pokedex database in Supabase.

## Files

1. **01-schema.sql** - Main database schema
   - Creates tables: `pokemon`, `evolution_chains`, `pokemon_forms`
   - Sets up JSONB columns for flexible data storage
   - Includes triggers for automatic `updated_at` timestamps

2. **02-indexes-rls.sql** - Performance optimization and security
   - Creates indexes for fast queries
   - Sets up Row Level Security (RLS) policies
   - Includes helper functions for common queries
   - Creates a materialized view for performance

## Setup Instructions

### Step 1: Execute Schema Script

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New query**
4. Copy and paste the contents of `01-schema.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success" message

### Step 2: Execute Indexes and RLS Script

1. In the SQL Editor, click **New query** again
2. Copy and paste the contents of `02-indexes-rls.sql`
3. Click **Run**
4. This creates indexes and security policies

### Step 3: Verify Setup

Run this verification query:

```sql
-- Check tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('pokemon', 'evolution_chains', 'pokemon_forms');

-- Check indexes were created
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('pokemon', 'evolution_chains', 'pokemon_forms');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('pokemon', 'evolution_chains', 'pokemon_forms');
```

### Step 4: Test Permissions

Test that the anon key can read data:

```sql
-- This should work (reading is allowed)
SELECT COUNT(*) FROM pokemon;

-- This should fail (writing requires service role)
INSERT INTO pokemon (id, name, generation) VALUES (9999, 'test', 1);
```

## Table Structure

### pokemon
- **id**: Pokemon ID (primary key)
- **name**: Pokemon name
- **height**, **weight**, **base_experience**: Basic stats
- **types**: JSONB array of type data
- **stats**: JSONB array of base stats
- **abilities**: JSONB array of abilities
- **sprites**: JSONB object with sprite URLs
- **moves**: JSONB array of moves (optional)
- **species_data**: JSONB with names, classification flags
- **form_data**: JSONB with form-specific data
- **generation**: Generation number (0-9)

### evolution_chains
- **id**: Chain ID (primary key)
- **chain_data**: JSONB with complete evolution tree

### pokemon_forms
- **id**: Form ID (primary key)
- **pokemon_id**: Reference to base Pokemon
- **form_name**: Name of the form
- **form_data**: JSONB with form details
- **is_regional_variant**, **is_mega_evolution**, **is_gigantamax**: Boolean flags

## Performance Features

1. **Indexes**: Optimized for common queries
   - Generation filtering
   - Type searching
   - Name searching (with fuzzy match)
   - Classification queries (legendary, mythical, baby)

2. **Materialized View**: `pokemon_summary`
   - Pre-computed summary data for list views
   - Refresh with: `REFRESH MATERIALIZED VIEW CONCURRENTLY pokemon_summary;`

3. **Helper Functions**:
   - `search_pokemon_by_name(search_query, lang_code)`: Multi-language search
   - `get_pokemon_by_generation(gen, limit, offset)`: Paginated generation query

## Security

- Row Level Security (RLS) is enabled on all tables
- Public (anon key) can only READ data
- Only service_role can INSERT, UPDATE, or DELETE
- This prevents unauthorized data modifications

## Maintenance

After bulk data imports, run:

```sql
-- Update statistics for query planner
ANALYZE pokemon;
ANALYZE evolution_chains;
ANALYZE pokemon_forms;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW CONCURRENTLY pokemon_summary;
```