import { NextRequest, NextResponse } from "next/server";
import { GET_POKEMON_BASIC } from "@/graphql/queries";
import { createApolloClient } from "../../utils/graphqlClient";

// GraphQL client setup
const client = createApolloClient();

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

    // Debug: Log the exact query and variables being sent
    console.log("Sending GraphQL query:", {
      query: GET_POKEMON_BASIC.loc?.source?.body,
      variables: { id },
    });

    // Fetch data from GraphQL server using the basic GET_POKEMON_BASIC query
    const { data, error } = await client.query({
      query: GET_POKEMON_BASIC,
      variables: { id },
      errorPolicy: "all",
      fetchPolicy: "no-cache", // Same as debug endpoint
    });

    if (error) {
      console.error("GraphQL Error:", error);
      console.error("GraphQL Errors Detail:", error.graphQLErrors);
      console.error("Network Error Detail:", error.networkError);

      // Try to extract more detailed error information
      let errorDetails = error.message;
      let networkErrorDetails = null;

      if (error.networkError && "result" in error.networkError) {
        const networkResult = error.networkError.result as {
          errors?: unknown[];
        };
        if (networkResult?.errors) {
          errorDetails = JSON.stringify(networkResult.errors, null, 2);
          console.error("Server GraphQL Errors:", networkResult.errors);
          networkErrorDetails = networkResult.errors;
        }
      }

      // Also try to read the response body if available
      if (error.networkError && "response" in error.networkError) {
        const response = error.networkError.response as {
          status: number;
          headers: { entries(): IterableIterator<[string, string]> };
        };
        console.error("Response status:", response.status);
        console.error(
          "Response headers:",
          Object.fromEntries(response.headers.entries()),
        );
      }

      return NextResponse.json(
        {
          error: "Failed to fetch Pokemon data",
          details: errorDetails,
          graphQLErrors: error.graphQLErrors,
          networkErrorDetails: networkErrorDetails,
          debugInfo: {
            hasNetworkError: !!error.networkError,
            networkErrorType: error.networkError?.constructor?.name,
            statusCode: error.networkError
              ? (error.networkError as { statusCode?: number }).statusCode
              : null,
          },
        },
        { status: 500 },
      );
    }

    if (!data?.pokemonBasic) {
      return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
    }

    // Return the raw GraphQL data for debugging
    return NextResponse.json({
      success: true,
      pokemon: data.pokemonBasic,
      metadata: {
        id,
        timestamp: new Date().toISOString(),
        source: "GraphQL API (Basic Detail)",
        query: "GET_POKEMON_BASIC",
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
