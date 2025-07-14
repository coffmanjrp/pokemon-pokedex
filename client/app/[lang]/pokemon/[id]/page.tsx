import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClient } from "@/lib/apollo";
import { GET_POKEMON, GET_POKEMONS_BASIC } from "@/graphql/queries";
import { Pokemon } from "@/types/pokemon";
import { Locale, interpolate } from "@/lib/dictionaries";
import { getDictionary } from "@/lib/get-dictionary";
import {
  getPokemonName,
  getTypeName,
  getPokemonDescription,
  getGenerationName,
} from "@/lib/pokemonUtils";
import { GENERATIONS } from "@/lib/data/generations";
import PokemonDetailClient from "./client";

interface PokemonDetailPageProps {
  params: Promise<{
    lang: Locale;
    id: string;
  }>;
}

// Generate static params for SSG with generational build support
export async function generateStaticParams() {
  const paths = [];
  const languages = ["en", "ja"];

  // Check environment variables for generational build control
  const enableGenerationalBuild =
    process.env.ENABLE_GENERATIONAL_BUILD === "true";
  const targetGeneration = process.env.BUILD_GENERATION
    ? parseInt(process.env.BUILD_GENERATION)
    : null;

  console.log(
    `Build mode: ${enableGenerationalBuild ? "Generational" : "Standard"}`,
  );
  if (targetGeneration) {
    console.log(`Target generation: ${targetGeneration}`);
  }

  try {
    // Use GraphQL to get all existing Pokemon IDs
    const client = await getClient();

    // First get total count to determine how many to fetch
    const { data: countData } = await client.query({
      query: GET_POKEMONS_BASIC,
      variables: { limit: 1, offset: 0 },
    });

    const totalPokemon = countData?.pokemonsBasic?.totalCount || 1302;

    // Fetch all Pokemon to get valid IDs only
    const { data } = await client.query({
      query: GET_POKEMONS_BASIC,
      variables: { limit: totalPokemon, offset: 0 },
    });

    // Extract only valid Pokemon IDs that actually exist
    let validPokemonIds =
      data?.pokemonsBasic?.edges?.map(
        (edge: { node: { id: string } }) => edge.node.id,
      ) || [];

    // Filter Pokemon IDs based on generation if specified
    if (targetGeneration) {
      const generation = GENERATIONS.find((gen) => gen.id === targetGeneration);
      if (generation) {
        const { start, end } = generation.pokemonRange;
        validPokemonIds = validPokemonIds.filter((id: string) => {
          const pokemonId = parseInt(id);
          return pokemonId >= start && pokemonId <= end;
        });
        console.log(
          `Filtered to generation ${targetGeneration} (${generation.name.en}): ${validPokemonIds.length} Pokemon (ID ${start}-${end})`,
        );
      } else {
        console.warn(`Invalid generation: ${targetGeneration}`);
        return [];
      }
    }

    // Generate paths for valid Pokemon IDs
    for (const lang of languages) {
      for (const pokemonId of validPokemonIds) {
        paths.push({
          lang,
          id: pokemonId.toString(),
        });
      }
    }

    const generationInfo = targetGeneration
      ? ` for Generation ${targetGeneration}`
      : "";
    console.log(
      `Generating ${paths.length} static paths for ${validPokemonIds.length} valid Pokemon${generationInfo} in ${languages.length} languages`,
    );

    if (validPokemonIds.length > 0) {
      console.log(
        `Pokemon ID range: ${Math.min(...validPokemonIds.map((id: string) => parseInt(id)))}-${Math.max(...validPokemonIds.map((id: string) => parseInt(id)))}`,
      );
    }

    return paths;
  } catch (error) {
    console.error(
      "Error fetching Pokemon data from GraphQL, using generation-based fallback:",
      error,
    );

    // Generation-based fallback
    if (targetGeneration) {
      const generation = GENERATIONS.find((gen) => gen.id === targetGeneration);
      if (generation) {
        const { start, end } = generation.pokemonRange;
        for (const lang of languages) {
          for (let i = start; i <= end; i++) {
            paths.push({
              lang,
              id: i.toString(),
            });
          }
        }
        console.log(
          `Using generation ${targetGeneration} fallback: ${paths.length} paths (ID ${start}-${end})`,
        );
        return paths;
      }
    }

    // Standard fallback: all generations
    for (const generation of GENERATIONS) {
      const { start, end } = generation.pokemonRange;
      for (const lang of languages) {
        for (let i = start; i <= end; i++) {
          paths.push({
            lang,
            id: i.toString(),
          });
        }
      }
    }
    console.log(
      `Using full fallback: ${paths.length} paths for all generations`,
    );
    return paths;
  }
}

