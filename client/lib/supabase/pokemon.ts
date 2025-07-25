import { supabase, handleSupabaseError } from "@/lib/supabase";
import type {
  Pokemon,
  PokemonTypeSlot,
  PokemonStat,
  PokemonAbility,
  PokemonSprites,
  PokemonSpecies,
  PokemonMove,
  OtherSprites,
} from "@/types/pokemon";
import { Locale } from "@/lib/dictionaries";
import type { Database } from "@/types/supabase";

// Transform Supabase data to match our Pokemon type
function transformSupabasePokemon(
  data: Partial<Database["public"]["Tables"]["pokemon"]["Row"]> & {
    basePokemonId?: number;
    basePokemonName?: string;
    formName?: string;
  },
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

  // Add form-specific properties if this is a form Pokemon
  if (data.basePokemonId) {
    (result as Pokemon & { basePokemonId: number }).basePokemonId =
      data.basePokemonId;
  }
  if (data.basePokemonName) {
    (result as Pokemon & { basePokemonName: string }).basePokemonName =
      data.basePokemonName;
  }
  if (data.formName) {
    (result as Pokemon & { formName: string }).formName = data.formName;
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

    return data?.map(transformSupabasePokemon) || [];
  } catch (error) {
    console.error("Error in getPokemonByGeneration:", error);
    throw error;
  }
}

