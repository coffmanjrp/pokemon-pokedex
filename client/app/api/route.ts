import { NextResponse } from "next/server";

export async function GET() {
  const endpoints = {
    title: "Pokemon Pokedex API Debug Endpoints",
    description: "API routes for debugging GraphQL data",
    version: "1.0.0",
    endpoints: [
      {
        path: "/api/pokemon",
        method: "GET",
        description: "Get Pokemon list (basic) or single Pokemon by ID",
        examples: ["/api/pokemon?limit=20&offset=0", "/api/pokemon?id=1"],
        parameters: {
          limit: "Number of Pokemon to fetch (default: 20)",
          offset: "Starting offset (default: 0)",
          id: "Pokemon ID for single Pokemon fetch",
        },
      },
      {
        path: "/api/pokemon/[id]",
        method: "GET",
        description: "Get basic Pokemon data (lightweight)",
        example: "/api/pokemon/2",
        parameters: {
          id: "Pokemon ID (1-1025)",
        },
      },
      {
        path: "/api/pokemon/[id]/basic",
        method: "GET",
        description: "Get basic Pokemon data with clear endpoint path",
        example: "/api/pokemon/2/basic",
        parameters: {
          id: "Pokemon ID (1-1025)",
        },
      },
      {
        path: "/api/pokemon/[id]/full",
        method: "GET",
        description:
          "Get complete Pokemon data including evolution chain (full detail)",
        example: "/api/pokemon/2/full",
        parameters: {
          id: "Pokemon ID (1-1025)",
        },
      },
      {
        path: "/api/pokemon/[id]/evolution",
        method: "GET",
        description: "Get detailed evolution chain analysis for a Pokemon",
        example: "/api/pokemon/2/evolution",
        parameters: {
          id: "Pokemon ID (1-1025)",
        },
      },
      {
        path: "/api/graphql/debug",
        method: "GET",
        description: "Debug and test GraphQL queries directly",
        examples: [
          "/api/graphql/debug?query=GET_POKEMONS_BASIC&limit=5",
          "/api/graphql/debug?query=GET_POKEMON_BASIC&id=1",
          "/api/graphql/debug?query=GET_POKEMON&id=1",
          "/api/graphql/debug?query=GET_POKEMONS_FULL&limit=3",
        ],
        parameters: {
          query:
            "Query type (GET_POKEMONS_BASIC, GET_POKEMON_BASIC, GET_POKEMON, GET_POKEMONS_FULL)",
          id: "Pokemon ID (required for detail queries)",
          limit: "Number of Pokemon (for list queries)",
          offset: "Starting offset (for list queries)",
        },
      },
    ],
    examples: {
      "Pokemon List (Basic)": {
        list: "/api/pokemon?limit=10&offset=0",
        debug: "/api/graphql/debug?query=GET_POKEMONS_BASIC&limit=5",
      },
      "Bulbasaur (Base)": {
        basic: "/api/pokemon?id=1",
        basic_detail: "/api/pokemon/1",
        basic_explicit: "/api/pokemon/1/basic",
        full_detail: "/api/pokemon/1/full",
        evolution: "/api/pokemon/1/evolution",
        debug_basic: "/api/graphql/debug?query=GET_POKEMON_BASIC&id=1",
        debug_full: "/api/graphql/debug?query=GET_POKEMON&id=1",
      },
      "Ivysaur (Middle)": {
        basic: "/api/pokemon?id=2",
        basic_detail: "/api/pokemon/2",
        basic_explicit: "/api/pokemon/2/basic",
        full_detail: "/api/pokemon/2/full",
        evolution: "/api/pokemon/2/evolution",
      },
      "Venusaur (Final)": {
        basic: "/api/pokemon?id=3",
        basic_detail: "/api/pokemon/3",
        basic_explicit: "/api/pokemon/3/basic",
        full_detail: "/api/pokemon/3/full",
        evolution: "/api/pokemon/3/evolution",
      },
      "Charmander (Base)": {
        basic: "/api/pokemon?id=4",
        basic_detail: "/api/pokemon/4",
        basic_explicit: "/api/pokemon/4/basic",
        full_detail: "/api/pokemon/4/full",
        evolution: "/api/pokemon/4/evolution",
      },
    },
    usage: {
      note: "These endpoints are for debugging purposes to inspect the raw GraphQL data",
      pokemon_list: "Use /api/pokemon with limit/offset to get Pokemon lists",
      pokemon_basic: "Use /api/pokemon?id=[id] to get basic Pokemon data",
      pokemon_basic_detail:
        "Use /api/pokemon/[id] to get basic Pokemon detail data",
      pokemon_basic_explicit:
        "Use /api/pokemon/[id]/basic for explicit basic Pokemon data",
      pokemon_full_detail:
        "Use /api/pokemon/[id]/full to get complete Pokemon data with evolution chain",
      evolution_debugging:
        "Use /api/pokemon/[id]/evolution to see detailed analysis of evolution conditions",
      graphql_debugging:
        "Use /api/graphql/debug to test different GraphQL queries directly",
      query_comparison:
        "Compare GET_POKEMON_BASIC vs GET_POKEMON to see data differences",
    },
  };

  return NextResponse.json(endpoints, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
