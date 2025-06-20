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