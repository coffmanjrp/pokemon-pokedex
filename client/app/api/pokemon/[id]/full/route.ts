import { NextRequest, NextResponse } from "next/server";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GET_POKEMON } from "@/graphql/queries";

// GraphQL client setup
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

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
    console.log("Sending full GraphQL query:", {
      query: GET_POKEMON.loc?.source?.body,
      variables: { id },
    });

    // Fetch data from GraphQL server using the full GET_POKEMON query
    const { data, error } = await client.query({
      query: GET_POKEMON,
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
