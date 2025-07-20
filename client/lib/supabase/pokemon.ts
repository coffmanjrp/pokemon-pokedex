import { supabase, handleSupabaseError } from "@/lib/supabase";
import type {
  Pokemon,
  PokemonTypeSlot,
  PokemonStat,
  PokemonAbility,
  PokemonSprites,
  PokemonSpecies,
  PokemonMove,
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
    types: (data.types as unknown as PokemonTypeSlot[]) || [],
    stats: (data.stats as unknown as PokemonStat[]) || [],
    abilities: (data.abilities as unknown as PokemonAbility[]) || [],
    sprites: (data.sprites as unknown as PokemonSprites) || {},
  };

  // Optional properties
  if (data.base_experience !== null && data.base_experience !== undefined) {
    result.baseExperience = data.base_experience;
  }

  // Handle species_data with property name conversion
  if (data.species_data) {
    const speciesData = data.species_data as Record<string, unknown>;
    result.species = {
      id: String(speciesData.id || data.id),
      name: (speciesData.name as string) || data.name!,
      names: (speciesData.names as PokemonSpecies["names"]) || [],
      flavorTextEntries:
        (
          speciesData.flavor_text_entries as Array<{
            flavor_text?: string;
            flavorText?: string;
            language: { name: string };
            version: { name: string };
          }>
        )?.map((entry) => ({
          flavorText: entry.flavor_text || entry.flavorText || "",
          language: entry.language,
          version: entry.version,
        })) || [],
      genera: (speciesData.genera as PokemonSpecies["genera"]) || [],
      generation: speciesData.generation as PokemonSpecies["generation"],
      evolutionChain:
        speciesData.evolution_chain as PokemonSpecies["evolutionChain"],
      genderRate: (speciesData.gender_rate ?? speciesData.genderRate) as number,
      hasGenderDifferences: (speciesData.has_gender_differences ??
        speciesData.hasGenderDifferences ??
        false) as boolean,
      isBaby: (speciesData.is_baby ?? speciesData.isBaby ?? false) as boolean,
      isLegendary: (speciesData.is_legendary ??
        speciesData.isLegendary ??
        false) as boolean,
      isMythical: (speciesData.is_mythical ??
        speciesData.isMythical ??
        false) as boolean,
    } as PokemonSpecies;
  }

  // Transform moves data from database
  result.moves = (data.moves as unknown as PokemonMove[]) || [];

  // gameIndices is not stored in Supabase yet
  // TODO: Implement game indices sync when needed
  // This will enable the Game History tab on Pokemon detail pages
  result.gameIndices = [];

  return result;
}

// Get Pokemon by generation with minimal data for list view
export async function getPokemonByGeneration(generation: number) {
  try {
    console.log(`Fetching Pokemon for generation ${generation}...`);

    // Query with minimal fields plus localized names from species_data
    // For now, fetch minimal data and species_data separately to avoid parsing issues
    const { data, error } = await supabase
      .from("pokemon")
      .select("id, name, types, sprites, species_data")
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
    // Import form IDs from the data file
    const { getValidFormIds } = await import("@/lib/data/pokemonFormIds");
    const formIds = getValidFormIds();

    console.log(
      `Fetching ${formIds.length} Pokemon forms from pokemon table...`,
    );

    // Fetch forms directly from pokemon table using their IDs
    const { data, error } = await supabase
      .from("pokemon")
      .select("*")
      .in("id", formIds)
      .order("id");

    if (error) {
      console.error("Error fetching Pokemon forms:", error);
      throw new Error(handleSupabaseError(error));
    }

    console.log(`Successfully fetched ${data?.length || 0} Pokemon forms`);

    // Transform to Pokemon type with form-specific flags
    return (
      data?.map((pokemon) => {
        const transformed = transformSupabasePokemon(pokemon);
        // Add form-specific flags for internal use
        const formTransformed = transformed as Pokemon & { is_form?: boolean };
        formTransformed.is_form = true;
        return transformed;
      }) || []
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
