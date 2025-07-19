import { FEATURE_FLAGS } from "@/lib/featureFlags";
import {
  getPokemonById,
  getPokemonByGeneration,
  getPokemonForms,
} from "@/lib/supabase/pokemon";
import { getEvolutionChainForPokemon } from "@/lib/supabase/evolution";
import { apolloClient } from "@/lib/apollo";
import { GET_POKEMON, GET_POKEMONS } from "@/graphql/queries";
import type { Pokemon, EvolutionChain } from "@/types/pokemon";

// Server-side utility for fetching Pokemon detail
export async function fetchPokemonDetail(id: number) {
  if (FEATURE_FLAGS.USE_SUPABASE_FOR_DETAIL) {
    // Use Supabase
    try {
      const pokemon = await getPokemonById(id);
      let evolutionChain: EvolutionChain | null = null;

      if (pokemon) {
        try {
          evolutionChain = await getEvolutionChainForPokemon(id);
        } catch (error) {
          console.log(
            "[ServerDataFetching] Failed to fetch evolution chain:",
            error,
          );
        }
      }

      return { pokemon, evolutionChain };
    } catch (error) {
      console.error("Error fetching from Supabase:", error);
      throw error;
    }
  } else {
    // Use GraphQL
    try {
      const { data } = await apolloClient.query({
        query: GET_POKEMON,
        variables: { id },
      });

      return {
        pokemon: data.pokemon as Pokemon | null,
        evolutionChain: data.evolutionChain as EvolutionChain | null,
      };
    } catch (error) {
      console.error("Error fetching from GraphQL:", error);
      throw error;
    }
  }
}

// Server-side utility for fetching Pokemon list by generation
export async function fetchPokemonByGeneration(generation: number) {
  if (FEATURE_FLAGS.USE_SUPABASE_FOR_LIST) {
    // Use Supabase
    try {
      let pokemon: Pokemon[] = [];

      if (generation === 0) {
        pokemon = await getPokemonForms();
      } else {
        pokemon = await getPokemonByGeneration(generation);
      }

      return pokemon;
    } catch (error) {
      console.error("Error fetching from Supabase:", error);
      throw error;
    }
  } else {
    // Use GraphQL
    try {
      const { data } = await apolloClient.query({
        query: GET_POKEMONS,
        variables: { generation },
      });

      interface PokemonEdge {
        node: Pokemon;
      }

      return (
        data.pokemonList?.edges?.map((edge: PokemonEdge) => edge.node) || []
      );
    } catch (error) {
      console.error("Error fetching from GraphQL:", error);
      throw error;
    }
  }
}

// Helper to determine data source
export function getDataSource(): "supabase" | "graphql" {
  return FEATURE_FLAGS.USE_SUPABASE_FOR_LIST ||
    FEATURE_FLAGS.USE_SUPABASE_FOR_DETAIL
    ? "supabase"
    : "graphql";
}
