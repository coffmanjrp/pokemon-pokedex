"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import { store } from "@/store";
import { apolloClient } from "@/lib/apollo";
import { LanguageInitializer } from "./LanguageInitializer";
import { PerformanceMonitor } from "./PerformanceMonitor";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <LanguageInitializer />
        <PerformanceMonitor />
        {children}
      </ApolloProvider>
    </Provider>
  );
}
