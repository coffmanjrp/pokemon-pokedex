"use client";

import { usePokemonListSupabase } from "./usePokemonListSupabase";
import type { Pokemon } from "@/types/pokemon";

interface UsePokemonListOptions {
  generation?: number;
  initialPokemon?: Pokemon[];
  autoFetch?: boolean;
}

// Unified hook that now only uses Supabase
// (GraphQL support removed as all Supabase flags are enabled)
export function usePokemonListUnified(options: UsePokemonListOptions = {}) {
  return usePokemonListSupabase(options);
}
