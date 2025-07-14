import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { ApolloLink } from "@apollo/client/link/core";

// Dynamic GraphQL URL based on server mode
const getGraphQLURL = () => {
  const serverMode = process.env.NEXT_PUBLIC_SERVER_MODE || "development";

  // Debug logging for build-time environment
  if (typeof window === "undefined") {
    console.log("[Apollo] Build-time environment:");
    console.log(`  - SERVER_MODE: ${serverMode}`);
    console.log(
      `  - GRAPHQL_URL_PROD: ${process.env.NEXT_PUBLIC_GRAPHQL_URL_PROD}`,
    );
    console.log(
      `  - GRAPHQL_URL_DEV: ${process.env.NEXT_PUBLIC_GRAPHQL_URL_DEV}`,
    );
  }

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

// Retry link for handling transient network errors
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => {
      // Retry on network errors and 5xx status codes
      return (
        !!error &&
        (error.networkError?.statusCode >= 500 ||
          error.networkError?.code === "ECONNRESET" ||
          error.networkError?.code === "ETIMEDOUT")
      );
    },
  },
});

const httpLink = createHttpLink({
  uri: getGraphQLURL(),
  // Add timeout for build-time requests
  fetchOptions: {
    timeout: 30000, // 30 seconds timeout
  },
});

// Combine retry and http links
const link = ApolloLink.from([retryLink, httpLink]);

export const apolloClient = new ApolloClient({
  link,
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

// Singleton instance for SSR client to share cache during build
let ssrClient: ApolloClient<object> | null = null;

// Server-side client for SSG/SSR
export function getClient() {
  // Return existing client if available (for cache sharing during build)
  if (ssrClient) {
    return ssrClient;
  }

  const graphQLURL = getGraphQLURL();

  console.log(`[Apollo SSR] Creating client with URL: ${graphQLURL}`);

  // Create retry link for SSR with enhanced settings
  const ssrRetryLink = new RetryLink({
    delay: {
      initial: 1000, // Increased from 500ms
      max: 10000, // Increased from 5000ms
      jitter: true,
    },
    attempts: {
      max: 7, // Increased from 5 for better reliability
      retryIf: (error) => {
        // Log errors during build
        if (error) {
          console.error("[Apollo SSR] GraphQL Error:", {
            message: error.message,
            networkError: error.networkError,
            graphQLErrors: error.graphQLErrors,
          });
        }

        // Retry on network errors including Railway-specific errors
        const statusCode = error.networkError?.statusCode;
        return (
          !!error &&
          (statusCode === 502 || // Bad Gateway
            statusCode === 503 || // Service Unavailable
            statusCode === 504 || // Gateway Timeout
            statusCode >= 500 || // Any 5xx error
            error.networkError?.code === "ECONNRESET" ||
            error.networkError?.code === "ETIMEDOUT" ||
            error.networkError?.code === "ENOTFOUND")
        );
      },
    },
  });

  const ssrHttpLink = createHttpLink({
    uri: graphQLURL,
    fetchOptions: {
      timeout: 90000, // 90 seconds timeout for build (increased from 60s)
    },
  });

  const ssrLink = ApolloLink.from([ssrRetryLink, ssrHttpLink]);

  ssrClient = new ApolloClient({
    link: ssrLink,
    cache: new InMemoryCache({
      addTypename: false, // Disable __typename for SSR consistency
      typePolicies: {
        Pokemon: {
          keyFields: ["id"], // Use Pokemon ID as cache key
        },
      },
    }),
    ssrMode: typeof window === "undefined",
    defaultOptions: {
      query: {
        errorPolicy: "all", // Continue even with errors
        fetchPolicy: "cache-first", // Use cache-first for build performance
      },
    },
  });

  return ssrClient;
}
