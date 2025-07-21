-- Add foreign key constraint between pokemon.evolution_chain_id and evolution_chains.id
-- This ensures referential integrity between the tables

-- First, let's check if there are any orphaned evolution_chain_ids
-- (IDs that don't exist in evolution_chains table)
WITH orphaned_ids AS (
  SELECT DISTINCT p.evolution_chain_id
  FROM pokemon p
  WHERE p.evolution_chain_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 
      FROM evolution_chains ec 
      WHERE ec.id = p.evolution_chain_id
    )
)
SELECT COUNT(*) as orphaned_count FROM orphaned_ids;

-- If there are orphaned IDs, set them to NULL before adding the constraint
UPDATE pokemon
SET evolution_chain_id = NULL
WHERE evolution_chain_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 
    FROM evolution_chains ec 
    WHERE ec.id = pokemon.evolution_chain_id
  );

-- Now add the foreign key constraint
ALTER TABLE pokemon
ADD CONSTRAINT fk_pokemon_evolution_chain
FOREIGN KEY (evolution_chain_id) 
REFERENCES evolution_chains(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Add comment to explain the relationship
COMMENT ON CONSTRAINT fk_pokemon_evolution_chain ON pokemon 
IS 'Links Pokemon to their evolution chain in evolution_chains table';

-- Verify the constraint was added
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'pokemon'
  AND kcu.column_name = 'evolution_chain_id';