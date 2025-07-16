import { NextRequest, NextResponse } from "next/server";
import { GET_POKEMON } from "@/graphql/queries";
import { createApolloClient } from "../../../utils/graphqlClient";

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

    // Prepare GraphQL query

    // Fetch data from GraphQL server using the full GET_POKEMON query
    const { data, error } = await client.query({
      query: GET_POKEMON,
      variables: { id },
      errorPolicy: "all",
      fetchPolicy: "no-cache", // Same as debug endpoint
    });

    if (error) {
      // Try to extract more detailed error information
      let errorDetails = error.message;
      let networkErrorDetails = null;

      if (error.networkError && "result" in error.networkError) {
        const networkResult = error.networkError.result as {
          errors?: unknown[];
        };
        if (networkResult?.errors) {
          errorDetails = JSON.stringify(networkResult.errors, null, 2);
          networkErrorDetails = networkResult.errors;
        }
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
        source: "GraphQL API (Full Detail)",
        query: "GET_POKEMON",
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
