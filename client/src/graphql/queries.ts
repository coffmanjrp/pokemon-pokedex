import { gql } from '@apollo/client';

export const GET_POKEMONS = gql`
  query GetPokemons($limit: Int, $offset: Int) {
    pokemons(limit: $limit, offset: $offset) {
      edges {
        node {
          id
          name
          height
          weight
          baseExperience
          types {
            slot
            type {
              id
              name
              url
            }
          }
          sprites {
            frontDefault
            frontShiny
            other {
              officialArtwork {
                frontDefault
                frontShiny
              }
              home {
                frontDefault
                frontShiny
              }
            }
          }
          stats {
            baseStat
            effort
            stat {
              id
              name
              url
            }
          }
          abilities {
            isHidden
            slot
            ability {
              id
              name
              url
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_POKEMON = gql`
  query GetPokemon($id: ID!) {
    pokemon(id: $id) {
      id
      name
      height
      weight
      baseExperience
      types {
        slot
        type {
          id
          name
          url
        }
      }
      sprites {
        frontDefault
        frontShiny
        backDefault
        backShiny
        other {
          officialArtwork {
            frontDefault
            frontShiny
          }
          home {
            frontDefault
            frontShiny
          }
        }
      }
      stats {
        baseStat
        effort
        stat {
          id
          name
          url
        }
      }
      abilities {
        isHidden
        slot
        ability {
          id
          name
          url
        }
      }
    }
  }
`;