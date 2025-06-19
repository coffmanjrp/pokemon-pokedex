import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClient } from '@/lib/apollo';
import { GET_POKEMON } from '@/graphql/queries';
import { Pokemon } from '@/types/pokemon';
import { Locale, interpolate } from '@/lib/dictionaries'
import { getDictionary } from '@/lib/get-dictionary';
import { getPokemonName, getTypeName } from '@/lib/pokemonUtils';
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

    const title = interpolate(dictionary.meta.pokemonTitle, { name: pokemonName });
    const description = interpolate(dictionary.meta.pokemonDescription, { 
      name: pokemonName, 
      type: types 
    });

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: pokemon.sprites.other?.officialArtwork?.frontDefault || pokemon.sprites.frontDefault || '',
            width: 475,
            height: 475,
            alt: `${pokemonName} official artwork`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [pokemon.sprites.other?.officialArtwork?.frontDefault || pokemon.sprites.frontDefault || ''],
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
      notFound();
    }

    return <PokemonDetailClient pokemon={pokemon} dictionary={dictionary} lang={lang} />;
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    notFound();
  }
}