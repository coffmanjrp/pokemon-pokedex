// Popular Pokemon IDs for priority loading (first 20)
export const POPULAR_POKEMON_IDS = [
  1,   // Bulbasaur
  4,   // Charmander  
  7,   // Squirtle
  25,  // Pikachu
  150, // Mewtwo
  149, // Dragonite
  144, // Articuno
  145, // Zapdos
  146, // Moltres
  6,   // Charizard
  9,   // Blastoise
  3,   // Venusaur
  151, // Mew
  94,  // Gengar
  131, // Lapras
  143, // Snorlax
  130, // Gyarados
  59,  // Arcanine
  68,  // Machamp
  65,  // Alakazam
] as const;

export type PopularPokemonId = typeof POPULAR_POKEMON_IDS[number];