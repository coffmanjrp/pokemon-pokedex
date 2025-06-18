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
      moves {
        move {
          id
          name
          url
        }
        versionGroupDetails {
          levelLearnedAt
          moveLearnMethod {
            name
            url
          }
          versionGroup {
            name
            url
          }
        }
      }
      species {
        id
        name
        flavorTextEntries {
          flavorText
          language {
            name
            url
          }
          version {
            name
            url
          }
        }
        genera {
          genus
          language {
            name
            url
          }
        }
        generation {
          id
          name
          url
        }
        evolutionChain {
          id
          url
        }
      }
      gameIndices {
        gameIndex
        version {
          name
          url
        }
      }
    }
  }
`;