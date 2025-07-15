import { Pokemon } from "@/types/pokemon";

interface BreadcrumbItem {
  position: number;
  name: string;
  item?: string;
}

interface StructuredDataProps {
  type: "website" | "pokemon" | "pokemonList";
  pokemon?: Pokemon;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dictionary: any; // Using any for now since dictionary structure varies
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
  switch (type) {
    case "website":
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: dictionary.common.title,
        description: dictionary.seo.homeDescription,
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
          name: dictionary.common.home,
          item: `${baseUrl}/${lang}`,
        },
        {
          position: 2,
          name: dictionary.common.pokemon,
          item: `${baseUrl}/${lang}/pokemon`,
        },
      ];

      if (currentGeneration !== undefined) {
        const genName =
          dictionary.generations?.[`generation${currentGeneration}`] ||
          `Generation ${currentGeneration}`;
        breadcrumbList.push({
          position: 3,
          name: genName,
        });
      }

      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name:
          currentGeneration !== undefined
            ? `${dictionary.generations?.[`generation${currentGeneration}`]} ${dictionary.common.pokemon}`
            : dictionary.common.pokemon,
        description: dictionary.seo.listDescription,
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
          name: dictionary.common.home,
          item: `${baseUrl}/${lang}`,
        },
        {
          position: 2,
          name: dictionary.common.pokemon,
          item: `${baseUrl}/${lang}/pokemon`,
        },
        {
          position: 3,
          name: pokemon.name,
        },
      ];

      // Get Pokemon types in the current language
      const types = pokemon.types.map(
        (t) =>
          dictionary.types?.[t.type.name as keyof typeof dictionary.types] ||
          t.type.name,
      );

      // Get abilities in the current language
      const abilities = pokemon.abilities.map((a) => {
        const ability = a.ability.names?.find((n) => n.language.name === lang);
        return ability?.name || a.ability.name;
      });

      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["Product", "VideoGameCharacter"],
        name: pokemon.name,
        description: `${pokemon.name} - ${types.join(", ")} ${dictionary.common.type} ${dictionary.common.pokemon}. ${dictionary.details.nationalDexNumber}: ${pokemon.id}`,
        image:
          pokemon.sprites.other?.officialArtwork?.frontDefault ||
          pokemon.sprites.frontDefault,
        url: `${baseUrl}/${lang}/pokemon/${pokemon.id}`,
        identifier: {
          "@type": "PropertyValue",
          name: dictionary.details.nationalDexNumber,
          value: pokemon.id.toString(),
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: dictionary.details.types,
            value: types.join(", "),
          },
          {
            "@type": "PropertyValue",
            name: dictionary.details.height,
            value: `${pokemon.height / 10}m`,
          },
          {
            "@type": "PropertyValue",
            name: dictionary.details.weight,
            value: `${pokemon.weight / 10}kg`,
          },
          {
            "@type": "PropertyValue",
            name: dictionary.details.abilities,
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
