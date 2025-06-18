export interface Pokemon {
  id: string;
  name: string;
  height: number;
  weight: number;
  baseExperience?: number;
  types: PokemonType[];
  sprites: PokemonSprites;
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}

export interface PokemonType {
  slot: number;
  type: Type;
}

export interface Type {
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