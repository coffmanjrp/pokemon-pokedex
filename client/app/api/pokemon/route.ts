import { NextRequest, NextResponse } from "next/server";
import { GET_POKEMONS_BASIC, GET_POKEMON_BASIC } from "@/graphql/queries";
import { createApolloClient } from "../utils/graphqlClient";

// GraphQL client setup
const client = createApolloClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const id = searchParams.get("id");

    // If ID is provided, fetch single Pokemon (basic)
    if (id) {
      const { data, error } = await client.query({
        query: GET_POKEMON_BASIC,
        variables: { id },
        errorPolicy: "all",
      });

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch Pokemon data", details: error.message },
          { status: 500 },
        );
      }

      if (!data?.pokemonBasic) {
        return NextResponse.json(
          { error: "Pokemon not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        pokemon: data.pokemonBasic,
        metadata: {
          id,
          timestamp: new Date().toISOString(),
          source: "GraphQL API (Basic)",
          query: "GET_POKEMON_BASIC",
        },
      });
    }

    // Otherwise, fetch Pokemon list (basic)
    const { data, error } = await client.query({
      query: GET_POKEMONS_BASIC,
      variables: { limit, offset },
      errorPolicy: "all",
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch Pokemon list", details: error.message },
        { status: 500 },
      );
    }

    if (!data?.pokemonsBasic) {
      return NextResponse.json(
        { error: "Pokemon list not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      pokemons: data.pokemonsBasic,
      metadata: {
        limit,
        offset,
        timestamp: new Date().toISOString(),
        source: "GraphQL API (Basic)",
        query: "GET_POKEMONS_BASIC",
        totalResults: data.pokemonsBasic.edges?.length || 0,
        hasNextPage: data.pokemonsBasic.pageInfo?.hasNextPage || false,
        hasPreviousPage: data.pokemonsBasic.pageInfo?.hasPreviousPage || false,
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