// Generate metadata for each Pokemon page
export async function generateMetadata({
  params,
}: {
  params: PokemonDetailPageProps["params"];
}): Promise<Metadata> {
  let id: string;
  let lang: Locale;

  try {
    const resolvedParams = await params;
    id = resolvedParams.id;
    lang = resolvedParams.lang;
  } catch (error) {
    console.error("[generateMetadata] Failed to resolve params:", error);
    return {
      title: "Pokemon | Pokedex",
      description: "Pokemon information page",
    };
  }

  try {
    const [dictionary, client] = await Promise.all([
      getDictionary(lang),
      getClient(),
    ]);

    console.log(`[generateMetadata] Fetching metadata for Pokemon ID: ${id}`);

    const { data, error } = await client.query({
      query: GET_POKEMON,
      variables: { id },
      errorPolicy: "all",
    });

    if (error) {
      console.error(`[generateMetadata] GraphQL error for ID ${id}:`, error);
      // Return basic metadata instead of throwing
      return {
        title: `Pokemon #${id} | Pokedex`,
        description:
          dictionary.ui.error.pokemonNotFound || "Pokemon information",
      };
    }

    const pokemon: Pokemon = data?.pokemon;

    if (!pokemon) {
      return {
        title: dictionary.ui.error.pokemonNotFound,
        description: "The requested Pokemon could not be found.",
      };
    }

    const pokemonName = getPokemonName(pokemon, lang, dictionary);
    const types = pokemon.types
      .map((t) => getTypeName(t.type.name, dictionary))
      .join("/");
    const pokemonDescription = getPokemonDescription(pokemon, lang);

    // Get stats for meta description
    const hpStat =
      pokemon.stats.find((s) => s.stat.name === "hp")?.baseStat || 0;
    const attackStat =
      pokemon.stats.find((s) => s.stat.name === "attack")?.baseStat || 0;
    const defenseStat =
      pokemon.stats.find((s) => s.stat.name === "defense")?.baseStat || 0;

    // Get generation info
    const generation = pokemon.species?.generation?.name
      ? getGenerationName(pokemon.species.generation.name, lang)
      : "";

    // Enhanced title with ID and type
    const title = interpolate(dictionary.meta.pokemonTitle, {
      name: pokemonName,
      id: pokemon.id.toString().padStart(3, "0"),
      type: types,
    });

    // Rich description with stats and Pokemon description
    const description = pokemonDescription
      ? interpolate(dictionary.meta.pokemonDescription, {
          name: pokemonName,
          type: types,
          hp: hpStat,
          attack: attackStat,
          defense: defenseStat,
          description:
            pokemonDescription.slice(0, 100) +
            (pokemonDescription.length > 100 ? "..." : ""),
        })
      : interpolate(dictionary.meta.pokemonDescriptionShort, {
          name: pokemonName,
          type: types,
          generation: generation,
          height: (pokemon.height / 10).toFixed(1),
          weight: (pokemon.weight / 10).toFixed(1),
        });

    // Keywords for SEO
    const keywords = interpolate(dictionary.meta.pokemonKeywords, {
      name: pokemonName,
      type: types,
      generation: generation,
    });

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://pokemon-pokedex-client.vercel.app/${lang}/pokemon/${id}`,
        siteName: dictionary.meta.title,
        images: [
          {
            url: `https://pokemon-pokedex-client.vercel.app/api/images/pokemon/${pokemon.id}`,
            width: 475,
            height: 475,
            alt: `${pokemonName} official artwork`,
          },
        ],
        locale: dictionary.meta.locale,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [
          `https://pokemon-pokedex-client.vercel.app/api/images/pokemon/${pokemon.id}`,
        ],
        creator: "@pokedex",
        site: "@pokedex",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      alternates: {
        canonical: `https://pokemon-pokedex-client.vercel.app/${lang}/pokemon/${id}`,
        languages: {
          en: `https://pokemon-pokedex-client.vercel.app/en/pokemon/${id}`,
          ja: `https://pokemon-pokedex-client.vercel.app/ja/pokemon/${id}`,
        },
      },
    };
  } catch (error) {
    console.error(`[generateMetadata] Unexpected error for ID ${id}:`, error);

    // Provide fallback metadata with Pokemon ID
    const fallbackTitle = id ? `Pokemon #${id} | Pokedex` : "Pokemon | Pokedex";

    return {
      title: fallbackTitle,
      description: "Pokemon information and stats",
      openGraph: {
        title: fallbackTitle,
        description: "View detailed information about this Pokemon",
        type: "website",
        url: `https://pokemon-pokedex-client.vercel.app/${lang || "en"}/pokemon/${id || ""}`,
      },
    };
  }
}

