import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    hello: String
    pokemon(id: ID!): Pokemon
    pokemons(limit: Int, offset: Int): PokemonConnection
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
    evolutionDetails: [EvolutionTrigger!]
    evolvesTo: [EvolutionDetail!]!
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
`;