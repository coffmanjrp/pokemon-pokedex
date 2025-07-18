import { supabase, handleSupabaseError } from "@/lib/supabase";
import type { Pokemon } from "@/types/pokemon";
import { Locale } from "@/lib/dictionaries";
import type { Database } from "@/types/supabase";

// Transform Supabase data to match our Pokemon type
function transformSupabasePokemon(
  data: Database["public"]["Tables"]["pokemon"]["Row"],
): Pokemon {
  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    base_experience: data.base_experience,
    types: data.types,
    stats: data.stats,
    abilities: data.abilities,
    sprites: data.sprites,
    moves: data.moves || [],
    species: data.species_data,
    forms: data.form_data || [],
    // Additional fields that might be needed
    order: data.id,
    is_default: true,
    location_area_encounters: "",
    held_items: [],
    game_indices: [],
    past_types: [],
    past_abilities: [],
  };
}

// Get Pokemon by generation
export async function getPokemonByGeneration(generation: number) {
  try {
    const { data, error } = await supabase
      .from("pokemon")
      .select("*")
      .eq("generation", generation)
      .order("id");

    if (error) {
      console.error("Error fetching Pokemon by generation:", error);
      throw new Error(handleSupabaseError(error));
    }

    return data?.map(transformSupabasePokemon) || [];
  } catch (error) {
    console.error("Error in getPokemonByGeneration:", error);
    throw error;
  }
}

// Get single Pokemon by ID
export async function getPokemonById(id: number) {
  try {
    const { data, error } = await supabase
      .from("pokemon")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching Pokemon by ID:", error);
      throw new Error(handleSupabaseError(error));
    }

    return data ? transformSupabasePokemon(data) : null;
  } catch (error) {
    console.error("Error in getPokemonById:", error);
    throw error;
  }
}

// Get multiple Pokemon by IDs
export async function getPokemonByIds(ids: number[]) {
  try {
    const { data, error } = await supabase
      .from("pokemon")
      .select("*")
      .in("id", ids)
      .order("id");

    if (error) {
      console.error("Error fetching Pokemon by IDs:", error);
      throw new Error(handleSupabaseError(error));
    }

    return data?.map(transformSupabasePokemon) || [];
  } catch (error) {
    console.error("Error in getPokemonByIds:", error);
    throw error;
  }
}

// Get all Pokemon (with pagination)
export async function getAllPokemon(offset = 0, limit = 20) {
  try {
    const { data, error, count } = await supabase
      .from("pokemon")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1)
      .order("id");

    if (error) {
      console.error("Error fetching all Pokemon:", error);
      throw new Error(handleSupabaseError(error));
    }

    return {
      pokemon: data?.map(transformSupabasePokemon) || [],
      total: count || 0,
    };
  } catch (error) {
    console.error("Error in getAllPokemon:", error);
    throw error;
  }
}

// Search Pokemon by name
// TODO: Implement language-specific search using species_data in the future
// Currently the language parameter is reserved for future multi-language search functionality
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function searchPokemon(query: string, _language: Locale = "en") {
  try {
    // For now, search by English name only
    // In the future, we could search in localized names from species_data
    const { data, error } = await supabase
      .from("pokemon")
      .select("*")
      .ilike("name", `%${query}%`)
      .order("id")
      .limit(50);

    if (error) {
      console.error("Error searching Pokemon:", error);
      throw new Error(handleSupabaseError(error));
    }

    return data?.map(transformSupabasePokemon) || [];
  } catch (error) {
    console.error("Error in searchPokemon:", error);
    throw error;
  }
}

// Get Pokemon forms
export async function getPokemonForms() {
  try {
    const { data, error } = await supabase
      .from("pokemon_forms")
      .select("*")
      .order("id");

    if (error) {
      console.error("Error fetching Pokemon forms:", error);
      throw new Error(handleSupabaseError(error));
    }

    // Transform form data to match Pokemon type
    return (
      data?.map((form) => ({
        id: form.id,
        name: form.form_name,
        ...form.form_data,
        // Mark as form
        is_form: true,
        base_pokemon_id: form.pokemon_id,
      })) || []
    );
  } catch (error) {
    console.error("Error in getPokemonForms:", error);
    throw error;
  }
}

// Get Pokemon by type
export async function getPokemonByType(typeName: string) {
  try {
    const { data, error } = await supabase
      .from("pokemon")
      .select("*")
      .or(
        `types->0->type->name.eq.${typeName},types->1->type->name.eq.${typeName}`,
      )
      .order("id");

    if (error) {
      console.error("Error fetching Pokemon by type:", error);
      throw new Error(handleSupabaseError(error));
    }

    return data?.map(transformSupabasePokemon) || [];
  } catch (error) {
    console.error("Error in getPokemonByType:", error);
    throw error;
  }
}
