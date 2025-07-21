import {
  EvolutionDetail,
  PokemonTypeSlot,
  PokemonSpecies,
  EvolutionTrigger,
} from "@/types/pokemon";

// Mock data for Eevee evolution chain
export const eeveeEvolutionMockData: EvolutionDetail = {
  id: "133",
  name: "eevee",
  sprites: {
    frontDefault:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
  },
  types: [
    {
      slot: 1,
      type: {
        id: "1",
        name: "normal",
        url: "https://pokeapi.co/api/v2/type/1/",
      },
    },
  ] as PokemonTypeSlot[],
  species: {
    id: "133",
    name: "eevee",
    names: [
      {
        name: "イーブイ",
        language: { name: "ja" },
      },
      {
        name: "Eevee",
        language: { name: "en" },
      },
    ],
  } as PokemonSpecies,
  evolvesTo: [
    // Vaporeon
    {
      id: "134",
      name: "vaporeon",
      sprites: {
        frontDefault:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png",
      },
      types: [
        {
          slot: 1,
          type: {
            id: "11",
            name: "water",
            url: "https://pokeapi.co/api/v2/type/11/",
          },
        },
      ] as PokemonTypeSlot[],
      species: {
        id: "134",
        name: "vaporeon",
        names: [
          {
            name: "シャワーズ",
            language: { name: "ja", url: "" },
          },
          {
            name: "Vaporeon",
            language: { name: "en", url: "" },
          },
        ],
        flavorTextEntries: [],
        genera: [],
        generation: { id: "1", name: "generation-i", url: "" },
      } as PokemonSpecies,
      evolutionDetails: [
        {
          item: {
            name: "water-stone",
            url: "https://pokeapi.co/api/v2/item/84/",
          },
          trigger: {
            name: "use-item",
            url: "https://pokeapi.co/api/v2/evolution-trigger/3/",
          },
        },
      ] as EvolutionTrigger[],
      evolvesTo: [],
    },
    // Jolteon
    {
      id: "135",
      name: "jolteon",
      sprites: {
        frontDefault:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png",
      },
      types: [
        {
          slot: 1,
          type: {
            id: "13",
            name: "electric",
            url: "https://pokeapi.co/api/v2/type/13/",
          },
        },
      ] as PokemonTypeSlot[],
      species: {
        id: "135",
        name: "jolteon",
        names: [
          {
            name: "サンダース",
            language: { name: "ja", url: "" },
          },
          {
            name: "Jolteon",
            language: { name: "en", url: "" },
          },
        ],
        flavorTextEntries: [],
        genera: [],
        generation: { id: "1", name: "generation-i", url: "" },
      } as PokemonSpecies,
      evolutionDetails: [
        {
          item: {
            name: "thunder-stone",
            url: "https://pokeapi.co/api/v2/item/83/",
          },
          trigger: {
            name: "use-item",
            url: "https://pokeapi.co/api/v2/evolution-trigger/3/",
          },
        },
      ] as EvolutionTrigger[],
      evolvesTo: [],
    },
    // Flareon
    {
      id: "136",
      name: "flareon",
      sprites: {
        frontDefault:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png",
      },
      types: [
        {
          slot: 1,
          type: {
            id: "10",
            name: "fire",
            url: "https://pokeapi.co/api/v2/type/10/",
          },
        },
      ] as PokemonTypeSlot[],
      species: {
        id: "136",
        name: "flareon",
        names: [
          {
            name: "ブースター",
            language: { name: "ja", url: "" },
          },
          {
            name: "Flareon",
            language: { name: "en", url: "" },
          },
        ],
        flavorTextEntries: [],
        genera: [],
        generation: { id: "1", name: "generation-i", url: "" },
      } as PokemonSpecies,
      evolutionDetails: [
        {
          item: {
            name: "fire-stone",
            url: "https://pokeapi.co/api/v2/item/82/",
          },
          trigger: {
            name: "use-item",
            url: "https://pokeapi.co/api/v2/evolution-trigger/3/",
          },
        },
      ] as EvolutionTrigger[],
      evolvesTo: [],
    },
    // Espeon
    {
      id: "196",
      name: "espeon",
      sprites: {
        frontDefault:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/196.png",
      },
      types: [
        {
          slot: 1,
          type: {
            id: "14",
            name: "psychic",
            url: "https://pokeapi.co/api/v2/type/14/",
          },
        },
      ] as PokemonTypeSlot[],
      species: {
        id: "196",
        name: "espeon",
        names: [
          {
            name: "エーフィ",
            language: { name: "ja", url: "" },
          },
          {
            name: "Espeon",
            language: { name: "en", url: "" },
          },
        ],
        flavorTextEntries: [],
        genera: [],
        generation: { id: "1", name: "generation-i", url: "" },
      } as PokemonSpecies,
      evolutionDetails: [
        {
          minHappiness: 160,
          timeOfDay: "day",
          trigger: {
            name: "level-up",
            url: "https://pokeapi.co/api/v2/evolution-trigger/1/",
          },
        },
      ] as EvolutionTrigger[],
      evolvesTo: [],
    },
    // Umbreon
    {
      id: "197",
      name: "umbreon",
      sprites: {
        frontDefault:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/197.png",
      },
      types: [
        {
          slot: 1,
          type: {
            id: "17",
            name: "dark",
            url: "https://pokeapi.co/api/v2/type/17/",
          },
        },
      ] as PokemonTypeSlot[],
      species: {
        id: "197",
        name: "umbreon",
        names: [
          {
            name: "ブラッキー",
            language: { name: "ja", url: "" },
          },
          {
            name: "Umbreon",
            language: { name: "en", url: "" },
          },
        ],
        flavorTextEntries: [],
        genera: [],
        generation: { id: "1", name: "generation-i", url: "" },
      } as PokemonSpecies,
      evolutionDetails: [
        {
          minHappiness: 160,
          timeOfDay: "night",
          trigger: {
            name: "level-up",
            url: "https://pokeapi.co/api/v2/evolution-trigger/1/",
          },
        },
      ] as EvolutionTrigger[],
      evolvesTo: [],
    },
    // Leafeon
    {
      id: "470",
      name: "leafeon",
      sprites: {
        frontDefault:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/470.png",
      },
      types: [
        {
          slot: 1,
          type: {
            id: "12",
            name: "grass",
            url: "https://pokeapi.co/api/v2/type/12/",
          },
        },
      ] as PokemonTypeSlot[],
      species: {
        id: "470",
        name: "leafeon",
        names: [
          {
            name: "リーフィア",
            language: { name: "ja", url: "" },
          },
          {
            name: "Leafeon",
            language: { name: "en", url: "" },
          },
        ],
        flavorTextEntries: [],
        genera: [],
        generation: { id: "1", name: "generation-i", url: "" },
      } as PokemonSpecies,
      evolutionDetails: [
        {
          location: {
            name: "moss-rock",
            url: "https://pokeapi.co/api/v2/location/8/",
          },
          trigger: {
            name: "level-up",
            url: "https://pokeapi.co/api/v2/evolution-trigger/1/",
          },
        },
      ] as EvolutionTrigger[],
      evolvesTo: [],
    },
    // Glaceon
    {
      id: "471",
      name: "glaceon",
      sprites: {
        frontDefault:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/471.png",
      },
      types: [
        {
          slot: 1,
          type: {
            id: "15",
            name: "ice",
            url: "https://pokeapi.co/api/v2/type/15/",
          },
        },
      ] as PokemonTypeSlot[],
      species: {
        id: "471",
        name: "glaceon",
        names: [
          {
            name: "グレイシア",
            language: { name: "ja", url: "" },
          },
          {
            name: "Glaceon",
            language: { name: "en", url: "" },
          },
        ],
        flavorTextEntries: [],
        genera: [],
        generation: { id: "1", name: "generation-i", url: "" },
      } as PokemonSpecies,
      evolutionDetails: [
        {
          location: {
            name: "icy-rock",
            url: "https://pokeapi.co/api/v2/location/9/",
          },
          trigger: {
            name: "level-up",
            url: "https://pokeapi.co/api/v2/evolution-trigger/1/",
          },
        },
      ] as EvolutionTrigger[],
      evolvesTo: [],
    },
    // Sylveon
    {
      id: "700",
      name: "sylveon",
      sprites: {
        frontDefault:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/700.png",
      },
      types: [
        {
          slot: 1,
          type: {
            id: "18",
            name: "fairy",
            url: "https://pokeapi.co/api/v2/type/18/",
          },
        },
      ] as PokemonTypeSlot[],
      species: {
        id: "700",
        name: "sylveon",
        names: [
          {
            name: "ニンフィア",
            language: { name: "ja", url: "" },
          },
          {
            name: "Sylveon",
            language: { name: "en", url: "" },
          },
        ],
        flavorTextEntries: [],
        genera: [],
        generation: { id: "1", name: "generation-i", url: "" },
      } as PokemonSpecies,
      evolutionDetails: [
        {
          minHappiness: 160,
          knownMove: {
            name: "fairy",
            url: "https://pokeapi.co/api/v2/type/18/",
          },
          trigger: {
            name: "level-up",
            url: "https://pokeapi.co/api/v2/evolution-trigger/1/",
          },
        },
      ] as EvolutionTrigger[],
      evolvesTo: [],
    },
  ],
};
