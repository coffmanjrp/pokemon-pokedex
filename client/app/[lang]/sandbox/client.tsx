"use client";

import { Dictionary, Locale } from "@/lib/dictionaries";
import { POKEMON_TYPE_COLORS, PokemonTypeName, Pokemon } from "@/types/pokemon";
import { useRef, Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ANIMATIONS, AnimationType } from "@/lib/animations";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setLanguage, setDictionary } from "@/store/slices/uiSlice";
import { HiChevronLeft } from "react-icons/hi2";

interface SandboxClientProps {
  dictionary: Dictionary;
  lang: Locale;
}

type TestPokemon = {
  id: string;
  name: string;
  types: Array<{ type: { name: string; url: string } }>;
  sprites: { other: { "official-artwork": { front_default: string } } };
  species: {
    name: string;
    url: string;
    genera: Array<{ genus: string; language: { name: string; url: string } }>;
    isBaby?: boolean;
    isLegendary?: boolean;
    isMythical?: boolean;
  };
};

// Test Pokemon data for each animation type
const testPokemons = [
  {
    id: "1",
    name: "bulbasaur",
    types: [{ type: { name: "grass", url: "" } }],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
        },
      },
    },
    species: {
      name: "bulbasaur",
      url: "",
      genera: [{ genus: "たねポケモン", language: { name: "ja", url: "" } }],
      isBaby: false,
      isLegendary: false,
      isMythical: false,
    },
  },
  {
    id: "6",
    name: "charizard",
    types: [{ type: { name: "fire", url: "" } }],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
        },
      },
    },
    species: {
      name: "charizard",
      url: "",
      genera: [{ genus: "かえんポケモン", language: { name: "ja", url: "" } }],
      isBaby: false,
      isLegendary: false,
      isMythical: false,
    },
  },
  {
    id: "9",
    name: "blastoise",
    types: [{ type: { name: "water", url: "" } }],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
        },
      },
    },
    species: {
      name: "blastoise",
      url: "",
      genera: [{ genus: "こうらポケモン", language: { name: "ja", url: "" } }],
      isBaby: false,
      isLegendary: false,
      isMythical: false,
    },
  },
  {
    id: "25",
    name: "pikachu",
    types: [{ type: { name: "electric", url: "" } }],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
        },
      },
    },
    species: {
      name: "pikachu",
      url: "",
      genera: [{ genus: "ねずみポケモン", language: { name: "ja", url: "" } }],
      isBaby: false,
      isLegendary: false,
      isMythical: false,
    },
  },
  {
    id: "150",
    name: "mewtwo",
    types: [{ type: { name: "psychic", url: "" } }],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
        },
      },
    },
    species: {
      name: "mewtwo",
      url: "",
      genera: [
        { genus: "いでんしポケモン", language: { name: "ja", url: "" } },
      ],
      isBaby: false,
      isLegendary: true,
      isMythical: false,
    },
  },
  {
    id: "144",
    name: "articuno",
    types: [{ type: { name: "ice", url: "" } }],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png",
        },
      },
    },
    species: {
      name: "articuno",
      url: "",
      genera: [
        { genus: "れいとうポケモン", language: { name: "ja", url: "" } },
      ],
      isBaby: false,
      isLegendary: true,
      isMythical: false,
    },
  },
  {
    id: "39",
    name: "jigglypuff",
    types: [{ type: { name: "normal", url: "" } }],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
        },
      },
    },
    species: {
      name: "jigglypuff",
      url: "",
      genera: [
        { genus: "ふうせんポケモン", language: { name: "ja", url: "" } },
      ],
      isBaby: false,
      isLegendary: false,
      isMythical: false,
    },
  },
  {
    id: "149",
    name: "dragonite",
    types: [{ type: { name: "dragon", url: "" } }],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png",
        },
      },
    },
    species: {
      name: "dragonite",
      url: "",
      genera: [
        { genus: "ドラゴンポケモン", language: { name: "ja", url: "" } },
      ],
      isBaby: false,
      isLegendary: false,
      isMythical: false,
    },
  },
  {
    id: "196",
    name: "espeon",
    types: [{ type: { name: "psychic", url: "" } }],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png",
        },
      },
    },
    species: {
      name: "espeon",
      url: "",
      genera: [
        { genus: "たいようポケモン", language: { name: "ja", url: "" } },
      ],
      isBaby: false,
      isLegendary: false,
      isMythical: false,
    },
  },
  {
    id: "130",
    name: "gyarados",
    types: [{ type: { name: "water", url: "" } }],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png",
        },
      },
    },
    species: {
      name: "gyarados",
      url: "",
      genera: [
        { genus: "きょうあくポケモン", language: { name: "ja", url: "" } },
      ],
      isBaby: false,
      isLegendary: false,
      isMythical: false,
    },
  },
  {
    id: "448",
    name: "lucario",
    types: [{ type: { name: "fighting", url: "" } }],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png",
        },
      },
    },
    species: {
      name: "lucario",
      url: "",
      genera: [{ genus: "はどうポケモン", language: { name: "ja", url: "" } }],
      isBaby: false,
      isLegendary: false,
      isMythical: false,
    },
  },
  {
    id: "384",
    name: "rayquaza",
    types: [{ type: { name: "dragon", url: "" } }],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png",
        },
      },
    },
    species: {
      name: "rayquaza",
      url: "",
      genera: [
        { genus: "てんくうポケモン", language: { name: "ja", url: "" } },
      ],
      isBaby: false,
      isLegendary: true,
      isMythical: false,
    },
  },
  {
    id: "65",
    name: "alakazam",
    types: [{ type: { name: "psychic", url: "" } }],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png",
        },
      },
    },
    species: {
      name: "alakazam",
      url: "",
      genera: [
        { genus: "ねんりきポケモン", language: { name: "ja", url: "" } },
      ],
      isBaby: false,
      isLegendary: false,
      isMythical: false,
    },
  },
];

