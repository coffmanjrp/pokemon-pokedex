export interface GenerationData {
  id: number;
  name: { en: string; ja: string };
  region: { en: string; ja: string };
  pokemonRange: { start: number; end: number };
  games: string[];
  remakes?: string[];
}

export const GENERATIONS: GenerationData[] = [
  {
    id: 1,
    name: { en: 'Generation I', ja: '第1世代' },
    region: { en: 'Kanto', ja: 'カントー地方' },
    pokemonRange: { start: 1, end: 151 },
    games: ['red', 'blue', 'yellow'],
    remakes: ['firered', 'leafgreen']
  },
  {
    id: 2,
    name: { en: 'Generation II', ja: '第2世代' },
    region: { en: 'Johto', ja: 'ジョウト地方' },
    pokemonRange: { start: 152, end: 251 },
    games: ['gold', 'silver', 'crystal'],
    remakes: ['heartgold', 'soulsilver']
  },
  {
    id: 3,
    name: { en: 'Generation III', ja: '第3世代' },
    region: { en: 'Hoenn', ja: 'ホウエン地方' },
    pokemonRange: { start: 252, end: 386 },
    games: ['ruby', 'sapphire', 'emerald'],
    remakes: ['omega-ruby', 'alpha-sapphire']
  },
  {
    id: 4,
    name: { en: 'Generation IV', ja: '第4世代' },
    region: { en: 'Sinnoh', ja: 'シンオウ地方' },
    pokemonRange: { start: 387, end: 493 },
    games: ['diamond', 'pearl', 'platinum'],
    remakes: ['brilliant-diamond', 'shining-pearl']
  },
  {
    id: 5,
    name: { en: 'Generation V', ja: '第5世代' },
    region: { en: 'Unova', ja: 'イッシュ地方' },
    pokemonRange: { start: 494, end: 649 },
    games: ['black', 'white', 'black-2', 'white-2']
  },
  {
    id: 6,
    name: { en: 'Generation VI', ja: '第6世代' },
    region: { en: 'Kalos', ja: 'カロス地方' },
    pokemonRange: { start: 650, end: 721 },
    games: ['x', 'y']
  },
  {
    id: 7,
    name: { en: 'Generation VII', ja: '第7世代' },
    region: { en: 'Alola', ja: 'アローラ地方' },
    pokemonRange: { start: 722, end: 809 },
    games: ['sun', 'moon', 'ultra-sun', 'ultra-moon']
  },
  {
    id: 8,
    name: { en: 'Generation VIII', ja: '第8世代' },
    region: { en: 'Galar', ja: 'ガラル地方' },
    pokemonRange: { start: 810, end: 905 },
    games: ['sword', 'shield'],
    remakes: ['legends-arceus'] // Special case: Hisui region
  },
  {
    id: 9,
    name: { en: 'Generation IX', ja: '第9世代' },
    region: { en: 'Paldea', ja: 'パルデア地方' },
    pokemonRange: { start: 906, end: 1025 },
    games: ['scarlet', 'violet']
  }
];

// Helper functions
export const getGenerationById = (id: number): GenerationData | undefined => {
  return GENERATIONS.find(gen => gen.id === id);
};

export const getGenerationByGame = (gameName: string): GenerationData | undefined => {
  return GENERATIONS.find(gen => 
    gen.games.includes(gameName) || 
    (gen.remakes && gen.remakes.includes(gameName))
  );
};

export const getGenerationByPokemonId = (pokemonId: number): GenerationData | undefined => {
  return GENERATIONS.find(gen => 
    pokemonId >= gen.pokemonRange.start && pokemonId <= gen.pokemonRange.end
  );
};

export const getGenerationName = (generation: GenerationData, language: 'en' | 'ja'): string => {
  return generation.name[language];
};

export const getGenerationRegion = (generation: GenerationData, language: 'en' | 'ja'): string => {
  return generation.region[language];
};

export const isRemakeGame = (gameName: string): boolean => {
  return GENERATIONS.some(gen => gen.remakes?.includes(gameName));
};