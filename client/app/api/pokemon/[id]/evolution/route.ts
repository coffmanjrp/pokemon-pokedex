import { NextRequest, NextResponse } from "next/server";
import { gql } from "@apollo/client";
import { createApolloClient } from "../../../utils/graphqlClient";

// GraphQL client setup
const client = createApolloClient();

// GraphQL query focused on evolution chain only
const GET_EVOLUTION_CHAIN = gql`
  query GetEvolutionChain($id: ID!) {
    pokemon(id: $id) {
      id
      name
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
              }
            }
          }
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

    // Fetch evolution chain data from GraphQL server
    const { data, error } = await client.query({
      query: GET_EVOLUTION_CHAIN,
      variables: { id },
      errorPolicy: "all",
    });

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to fetch evolution chain data",
          details: error.message,
        },
        { status: 500 },
      );
    }

    if (!data?.pokemon) {
      return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
    }

    // Helper function to analyze evolution details
    const analyzeEvolutionDetails = (evolutionDetails: unknown[]) => {
      if (!Array.isArray(evolutionDetails)) return null;

      return evolutionDetails.map((detail: unknown, index) => {
        const detailObj = detail as Record<string, unknown>; // Type assertion for accessing properties

        // Helper function to safely extract name property
        const getName = (val: unknown): string | undefined => {
          if (typeof val === "object" && val !== null && "name" in val) {
            const nameValue = (val as Record<string, unknown>).name;
            return typeof nameValue === "string" ? nameValue : undefined;
          }
          return undefined;
        };

        const analysis = {
          index,
          raw: detail,
          conditions: [] as string[],
          hasMinLevel:
            detailObj.minLevel !== null && detailObj.minLevel !== undefined,
          minLevelValue: detailObj.minLevel,
          hasItem: !!detailObj.item,
          itemName: getName(detailObj.item),
          trigger: getName(detailObj.trigger),
          hasTimeOfDay: !!detailObj.timeOfDay,
          timeOfDay: detailObj.timeOfDay,
          hasHappiness:
            detailObj.minHappiness !== null &&
            detailObj.minHappiness !== undefined,
          minHappiness: detailObj.minHappiness,
          hasKnownMove: !!detailObj.knownMove,
          knownMove: getName(detailObj.knownMove),
        };

        // Determine what conditions would be displayed
        if (analysis.hasMinLevel) {
          analysis.conditions.push(`Level ${detailObj.minLevel}`);
        }
        if (analysis.hasItem && analysis.itemName) {
          analysis.conditions.push(
            `Use ${analysis.itemName.replace(/-/g, " ")}`,
          );
        }
        if (analysis.trigger === "trade") {
          analysis.conditions.push("Trade");
        }
        if (analysis.trigger === "level-up" && !analysis.hasMinLevel) {
          analysis.conditions.push("Level up");
        }
        if (analysis.hasHappiness) {
          analysis.conditions.push(`Happiness ${detailObj.minHappiness}+`);
        }
        if (analysis.hasTimeOfDay) {
          analysis.conditions.push(`Time: ${detailObj.timeOfDay}`);
        }
        if (analysis.hasKnownMove && analysis.knownMove) {
          analysis.conditions.push(
            `Learn ${analysis.knownMove.replace(/-/g, " ")}`,
          );
        }

        return analysis;
      });
    };

    // Deep analysis of evolution chain
    const evolutionChain = data.pokemon.species?.evolutionChain?.chain;
    const analysisResult = {
      pokemonId: id,
      pokemonName: data.pokemon.name,
      hasEvolutionChain: !!evolutionChain,
      evolutionChain: evolutionChain
        ? {
            baseStage: {
              id: evolutionChain.id,
              name: evolutionChain.name,
              evolutionDetails: evolutionChain.evolutionDetails,
              evolutionAnalysis: analyzeEvolutionDetails(
                evolutionChain.evolutionDetails,
              ),
              hasEvolvesTo:
                Array.isArray(evolutionChain.evolvesTo) &&
                evolutionChain.evolvesTo.length > 0,
            },
            secondStage: evolutionChain.evolvesTo?.[0]
              ? {
                  id: evolutionChain.evolvesTo[0].id,
                  name: evolutionChain.evolvesTo[0].name,
                  evolutionDetails:
                    evolutionChain.evolvesTo[0].evolutionDetails,
                  evolutionAnalysis: analyzeEvolutionDetails(
                    evolutionChain.evolvesTo[0].evolutionDetails,
                  ),
                  hasEvolvesTo:
                    Array.isArray(evolutionChain.evolvesTo[0].evolvesTo) &&
                    evolutionChain.evolvesTo[0].evolvesTo.length > 0,
                }
              : null,
            thirdStage: evolutionChain.evolvesTo?.[0]?.evolvesTo?.[0]
              ? {
                  id: evolutionChain.evolvesTo[0].evolvesTo[0].id,
                  name: evolutionChain.evolvesTo[0].evolvesTo[0].name,
                  evolutionDetails:
                    evolutionChain.evolvesTo[0].evolvesTo[0].evolutionDetails,
                  evolutionAnalysis: analyzeEvolutionDetails(
                    evolutionChain.evolvesTo[0].evolvesTo[0].evolutionDetails,
                  ),
                }
              : null,
          }
        : null,
      rawData: data.pokemon.species?.evolutionChain,
    };

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      metadata: {
        id,
        timestamp: new Date().toISOString(),
        source: "Evolution Chain Analysis API",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
