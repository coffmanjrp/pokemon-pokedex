/**
 * Custom Error Classes for Pokemon Pokedex Application
 * Provides standardized error handling across the application
 */

export type ErrorCode =
  | "POKEMON_NOT_FOUND"
  | "GENERATION_NOT_FOUND"
  | "INVALID_POKEMON_ID"
  | "INVALID_GENERATION"
  | "API_ERROR"
  | "NETWORK_ERROR"
  | "GRAPHQL_ERROR"
  | "CACHE_ERROR"
  | "VALIDATION_ERROR"
  | "UNKNOWN_ERROR";

export type ErrorSeverity = "low" | "medium" | "high" | "critical";

/**
 * Base error class for application-specific errors
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly severity: ErrorSeverity;
  public readonly timestamp: Date;
  public readonly context: Record<string, unknown> | undefined;

  constructor(
    message: string,
    code: ErrorCode = "UNKNOWN_ERROR",
    severity: ErrorSeverity = "medium",
    context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.severity = severity;
    this.timestamp = new Date();
    this.context = context || undefined;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * API-related errors (GraphQL, REST API, external services)
 */
export class APIError extends AppError {
  public readonly statusCode: number | undefined;
  public readonly endpoint: string | undefined;
  public readonly method: string | undefined;

  constructor(
    message: string,
    statusCode?: number,
    endpoint?: string,
    method?: string,
    context?: Record<string, unknown>,
  ) {
    const code = statusCode === 404 ? "POKEMON_NOT_FOUND" : "API_ERROR";
    const severity = statusCode && statusCode >= 500 ? "high" : "medium";

    super(message, code, severity, context);
    this.name = "APIError";
    this.statusCode = statusCode || undefined;
    this.endpoint = endpoint || undefined;
    this.method = method || undefined;
  }

  static fromGraphQLError(error: {
    message?: string;
    graphQLErrors?: unknown;
    networkError?: { statusCode?: number } | null;
    operation?: {
      operationName?: string;
      query?: unknown;
      variables?: unknown;
    };
  }): APIError {
    const message = error.message || "GraphQL request failed";
    const context = {
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError,
      operation: error.operation,
    };

    return new APIError(
      message,
      error.networkError?.statusCode,
      error.operation?.operationName,
      "GRAPHQL",
      context,
    );
  }
}

/**
 * Validation errors for user input and data integrity
 */
export class ValidationError extends AppError {
  public readonly field: string | undefined;
  public readonly value: unknown;
  public readonly constraints: string[] | undefined;

  constructor(
    message: string,
    field?: string,
    value?: unknown,
    constraints?: string[],
  ) {
    super(message, "VALIDATION_ERROR", "low", { field, value, constraints });
    this.name = "ValidationError";
    this.field = field || undefined;
    this.value = value;
    this.constraints = constraints || undefined;
  }

  static invalidPokemonId(id: string | number): ValidationError {
    return new ValidationError(`Invalid Pokemon ID: ${id}`, "pokemonId", id, [
      "Must be a number between 1 and 1025, or a valid form ID (10000+)",
    ]);
  }

  static invalidGeneration(generation: number): ValidationError {
    return new ValidationError(
      `Invalid generation: ${generation}`,
      "generation",
      generation,
      ["Must be a number between 0 and 9"],
    );
  }
}

/**
 * Cache-related errors
 */
export class CacheError extends AppError {
  public readonly operation: "read" | "write" | "delete" | "clear";
  public readonly key: string | undefined;

  constructor(
    message: string,
    operation: "read" | "write" | "delete" | "clear",
    key?: string,
    context?: Record<string, unknown>,
  ) {
    super(message, "CACHE_ERROR", "low", { ...context, operation, key });
    this.name = "CacheError";
    this.operation = operation;
    this.key = key || undefined;
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends AppError {
  public readonly url: string | undefined;
  public readonly timeout: boolean;

  constructor(
    message: string,
    url?: string,
    timeout: boolean = false,
    context?: Record<string, unknown>,
  ) {
    super(message, "NETWORK_ERROR", "high", { ...context, url, timeout });
    this.name = "NetworkError";
    this.url = url || undefined;
    this.timeout = timeout;
  }
}

/**
 * Type guards for error checking
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export const isAPIError = (error: unknown): error is APIError => {
  return error instanceof APIError;
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
};

export const isCacheError = (error: unknown): error is CacheError => {
  return error instanceof CacheError;
};

export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError;
};

/**
 * Convert unknown errors to AppError
 */
export const normalizeError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes("Network")) {
      return new NetworkError(error.message);
    }

    if (error.message.includes("fetch")) {
      return new APIError(error.message);
    }

    return new AppError(error.message);
  }

  if (typeof error === "string") {
    return new AppError(error);
  }

  return new AppError("An unknown error occurred");
};
