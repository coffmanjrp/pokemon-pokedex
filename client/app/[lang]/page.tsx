import { Metadata } from "next";
import { Locale } from "@/lib/dictionaries";
import { getDictionary } from "@/lib/get-dictionary";
import { PokemonListClient } from "./client";

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
  const pokemonImageUrl = `https://pokemon-pokedex-client.vercel.app/api/images/pokemon/${selectedPokemon.id}`;

  const title =
    dictionary.meta.homeTitle ||
    (lang === "ja"
      ? "ポケモン図鑑 | 全世代ポケモン完全データベース"
      : "Pokemon Pokedex | Complete Multi-Generation Pokemon Database");

  const description =
    dictionary.meta.homeDescription ||
    (lang === "ja"
      ? `全1302匹以上のポケモンの詳細情報を網羅。公式アートワーク、ステータス、タイプ相性、進化チェーン、技一覧など充実した機能を提供する最新のポケモン図鑑。第1世代から第9世代まで完全対応。`
      : `Comprehensive Pokemon database featuring 1302+ Pokemon with detailed stats, official artwork, type effectiveness, evolution chains, and move sets. Complete coverage from Generation 1 to 9 with advanced search and filtering capabilities.`);

  const keywords =
    lang === "ja"
      ? "ポケモン図鑑,ポケモンデータベース,ポケモン一覧,ポケモンステータス,ポケモン検索,進化チェーン,タイプ相性,公式アートワーク,第1世代,第2世代,第3世代,第4世代,第5世代,第6世代,第7世代,第8世代,第9世代"
      : "pokemon pokedex,pokemon database,pokemon list,pokemon stats,pokemon search,evolution chain,type effectiveness,official artwork,generation 1,generation 2,generation 3,generation 4,generation 5,generation 6,generation 7,generation 8,generation 9";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://pokemon-pokedex-client.vercel.app/${lang}`,
      siteName: lang === "ja" ? "ポケモン図鑑" : "Pokemon Pokedex",
      images: [
        {
          url: pokemonImageUrl,
          width: 475,
          height: 475,
          alt:
            lang === "ja"
              ? `${selectedPokemon.name} - ポケモン図鑑`
              : `${selectedPokemon.name} - Pokemon Pokedex`,
        },
        // Fallback image
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt:
            lang === "ja"
              ? "ポケモン図鑑 - 包括的なポケモンデータベース"
              : "Pokemon Pokedex - Comprehensive Pokemon Database",
        },
      ],
      locale: lang === "ja" ? "ja_JP" : "en_US",
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
      canonical: `https://pokemon-pokedex-client.vercel.app/${lang}`,
      languages: {
        en: "https://pokemon-pokedex-client.vercel.app/en",
        ja: "https://pokemon-pokedex-client.vercel.app/ja",
        "x-default": "https://pokemon-pokedex-client.vercel.app/en",
      },
    },
    category: "entertainment",
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  // For ISR, only provide empty initial data to prevent generation mismatch issues
  // Let client-side handle all Pokemon loading based on current generation
  return (
    <PokemonListClient
      dictionary={dictionary}
      lang={lang}
      initialPokemon={[]}
    />
  );
}
