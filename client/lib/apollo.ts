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
    typePolicies: {
      Query: {
        fields: {
          // Generation-specific cache management for Pokemon lists
          pokemonsBasic: {
            keyArgs: ["limit", "offset"], // Cache by generation parameters
            merge(existing = { edges: [], pageInfo: {} }, incoming) {
              // Prevent duplicates by checking Pokemon IDs
              const existingIds = new Set(
                existing.edges.map(
                  (edge: { node: { id: string } }) => edge.node.id,
                ),
              );
              const newEdges = incoming.edges.filter(
                (edge: { node: { id: string } }) =>
                  !existingIds.has(edge.node.id),
              );

              return {
                edges: [...existing.edges, ...newEdges],
                pageInfo: incoming.pageInfo,
              };
            },
          },
          pokemons: {
            keyArgs: ["limit", "offset"], // Cache by generation parameters
            merge(existing = { edges: [], pageInfo: {} }, incoming) {
              // Prevent duplicates by checking Pokemon IDs
              const existingIds = new Set(
                existing.edges.map(
                  (edge: { node: { id: string } }) => edge.node.id,
                ),
              );
              const newEdges = incoming.edges.filter(
                (edge: { node: { id: string } }) =>
                  !existingIds.has(edge.node.id),
              );

              return {
                edges: [...existing.edges, ...newEdges],
                pageInfo: incoming.pageInfo,
              };
            },
          },
        },
      },
      Pokemon: {
        keyFields: ["id"], // Use Pokemon ID as cache key
        fields: {
          types: {
            merge: true, // Always replace types array completely
          },
          stats: {
            merge: true, // Always replace stats array completely
          },
          abilities: {
            merge: true, // Always replace abilities array completely
          },
          moves: {
            merge: true, // Always replace moves array completely
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      fetchPolicy: "cache-first", // Prioritize cache for faster generation switching
      nextFetchPolicy: "cache-first", // Maintain cache-first after initial query
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-first", // Prioritize cache for faster generation switching
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
