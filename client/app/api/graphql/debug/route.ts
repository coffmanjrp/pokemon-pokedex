import { NextRequest, NextResponse } from "next/server";
import {
  GET_POKEMONS_BASIC,
  GET_POKEMON_BASIC,
  GET_POKEMON,
  GET_POKEMONS_FULL,
} from "@/graphql/queries";
import { createApolloClient } from "../../utils/graphqlClient";

// GraphQL client setup
const client = createApolloClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryType = searchParams.get("query");
    const id = searchParams.get("id");
    const limit = parseInt(searchParams.get("limit") || "5");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!queryType) {
      return NextResponse.json({
        error: "Query type is required",
        availableQueries: [
          "GET_POKEMONS_BASIC",
          "GET_POKEMON_BASIC",
          "GET_POKEMON",
          "GET_POKEMONS_FULL",
        ],
        examples: {
          "Basic Pokemon List":
            "/api/graphql/debug?query=GET_POKEMONS_BASIC&limit=5",
          "Basic Pokemon Detail":
            "/api/graphql/debug?query=GET_POKEMON_BASIC&id=1",
          "Full Pokemon Detail": "/api/graphql/debug?query=GET_POKEMON&id=1",
          "Full Pokemon List":
            "/api/graphql/debug?query=GET_POKEMONS_FULL&limit=5",
        },
      });
    }

    let query;
    let variables: Record<string, string | number> = {};

    switch (queryType) {
      case "GET_POKEMONS_BASIC":
        query = GET_POKEMONS_BASIC;
        variables = { limit, offset };
        break;
      case "GET_POKEMON_BASIC":
        if (!id) {
          return NextResponse.json(
            { error: "ID is required for Pokemon detail queries" },
            { status: 400 },
          );
        }
        query = GET_POKEMON_BASIC;
        variables = { id };
        break;
      case "GET_POKEMON":
        if (!id) {
          return NextResponse.json(
            { error: "ID is required for Pokemon detail queries" },
            { status: 400 },
          );
        }
        query = GET_POKEMON;
        variables = { id };
        break;
      case "GET_POKEMONS_FULL":
        query = GET_POKEMONS_FULL;
        variables = { limit, offset };
        break;
      default:
        return NextResponse.json(
          { error: `Unknown query type: ${queryType}` },
          { status: 400 },
        );
    }

    const startTime = Date.now();
    const { data, error, loading } = await client.query({
      query,
      variables,
      errorPolicy: "all",
      fetchPolicy: "no-cache", // Always fetch fresh data for debugging
    });
    const endTime = Date.now();

    if (error) {
      console.error("GraphQL Error:", error);
      return NextResponse.json(
        {
          error: "GraphQL query failed",
          details: error.message,
          graphQLErrors: error.graphQLErrors,
          networkError: error.networkError,
          metadata: {
            queryType,
            variables,
            timestamp: new Date().toISOString(),
            executionTime: endTime - startTime,
          },
        },
        { status: 500 },
      );
    }

    // Calculate data size for debugging
    const dataString = JSON.stringify(data);
    const dataSize = new Blob([dataString]).size;

    return NextResponse.json({
      success: true,
      data,
      metadata: {
        queryType,
        variables,
        timestamp: new Date().toISOString(),
        executionTime: endTime - startTime,
        dataSize: `${(dataSize / 1024).toFixed(2)} KB`,
        loading,
        source: "GraphQL API Debug",
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
