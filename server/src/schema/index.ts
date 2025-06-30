import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    hello: String
    pokemon(id: ID!): Pokemon
    pokemons(limit: Int, offset: Int): PokemonConnection
    pokemonForms(speciesId: ID!): [PokemonForm!]!
    pokemonForm(id: ID!): PokemonForm
    
    # Selective data loading queries
    pokemonBasic(id: ID!): PokemonBasic
    pokemonFull(id: ID!): Pokemon
    pokemonsBasic(limit: Int, offset: Int): PokemonBasicConnection
    pokemonsFull(limit: Int, offset: Int): PokemonConnection
  }

  type Pokemon {
    id: ID!
    name: String!
    height: Int!
    weight: Int!
    baseExperience: Int
    types: [PokemonType!]!
    sprites: PokemonSprites!
    stats: [PokemonStat!]!
    abilities: [PokemonAbility!]!
    moves: [PokemonMove!]!
    species: PokemonSpecies
    gameIndices: [GameIndex!]!
  }

  type PokemonType {
    slot: Int!
    type: Type!
  }

  type Type {
    id: ID!
    name: String!
    url: String!
  }

  type PokemonSprites {
    frontDefault: String
    frontShiny: String
    backDefault: String
    backShiny: String
    other: OtherSprites
  }

  type OtherSprites {
    officialArtwork: OfficialArtwork
    home: HomeSprites
  }

  type OfficialArtwork {
    frontDefault: String
    frontShiny: String
  }

  type HomeSprites {
    frontDefault: String
    frontShiny: String
  }

  type PokemonStat {
    baseStat: Int!
    effort: Int!
    stat: Stat!
  }

  type Stat {
    id: ID!
    name: String!
    url: String!
  }

  type PokemonAbility {
    isHidden: Boolean!
    slot: Int!
    ability: Ability!
  }

  type Ability {
    id: ID!
    name: String!
    url: String!
    names: [AbilityName!]!
  }

  type AbilityName {
    name: String!
    language: Language!
  }

  type PokemonConnection {
    edges: [PokemonEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type PokemonEdge {
    node: Pokemon!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type PokemonMove {
    move: Move!
    versionGroupDetails: [MoveVersionGroupDetail!]!
  }

  type Move {
    id: ID!
    name: String!
    url: String!
    names: [MoveName!]
    type: Type!
    damageClass: MoveDamageClass!
    power: Int
    accuracy: Int
    pp: Int
    priority: Int
    target: MoveTarget!
    effectChance: Int
    flavorTextEntries: [MoveFlavorTextEntry!]
  }

  type MoveDamageClass {
    id: ID!
    name: String!
    names: [MoveDamageClassName!]!
  }

  type MoveDamageClassName {
    name: String!
    language: Language!
  }

  type MoveName {
    name: String!
    language: Language!
  }

  type MoveTarget {
    id: ID!
    name: String!
    names: [MoveTargetName!]!
  }

  type MoveTargetName {
    name: String!
    language: Language!
  }

  type MoveFlavorTextEntry {
    flavorText: String
    language: Language!
    versionGroup: VersionGroup!
  }

  type MoveVersionGroupDetail {
    levelLearnedAt: Int!
    moveLearnMethod: MoveLearnMethod!
    versionGroup: VersionGroup!
  }

  type MoveLearnMethod {
    name: String!
    url: String!
  }

  type VersionGroup {
    name: String!
    url: String!
  }

  type PokemonSpecies {
    id: ID!
    name: String!
    names: [SpeciesName!]!
    flavorTextEntries: [FlavorTextEntry!]!
    genera: [Genus!]!
    generation: Generation!
    evolutionChain: EvolutionChain
    varieties: [PokemonVariety!]!
    genderRate: Int
    hasGenderDifferences: Boolean
  }

  type PokemonVariety {
    isDefault: Boolean!
    pokemon: NamedResource!
  }

  type PokemonForm {
    id: ID!
    name: String!
    formName: String
    formNames: [FormName!]!
    formOrder: Int!
    isDefault: Boolean!
    isBattleOnly: Boolean!
    isMega: Boolean!
    sprites: PokemonSprites!
    types: [PokemonType!]!
    versionGroup: VersionGroup
  }

  type FormName {
    name: String!
    language: Language!
  }

  type SpeciesName {
    name: String!
    language: Language!
  }

  type FlavorTextEntry {
    flavorText: String!
    language: Language!
    version: Version!
  }

  type Genus {
    genus: String!
    language: Language!
  }

  type Language {
    name: String!
    url: String!
  }

  type Version {
    name: String!
    url: String!
  }

  type Generation {
    id: ID!
    name: String!
    url: String!
  }

  type NamedResource {
    id: ID!
    name: String!
    url: String!
  }

  type EvolutionChain {
    id: ID!
    url: String!
    chain: EvolutionDetail!
  }

  type EvolutionDetail {
    id: ID!
    name: String!
    sprites: PokemonSprites!
    types: [PokemonType!]!
    species: PokemonSpecies
    evolutionDetails: [EvolutionTrigger!]
    evolvesTo: [EvolutionDetail!]!
    forms: [FormVariant!]!
  }

  type FormVariant {
    id: ID!
    name: String!
    formName: String
    sprites: PokemonSprites!
    types: [PokemonType!]!
    isRegionalVariant: Boolean!
    isMegaEvolution: Boolean!
    isDynamax: Boolean!
  }

  type EvolutionTrigger {
    minLevel: Int
    item: NamedResource
    trigger: NamedResource!
    timeOfDay: String
    location: NamedResource
    knownMove: NamedResource
    minHappiness: Int
    minBeauty: Int
    minAffection: Int
    needsOverworldRain: Boolean
    partySpecies: NamedResource
    partyType: NamedResource
    relativePhysicalStats: Int
    tradeSpecies: NamedResource
    turnUpsideDown: Boolean
  }

  type GameIndex {
    gameIndex: Int!
    version: Version!
  }

  # Lightweight Pokemon type for browsing (name, image, type, classification only)
  type PokemonBasic {
    id: ID!
    name: String!
    types: [PokemonType!]!
    sprites: PokemonSprites!
    species: PokemonSpeciesBasic
  }

  # Lightweight species type for browsing
  type PokemonSpeciesBasic {
    id: ID!
    name: String!
    names: [SpeciesName!]!
    genera: [Genus!]!
    genderRate: Int
    hasGenderDifferences: Boolean
  }

  # Connection type for PokemonBasic pagination
  type PokemonBasicConnection {
    edges: [PokemonBasicEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type PokemonBasicEdge {
    node: PokemonBasic!
    cursor: String!
  }
`;