import { supabase, handleSupabaseError } from "@/lib/supabase";
import { GENERATIONS } from "@/lib/data/generations";
import { REAL_FORM_IDS } from "@/lib/data/formIds";

// Get all Pokemon IDs for static generation
export async function getAllPokemonIdsForStaticGeneration() {
  try {
    console.log("[SSG] Fetching all Pokemon IDs from Supabase...");

    // Fetch all regular Pokemon IDs
    const { data: regularPokemon, error: regularError } = await supabase
      .from("pokemon")
      .select("id")
      .order("id");

    if (regularError) {
      console.error("[SSG] Error fetching regular Pokemon IDs:", regularError);
      throw new Error(handleSupabaseError(regularError));
    }

    // Fetch all form Pokemon IDs
    const { data: formPokemon, error: formError } = await supabase
      .from("pokemon_forms")
      .select("id")
      .order("id");

    if (formError) {
      console.error("[SSG] Error fetching form Pokemon IDs:", formError);
      throw new Error(handleSupabaseError(formError));
    }

    // Combine all IDs
    const allIds = [
      ...(regularPokemon?.map((p) => p.id) || []),
      ...(formPokemon?.map((p) => p.id) || []),
    ];

    console.log(
      `[SSG] Successfully fetched ${allIds.length} Pokemon IDs from Supabase`,
    );
    return allIds;
  } catch (error) {
    console.error("[SSG] Error in getAllPokemonIdsForStaticGeneration:", error);
    throw error;
  }
}

// Get Pokemon IDs by generation for static generation
export async function getPokemonIdsByGenerationForStaticGeneration(
  generation: number,
) {
  try {
    console.log(
      `[SSG] Fetching Pokemon IDs for generation ${generation} from Supabase...`,
    );

    if (generation === 0) {
      // For generation 0, use REAL_FORM_IDS
      console.log(
        `[SSG] Using REAL_FORM_IDS for generation 0: ${REAL_FORM_IDS.length} forms`,
      );
      return REAL_FORM_IDS;
    }

    // For regular generations, fetch from database
    const { data, error } = await supabase
      .from("pokemon")
      .select("id")
      .eq("generation", generation)
      .order("id");

    if (error) {
      console.error(
        `[SSG] Error fetching Pokemon IDs for generation ${generation}:`,
        error,
      );
      throw new Error(handleSupabaseError(error));
    }

    const ids = data?.map((p) => p.id) || [];
    console.log(
      `[SSG] Successfully fetched ${ids.length} Pokemon IDs for generation ${generation}`,
    );
    return ids;
  } catch (error) {
    console.error(
      `[SSG] Error in getPokemonIdsByGenerationForStaticGeneration:`,
      error,
    );
    throw error;
  }
}

// Fallback to generation ranges if Supabase is unavailable
export function getFallbackPokemonIds(): number[] {
  console.log("[SSG] Using fallback generation ranges...");
  const allIds: number[] = [];

  // Add regular Pokemon from all generations
  for (const generation of GENERATIONS) {
    const { start, end } = generation.pokemonRange;
    for (let i = start; i <= end; i++) {
      allIds.push(i);
    }
  }

  // Add form Pokemon
  allIds.push(...REAL_FORM_IDS);

  console.log(`[SSG] Generated ${allIds.length} fallback Pokemon IDs`);
  return allIds;
}
