import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClient } from "@/lib/apollo";
import { GET_POKEMONS } from "@/graphql/queries";
import { Pokemon } from "@/types/pokemon";
import { Locale } from "@/lib/dictionaries";
import { getGenerationById } from "@/lib/data/generations";
import GenerationPageClient from "./client";

interface GenerationPageProps {
  params: Promise<{
    lang: Locale;
    id: string;
  }>;
}

// Generate static params for SSG - Respects BUILD_GENERATION environment variable
export async function generateStaticParams() {
  const paths = [];
  const languages = ["en", "ja"];

  // Check for specific generation build
  const buildGeneration = process.env.BUILD_GENERATION
    ? parseInt(process.env.BUILD_GENERATION)
    : null;

  // Determine which generations to build
  let supportedGenerations: number[];
  if (buildGeneration && buildGeneration >= 1 && buildGeneration <= 9) {
    // Build only the specified generation
    supportedGenerations = [buildGeneration];
    console.log(
      `Building generation page for Generation ${buildGeneration} only`,
    );
  } else {
    // Default: All generations 1-9
    supportedGenerations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    console.log(`Building generation pages for all Generations 1-9 (default)`);
  }

  for (const lang of languages) {
    for (const generationId of supportedGenerations) {
      paths.push({
        lang,
        id: generationId.toString(),
      });
    }
  }

  console.log(`Generating ${paths.length} generation pages`);
  return paths;
}

// Generate metadata for each generation page
export async function generateMetadata({
  params,
}: {
  params: GenerationPageProps["params"];
}): Promise<Metadata> {
  try {
    const { id, lang } = await params;
    const generationId = parseInt(id);

    const generation = getGenerationById(generationId);

    if (!generation) {
      return {
        title: "Generation Not Found",
        description: "The requested Pokemon generation could not be found.",
      };
    }

    const generationName = generation.name[lang];
    const regionName = generation.region[lang];
    const pokemonCount =
      generation.pokemonRange.end - generation.pokemonRange.start + 1;

    const title =
      lang === "ja"
        ? `${generationName} | ${regionName} | ポケモン図鑑`
        : `${generationName} | ${regionName} | Pokemon Pokedex`;

    const description =
      lang === "ja"
        ? `${generationName}（${regionName}）のポケモン${pokemonCount}匹の詳細情報。公式アートワーク、ステータス、タイプ相性、進化チェーンなど充実した機能を提供。`
        : `Complete ${generationName} (${regionName}) Pokemon database featuring ${pokemonCount} Pokemon with detailed stats, official artwork, type effectiveness, and evolution chains.`;

    // Featured Pokemon based on generation
    let featuredPokemon: { id: number; name: string };
    let keywords: string;

    switch (generationId) {
      case 1:
        featuredPokemon = { id: 25, name: "Pikachu" }; // Iconic Generation 1
        keywords =
          lang === "ja"
            ? `${generationName},${regionName},ポケモン図鑑,第1世代,カントー地方,ピカチュウ,フシギダネ,ヒトカゲ,ゼニガメ`
            : `${generationName},${regionName},pokemon,generation 1,kanto,pikachu,bulbasaur,charmander,squirtle`;
        break;
      case 2:
        featuredPokemon = { id: 249, name: "Lugia" }; // Iconic Generation 2 legendary
        keywords =
          lang === "ja"
            ? `${generationName},${regionName},ポケモン図鑑,第2世代,ジョウト地方,ルギア,ホウオウ,チコリータ,ヒノアラシ,ワニノコ`
            : `${generationName},${regionName},pokemon,generation 2,johto,lugia,ho-oh,chikorita,cyndaquil,totodile`;
        break;
      case 3:
        featuredPokemon = { id: 384, name: "Rayquaza" }; // Iconic Generation 3 legendary
        keywords =
          lang === "ja"
            ? `${generationName},${regionName},ポケモン図鑑,第3世代,ホウエン地方,レックウザ,グラードン,カイオーガ,キモリ,アチャモ,ミズゴロウ`
            : `${generationName},${regionName},pokemon,generation 3,hoenn,rayquaza,groudon,kyogre,treecko,torchic,mudkip`;
        break;
      case 4:
        featuredPokemon = { id: 493, name: "Arceus" }; // Iconic Generation 4 legendary
        keywords =
          lang === "ja"
            ? `${generationName},${regionName},ポケモン図鑑,第4世代,シンオウ地方,アルセウス,ディアルガ,パルキア,ナエトル,ヒコザル,ポッチャマ`
            : `${generationName},${regionName},pokemon,generation 4,sinnoh,arceus,dialga,palkia,turtwig,chimchar,piplup`;
        break;
      case 5:
        featuredPokemon = { id: 644, name: "Zekrom" }; // Iconic Generation 5 legendary
        keywords =
          lang === "ja"
            ? `${generationName},${regionName},ポケモン図鑑,第5世代,イッシュ地方,ゼクロム,レシラム,キュレム,ツタージャ,ポカブ,ミジュマル`
            : `${generationName},${regionName},pokemon,generation 5,unova,zekrom,reshiram,kyurem,snivy,tepig,oshawott`;
        break;
      case 6:
        featuredPokemon = { id: 717, name: "Yveltal" }; // Iconic Generation 6 legendary
        keywords =
          lang === "ja"
            ? `${generationName},${regionName},ポケモン図鑑,第6世代,カロス地方,イベルタル,ゼルネアス,ジガルデ,ハリマロン,フォッコ,ケロマツ`
            : `${generationName},${regionName},pokemon,generation 6,kalos,yveltal,xerneas,zygarde,chespin,fennekin,froakie`;
        break;
      case 7:
        featuredPokemon = { id: 792, name: "Lunala" }; // Iconic Generation 7 legendary
        keywords =
          lang === "ja"
            ? `${generationName},${regionName},ポケモン図鑑,第7世代,アローラ地方,ルナアーラ,ソルガレオ,ネクロズマ,モクロー,ニャビー,アシマリ`
            : `${generationName},${regionName},pokemon,generation 7,alola,lunala,solgaleo,necrozma,rowlet,litten,popplio`;
        break;
      case 8:
        featuredPokemon = { id: 890, name: "Eternatus" }; // Iconic Generation 8 legendary
        keywords =
          lang === "ja"
            ? `${generationName},${regionName},ポケモン図鑑,第8世代,ガラル地方,ムゲンダイナ,ザシアン,ザマゼンタ,サルノリ,ヒバニー,メッソン`
            : `${generationName},${regionName},pokemon,generation 8,galar,eternatus,zacian,zamazenta,grookey,scorbunny,sobble`;
        break;
      case 9:
        featuredPokemon = { id: 1007, name: "Koraidon" }; // Iconic Generation 9 legendary
        keywords =
          lang === "ja"
            ? `${generationName},${regionName},ポケモン図鑑,第9世代,パルデア地方,コライドン,ミライドン,ニャオハ,ホゲータ,クワッス`
            : `${generationName},${regionName},pokemon,generation 9,paldea,koraidon,miraidon,sprigatito,fuecoco,quaxly`;
        break;
      default:
        // Default fallback
        featuredPokemon = { id: 25, name: "Pikachu" };
        keywords =
          lang === "ja"
            ? `${generationName},${regionName},ポケモン図鑑`
            : `${generationName},${regionName},pokemon`;
    }

    const pokemonImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${featuredPokemon.id}.png`;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://pokemon-pokedex-client.vercel.app/${lang}/generation/${id}`,
        siteName: lang === "ja" ? "ポケモン図鑑" : "Pokemon Pokedex",
        images: [
          {
            url: pokemonImageUrl,
            width: 475,
            height: 475,
            alt: `${featuredPokemon.name} - ${generationName}`,
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
        canonical: `https://pokemon-pokedex-client.vercel.app/${lang}/generation/${id}`,
        languages: {
          en: `https://pokemon-pokedex-client.vercel.app/en/generation/${id}`,
          ja: `https://pokemon-pokedex-client.vercel.app/ja/generation/${id}`,
        },
      },
    };
  } catch (error) {
    console.error(
      `Error generating metadata for generation ${(await params).id}:`,
      error,
    );
    return {
      title: "Pokemon Generation | Pokedex",
      description: "Pokemon generation information page",
    };
  }
}