// Get single Pokemon by ID
export async function getPokemonById(id: number) {
  try {
    // Check if this is a Generation 0 form Pokemon
    if (id >= 10000) {
      // First try to fetch from pokemon_forms table
      const { data: formData, error: formError } = await supabase
        .from("pokemon_forms")
        .select(
          `
          id,
          pokemon_id,
          form_name,
          form_data,
          pokemon:pokemon!pokemon_id (
            id,
            name,
            species_data
          )
        `,
        )
        .eq("id", id)
        .single();

      if (!formError && formData) {
        // Extract form data
        const formDataRecord = formData.form_data as Record<string, unknown>;
        const basePokemon = (
          formData as {
            pokemon?: { id?: number; name?: string; species_data?: unknown };
          }
        ).pokemon;

        // Create a Pokemon object with basePokemonId included
        const formPokemon = {
          ...formDataRecord,
          id,
          basePokemonId: formData.pokemon_id,
          basePokemonName: basePokemon?.name,
          formName: formData.form_name,
          // Include base Pokemon's species_data for proper name and description display
          species_data: basePokemon?.species_data,
        };

        return transformSupabasePokemon(
          formPokemon as Partial<
            Database["public"]["Tables"]["pokemon"]["Row"]
          > & {
            basePokemonId?: number;
            basePokemonName?: string;
            formName?: string;
          },
        );
      }
    }

    // Regular Pokemon or fallback for forms
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

// Search Pokemon across all generations
export async function searchAllGenerationsPokemon(
  query: string,
  filters?: { types?: string[] },
  offset = 0,
  limit = 50,
) {
  try {
    // For Japanese/other language searches, we need to fetch all and filter client-side
    // This is a temporary solution until we implement a proper server-side search
    const isNumericQuery = !isNaN(parseInt(query));

    if (!isNumericQuery && query.trim().length > 0) {
      // Fetch all Pokemon (excluding forms) for client-side filtering
      let queryBuilder = supabase
        .from("pokemon")
        .select("id, name, types, sprites, species_data")
        .lt("id", 10000)
        .order("id");

      // Apply type filters if present
      if (filters?.types && filters.types.length > 0) {
        const typeConditions = filters.types
          .map(
            (type) =>
              `types->0->type->name.eq.${type},types->1->type->name.eq.${type}`,
          )
          .join(",");
        queryBuilder = queryBuilder.or(typeConditions);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error("Error fetching Pokemon for search:", error);
        throw new Error(handleSupabaseError(error));
      }

      // Filter on client side for name matches (including localized names)
      const searchLower = query.toLowerCase();
      const filteredData =
        data?.filter((pokemon) => {
          // Check English name
          if (pokemon.name.toLowerCase().includes(searchLower)) {
            return true;
          }

          // Check localized names in species_data
          if (
            pokemon.species_data &&
            typeof pokemon.species_data === "object"
          ) {
            const speciesData = pokemon.species_data as Record<string, unknown>;
            if (speciesData.names && Array.isArray(speciesData.names)) {
              return speciesData.names.some(
                (nameObj: { name?: string }) =>
                  nameObj.name &&
                  nameObj.name.toLowerCase().includes(searchLower),
              );
            }
          }

          return false;
        }) || [];

      // Apply pagination to filtered results
      const paginatedData = filteredData.slice(offset, offset + limit);

      return {
        pokemon: paginatedData.map(transformSupabasePokemon),
        totalCount: filteredData.length,
        hasNextPage: filteredData.length > offset + limit,
      };
    } else {
      // Original logic for numeric queries or empty queries
      let queryBuilder = supabase
        .from("pokemon")
        .select("id, name, types, sprites, species_data", { count: "exact" });

      // Exclude Generation 0 forms (ID >= 10000)
      queryBuilder = queryBuilder.lt("id", 10000);

      // Apply search query
      if (query.trim()) {
        const numericQuery = parseInt(query);
        if (!isNaN(numericQuery)) {
          queryBuilder = queryBuilder.eq("id", numericQuery);
        } else {
          queryBuilder = queryBuilder.ilike("name", `%${query}%`);
        }
      }

      // Apply type filters
      if (filters?.types && filters.types.length > 0) {
        const typeConditions = filters.types
          .map(
            (type) =>
              `types->0->type->name.eq.${type},types->1->type->name.eq.${type}`,
          )
          .join(",");
        queryBuilder = queryBuilder.or(typeConditions);
      }

      // Apply pagination
      queryBuilder = queryBuilder.range(offset, offset + limit - 1).order("id");

      const { data, error, count } = await queryBuilder;

      if (error) {
        console.error("Error searching Pokemon across generations:", error);
        throw new Error(handleSupabaseError(error));
      }

      return {
        pokemon: data?.map(transformSupabasePokemon) || [],
        totalCount: count || 0,
        hasNextPage: (count || 0) > offset + limit,
      };
    }
  } catch (error) {
    console.error("Error in searchAllGenerationsPokemon:", error);
    throw error;
  }
}

// Get Pokemon forms from pokemon_forms table
export async function getPokemonForms() {
  try {
    // Fetch forms from pokemon_forms table with their base Pokemon data
    const { data, error } = await supabase
      .from("pokemon_forms")
      .select(
        `
        id,
        pokemon_id,
        form_name,
        form_data,
        is_regional_variant,
        is_mega_evolution,
        is_gigantamax,
        pokemon!inner (
          id,
          name,
          species_data
        )
      `,
      )
      .order("pokemon_id")
      .order("id");

    if (error) {
      console.error("Error fetching Pokemon forms:", error);
      throw new Error(handleSupabaseError(error));
    }

    // Transform form data to match Pokemon type
    const transformedPokemon = data?.map((form) => {
      // Extract form data
      const formData = form.form_data as Record<string, unknown>;

      // Get base Pokemon data
      const basePokemon = (
        form as {
          pokemon?: { id?: number; name?: string; species_data?: unknown };
        }
      ).pokemon;
      const baseSpeciesData = basePokemon?.species_data as
        | Record<string, unknown>
        | undefined;

      // Handle sprites with both camelCase and snake_case properties
      const rawSprites = (formData.sprites as Record<string, unknown>) || {};
      const frontDefault = rawSprites.front_default || rawSprites.frontDefault;
      const frontShiny = rawSprites.front_shiny || rawSprites.frontShiny;
      const backDefault = rawSprites.back_default || rawSprites.backDefault;
      const backShiny = rawSprites.back_shiny || rawSprites.backShiny;

      const sprites: PokemonSprites = {};

      if (frontDefault) {
        sprites.frontDefault = String(frontDefault);
      }
      if (frontShiny) {
        sprites.frontShiny = String(frontShiny);
      }
      if (backDefault) {
        sprites.backDefault = String(backDefault);
      }
      if (backShiny) {
        sprites.backShiny = String(backShiny);
      }
      if (rawSprites.other) {
        sprites.other = rawSprites.other as OtherSprites;
      }

      // Create Pokemon object from form data
      const pokemon: Pokemon = {
        id: String(form.id),
        name: (formData.name as string) || form.form_name,
        height: (formData.height as number) || 0,
        weight: (formData.weight as number) || 0,
        types: (formData.types as PokemonTypeSlot[]) || [],
        stats: (formData.stats as PokemonStat[]) || [],
        abilities: (formData.abilities as PokemonAbility[]) || [],
        sprites: sprites,
        moves: [], // Forms typically don't have separate moves
        // Add form-specific properties
        basePokemonId: form.pokemon_id,
        formName: form.form_name,
        isRegionalVariant: form.is_regional_variant,
        isMegaEvolution: form.is_mega_evolution,
        isDynamax: form.is_gigantamax,
      } as Pokemon & {
        basePokemonId?: number;
      };

      // Add species data from base Pokemon if available
      if (baseSpeciesData && basePokemon) {
        pokemon.species = {
          id: String(baseSpeciesData.id || basePokemon.id || form.pokemon_id),
          name:
            (baseSpeciesData.name as string) ||
            basePokemon.name ||
            form.form_name,
          names: (baseSpeciesData.names as PokemonSpecies["names"]) || [],
          flavorTextEntries:
            (
              baseSpeciesData.flavor_text_entries as Array<{
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
          genera: (baseSpeciesData.genera as PokemonSpecies["genera"]) || [],
          generation:
            baseSpeciesData.generation as PokemonSpecies["generation"],
          evolutionChain:
            baseSpeciesData.evolution_chain as PokemonSpecies["evolutionChain"],
          genderRate: (baseSpeciesData.gender_rate ??
            baseSpeciesData.genderRate) as number,
          hasGenderDifferences: (baseSpeciesData.has_gender_differences ??
            baseSpeciesData.hasGenderDifferences ??
            false) as boolean,
          isBaby: (baseSpeciesData.is_baby ??
            baseSpeciesData.isBaby ??
            false) as boolean,
          isLegendary: (baseSpeciesData.is_legendary ??
            baseSpeciesData.isLegendary ??
            false) as boolean,
          isMythical: (baseSpeciesData.is_mythical ??
            baseSpeciesData.isMythical ??
            false) as boolean,
        } as PokemonSpecies;
      }

      return pokemon;
    });

    return transformedPokemon || [];
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
