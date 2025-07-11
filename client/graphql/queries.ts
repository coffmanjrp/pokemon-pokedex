import { gql } from "@apollo/client";

// Basic queries for runtime browsing (lightweight)
export const GET_POKEMONS_BASIC = gql`
  query GetPokemonsBasic($limit: Int, $offset: Int) {
    pokemonsBasic(limit: $limit, offset: $offset) {
      edges {
        node {
          id
          name
          types {
            type {
              name
            }
          }
          sprites {
            frontDefault
            other {
              officialArtwork {
                frontDefault
              }
            }
          }
          species {
            id
            names {
              name
              language {
                name
              }
            }
            genera {
              genus
              language {
                name
              }
            }
            genderRate
            hasGenderDifferences
            isBaby
            isLegendary
            isMythical
          }
          formName
          isRegionalVariant
          isMegaEvolution
          isDynamax
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

export const GET_POKEMON_BASIC = gql`
  query GetPokemonBasic($id: ID!) {
    pokemonBasic(id: $id) {
      id
      name
      types {
        type {
          name
        }
      }
      sprites {
        frontDefault
        other {
          officialArtwork {
            frontDefault
          }
        }
      }
      species {
        id
        names {
          name
          language {
            name
          }
        }
        genera {
          genus
          language {
            name
          }
        }
        genderRate
        hasGenderDifferences
        isBaby
        isLegendary
        isMythical
      }
      formName
      isRegionalVariant
      isMegaEvolution
      isDynamax
    }
  }
`;

// Optimized query for Pokemon card list - reduced by ~70% size
export const GET_POKEMONS = gql`
  query GetPokemons($limit: Int, $offset: Int) {
    pokemons(limit: $limit, offset: $offset) {
      edges {
        node {
          id
          name
          types {
            type {
              name
            }
          }
          sprites {
            frontDefault
            other {
              officialArtwork {
                frontDefault
              }
            }
          }
          species {
            names {
              name
              language {
                name
              }
            }
            genera {
              genus
              language {
                name
              }
            }
            genderRate
            hasGenderDifferences
            isBaby
            isLegendary
            isMythical
          }
          formName
          isRegionalVariant
          isMegaEvolution
          isDynamax
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

// Keep the full query for detailed pages (already used in SSG)
export const GET_POKEMONS_FULL = gql`
  query GetPokemonsFull($limit: Int, $offset: Int) {
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
              names {
                name
                language {
                  name
                  url
                }
              }
            }
          }
          species {
            id
            name
            names {
              name
              language {
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
            genderRate
            hasGenderDifferences
            isBaby
            isLegendary
            isMythical
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
          names {
            name
            language {
              name
              url
            }
          }
        }
      }
      moves {
        move {
          id
          name
          url
          names {
            name
            language {
              name
              url
            }
          }
          type {
            id
            name
            url
          }
          damageClass {
            id
            name
            names {
              name
              language {
                name
                url
              }
            }
          }
          power
          accuracy
          pp
          priority
          target {
            id
            name
            names {
              name
              language {
                name
                url
              }
            }
          }
          effectChance
          flavorTextEntries {
            flavorText
            language {
              name
              url
            }
            versionGroup {
              name
              url
            }
          }
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
        names {
          name
          language {
            name
            url
          }
        }
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
        genderRate
        hasGenderDifferences
        isBaby
        isLegendary
        isMythical
        evolutionChain {
          id
          url
          chain {
            id
            name
            sprites {
              frontDefault
              other {
                officialArtwork {
                  frontDefault
                }
              }
            }
            types {
              slot
              type {
                id
                name
                url
              }
            }
            species {
              id
              name
              names {
                name
                language {
                  name
                  url
                }
              }
            }
            evolutionDetails {
              minLevel
              item {
                id
                name
                url
              }
              trigger {
                id
                name
                url
              }
              timeOfDay
              location {
                id
                name
                url
              }
              knownMove {
                id
                name
                url
              }
              minHappiness
              minBeauty
              minAffection
              needsOverworldRain
              partySpecies {
                id
                name
                url
              }
              partyType {
                id
                name
                url
              }
              relativePhysicalStats
              tradeSpecies {
                id
                name
                url
              }
              turnUpsideDown
            }
            forms {
              id
              name
              formName
              sprites {
                frontDefault
                other {
                  officialArtwork {
                    frontDefault
                  }
                }
              }
              types {
                slot
                type {
                  id
                  name
                  url
                }
              }
              isRegionalVariant
              isMegaEvolution
              isDynamax
            }
            evolvesTo {
              id
              name
              sprites {
                frontDefault
                other {
                  officialArtwork {
                    frontDefault
                  }
                }
              }
              types {
                slot
                type {
                  id
                  name
                  url
                }
              }
              species {
                id
                name
                names {
                  name
                  language {
                    name
                    url
                  }
                }
              }
              evolutionDetails {
                minLevel
                item {
                  id
                  name
                  url
                }
                trigger {
                  id
                  name
                  url
                }
                timeOfDay
                location {
                  id
                  name
                  url
                }
                knownMove {
                  id
                  name
                  url
                }
                minHappiness
                minBeauty
                minAffection
                needsOverworldRain
                partySpecies {
                  id
                  name
                  url
                }
                partyType {
                  id
                  name
                  url
                }
                relativePhysicalStats
                tradeSpecies {
                  id
                  name
                  url
                }
                turnUpsideDown
              }
              forms {
                id
                name
                formName
                sprites {
                  frontDefault
                  other {
                    officialArtwork {
                      frontDefault
                    }
                  }
                }
                types {
                  slot
                  type {
                    id
                    name
                    url
                  }
                }
                isRegionalVariant
                isMegaEvolution
                isDynamax
              }
              evolvesTo {
                id
                name
                sprites {
                  frontDefault
                  other {
                    officialArtwork {
                      frontDefault
                    }
                  }
                }
                types {
                  slot
                  type {
                    id
                    name
                    url
                  }
                }
                species {
                  id
                  name
                  names {
                    name
                    language {
                      name
                      url
                    }
                  }
                }
                evolutionDetails {
                  minLevel
                  item {
                    id
                    name
                    url
                  }
                  trigger {
                    id
                    name
                    url
                  }
                  timeOfDay
                  location {
                    id
                    name
                    url
                  }
                  knownMove {
                    id
                    name
                    url
                  }
                  minHappiness
                  minBeauty
                  minAffection
                  needsOverworldRain
                  partySpecies {
                    id
                    name
                    url
                  }
                  partyType {
                    id
                    name
                    url
                  }
                  relativePhysicalStats
                  tradeSpecies {
                    id
                    name
                    url
                  }
                  turnUpsideDown
                }
                forms {
                  id
                  name
                  formName
                  sprites {
                    frontDefault
                    other {
                      officialArtwork {
                        frontDefault
                      }
                    }
                  }
                  types {
                    slot
                    type {
                      id
                      name
                      url
                    }
                  }
                  isRegionalVariant
                  isMegaEvolution
                  isDynamax
                }
              }
            }
          }
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
