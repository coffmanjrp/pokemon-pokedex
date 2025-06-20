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
  frontFemale?: string;
  frontShinyFemale?: string;
  backFemale?: string;
  backShinyFemale?: string;
  other?: OtherSprites;
  versions?: VersionSprites;
}

export interface OtherSprites {
  officialArtwork?: OfficialArtwork;
  home?: HomeSprites;
  dreamWorld?: DreamWorldSprites;
  showdown?: ShowdownSprites;
}

export interface OfficialArtwork {
  frontDefault?: string;
  frontShiny?: string;
}

export interface HomeSprites {
  frontDefault?: string;
  frontShiny?: string;
  frontFemale?: string;
  frontShinyFemale?: string;
}

export interface DreamWorldSprites {
  frontDefault?: string;
  frontFemale?: string;
}

export interface ShowdownSprites {
  frontDefault?: string;
  frontShiny?: string;
  backDefault?: string;
  backShiny?: string;
  frontFemale?: string;
  frontShinyFemale?: string;
  backFemale?: string;
  backShinyFemale?: string;
}

export interface VersionSprites {
  generationI?: GenerationISprites;
  generationII?: GenerationIISprites;
  generationIII?: GenerationIIISprites;
  generationIV?: GenerationIVSprites;
  generationV?: GenerationVSprites;
  generationVI?: GenerationVISprites;
  generationVII?: GenerationVIISprites;
  generationVIII?: GenerationVIIISprites;
}

export interface GenerationISprites {
  redBlue?: RedBlueSprites;
  yellow?: YellowSprites;
}

export interface RedBlueSprites {
  frontDefault?: string;
  backDefault?: string;
  frontGray?: string;
  backGray?: string;
  frontTransparent?: string;
  backTransparent?: string;
}

export interface YellowSprites {
  frontDefault?: string;
  backDefault?: string;
  frontGray?: string;
  backGray?: string;
  frontTransparent?: string;
  backTransparent?: string;
}

export interface GenerationIISprites {
  crystal?: CrystalSprites;
  gold?: GoldSprites;
  silver?: SilverSprites;
}

export interface CrystalSprites {
  frontDefault?: string;
  backDefault?: string;
  frontShiny?: string;
  backShiny?: string;
  frontTransparent?: string;
  backTransparent?: string;
  frontShinyTransparent?: string;
  backShinyTransparent?: string;
}

export interface GoldSprites {
  frontDefault?: string;
  backDefault?: string;
  frontShiny?: string;
  backShiny?: string;
  frontTransparent?: string;
  backTransparent?: string;
  frontShinyTransparent?: string;
  backShinyTransparent?: string;
}

export interface SilverSprites {
  frontDefault?: string;
  backDefault?: string;
  frontShiny?: string;
  backShiny?: string;
  frontTransparent?: string;
  backTransparent?: string;
  frontShinyTransparent?: string;
  backShinyTransparent?: string;
}

export interface GenerationIIISprites {
  emerald?: EmeraldSprites;
  fireredLeafgreen?: FireredLeafgreenSprites;
  rubySapphire?: RubySapphireSprites;
}

export interface EmeraldSprites {
  frontDefault?: string;
  frontShiny?: string;
}

export interface FireredLeafgreenSprites {
  frontDefault?: string;
  backDefault?: string;
  frontShiny?: string;
  backShiny?: string;
}

export interface RubySapphireSprites {
  frontDefault?: string;
  backDefault?: string;
  frontShiny?: string;
  backShiny?: string;
}

export interface GenerationIVSprites {
  diamondPearl?: DiamondPearlSprites;
  heartgoldSoulsilver?: HeartgoldSoulsilverSprites;
  platinum?: PlatinumSprites;
}

export interface DiamondPearlSprites {
  frontDefault?: string;
  backDefault?: string;
  frontShiny?: string;
  backShiny?: string;
  frontFemale?: string;
  backFemale?: string;
  frontShinyFemale?: string;
  backShinyFemale?: string;
}

export interface HeartgoldSoulsilverSprites {
  frontDefault?: string;
  backDefault?: string;
  frontShiny?: string;
  backShiny?: string;
  frontFemale?: string;
  backFemale?: string;
  frontShinyFemale?: string;
  backShinyFemale?: string;
}

