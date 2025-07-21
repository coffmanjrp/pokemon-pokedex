"use client";

import { usePokemonDetail } from "./usePokemonDetail";

// Unified hook that now only uses Supabase
// (GraphQL support removed as all Supabase flags are enabled)
export function usePokemonDetailUnified(pokemonId: number | string) {
  return usePokemonDetail(pokemonId);
}
