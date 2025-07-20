-- Remove pokemon_forms table as it's no longer needed
-- All form data is now stored directly in the pokemon table

-- Drop the table and all its dependencies
DROP TABLE IF EXISTS pokemon_forms CASCADE;

-- Remove any indexes that were specific to pokemon_forms
-- (none currently exist, but included for completeness)

-- Note: Form Pokemon are stored in the pokemon table with:
-- - IDs in the 10000+ range (e.g., 10033 for Mega Venusaur)
-- - generation = 0 to identify them as forms
-- - form_data JSONB field for form-specific information