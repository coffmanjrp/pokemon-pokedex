"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { LanguageInitializer } from "./LanguageInitializer";
import { PerformanceMonitor } from "./PerformanceMonitor";

interface ProvidersProps {
  children: ReactNode;
}

// Apollo Client removed as all Supabase flags are enabled
export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <LanguageInitializer />
      <PerformanceMonitor />
      {children}
    </Provider>
  );
}
