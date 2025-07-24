import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPokemonDetail } from "@/lib/serverDataFetching";
import { Locale, interpolate } from "@/lib/dictionaries";
import { getDictionary } from "@/lib/get-dictionary";
import {
  getPokemonName,
  getTypeName,
  getPokemonDescription,
  getGenerationName,
} from "@/lib/pokemonUtils";
import { GENERATIONS } from "@/lib/data/generations";
import {
  getAllPokemonIdsForStaticGeneration,
  getPokemonIdsByGenerationForStaticGeneration,
  getFallbackPokemonIds,
} from "@/lib/supabase/static";
import PokemonDetailClient from "./client";
import {
  generateStructuredData,
  createStructuredDataScript,
} from "@/lib/utils/structuredData";
import { getCanonicalUrl, getAlternateUrls } from "@/lib/utils/metadata";

interface PokemonDetailPageProps {
  params: Promise<{
    lang: Locale;
    id: string;
  }>;
}

// Generate static params for SSG with generational build support
export async function generateStaticParams() {
  const paths = [];
  const languages = ["en", "ja", "zh-Hans", "zh-Hant", "es", "it", "de", "fr"];

  // Check environment variables for generational build control
  const enableGenerationalBuild =
    process.env.ENABLE_GENERATIONAL_BUILD === "true";
  const targetGeneration = process.env.BUILD_GENERATION
    ? parseInt(process.env.BUILD_GENERATION)
    : null;

  console.log(
    `Build mode: ${enableGenerationalBuild ? "Generational" : "Standard"}`,
  );
  console.log(`SSG mode: Supabase`);

  if (targetGeneration) {
    console.log(`Target generation: ${targetGeneration}`);
  }

  try {
    // Use Supabase for SSG
    let pokemonIds: number[] = [];

    if (targetGeneration !== null) {
      // Fetch IDs for specific generation
      pokemonIds =
        await getPokemonIdsByGenerationForStaticGeneration(targetGeneration);
    } else {
      // Fetch all Pokemon IDs
      pokemonIds = await getAllPokemonIdsForStaticGeneration();
    }

    // Generate paths for each Pokemon and language
    for (const lang of languages) {
      for (const id of pokemonIds) {
        paths.push({
          lang,
          id: id.toString(),
        });
      }
    }

    console.log(`[SSG] Generated ${paths.length} paths using Supabase data`);
    return paths;
  } catch (error) {
    console.error(
      "[SSG] Error fetching from Supabase, falling back to generation ranges:",
      error,
    );
  }

  // Fallback: Generation-based static path generation
  if (targetGeneration !== null) {
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
        `Generated ${paths.length} paths for generation ${targetGeneration} (ID ${start}-${end})`,
      );
      return paths;
    }
  }

  // Standard build: all generations (fallback)
  const fallbackIds = getFallbackPokemonIds();
  for (const lang of languages) {
    for (const id of fallbackIds) {
      paths.push({
        lang,
        id: id.toString(),
      });
    }
  }

  console.log(`Generated ${paths.length} static paths using fallback data`);
  return paths;
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
    const dictionary = await getDictionary(lang);

    console.log(`[generateMetadata] Fetching metadata for Pokemon ID: ${id}`);

    const { pokemon } = await fetchPokemonDetail(parseInt(id));

    if (!pokemon) {
      console.log(`[generateMetadata] Pokemon not found for ID ${id}`);
      // Return basic metadata instead of throwing
      return {
        title: `Pokemon #${id} | Pokedex`,
        description:
          dictionary.ui.error.pokemonNotFound || "Pokemon information",
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

    const canonicalUrl = getCanonicalUrl(`/${lang}/pokemon/${id}`);
    const alternateUrls = getAlternateUrls(`/pokemon/${id}`, ["en", "ja"]);

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: "website",
        url: canonicalUrl,
        siteName: dictionary.meta.title,
        images: [
          {
            url: getCanonicalUrl(`/api/images/pokemon/${pokemon.id}`),
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
        images: [getCanonicalUrl(`/api/images/pokemon/${pokemon.id}`)],
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
        canonical: canonicalUrl,
        languages: alternateUrls,
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
        url: getCanonicalUrl(`/${lang || "en"}/pokemon/${id || ""}`),
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

  try {
    const dictionary = await getDictionary(lang);

    console.log(`[PokemonDetailPage] Fetching Pokemon with ID: ${id}`);

    const { pokemon } = await fetchPokemonDetail(parseInt(id));

    if (!pokemon) {
      console.error(`[PokemonDetailPage] Pokemon not found for ID ${id}`);

      // If it's a build-time error, we might want to skip this page
      if (process.env.NODE_ENV === "production") {
        console.warn(
          `[PokemonDetailPage] Skipping Pokemon ${id} due to GraphQL error during build`,
        );
        notFound();
      }
      // If we reach here at runtime, return an error UI
      return (
        <div>
          <h1>Pokemon #{id} could not be loaded</h1>
          <p>Please try again later.</p>
        </div>
      );
    }

    console.log(`[PokemonDetailPage] Response received for ID ${id}`);

    // Generate structured data for SEO
    const structuredData = generateStructuredData({
      type: "pokemon",
      pokemon,
      dictionary,
      lang,
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={createStructuredDataScript(structuredData)}
        />
        <PokemonDetailClient
          pokemon={pokemon}
          lang={lang}
          dictionary={dictionary}
        />
      </>
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
