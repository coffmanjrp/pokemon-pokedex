import { supabase, handleSupabaseError } from "@/lib/supabase";
import type {
  Pokemon,
  PokemonTypeSlot,
  PokemonStat,
  PokemonAbility,
  PokemonSprites,
  PokemonSpecies,
} from "@/types/pokemon";
import { Locale } from "@/lib/dictionaries";
import type { Database } from "@/types/supabase";

// Transform Supabase data to match our Pokemon type
function transformSupabasePokemon(
  data: Partial<Database["public"]["Tables"]["pokemon"]["Row"]>,
): Pokemon {
  const result: Pokemon = {
    id: String(data.id!),
    name: data.name!,
    height: data.height || 0,
    weight: data.weight || 0,
    types: (data.types as PokemonTypeSlot[]) || [],
    stats: (data.stats as PokemonStat[]) || [],
    abilities: (data.abilities as PokemonAbility[]) || [],
    sprites: (data.sprites as PokemonSprites) || {},
  };

  // Optional properties
  if (data.base_experience !== null && data.base_experience !== undefined) {
    result.baseExperience = data.base_experience;
  }
  if (data.species_data) {
    result.species = data.species_data as PokemonSpecies;
  }
  result.moves = [];
  result.gameIndices = [];

  return result;
}

// Get Pokemon by generation with minimal data for list view
export async function getPokemonByGeneration(generation: number) {
  try {
    console.log(`Fetching Pokemon for generation ${generation}...`);

    // Query with minimal fields and add a timeout
    const { data, error } = await supabase
      .from("pokemon")
      .select("id, name, types, sprites")
      .eq("generation", generation)
      .order("id")
      .limit(300); // Add limit to prevent timeout on large datasets

    if (error) {
      console.error("Error fetching Pokemon by generation:", error);
      throw new Error(handleSupabaseError(error));
    }

    console.log(
      `Successfully fetched ${data?.length || 0} Pokemon for generation ${generation}`,
    );
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
