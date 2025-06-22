import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    addTypename: false, // Disable __typename to prevent cache issues
    dataIdFromObject: () => null, // Disable normalization completely
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache', // Disable cache until issues are resolved
    },
    query: {
      errorPolicy: 'ignore', 
      fetchPolicy: 'no-cache', // Disable cache until issues are resolved
    },
  },
});

// Server-side client for SSG/SSR
export function getClient() {
  return new ApolloClient({
    link: createHttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
    }),
    cache: new InMemoryCache({
      addTypename: false, // Disable __typename for SSR consistency
      dataIdFromObject: () => null, // Disable normalization
    }),
    ssrMode: typeof window === 'undefined',
  });
}