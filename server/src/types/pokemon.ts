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
  moves: PokemonMove[];
  species?: PokemonSpecies | null;
  gameIndices: GameIndex[];
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
  evolutionChain?: EvolutionChain | undefined;
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