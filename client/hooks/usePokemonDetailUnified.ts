"use client";

import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { usePokemonDetailSupabase } from "./usePokemonDetailSupabase";
import { useQuery } from "@apollo/client";
import { GET_POKEMON_DETAIL } from "@/lib/graphql/queries";
import type { Pokemon, EvolutionChain } from "@/types/pokemon";

// Unified hook that switches between GraphQL and Supabase based on feature flag
export function usePokemonDetailUnified(pokemonId: number | string) {
  const id = typeof pokemonId === "string" ? parseInt(pokemonId) : pokemonId;

  // Call both hooks unconditionally to satisfy React's rules of hooks
  const supabaseResult = usePokemonDetailSupabase(pokemonId);
  const { data, loading, error } = useQuery(GET_POKEMON_DETAIL, {
    variables: { id },
    skip: !id || FEATURE_FLAGS.USE_SUPABASE_FOR_DETAIL,
  });

  const graphqlResult = {
    pokemon: data?.pokemon as Pokemon | null,
    evolutionChain: data?.evolutionChain as EvolutionChain | null,
    loading,
    error: error || null,
  };

  return FEATURE_FLAGS.USE_SUPABASE_FOR_DETAIL ? supabaseResult : graphqlResult;
}
