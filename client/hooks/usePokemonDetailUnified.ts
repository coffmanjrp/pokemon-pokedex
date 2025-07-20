"use client";

import { usePokemonDetailSupabase } from "./usePokemonDetailSupabase";

// Unified hook that now only uses Supabase
// (GraphQL support removed as all Supabase flags are enabled)
export function usePokemonDetailUnified(pokemonId: number | string) {
  return usePokemonDetailSupabase(pokemonId);
}