interface TestCardProps {
  pokemon: TestPokemon;
  animationType: AnimationType;
  animationDescription: string;
  onAnimationClick: (
    e: React.MouseEvent,
    pokemon: TestPokemon,
    animationType: AnimationType,
  ) => void;
}

function TestCard({
  pokemon,
  animationType,
  animationDescription,
  onAnimationClick,
}: TestCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const primaryType = pokemon.types?.[0]?.type.name as PokemonTypeName;
  const primaryColor = POKEMON_TYPE_COLORS[primaryType] || "#68A090";
  const [hoverCleanup, setHoverCleanup] = useState<(() => void) | null>(null);

  const isHoverEffect =
    animationType.includes("-hover-") ||
    [
      "baby-heart-burst",
      "legendary-border-flow",
      "legendary-rainbow-border",
      "legendary-lightning-border",
      "mythical-electric-spark",
    ].includes(animationType);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isHoverEffect) {
      onAnimationClick(e, pokemon, animationType);
    }
  };

  const handleHoverStart = () => {
    if (isHoverEffect && cardRef.current) {
      const animationFunction = ANIMATIONS[animationType];
      if (animationFunction) {
        const cleanupFn = animationFunction({
          pokemon: pokemon as unknown as Pokemon,
          clickEvent: new MouseEvent(
            "mouseenter",
          ) as unknown as React.MouseEvent<HTMLElement>,
          targetElement: cardRef.current,
        });
        if (cleanupFn) {
          setHoverCleanup(() => cleanupFn);
        }
      }
    }
  };

  const handleHoverEnd = () => {
    if (hoverCleanup) {
      hoverCleanup();
      setHoverCleanup(null);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-bold mb-2 text-center">{animationType}</h3>
      <p className="text-sm text-gray-600 mb-4 text-center">
        {animationDescription}
        {isHoverEffect && (
          <span className="block mt-1 text-xs font-semibold text-blue-600">
            HOVER TO TEST
          </span>
        )}
        {!isHoverEffect && (
          <span className="block mt-1 text-xs font-semibold text-green-600">
            CLICK TO TEST
          </span>
        )}
      </p>

      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 cursor-pointer group"
        onClick={handleClick}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
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
            #{pokemon.id.padStart(3, "0")}
          </span>
        </div>

        {/* Pokemon Image */}
        <div className="relative h-32 flex items-center justify-center p-4">
          <Image
            src={
              pokemon.sprites?.other?.["official-artwork"]?.front_default ||
              "/placeholder-pokemon.png"
            }
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

function SandboxContent({
  lang,
  dictionary,
}: {
  lang: Locale;
  dictionary: Dictionary;
}) {
  const searchParams = useSearchParams();
  const fromGeneration = searchParams.get("from");

  const text = {
    backButton: dictionary.ui.navigation.home,
    title: dictionary.ui.sandbox?.title || "Animation Sandbox",
    subtitle: dictionary.ui.sandbox?.subtitle || "Test Pokemon card animations",
    instructions:
      dictionary.ui.sandbox?.instructions ||
      "Click or hover on cards to test animations",
  };

  // Create back URL based on generation parameter
  const backUrl =
    fromGeneration && fromGeneration.startsWith("generation-")
      ? `/${lang}/?generation=${fromGeneration.split("-")[1]}`
      : `/${lang}/`;

  const animations = [
    {
      type: "ripple-wave" as AnimationType,
      description: "Click point ripple effect with type color expansion",
      pokemon: testPokemons[0],
    },
    {
      type: "particle-burst" as AnimationType,
      description: "Type-based particles burst radially from click point",
      pokemon: testPokemons[1],
    },
    {
      type: "card-flip" as AnimationType,
      description: "3D flip effect revealing additional information",
      pokemon: testPokemons[2],
    },
    {
      type: "pokeball-pop" as AnimationType,
      description: "Pokeball appears and opens at click point",
      pokemon: testPokemons[3],
    },
    {
      type: "electric-spark" as AnimationType,
      description: "Electric effect runs along card border",
      pokemon: testPokemons[4],
    },
    {
      type: "scale-glow" as AnimationType,
      description: "Card scales up and glows with type color",
      pokemon: testPokemons[5],
    },
    {
      type: "bounce-tilt" as AnimationType,
      description: "Card bounces and tilts in 3D space",
      pokemon: testPokemons[6],
    },
    {
      type: "card-echo" as AnimationType,
      description: "Full card echoes expand outward like ripples",
      pokemon: testPokemons[7],
    },
    {
      type: "card-echo-border" as AnimationType,
      description: "Only card border echoes expand outward",
      pokemon: testPokemons[8],
    },
    {
      type: "particle-echo-combo" as AnimationType,
      description: "Combination of particle burst and border echo",
      pokemon: testPokemons[9] || testPokemons[0],
    },
    {
      type: "ultimate-echo-combo" as AnimationType,
      description: "Ultimate echo combo: particles + card echo + border echo",
      pokemon: testPokemons[10] || testPokemons[0],
    },
    {
      type: "elemental-storm" as AnimationType,
      description: "Massive elemental storm with lightning and screen shake",
      pokemon: testPokemons[11] || testPokemons[0],
    },
    {
      type: "mega-evolution" as AnimationType,
      description: "Evolution transformation with energy rings and power surge",
      pokemon: testPokemons[12] || testPokemons[0],
    },
    {
      type: "baby-sparkle" as AnimationType,
      description:
        "Baby Pokemon sparkle effect with cute pastel colors and hearts",
      pokemon: {
        ...testPokemons[6],
        species: {
          ...testPokemons[6]?.species,
          isBaby: true,
          isLegendary: false,
          isMythical: false,
        },
      },
    },
    {
      type: "legendary-aura" as AnimationType,
      description:
        "Legendary Pokemon aura with golden energy rings and lightning",
      pokemon: {
        ...testPokemons[4],
        species: {
          ...testPokemons[4]?.species,
          isBaby: false,
          isLegendary: true,
          isMythical: false,
        },
      },
    },
    {
      type: "mythical-shimmer" as AnimationType,
      description:
        "Mythical Pokemon shimmer with rainbow portal and mystical symbols",
      pokemon: {
        ...testPokemons[5],
        species: {
          ...testPokemons[5]?.species,
          isBaby: false,
          isLegendary: false,
          isMythical: true,
        },
      },
    },
    {
      type: "baby-hover-sparkle" as AnimationType,
      description: "Baby Pokemon hover effect with gentle sparkles and glow",
      pokemon: {
        ...testPokemons[6],
        species: {
          ...testPokemons[6]?.species,
          isBaby: true,
          isLegendary: false,
          isMythical: false,
        },
      },
    },
    {
      type: "legendary-hover-aura" as AnimationType,
      description:
        "Legendary Pokemon hover effect with powerful aura and lightning",
      pokemon: {
        ...testPokemons[4],
        species: {
          ...testPokemons[4]?.species,
          isBaby: false,
          isLegendary: true,
          isMythical: false,
        },
      },
    },
    {
      type: "mythical-hover-shimmer" as AnimationType,
      description:
        "Mythical Pokemon hover effect with mystical shimmer and floating symbols",
      pokemon: {
        ...testPokemons[5],
        species: {
          ...testPokemons[5]?.species,
          isBaby: false,
          isLegendary: false,
          isMythical: true,
        },
      },
    },
    {
      type: "baby-heart-burst" as AnimationType,
      description:
        "Baby Pokemon heart burst - cute hearts fly out briefly on hover",
      pokemon: {
        ...testPokemons[6],
        species: {
          ...testPokemons[6]?.species,
          isBaby: true,
          isLegendary: false,
          isMythical: false,
        },
      },
    },
    {
      type: "legendary-border-flow" as AnimationType,
      description: "Legendary Pokemon dual type colors flowing around border",
      pokemon: {
        ...testPokemons[4], // Pikachu (Electric)
        types: [
          { type: { name: "electric", url: "" } },
          { type: { name: "fighting", url: "" } }, // Add secondary type for demo
        ],
        species: {
          ...testPokemons[4]?.species,
          isBaby: false,
          isLegendary: true,
          isMythical: false,
        },
      },
    },
    {
      type: "legendary-rainbow-border" as AnimationType,
      description: "Legendary Pokemon prismatic rainbow border with rotation",
      pokemon: {
        ...testPokemons[5],
        species: {
          ...testPokemons[5]?.species,
          isBaby: false,
          isLegendary: true,
          isMythical: false,
        },
      },
    },
    {
      type: "legendary-lightning-border" as AnimationType,
      description: "Legendary Pokemon golden lightning sparks along border",
      pokemon: {
        ...testPokemons[11],
        species: {
          ...testPokemons[11]?.species,
          isBaby: false,
          isLegendary: true,
          isMythical: false,
        },
      },
    },
    {
      type: "mythical-electric-spark" as AnimationType,
      description:
        "Mythical Pokemon electric sparks around card with connecting lines",
      pokemon: {
        ...testPokemons[4], // Pikachu for electric theme
        species: {
          ...testPokemons[4]?.species,
          isBaby: false,
          isLegendary: false,
          isMythical: true,
        },
      },
    },
  ];

  const handleAnimationClick = (
    e: React.MouseEvent,
    pokemon: TestPokemon,
    animationType: AnimationType,
  ) => {
    const targetElement = e.currentTarget as HTMLElement;
    const gridContainer = document.querySelector(
      ".grid.grid-cols-1",
    ) as HTMLElement;

    const animationFunction = ANIMATIONS[animationType];
    if (animationFunction) {
      animationFunction({
        pokemon: pokemon as unknown as Pokemon,
        clickEvent: e,
        targetElement,
        gridContainer,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href={backUrl}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <HiChevronLeft className="w-4 h-4 mr-1.5" />
            {text.backButton}
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {text.title}
          </h1>
          <p className="text-lg text-gray-600">{text.subtitle}</p>
        </div>

        {/* Regular Effects Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Regular Click Effects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
            {animations
              .filter(
                (animation) =>
                  !animation.type.includes("-hover-") &&
                  ![
                    "baby-heart-burst",
                    "legendary-border-flow",
                    "legendary-rainbow-border",
                    "legendary-lightning-border",
                    "mythical-electric-spark",
                  ].includes(animation.type),
              )
              .map((animation) =>
                animation.pokemon ? (
                  <TestCard
                    key={animation.type}
                    pokemon={animation.pokemon as TestPokemon}
                    animationType={animation.type}
                    animationDescription={animation.description}
                    onAnimationClick={handleAnimationClick}
                  />
                ) : null,
              )}
          </div>
        </div>

        {/* Hover Effects Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Special Hover Effects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
            {animations
              .filter((animation) => animation.type.includes("-hover-"))
              .map((animation) =>
                animation.pokemon ? (
                  <TestCard
                    key={animation.type}
                    pokemon={animation.pokemon as TestPokemon}
                    animationType={animation.type}
                    animationDescription={animation.description}
                    onAnimationClick={handleAnimationClick}
                  />
                ) : null,
              )}
          </div>
        </div>

        {/* Classification Effects Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Classification Hover Effects
            <span className="block text-sm font-normal text-gray-600 mt-2">
              Special effects based on Pokemon classification (Baby, Legendary,
              Mythical)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
            {animations
              .filter((animation) =>
                [
                  "baby-heart-burst",
                  "legendary-border-flow",
                  "legendary-rainbow-border",
                  "legendary-lightning-border",
                  "mythical-electric-spark",
                ].includes(animation.type),
              )
              .map((animation) =>
                animation.pokemon ? (
                  <TestCard
                    key={animation.type}
                    pokemon={animation.pokemon as TestPokemon}
                    animationType={animation.type}
                    animationDescription={animation.description}
                    onAnimationClick={handleAnimationClick}
                  />
                ) : null,
              )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">{text.instructions}</p>
        </div>
      </div>
    </div>
  );
}

export function SandboxClient({ dictionary, lang }: SandboxClientProps) {
  const dispatch = useAppDispatch();
  const { language: currentLanguage, dictionary: currentDictionary } =
    useAppSelector((state) => state.ui);

  // Sync language and dictionary from server props to Redux store
  useEffect(() => {
    if (currentLanguage !== lang) {
      dispatch(setLanguage(lang));
    }
    if (!currentDictionary) {
      dispatch(setDictionary(dictionary));
    }
  }, [lang, currentLanguage, dictionary, currentDictionary, dispatch]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SandboxContent lang={lang} dictionary={dictionary} />
    </Suspense>
  );
}
