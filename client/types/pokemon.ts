export interface Pokemon {
  id: string;
  name: string;
  height: number;
  weight: number;
  baseExperience?: number;
  types: PokemonTypeSlot[];
  sprites: PokemonSprites;
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves?: PokemonMove[];
  species?: PokemonSpecies;
  gameIndices?: GameIndex[];
}

export interface PokemonTypeSlot {
  slot: number;
  type: PokemonType;
}

export interface PokemonType {
  id: string;
  name: string;
  url: string;
}

export interface PokemonSprites {
  frontDefault?: string;
  frontShiny?: string;
  backDefault?: string;
  backShiny?: string;
  other?: OtherSprites;
}

export interface OtherSprites {
  officialArtwork?: OfficialArtwork;
  home?: HomeSprites;
}

export interface OfficialArtwork {
  frontDefault?: string;
  frontShiny?: string;
}

export interface HomeSprites {
  frontDefault?: string;
  frontShiny?: string;
}

export interface PokemonStat {
  baseStat: number;
  effort: number;
  stat: Stat;
}

export interface Stat {
  id: string;
  name: string;
  url: string;
}

export interface PokemonAbility {
  isHidden: boolean;
  slot: number;
  ability: Ability;
}

export interface Ability {
  id: string;
  name: string;
  url: string;
}

export interface PokemonConnection {
  edges: PokemonEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface PokemonEdge {
  node: Pokemon;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

// Pokemon type names for filtering and styling
export type PokemonTypeName = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface PokemonMove {
  move: Move;
  versionGroupDetails: MoveVersionGroupDetail[];
}

export interface Move {
  id: string;
  name: string;
  url: string;
}

export interface MoveVersionGroupDetail {
  levelLearnedAt: number;
  moveLearnMethod: MoveLearnMethod;
  versionGroup: VersionGroup;
}

export interface MoveLearnMethod {
  name: string;
  url: string;
}

export interface VersionGroup {
  name: string;
  url: string;
}

export interface PokemonSpecies {
  id: string;
  name: string;
  names: SpeciesName[];
  flavorTextEntries: FlavorTextEntry[];
  genera: Genus[];
  generation: Generation;
  evolutionChain?: EvolutionChain;
}

export interface SpeciesName {
  name: string;
  language: Language;
}

export interface FlavorTextEntry {
  flavorText: string;
  language: Language;
  version: Version;
}

export interface Genus {
  genus: string;
  language: Language;
}

export interface Language {
  name: string;
  url: string;
}

export interface Version {
  name: string;
  url: string;
}

export interface Generation {
  id: string;
  name: string;
  url: string;
}

export interface EvolutionChain {
  id: string;
  url: string;
}

export interface GameIndex {
  gameIndex: number;
  version: Version;
}

// Pokemon type colors for UI styling
export const POKEMON_TYPE_COLORS: Record<PokemonTypeName, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};