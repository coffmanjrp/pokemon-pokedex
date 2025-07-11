import { ApolloClient, InMemoryCache } from "@apollo/client";

// Get GraphQL URL based on server mode
export function getGraphQLUrl(): string {
  const serverMode = process.env.NEXT_PUBLIC_SERVER_MODE;

  if (serverMode === "production") {
    return (
      process.env.NEXT_PUBLIC_GRAPHQL_URL_PROD ||
      "http://localhost:4000/graphql"
    );
  }

  return (
    process.env.NEXT_PUBLIC_GRAPHQL_URL_DEV || "http://localhost:4000/graphql"
  );
}

// Create Apollo Client instance
export function createApolloClient() {
  return new ApolloClient({
    uri: getGraphQLUrl(),
    cache: new InMemoryCache(),
  });
}
