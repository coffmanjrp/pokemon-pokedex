import { Metadata } from "next";
import { Locale, interpolate } from "@/lib/dictionaries";
import { getDictionary } from "@/lib/get-dictionary";
import { getFallbackMetadata } from "@/lib/fallbackText";
import { PokemonListClient } from "./client";
import {
  generateStructuredData,
  createStructuredDataScript,
} from "@/lib/utils/structuredData";
import { getCanonicalUrl, getAlternateUrls } from "@/lib/utils/metadata";

// ISR configuration: revalidate every hour
export const revalidate = 3600;

interface HomePageProps {
  params: Promise<{
    lang: Locale;
  }>;
}

// Generate metadata for each language page
export async function generateMetadata({
  params,
}: {
  params: HomePageProps["params"];
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  // Featured Pokemon for Open Graph images (popular and iconic Pokemon)
  const featuredPokemon = [
    { id: 25, name: "Pikachu" },
    { id: 6, name: "Charizard" },
    { id: 150, name: "Mewtwo" },
    { id: 448, name: "Lucario" },
    { id: 384, name: "Rayquaza" },
    { id: 3, name: "Venusaur" },
    { id: 9, name: "Blastoise" },
    { id: 131, name: "Lapras" },
  ];

  // Select featured Pokemon based on current date for variety (changes daily)
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  const selectedPokemon = featuredPokemon[dayOfYear % featuredPokemon.length]!;

  // High-quality official artwork URL from our own domain
  const pokemonImageUrl = getCanonicalUrl(
    `/api/images/pokemon/${selectedPokemon.id}`,
  );

  const title =
    dictionary.meta.homeTitle || getFallbackMetadata(lang, "homeTitle");

  const description =
    dictionary.meta.homeDescription ||
    getFallbackMetadata(lang, "homeDescription");

  const keywords = dictionary.meta.homeKeywords;

  const canonicalUrl = getCanonicalUrl(`/${lang}`);
  const alternateUrls = getAlternateUrls("/", ["en", "ja"]);

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
          url: pokemonImageUrl,
          width: 475,
          height: 475,
          alt: interpolate(dictionary.meta.pokemonImageAlt, {
            name: selectedPokemon.name,
          }),
        },
        // Fallback image
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: dictionary.meta.fallbackImageAlt,
        },
      ],
      locale: dictionary.meta.locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [pokemonImageUrl],
      creator: "@pokemon",
      site: "@pokemon",
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
      languages: {
        ...alternateUrls,
        "x-default": getCanonicalUrl("/en"),
      },
    },
    category: "entertainment",
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  // Generate structured data for SEO
  const structuredData = generateStructuredData({
    type: "website",
    dictionary,
    lang,
  });

  // For ISR, only provide empty initial data to prevent generation mismatch issues
  // Let client-side handle all Pokemon loading based on current generation
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={createStructuredDataScript(structuredData)}
      />
      <PokemonListClient
        dictionary={dictionary}
        lang={lang}
        initialPokemon={[]}
      />
    </>
  );
}
