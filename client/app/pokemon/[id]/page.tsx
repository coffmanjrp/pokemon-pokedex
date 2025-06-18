import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClient } from '@/lib/apollo';
import { GET_POKEMON } from '@/graphql/queries';
import { Pokemon } from '@/types/pokemon';
import PokemonDetailClient from './client';

// Generate static params for SSG
export async function generateStaticParams() {
  // Generate static pages for first 151 Pokemon (Gen 1) for initial build
  // More can be added on-demand via ISR
  const paths = Array.from({ length: 151 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
  
  return paths;
}

// Generate metadata for each Pokemon page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const client = getClient();
    const { data } = await client.query({
      query: GET_POKEMON,
      variables: { id: params.id },
    });

    const pokemon: Pokemon = data?.pokemon;

    if (!pokemon) {
      return {
        title: 'Pokemon Not Found | Pokedex',
        description: 'The requested Pokemon could not be found.',
      };
    }

    return {
      title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} | Pokedex`,
      description: `Learn about ${pokemon.name}, a ${pokemon.types.map(t => t.type.name).join('/')} type Pokemon. View stats, abilities, and sprites.`,
      openGraph: {
        title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} | Pokedex`,
        description: `Learn about ${pokemon.name}, a ${pokemon.types.map(t => t.type.name).join('/')} type Pokemon.`,
        images: [
          {
            url: pokemon.sprites.other?.officialArtwork?.frontDefault || pokemon.sprites.frontDefault || '',
            width: 475,
            height: 475,
            alt: `${pokemon.name} official artwork`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} | Pokedex`,
        description: `Learn about ${pokemon.name}, a ${pokemon.types.map(t => t.type.name).join('/')} type Pokemon.`,
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
export default async function PokemonDetailPage({ params }: { params: { id: string } }) {
  try {
    const client = getClient();
    const { data } = await client.query({
      query: GET_POKEMON,
      variables: { id: params.id },
    });

    const pokemon: Pokemon = data?.pokemon;

    if (!pokemon) {
      notFound();
    }

    return <PokemonDetailClient pokemon={pokemon} />;
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    notFound();
  }
}