// Server Component for SSG
export default async function GenerationPage({
  params,
}: {
  params: GenerationPageProps["params"];
}) {
  const { id, lang } = await params;
  const generationId = parseInt(id);

  // Validate generation ID
  const generation = getGenerationById(generationId);
  if (!generation) {
    console.warn(`Invalid generation ID: ${id}`);
    notFound();
  }

  try {
    console.log(
      `Fetching Pokemon for Generation ${generationId} (${generation.name.en})`,
    );
    const client = await getClient();

    // Calculate limit based on generation Pokemon range
    const { start, end } = generation.pokemonRange;
    const pokemonCount = end - start + 1;

    const { data } = await client.query({
      query: GET_POKEMONS,
      variables: {
        limit: pokemonCount,
        offset: start - 1, // PokeAPI is 0-indexed, Pokemon IDs are 1-indexed
      },
      errorPolicy: "all",
    });

    // Filter to ensure we only get Pokemon from this generation
    const generationPokemon =
      data?.pokemons?.edges
        ?.map((edge: { node: Pokemon }) => edge.node)
        .filter((pokemon: Pokemon) => {
          const pokemonId = parseInt(pokemon.id);
          return pokemonId >= start && pokemonId <= end;
        }) || [];

    console.log(
      `Successfully fetched ${generationPokemon.length} Pokemon for Generation ${generationId}`,
    );

    return (
      <GenerationPageClient
        pokemon={generationPokemon}
        generation={generation}
        lang={lang}
      />
    );
  } catch (error) {
    console.error(`Error fetching Pokemon for Generation ${id}:`, error);
    notFound();
  }
}
