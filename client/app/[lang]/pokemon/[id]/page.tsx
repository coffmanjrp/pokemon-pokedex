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
import PokemonDetailClient from "./client";

interface PokemonDetailPageProps {
  params: Promise<{
    lang: Locale;
    id: string;
  }>;
}

// Generate static params for SSG
export async function generateStaticParams() {
  // Generate paths for both languages and all existing Pokemon
  const paths = [];
  const languages = ["en", "ja"];

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
    const validPokemonIds =
      data?.pokemonsBasic?.edges?.map(
        (edge: { node: { id: string } }) => edge.node.id,
      ) || [];

    // Generate paths only for valid Pokemon IDs
    for (const lang of languages) {
      for (const pokemonId of validPokemonIds) {
        paths.push({
          lang,
          id: pokemonId.toString(),
        });
      }
    }

    console.log(
      `Generating ${paths.length} static paths for ${validPokemonIds.length} valid Pokemon in ${languages.length} languages`,
    );
    console.log(
      `Sample Pokemon IDs: ${validPokemonIds.slice(0, 10).join(", ")}...`,
    );
    return paths;
  } catch (error) {
    console.error(
      "Error fetching Pokemon data from GraphQL, using sequential fallback:",
      error,
    );
    // Fallback: generate for known range and let individual pages handle errors
    const fallbackCount = 1025; // Use conservative count for basic Pokemon
    for (const lang of languages) {
      for (let i = 1; i <= fallbackCount; i++) {
        paths.push({
          lang,
          id: i.toString(),
        });
      }
    }
    console.log(
      `Using fallback: ${paths.length} paths for first ${fallbackCount} Pokemon`,
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
  try {
    const { id, lang } = await params;
    const [dictionary, client] = await Promise.all([
      getDictionary(lang),
      getClient(),
    ]);

    const { data } = await client.query({
      query: GET_POKEMON,
      variables: { id },
    });

    const pokemon: Pokemon = data?.pokemon;

    if (!pokemon) {
      return {
        title: dictionary.ui.error.pokemonNotFound,
        description: "The requested Pokemon could not be found.",
      };
    }

    const pokemonName = getPokemonName(pokemon, lang);
    const types = pokemon.types
      .map((t) => getTypeName(t.type.name, lang))
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
        url: `https://pokedex.example.com/${lang}/pokemon/${id}`,
        siteName: lang === "ja" ? "ポケモン図鑑" : "Pokédex",
        images: [
          {
            url:
              pokemon.sprites.other?.officialArtwork?.frontDefault ||
              pokemon.sprites.frontDefault ||
              "",
            width: 475,
            height: 475,
            alt: `${pokemonName} official artwork`,
          },
        ],
        locale: lang === "ja" ? "ja_JP" : "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [
          pokemon.sprites.other?.officialArtwork?.frontDefault ||
            pokemon.sprites.frontDefault ||
            "",
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
        canonical: `https://pokedex.example.com/${lang}/pokemon/${id}`,
        languages: {
          en: `https://pokedex.example.com/en/pokemon/${id}`,
          ja: `https://pokedex.example.com/ja/pokemon/${id}`,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Pokemon | Pokedex",
      description: "Pokemon information page",
    };
  }
}

// Server Component for SSG
export default async function PokemonDetailPage({
  params,
}: {
  params: PokemonDetailPageProps["params"];
}) {
  const { id, lang } = await params;

  try {
    const client = await getClient();

    const { data } = await client.query({
      query: GET_POKEMON,
      variables: { id },
      errorPolicy: "all", // Continue even if there are GraphQL errors
    });

    const pokemon: Pokemon = data?.pokemon;

    if (!pokemon) {
      console.warn(`Pokemon with ID ${id} not found, redirecting to 404`);
      notFound();
    }

    return <PokemonDetailClient pokemon={pokemon} lang={lang} />;
  } catch (error) {
    console.error(`Error fetching Pokemon with ID ${id}:`, error);
    // For invalid IDs that shouldn't have been generated, return 404
    notFound();
  }
}