// Server Component for SSG
export default async function PokemonDetailPage({
  params,
}: {
  params: PokemonDetailPageProps["params"];
}) {
  let id: string;
  let lang: Locale;

  try {
    const resolvedParams = await params;
    id = resolvedParams.id;
    lang = resolvedParams.lang;
  } catch (error) {
    console.error("[PokemonDetailPage] Failed to resolve params:", error);
    notFound();
  }

  // Add environment debugging
  console.log("[PokemonDetailPage] Environment check:");
  console.log(`  - NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`  - BUILD_MODE: ${process.env.BUILD_MODE}`);
  console.log(`  - SERVER_MODE: ${process.env.NEXT_PUBLIC_SERVER_MODE}`);

  try {
    const [dictionary, client] = await Promise.all([
      getDictionary(lang),
      getClient(),
    ]);

    console.log(`[PokemonDetailPage] Fetching Pokemon with ID: ${id}`);

    const { data, error } = await client.query({
      query: GET_POKEMON,
      variables: { id },
      errorPolicy: "all", // Continue even if there are GraphQL errors
    });

    if (error) {
      console.error(`[PokemonDetailPage] GraphQL error for ID ${id}:`, {
        message: error.message,
        networkError: error.networkError,
        graphQLErrors: error.graphQLErrors,
      });

      // If it's a build-time error, we might want to skip this page
      if (process.env.NODE_ENV === "production" && !data?.pokemon) {
        console.warn(
          `[PokemonDetailPage] Skipping Pokemon ${id} due to GraphQL error during build`,
        );
        notFound();
      }
    }

    console.log(`[PokemonDetailPage] Response received for ID ${id}`);

    const pokemon: Pokemon = data?.pokemon;

    if (!pokemon) {
      console.warn(`[PokemonDetailPage] Pokemon with ID ${id} not found`);
      notFound();
    }

    return (
      <PokemonDetailClient
        pokemon={pokemon}
        lang={lang}
        dictionary={dictionary}
      />
    );
  } catch (error) {
    console.error(`[PokemonDetailPage] Critical error for ID ${id}:`, {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // More detailed error handling for build time
    if (process.env.NODE_ENV === "production") {
      console.warn(
        `[PokemonDetailPage] Falling back to 404 for Pokemon ${id} due to error`,
      );
    }

    notFound();
  }
}
