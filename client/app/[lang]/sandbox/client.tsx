'use client';

import { Dictionary, Locale } from '@/lib/dictionaries';
import { POKEMON_TYPE_COLORS, PokemonTypeName } from '@/types/pokemon';
import { useRef } from 'react';
import Image from 'next/image';
import { ANIMATIONS, AnimationType } from '@/lib/animations';

interface SandboxClientProps {
  dictionary: Dictionary;
  lang: Locale;
}

type TestPokemon = {
  id: string;
  name: string;
  types: Array<{ type: { name: string; url: string } }>;
  sprites: { other: { 'official-artwork': { front_default: string } } };
  species: { name: string; url: string; genera: Array<{ genus: string; language: { name: string; url: string } }> };
};

// Test Pokemon data for each animation type  
const testPokemons = [
  {
    id: '1',
    name: 'bulbasaur',
    types: [{ type: { name: 'grass', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' } } },
    species: { name: 'bulbasaur', url: '', genera: [{ genus: 'たねポケモン', language: { name: 'ja', url: '' } }] }
  },
  {
    id: '6',
    name: 'charizard',
    types: [{ type: { name: 'fire', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' } } },
    species: { name: 'charizard', url: '', genera: [{ genus: 'かえんポケモン', language: { name: 'ja', url: '' } }] }
  },
  {
    id: '9',
    name: 'blastoise',
    types: [{ type: { name: 'water', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png' } } },
    species: { name: 'blastoise', url: '', genera: [{ genus: 'こうらポケモン', language: { name: 'ja', url: '' } }] }
  },
  {
    id: '25',
    name: 'pikachu',
    types: [{ type: { name: 'electric', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' } } },
    species: { name: 'pikachu', url: '', genera: [{ genus: 'ねずみポケモン', language: { name: 'ja', url: '' } }] }
  },
  {
    id: '150',
    name: 'mewtwo',
    types: [{ type: { name: 'psychic', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png' } } },
    species: { name: 'mewtwo', url: '', genera: [{ genus: 'いでんしポケモン', language: { name: 'ja', url: '' } }] }
  },
  {
    id: '144',
    name: 'articuno',
    types: [{ type: { name: 'ice', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png' } } },
    species: { name: 'articuno', url: '', genera: [{ genus: 'れいとうポケモン', language: { name: 'ja', url: '' } }] }
  },
  {
    id: '39',
    name: 'jigglypuff',
    types: [{ type: { name: 'normal', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png' } } },
    species: { name: 'jigglypuff', url: '', genera: [{ genus: 'ふうせんポケモン', language: { name: 'ja', url: '' } }] }
  },
  {
    id: '149',
    name: 'dragonite',
    types: [{ type: { name: 'dragon', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png' } } },
    species: { name: 'dragonite', url: '', genera: [{ genus: 'ドラゴンポケモン', language: { name: 'ja', url: '' } }] }
  },
  {
    id: '196',
    name: 'espeon',
    types: [{ type: { name: 'psychic', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png' } } },
    species: { name: 'espeon', url: '', genera: [{ genus: 'たいようポケモン', language: { name: 'ja', url: '' } }] }
  },
  {
    id: '130',
    name: 'gyarados',
    types: [{ type: { name: 'water', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png' } } },
    species: { name: 'gyarados', url: '', genera: [{ genus: 'きょうあくポケモン', language: { name: 'ja', url: '' } }] }
  },
  {
    id: '448',
    name: 'lucario',
    types: [{ type: { name: 'fighting', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png' } } },
    species: { name: 'lucario', url: '', genera: [{ genus: 'はどうポケモン', language: { name: 'ja', url: '' } }] }
  },
  {
    id: '384',
    name: 'rayquaza',
    types: [{ type: { name: 'dragon', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png' } } },
    species: { name: 'rayquaza', url: '', genera: [{ genus: 'てんくうポケモン', language: { name: 'ja', url: '' } }] }
  },
  {
    id: '65',
    name: 'alakazam',
    types: [{ type: { name: 'psychic', url: '' } }],
    sprites: { other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png' } } },
    species: { name: 'alakazam', url: '', genera: [{ genus: 'ねんりきポケモン', language: { name: 'ja', url: '' } }] }
  },
];

interface TestCardProps {
  pokemon: TestPokemon;
  animationType: AnimationType;
  animationDescription: string;
  onAnimationClick: (e: React.MouseEvent, pokemon: TestPokemon, animationType: AnimationType) => void;
}

function TestCard({ pokemon, animationType, animationDescription, onAnimationClick }: TestCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const primaryType = pokemon.types[0]?.type.name as PokemonTypeName;
  const primaryColor = POKEMON_TYPE_COLORS[primaryType] || '#68A090';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onAnimationClick(e, pokemon, animationType);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-bold mb-2 text-center">{animationType}</h3>
      <p className="text-sm text-gray-600 mb-4 text-center">{animationDescription}</p>
      
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 cursor-pointer group"
        onClick={handleClick}
        style={{
          borderColor: primaryColor,
          boxShadow: `0 4px 20px ${primaryColor}20`,
        }}
      >
        {/* Type-based Background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundColor: primaryColor,
          }}
        />

        {/* Pokemon ID */}
        <div className="absolute top-3 right-3 z-10">
          <span 
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: primaryColor }}
          >
            #{pokemon.id.padStart(3, '0')}
          </span>
        </div>

        {/* Pokemon Image */}
        <div className="relative h-32 flex items-center justify-center p-4">
          <Image
            src={pokemon.sprites.other['official-artwork'].front_default}
            alt={pokemon.name}
            width={96}
            height={96}
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* Pokemon Info */}
        <div className="p-4 pt-0">
          {/* Name */}
          <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </h3>

          {/* Type */}
          <div className="flex justify-center mb-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {primaryType}
            </span>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
}

export function SandboxClient({ lang }: SandboxClientProps) {
  const animations = [
    {
      type: 'ripple-wave' as AnimationType,
      description: 'Click point ripple effect with type color expansion',
      pokemon: testPokemons[0]
    },
    {
      type: 'particle-burst' as AnimationType,
      description: 'Type-based particles burst radially from click point',
      pokemon: testPokemons[1]
    },
    {
      type: 'card-flip' as AnimationType,
      description: '3D flip effect revealing additional information',
      pokemon: testPokemons[2]
    },
    {
      type: 'pokeball-pop' as AnimationType,
      description: 'Pokeball appears and opens at click point',
      pokemon: testPokemons[3]
    },
    {
      type: 'electric-spark' as AnimationType,
      description: 'Electric effect runs along card border',
      pokemon: testPokemons[4]
    },
    {
      type: 'scale-glow' as AnimationType,
      description: 'Card scales up and glows with type color',
      pokemon: testPokemons[5]
    },
    {
      type: 'bounce-tilt' as AnimationType,
      description: 'Card bounces and tilts in 3D space',
      pokemon: testPokemons[6]
    },
    {
      type: 'card-echo' as AnimationType,
      description: 'Full card echoes expand outward like ripples',
      pokemon: testPokemons[7]
    },
    {
      type: 'card-echo-border' as AnimationType,
      description: 'Only card border echoes expand outward',
      pokemon: testPokemons[8]
    },
    {
      type: 'particle-echo-combo' as AnimationType,
      description: 'Combination of particle burst and border echo',
      pokemon: testPokemons[9]
    },
    {
      type: 'ultimate-echo-combo' as AnimationType,
      description: 'Ultimate echo combo: particles + card echo + border echo',
      pokemon: testPokemons[10]
    },
    {
      type: 'elemental-storm' as AnimationType,
      description: 'Massive elemental storm with lightning and screen shake',
      pokemon: testPokemons[11]
    },
    {
      type: 'mega-evolution' as AnimationType,
      description: 'Evolution transformation with energy rings and power surge',
      pokemon: testPokemons[12]
    }
  ];

  const handleAnimationClick = (e: React.MouseEvent, pokemon: TestPokemon, animationType: AnimationType) => {
    const targetElement = e.currentTarget as HTMLElement;
    const gridContainer = document.querySelector('.grid.grid-cols-1') as HTMLElement;
    
    const animationFunction = ANIMATIONS[animationType];
    if (animationFunction) {
      animationFunction({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pokemon: pokemon as any,
        clickEvent: e,
        targetElement,
        gridContainer
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {lang === 'en' ? 'Animation Sandbox' : 'アニメーション サンドボックス'}
          </h1>
          <p className="text-lg text-gray-600">
            {lang === 'en' 
              ? 'Test different Pokemon card click animations' 
              : '様々なポケモンカードクリックアニメーションをテスト'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
          {animations.map((animation) => (
            <TestCard
              key={animation.type}
              pokemon={animation.pokemon}
              animationType={animation.type}
              animationDescription={animation.description}
              onAnimationClick={handleAnimationClick}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            {lang === 'en' 
              ? 'Click on each card to test the animation effects' 
              : '各カードをクリックしてアニメーション効果をテストしてください'
            }
          </p>
        </div>
      </div>
    </div>
  );
}