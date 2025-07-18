-- Pokemon Pokedex Database Indexes and RLS Policies
-- Version: 1.0.0
-- Description: Performance indexes and Row Level Security policies

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Basic lookup indexes
CREATE INDEX IF NOT EXISTS idx_pokemon_generation ON pokemon(generation);
CREATE INDEX IF NOT EXISTS idx_pokemon_name ON pokemon(name);

-- JSONB indexes for efficient querying
-- GIN indexes allow efficient queries on JSONB data
CREATE INDEX IF NOT EXISTS idx_pokemon_types ON pokemon USING GIN(types);
CREATE INDEX IF NOT EXISTS idx_pokemon_species_data ON pokemon USING GIN(species_data);

-- Specific JSONB path indexes for common queries
-- Index for searching by Pokemon type name
CREATE INDEX IF NOT EXISTS idx_pokemon_type_names ON pokemon USING GIN((types -> 'type' -> 'name'));

-- Index for classification queries (legendary, mythical, baby)
CREATE INDEX IF NOT EXISTS idx_pokemon_is_legendary ON pokemon ((species_data ->> 'is_legendary'));
CREATE INDEX IF NOT EXISTS idx_pokemon_is_mythical ON pokemon ((species_data ->> 'is_mythical'));
CREATE INDEX IF NOT EXISTS idx_pokemon_is_baby ON pokemon ((species_data ->> 'is_baby'));

-- Full-text search index on Pokemon names
CREATE INDEX IF NOT EXISTS idx_pokemon_name_trgm ON pokemon USING GIN(name gin_trgm_ops);

-- Index for localized names search (supports multiple languages)
CREATE INDEX IF NOT EXISTS idx_pokemon_localized_names ON pokemon USING GIN((species_data -> 'names'));

-- Evolution chain indexes
CREATE INDEX IF NOT EXISTS idx_evolution_chains_data ON evolution_chains USING GIN(chain_data);

-- Pokemon forms indexes
CREATE INDEX IF NOT EXISTS idx_forms_pokemon_id ON pokemon_forms(pokemon_id);
CREATE INDEX IF NOT EXISTS idx_forms_variant_types ON pokemon_forms(is_regional_variant, is_mega_evolution, is_gigantamax);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE pokemon ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolution_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE pokemon_forms ENABLE ROW LEVEL SECURITY;

-- Pokemon table policies
-- Allow all authenticated and anonymous users to read Pokemon data
CREATE POLICY "Public read access for pokemon" ON pokemon
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Only service role can insert/update/delete
CREATE POLICY "Service role write access for pokemon" ON pokemon
  FOR ALL
  TO service_role
  USING (true);

-- Evolution chains policies
CREATE POLICY "Public read access for evolution_chains" ON evolution_chains
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Service role write access for evolution_chains" ON evolution_chains
  FOR ALL
  TO service_role
  USING (true);

-- Pokemon forms policies
CREATE POLICY "Public read access for pokemon_forms" ON pokemon_forms
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Service role write access for pokemon_forms" ON pokemon_forms
  FOR ALL
  TO service_role
  USING (true);

-- ==========================================
-- HELPER FUNCTIONS FOR COMMON QUERIES
-- ==========================================

-- Function to search Pokemon by partial name (supports multiple languages)
CREATE OR REPLACE FUNCTION search_pokemon_by_name(search_query TEXT, lang_code TEXT DEFAULT 'en')
RETURNS TABLE(
  id INTEGER,
  name VARCHAR(50),
  localized_name TEXT,
  types JSONB,
  sprites JSONB,
  generation INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    COALESCE(
      p.species_data -> 'names' ->> jsonb_array_elements_text(
        jsonb_path_query_array(
          p.species_data,
          '$.names[*] ? (@.language.name == $lang)',
          jsonb_build_object('lang', lang_code)
        )
      ) ->> 'name',
      p.name
    ) as localized_name,
    p.types,
    p.sprites,
    p.generation
  FROM pokemon p
  WHERE 
    p.name ILIKE '%' || search_query || '%'
    OR EXISTS (
      SELECT 1 
      FROM jsonb_array_elements(p.species_data -> 'names') AS elem
      WHERE elem ->> 'name' ILIKE '%' || search_query || '%'
    )
  ORDER BY p.id;
END;
$$ LANGUAGE plpgsql;

-- Function to get Pokemon by generation with pagination
CREATE OR REPLACE FUNCTION get_pokemon_by_generation(
  gen INTEGER,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
  id INTEGER,
  name VARCHAR(50),
  types JSONB,
  sprites JSONB,
  species_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.types,
    p.sprites,
    p.species_data
  FROM pokemon p
  WHERE p.generation = gen
  ORDER BY p.id
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- PERFORMANCE OPTIMIZATION
-- ==========================================

-- Update table statistics for query planner
ANALYZE pokemon;
ANALYZE evolution_chains;
ANALYZE pokemon_forms;

-- Create a materialized view for frequently accessed Pokemon summary data
-- This can significantly improve performance for list views
CREATE MATERIALIZED VIEW IF NOT EXISTS pokemon_summary AS
SELECT 
  p.id,
  p.name,
  p.generation,
  p.types,
  p.sprites -> 'other' -> 'official-artwork' -> 'front_default' as artwork_url,
  p.species_data -> 'names' as localized_names,
  (p.species_data ->> 'is_legendary')::boolean as is_legendary,
  (p.species_data ->> 'is_mythical')::boolean as is_mythical,
  (p.species_data ->> 'is_baby')::boolean as is_baby
FROM pokemon p;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_pokemon_summary_id ON pokemon_summary(id);
CREATE INDEX IF NOT EXISTS idx_pokemon_summary_generation ON pokemon_summary(generation);

-- Add comment for documentation
COMMENT ON MATERIALIZED VIEW pokemon_summary IS 'Cached summary data for Pokemon list views - refresh after data updates';

-- ==========================================
-- MAINTENANCE NOTES
-- ==========================================

/*
To refresh the materialized view after data updates:
REFRESH MATERIALIZED VIEW CONCURRENTLY pokemon_summary;

To check index usage:
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

To check table sizes:
SELECT 
  relname AS "table",
  pg_size_pretty(pg_total_relation_size(relid)) AS "size"
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(relid) DESC;
*/