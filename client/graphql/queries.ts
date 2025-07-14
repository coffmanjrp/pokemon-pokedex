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

// Lightweight query for metadata generation only
export const GET_POKEMON_META = gql`
  query GetPokemonMeta($id: ID!) {
    pokemon(id: $id) {
      id
      name
      height
      weight
      types {
        type {
          name
        }
      }
      sprites {
        other {
          officialArtwork {
            frontDefault
          }
        }
      }
      stats {
        baseStat
        stat {
          name
        }
      }
      species {
        names {
          name
          language {
            name
          }
        }
        flavorTextEntries {
          flavorText
          language {
            name
          }
        }
        generation {
          name
        }
      }
    }
  }
`;

export const GET_POKEMON_FULL = gql`
  query GetPokemonFull($id: ID!) {
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

// Main query for SSG build - without moves and evolution chain
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
      }
      formName
      isRegionalVariant
      isMegaEvolution
      isDynamax
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

// Separate query for moves data
export const GET_POKEMON_MOVES = gql`
  query GetPokemonMoves($id: ID!) {
    pokemon(id: $id) {
      id
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
    }
  }
`;

// Separate query for evolution chain
export const GET_POKEMON_EVOLUTION = gql`
  query GetPokemonEvolution($id: ID!) {
    pokemon(id: $id) {
      id
      species {
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
                item {
                  name
                  url
                }
                knownMove {
                  name
                  url
                }
                location {
                  name
                  url
                }
                minAffection
                minBeauty
                minHappiness
                minLevel
                needsOverworldRain
                partySpecies {
                  name
                  url
                }
                partyType {
                  name
                  url
                }
                relativePhysicalStats
                timeOfDay
                tradeSpecies {
                  name
                  url
                }
                trigger {
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
                  item {
                    name
                    url
                  }
                  knownMove {
                    name
                    url
                  }
                  location {
                    name
                    url
                  }
                  minAffection
                  minBeauty
                  minHappiness
                  minLevel
                  needsOverworldRain
                  partySpecies {
                    name
                    url
                  }
                  partyType {
                    name
                    url
                  }
                  relativePhysicalStats
                  timeOfDay
                  tradeSpecies {
                    name
                    url
                  }
                  trigger {
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
    }
  }
`;
