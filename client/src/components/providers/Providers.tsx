'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { store } from '@/store';
import { apolloClient } from '@/lib/apollo';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        {children}
      </ApolloProvider>
    </Provider>
  );
}