export interface PlatinumSprites {
  frontDefault?: string;
  backDefault?: string;
  frontShiny?: string;
  backShiny?: string;
  frontFemale?: string;
  backFemale?: string;
  frontShinyFemale?: string;
  backShinyFemale?: string;
}

export interface GenerationVSprites {
  blackWhite?: BlackWhiteSprites;
}

export interface BlackWhiteSprites {
  frontDefault?: string;
  backDefault?: string;
  frontShiny?: string;
  backShiny?: string;
  frontFemale?: string;
  backFemale?: string;
  frontShinyFemale?: string;
  backShinyFemale?: string;
  animated?: AnimatedSprites;
}

export interface AnimatedSprites {
  frontDefault?: string;
  backDefault?: string;
  frontShiny?: string;
  backShiny?: string;
  frontFemale?: string;
  backFemale?: string;
  frontShinyFemale?: string;
  backShinyFemale?: string;
}

export interface GenerationVISprites {
  omegarubyAlphasapphire?: OmegarubyAlphasapphireSprites;
  xy?: XYSprites;
}

export interface OmegarubyAlphasapphireSprites {
  frontDefault?: string;
  frontShiny?: string;
  frontFemale?: string;
  frontShinyFemale?: string;
}

export interface XYSprites {
  frontDefault?: string;
  frontShiny?: string;
  frontFemale?: string;
  frontShinyFemale?: string;
}

export interface GenerationVIISprites {
  icons?: IconSprites;
  ultraSunUltraMoon?: UltraSunUltraMoonSprites;
}

export interface IconSprites {
  frontDefault?: string;
  frontFemale?: string;
}

export interface UltraSunUltraMoonSprites {
  frontDefault?: string;
  frontShiny?: string;
  frontFemale?: string;
  frontShinyFemale?: string;
}

export interface GenerationVIIISprites {
  icons?: IconSprites;
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
  names: NamedResourceWithLanguage[];
  type: PokemonType;
  damageClass: MoveDamageClass;
  power?: number;
  accuracy?: number;
  pp?: number;
  priority: number;
  target: MoveTarget;
  effectChance?: number;
  flavorTextEntries: MoveFlavorTextEntry[];
}

export interface MoveDamageClass {
  id: string;
  name: string;
  names: MoveDamageClassName[];
}

export interface MoveDamageClassName {
  name: string;
  language: Language;
}

export interface MoveTarget {
  id: string;
  name: string;
  names: MoveTargetName[];
}

export interface MoveTargetName {
  name: string;
  language: Language;
}

export interface MoveFlavorTextEntry {
  flavorText?: string;
  language: Language;
  versionGroup: VersionGroup;
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
  varieties?: PokemonVariety[];
}

export interface PokemonVariety {
  isDefault: boolean;
  pokemon: NamedResource;
}

export interface PokemonForm {
  id: string;
  name: string;
  formName?: string;
  formNames?: FormName[];
  formOrder: number;
  isDefault: boolean;
  isBattleOnly: boolean;
  isMega: boolean;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  versionGroup?: VersionGroup;
}

export interface FormName {
  name: string;
  language: Language;
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
  chain?: EvolutionDetail;
}

export interface EvolutionDetail {
  id: string;
  name: string;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  species?: PokemonSpecies;
  evolutionDetails?: EvolutionTrigger[];
  evolvesTo: EvolutionDetail[];
  forms?: FormVariant[];
}

export interface FormVariant {
  id: string;
  name: string;
  formName?: string;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  isRegionalVariant?: boolean;
  isMegaEvolution?: boolean;
  isDynamax?: boolean;
}

export interface EvolutionTrigger {
  minLevel?: number;
  item?: NamedResource;
  trigger: NamedResource;
  timeOfDay?: string;
  location?: NamedResource;
  knownMove?: NamedResource;
  minHappiness?: number;
  minBeauty?: number;
  minAffection?: number;
  needsOverworldRain?: boolean;
  partySpecies?: NamedResource;
  partyType?: NamedResource;
  relativePhysicalStats?: number;
  tradeSpecies?: NamedResource;
  turnUpsideDown?: boolean;
}

export interface NamedResource {
  id: string;
  name: string;
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