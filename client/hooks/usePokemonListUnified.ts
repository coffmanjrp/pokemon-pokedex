"use client";

import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { usePokemonList } from "./usePokemonList";
import { usePokemonListSupabase } from "./usePokemonListSupabase";
import type { Pokemon } from "@/types/pokemon";

interface UsePokemonListOptions {
  generation?: number;
  initialPokemon?: Pokemon[];
  autoFetch?: boolean;
}

// Unified hook that switches between GraphQL and Supabase based on feature flag
export function usePokemonListUnified(options: UsePokemonListOptions = {}) {
  const graphqlResult = usePokemonList(
    !FEATURE_FLAGS.USE_SUPABASE_FOR_LIST
      ? options
      : { ...options, autoFetch: false },
  );
  const supabaseResult = usePokemonListSupabase(
    FEATURE_FLAGS.USE_SUPABASE_FOR_LIST
      ? options
      : { ...options, autoFetch: false },
  );

  return FEATURE_FLAGS.USE_SUPABASE_FOR_LIST ? supabaseResult : graphqlResult;
}
