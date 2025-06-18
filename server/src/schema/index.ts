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
`;