import { NextRequest, NextResponse } from "next/server";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// GraphQL client setup
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

// GraphQL query for Pokemon details with evolution chain
const GET_POKEMON_DETAIL = gql`
  query GetPokemonDetail($id: ID!) {
    pokemon(id: $id) {
      id
      name
      height
      weight
      baseExperience
      order
      isDefault
      sprites {
        frontDefault
        frontShiny
        backDefault
        backShiny
        frontFemale
        backFemale
        frontShinyFemale
        backShinyFemale
        other {
          officialArtwork {
            frontDefault
            frontShiny
          }
          home {
            frontDefault
            frontShiny
            frontFemale
            frontShinyFemale
          }
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
      types {
        slot
        type {
          id
          name
          url
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
      moves {
        move {
          id
          name
          url
          power
          accuracy
          pp
          damageClass {
            id
            name
            url
          }
          type {
            id
            name
            url
          }
        }
        versionGroupDetails {
          levelLearnedAt
          moveLearnMethod {
            id
            name
            url
          }
          versionGroup {
            id
            name
            url
          }
        }
      }
      species {
        id
        name
        url
        flavorTextEntries {
          flavorText
          language {
            id
            name
            url
          }
          version {
            id
            name
            url
          }
        }
        genera {
          genus
          language {
            id
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
              isMegaEvolution
              isRegionalVariant
              isDynamax
              sprites {
                frontDefault
                frontShiny
                other {
                  officialArtwork {
                    frontDefault
                    frontShiny
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
            }
            evolvesTo {
              id
              name
              sprites {
                frontDefault
                frontShiny
                other {
                  officialArtwork {
                    frontDefault
                    frontShiny
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
                isMegaEvolution
                isRegionalVariant
                isDynamax
                sprites {
                  frontDefault
                  frontShiny
                  other {
                    officialArtwork {
                      frontDefault
                      frontShiny
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
              }
              evolvesTo {
                id
                name
                sprites {
                  frontDefault
                  frontShiny
                  other {
                    officialArtwork {
                      frontDefault
                      frontShiny
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
              }
            }
          }
        }
      }
      gameIndices {
        gameIndex
        version {
          id
          name
          url
        }
      }
    }
  }
`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Pokemon ID is required" },
        { status: 400 },
      );
    }

    // Fetch data from GraphQL server
    const { data, error } = await client.query({
      query: GET_POKEMON_DETAIL,
      variables: { id },
      errorPolicy: "all",
    });

    if (error) {
      console.error("GraphQL Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch Pokemon data", details: error.message },
        { status: 500 },
      );
    }

    if (!data?.pokemon) {
      return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
    }

    // Return the raw GraphQL data for debugging
    return NextResponse.json({
      success: true,
      pokemon: data.pokemon,
      metadata: {
        id,
        timestamp: new Date().toISOString(),
        source: "GraphQL API",
      },
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
