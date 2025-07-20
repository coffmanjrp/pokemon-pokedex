"use client";

import { useEffect, useState } from "react";
import { getPokemonById } from "@/lib/supabase/pokemon";
import { getEvolutionChainForPokemon } from "@/lib/supabase/evolution";
import type { Pokemon, EvolutionChain } from "@/types/pokemon";

interface UsePokemonDetailResult {
  pokemon: Pokemon | null;
  evolutionChain: EvolutionChain | null;
  loading: boolean;
  error: Error | null;
}

export function usePokemonDetail(
  pokemonId: number | string,
): UsePokemonDetailResult {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPokemonDetail() {
      setLoading(true);
      setError(null);

      try {
        const id =
          typeof pokemonId === "string" ? parseInt(pokemonId) : pokemonId;

        // Fetch Pokemon data
        const pokemonData = await getPokemonById(id);
        if (!pokemonData) {
          throw new Error(`Pokemon with ID ${id} not found`);
        }
        setPokemon(pokemonData);

        // Fetch evolution chain
        try {
          const evolutionData = await getEvolutionChainForPokemon(id);
          setEvolutionChain(evolutionData);
        } catch (evolutionError) {
          // Evolution chain fetch failure shouldn't block Pokemon display
          console.error("Failed to fetch evolution chain:", evolutionError);
          setEvolutionChain(null);
        }
      } catch (err) {
        console.error("Error fetching Pokemon detail:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch Pokemon"),
        );
        setPokemon(null);
        setEvolutionChain(null);
      } finally {
        setLoading(false);
      }
    }

    if (pokemonId) {
      fetchPokemonDetail();
    }
  }, [pokemonId]);

  return {
    pokemon,
    evolutionChain,
    loading,
    error,
  };
}
