import { NextResponse } from "next/server";

export async function GET() {
  const endpoints = {
    title: "Pokemon Pokedex API",
    description: "API routes for Pokemon data",
    version: "2.0.0",
    endpoints: [
      {
        path: "/api/health",
        method: "GET",
        description: "Health check endpoint",
        example: "/api/health",
      },
      {
        path: "/api/errors",
        method: "POST",
        description: "Log client-side errors",
        example: "/api/errors",
      },
      {
        path: "/api/errors/batch",
        method: "POST",
        description: "Batch log client-side errors",
        example: "/api/errors/batch",
      },
      {
        path: "/api/images/pokemon/[id]",
        method: "GET",
        description: "Get Pokemon sprite image",
        example: "/api/images/pokemon/25",
        parameters: {
          id: "Pokemon ID",
        },
      },
    ],
    notes: {
      dataSource: "All Pokemon data is now served from Supabase",
      migration:
        "GraphQL endpoints have been removed in favor of direct Supabase queries",
    },
  };

  return NextResponse.json(endpoints, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
