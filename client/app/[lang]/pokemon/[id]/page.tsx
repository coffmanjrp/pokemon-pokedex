import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClient } from '@/lib/apollo';
import { GET_POKEMON } from '@/graphql/queries';
import { Pokemon } from '@/types/pokemon';
import { Locale, interpolate } from '@/lib/dictionaries'
import { getDictionary } from '@/lib/get-dictionary';
import { getPokemonName, getTypeName, getPokemonDescription, getGenerationName } from '@/lib/pokemonUtils';
import PokemonDetailClient from './client';

interface PokemonDetailPageProps {
  params: Promise<{
    lang: Locale;
    id: string;
  }>;
}

// Generate static params for SSG
export async function generateStaticParams() {
  // Generate paths for both languages and first 151 Pokemon
  const paths = [];
  const languages = ['en', 'ja'];
  
  for (const lang of languages) {
    for (let i = 1; i <= 151; i++) {
      paths.push({
        lang,
        id: i.toString(),
      });
    }
  }
  
  return paths;
}

// Generate metadata for each Pokemon page
export async function generateMetadata({ params }: { params: PokemonDetailPageProps['params'] }): Promise<Metadata> {
  try {
    const { id, lang } = await params;
    const [dictionary, client] = await Promise.all([
      getDictionary(lang),
      getClient()
    ]);
    
    const { data } = await client.query({
      query: GET_POKEMON,
      variables: { id },
    });

    const pokemon: Pokemon = data?.pokemon;

    if (!pokemon) {
      return {
        title: dictionary.ui.error.pokemonNotFound,
        description: 'The requested Pokemon could not be found.',
      };
    }

    const pokemonName = getPokemonName(pokemon, lang);
    const types = pokemon.types.map(t => getTypeName(t.type.name, lang)).join('/');
    const pokemonDescription = getPokemonDescription(pokemon, lang);
    
    // Get stats for meta description
    const hpStat = pokemon.stats.find(s => s.stat.name === 'hp')?.baseStat || 0;
    const attackStat = pokemon.stats.find(s => s.stat.name === 'attack')?.baseStat || 0;
    const defenseStat = pokemon.stats.find(s => s.stat.name === 'defense')?.baseStat || 0;
    
    // Get generation info
    const generation = pokemon.species?.generation?.name ? 
      getGenerationName(pokemon.species.generation.name, lang) : '';
    
    // Enhanced title with ID and type
    const title = interpolate(dictionary.meta.pokemonTitle, { 
      name: pokemonName,
      id: pokemon.id.toString().padStart(3, '0'),
      type: types
    });
    
    // Rich description with stats and Pokemon description
    const description = pokemonDescription ? 
      interpolate(dictionary.meta.pokemonDescription, { 
        name: pokemonName, 
        type: types,
        hp: hpStat,
        attack: attackStat,
        defense: defenseStat,
        description: pokemonDescription.slice(0, 100) + (pokemonDescription.length > 100 ? '...' : '')
      }) :
      interpolate(dictionary.meta.pokemonDescriptionShort, { 
        name: pokemonName, 
        type: types,
        generation: generation,
        height: (pokemon.height / 10).toFixed(1),
        weight: (pokemon.weight / 10).toFixed(1)
      });
    
    // Keywords for SEO
    const keywords = interpolate(dictionary.meta.pokemonKeywords, {
      name: pokemonName,
      type: types,
      generation: generation
    });

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `https://pokedex.example.com/${lang}/pokemon/${id}`,
        siteName: lang === 'ja' ? 'ポケモン図鑑' : 'Pokédex',
        images: [
          {
            url: pokemon.sprites.other?.officialArtwork?.frontDefault || pokemon.sprites.frontDefault || '',
            width: 475,
            height: 475,
            alt: `${pokemonName} official artwork`,
          },
        ],
        locale: lang === 'ja' ? 'ja_JP' : 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [pokemon.sprites.other?.officialArtwork?.frontDefault || pokemon.sprites.frontDefault || ''],
        creator: '@pokedex',
        site: '@pokedex',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
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
    console.error('Error generating metadata:', error);
    return {
      title: 'Pokemon | Pokedex',
      description: 'Pokemon information page',
    };
  }
}

// Server Component for SSG
export default async function PokemonDetailPage({ params }: { params: PokemonDetailPageProps['params'] }) {
  try {
    const { id, lang } = await params;
    const client = await getClient();
    
    const { data } = await client.query({
      query: GET_POKEMON,
      variables: { id },
    });

    const pokemon: Pokemon = data?.pokemon;

    if (!pokemon) {
      notFound();
    }

    return <PokemonDetailClient pokemon={pokemon} lang={lang} />;
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    notFound();
  }
}