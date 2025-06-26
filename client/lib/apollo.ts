import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// Dynamic GraphQL URL based on server mode
const getGraphQLURL = () => {
  const serverMode = process.env.NEXT_PUBLIC_SERVER_MODE || "development";

  if (serverMode === "production") {
    return (
      process.env.NEXT_PUBLIC_GRAPHQL_URL_PROD ||
      "https://pokemon-pokedex-production.up.railway.app/graphql"
    );
  } else {
    return (
      process.env.NEXT_PUBLIC_GRAPHQL_URL_DEV || "http://localhost:4000/graphql"
    );
  }
};

const httpLink = createHttpLink({
  uri: getGraphQLURL(),
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    addTypename: false, // Disable __typename to prevent cache issues
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      fetchPolicy: "cache-first",
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-first",
    },
  },
});

// Server-side client for SSG/SSR
export function getClient() {
  return new ApolloClient({
    link: createHttpLink({
      uri: getGraphQLURL(),
    }),
    cache: new InMemoryCache({
      addTypename: false, // Disable __typename for SSR consistency
    }),
    ssrMode: typeof window === "undefined",
  });
}
