/**
 * Error Handling Examples and Usage Guide
 * Shows how to use the new error handling system
 */

import {
  AppError,
  APIError,
  ValidationError,
  NetworkError,
  CacheError,
} from "./customErrors";
import {
  handleError,
  getUserMessage,
  getRecoverySuggestions,
  errorHandler,
} from "./errorHandler";
import { Dictionary } from "@/lib/dictionaries";

/**
 * Example 1: Handling API errors
 */
export async function fetchPokemonExample(id: string) {
  try {
    const response = await fetch(`/api/pokemon/${id}`);

    if (!response.ok) {
      throw new APIError(
        `Failed to fetch Pokemon ${id}`,
        response.status,
        `/api/pokemon/${id}`,
        "GET",
      );
    }

    return await response.json();
  } catch (error) {
    // Handle and normalize the error
    const appError = handleError(error, {
      pokemonId: id,
      operation: "fetchPokemon",
    });

    // Re-throw for component to handle
    throw appError;
  }
}

/**
 * Example 2: Handling validation errors
 */
export function validatePokemonId(id: string | number) {
  const numId = typeof id === "string" ? parseInt(id) : id;

  if (isNaN(numId)) {
    throw ValidationError.invalidPokemonId(id);
  }

  // Standard Pokemon IDs (1-1025)
  if (numId >= 1 && numId <= 1025) {
    return numId;
  }

  // Form Pokemon IDs (10000+)
  if (numId >= 10000 && numId <= 20000) {
    return numId;
  }

  throw ValidationError.invalidPokemonId(id);
}

/**
 * Example 3: Handling cache errors
 */
export async function getCachedPokemon(id: string) {
  try {
    const cached = localStorage.getItem(`pokemon-${id}`);

    if (!cached) {
      return null;
    }

    return JSON.parse(cached);
  } catch (error) {
    // Handle cache parse error
    const cacheError = new CacheError(
      "Failed to parse cached Pokemon data",
      "read",
      `pokemon-${id}`,
      { originalError: error },
    );

    handleError(cacheError);

    // Clear corrupted cache
    try {
      localStorage.removeItem(`pokemon-${id}`);
    } catch {
      // Ignore cleanup errors
    }

    return null;
  }
}

/**
 * Example 4: Component error handling with user feedback
 * This is a conceptual example - implement in a React component file
 */
export function getErrorDisplay(
  error: AppError,
  dictionary: Dictionary,
): { message: string; suggestions: string[] } {
  const userMessage = getUserMessage(error, dictionary);
  const suggestions = getRecoverySuggestions(error, dictionary);

  return {
    message: userMessage,
    suggestions: suggestions,
  };
}

/**
 * Example 5: GraphQL error handling
 */
export function handleGraphQLError(error: {
  message?: string;
  graphQLErrors?: unknown;
  networkError?: { statusCode?: number } | null;
  operation?: {
    operationName?: string;
    query?: { loc?: { source?: { body?: string } } };
    variables?: unknown;
  };
}) {
  // Convert GraphQL error to APIError
  const apiError = APIError.fromGraphQLError(error);

  // Handle the error
  return handleError(apiError, {
    query: error.operation?.query?.loc?.source?.body,
    variables: error.operation?.variables,
  });
}

/**
 * Example 6: Network error with retry
 */
export async function fetchWithRetry<T>(
  url: string,
  options?: RequestInit,
  maxRetries: number = 3,
): Promise<T> {
  let lastError: AppError | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new APIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          url,
          options?.method || "GET",
        );
      }

      return await response.json();
    } catch (error) {
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes("fetch")) {
        lastError = new NetworkError("Network request failed", url, false, {
          attempt,
          maxRetries,
        });
      } else {
        lastError = handleError(error, { attempt, maxRetries });
      }

      // Check if we should retry
      if (attempt < maxRetries && errorHandler.shouldRetry(lastError)) {
        const delay = errorHandler.getRetryDelay(attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      break;
    }
  }

  throw lastError;
}

/**
 * Example 7: Error boundary usage pattern
 * This shows the pattern for implementing error boundaries in React components
 */
export const errorBoundaryPattern = `
// In a React component file:
import React from 'react';
import { AppError, handleError } from '@/lib/errors';
import { getUserMessage } from '@/lib/errors/errorHandler';
import { Dictionary } from '@/lib/dictionaries';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  dictionary: Dictionary;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const appError = handleError(error, { component: 'ErrorBoundary' });
    return { hasError: true, error: appError };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    handleError(error, {
      component: 'ErrorBoundary',
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const userMessage = getUserMessage(this.state.error, this.props.dictionary);
      
      return (
        <div className="error-boundary-fallback">
          <h2>{userMessage}</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            {this.props.dictionary.ui.error.tryAgain}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
`;
