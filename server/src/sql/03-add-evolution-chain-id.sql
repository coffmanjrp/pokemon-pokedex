-- Add evolution_chain_id column to pokemon table
ALTER TABLE pokemon 
ADD COLUMN IF NOT EXISTS evolution_chain_id INTEGER;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_pokemon_evolution_chain_id 
ON pokemon(evolution_chain_id);

-- Add comment to explain the column
COMMENT ON COLUMN pokemon.evolution_chain_id IS 'Direct reference to evolution_chains.id for faster lookups';

-- Update existing data by extracting evolution chain ID from species_data
-- This extracts the ID from URLs like "https://pokeapi.co/api/v2/evolution-chain/1/"
UPDATE pokemon
SET evolution_chain_id = (
  CASE 
    WHEN species_data->>'evolution_chain' IS NOT NULL THEN
      CAST(
        REGEXP_REPLACE(
          species_data->'evolution_chain'->>'url',
          '.*evolution-chain/(\d+)/?$',
          '\1'
        ) AS INTEGER
      )
    WHEN species_data->>'evolutionChain' IS NOT NULL THEN
      CAST(
        REGEXP_REPLACE(
          species_data->'evolutionChain'->>'url',
          '.*evolution-chain/(\d+)/?$',
          '\1'
        ) AS INTEGER
      )
    ELSE NULL
  END
)
WHERE evolution_chain_id IS NULL
  AND (
    species_data->>'evolution_chain' IS NOT NULL 
    OR species_data->>'evolutionChain' IS NOT NULL
  );

-- Verify the update
SELECT 
  COUNT(*) as total_pokemon,
  COUNT(evolution_chain_id) as with_evolution_chain,
  COUNT(*) - COUNT(evolution_chain_id) as without_evolution_chain
FROM pokemon;