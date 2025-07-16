import { Pokemon } from "@/types/pokemon";
import { Dictionary } from "@/lib/dictionaries";

interface BreadcrumbItem {
  position: number;
  name: string;
  item?: string;
}

interface StructuredDataProps {
  type: "website" | "pokemon" | "pokemonList";
  pokemon?: Pokemon;
  dictionary: Dictionary;
  lang: string;
  currentGeneration?: number;
  baseUrl?: string;
}

/**
 * Generate structured data for SEO (JSON-LD format)
 */
export function generateStructuredData({
  type,
  pokemon,
  dictionary,
  lang,
  currentGeneration,
  baseUrl = "https://pokemon-pokedex-client.vercel.app",
}: StructuredDataProps): string {
  try {
    switch (type) {
      case "website":
        return JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: dictionary.meta?.title || "Pokemon Pokedex",
          description:
            dictionary.meta?.homeDescription ||
            "Explore the world of Pokemon with our comprehensive Pokedex. Search, filter, and discover detailed information about all Pokemon.",
          url: `${baseUrl}/${lang}`,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${baseUrl}/${lang}/pokemon?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
          inLanguage: lang,
        });

      case "pokemonList":
        const breadcrumbList: BreadcrumbItem[] = [
          {
            position: 1,
            name: dictionary.ui?.navigation?.home || "Home",
            item: `${baseUrl}/${lang}`,
          },
          {
            position: 2,
            name: "Pokemon",
            item: `${baseUrl}/${lang}/pokemon`,
          },
        ];

        if (currentGeneration !== undefined) {
          breadcrumbList.push({
            position: 3,
            name: `Generation ${currentGeneration}`,
          });
        }

        return JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name:
            currentGeneration !== undefined
              ? `Generation ${currentGeneration} Pokemon`
              : "Pokemon",
          description:
            dictionary.meta?.homeDescription ||
            "Browse all Pokemon. Filter by type, search by name, and explore detailed information.",
          url: `${baseUrl}/${lang}/pokemon${currentGeneration !== undefined ? `?generation=${currentGeneration}` : ""}`,
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbList,
          },
          inLanguage: lang,
        });

      case "pokemon":
        if (!pokemon) return "";

        const pokemonBreadcrumb: BreadcrumbItem[] = [
          {
            position: 1,
            name: dictionary.ui?.navigation?.home || "Home",
            item: `${baseUrl}/${lang}`,
          },
          {
            position: 2,
            name: "Pokemon",
            item: `${baseUrl}/${lang}/pokemon`,
          },
          {
            position: 3,
            name: pokemon.name,
          },
        ];

        // Get Pokemon types in the current language
        const types = pokemon.types.map((t) => {
          // Try to get translated type name from dictionary
          if (dictionary.ui?.types) {
            const typeName =
              dictionary.ui.types[
                t.type.name as keyof typeof dictionary.ui.types
              ];
            return typeName || t.type.name;
          }
          return t.type.name;
        });

        // Get abilities in the current language
        const abilities = pokemon.abilities.map((a) => {
          const ability = a.ability.names?.find(
            (n) => n.language.name === lang,
          );
          return ability?.name || a.ability.name;
        });

        return JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["Product", "VideoGameCharacter"],
          name: pokemon.name,
          description: `${pokemon.name} - ${types.join(", ")} type Pokemon. National Dex Number: ${pokemon.id}`,
          image:
            pokemon.sprites.other?.officialArtwork?.frontDefault ||
            pokemon.sprites.frontDefault,
          url: `${baseUrl}/${lang}/pokemon/${pokemon.id}`,
          identifier: {
            "@type": "PropertyValue",
            name: "National Dex Number",
            value: pokemon.id.toString(),
          },
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: dictionary.ui?.pokemonDetails?.types || "Types",
              value: types.join(", "),
            },
            {
              "@type": "PropertyValue",
              name: dictionary.ui?.pokemonDetails?.height || "Height",
              value: `${pokemon.height / 10}m`,
            },
            {
              "@type": "PropertyValue",
              name: dictionary.ui?.pokemonDetails?.weight || "Weight",
              value: `${pokemon.weight / 10}kg`,
            },
            {
              "@type": "PropertyValue",
              name: dictionary.ui?.pokemonDetails?.abilities || "Abilities",
              value: abilities.join(", "),
            },
          ],
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: pokemonBreadcrumb,
          },
          isPartOf: {
            "@type": "VideoGame",
            name: "Pokémon",
            gamePlatform: ["Nintendo Switch", "Nintendo 3DS", "Mobile"],
          },
          inLanguage: lang,
        });

      default:
        return "";
    }
  } catch (error) {
    // Return empty string on error to prevent breaking the page
    console.error("Error generating structured data:", error);
    return "";
  }
}

/**
 * Create a script tag with structured data
 */
export function createStructuredDataScript(structuredData: string): {
  __html: string;
} {
  return {
    __html: structuredData,
  };
}
