/**
 * Centralized Error Handling Service
 * Manages error logging, reporting, and user notification
 */

import {
  AppError,
  APIError,
  ValidationError,
  NetworkError,
  normalizeError,
  ErrorCode,
  ErrorSeverity,
} from "./customErrors";
import { Dictionary } from "@/lib/dictionaries";
import { errorLogger } from "./errorLogger";

export interface ErrorHandlerOptions {
  logToConsole?: boolean;
  logToServer?: boolean;
  showUserNotification?: boolean;
  dictionary?: Dictionary;
}

export interface ErrorReport {
  error: AppError;
  url: string;
  userAgent: string;
  timestamp: Date;
  additionalContext: Record<string, unknown> | undefined;
}

class ErrorHandlerService {
  private static instance: ErrorHandlerService;
  private errorQueue: ErrorReport[] = [];
  private readonly maxQueueSize = 50;
  private options: ErrorHandlerOptions = {
    logToConsole: true,
    logToServer: false,
    showUserNotification: true,
  };

  private constructor() {}

  static getInstance(): ErrorHandlerService {
    if (!ErrorHandlerService.instance) {
      ErrorHandlerService.instance = new ErrorHandlerService();
    }
    return ErrorHandlerService.instance;
  }

  /**
   * Configure error handler options
   */
  configure(options: ErrorHandlerOptions): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Main error handling method
   */
  handleError(error: unknown, context?: Record<string, unknown>): AppError {
    const normalizedError = normalizeError(error);

    // Create error report
    const report: ErrorReport = {
      error: normalizedError,
      url: typeof window !== "undefined" ? window.location.href : "server",
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "server",
      timestamp: new Date(),
      additionalContext: context,
    };

    // Add to queue
    this.addToQueue(report);

    // Log based on severity
    this.logError(normalizedError, report);

    // Log to persistent storage
    errorLogger.logError(report);

    // Send to server if critical
    if (
      normalizedError.severity === "critical" ||
      normalizedError.severity === "high"
    ) {
      this.reportToServer(report);
    }

    return normalizedError;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error: AppError, dictionary?: Dictionary): string {
    if (!dictionary) {
      return this.getFallbackMessage(error);
    }

    // Map error codes to dictionary keys
    const errorMessages: Record<ErrorCode, string> = {
      POKEMON_NOT_FOUND:
        dictionary.errors?.pokemonNotFound || "Pokemon not found",
      GENERATION_NOT_FOUND:
        dictionary.errors?.generationNotFound || "Generation not found",
      INVALID_POKEMON_ID:
        dictionary.errors?.invalidPokemonId || "Invalid Pokemon ID",
      INVALID_GENERATION:
        dictionary.errors?.invalidGeneration || "Invalid generation",
      API_ERROR: dictionary.errors?.apiError || "Failed to fetch data",
      NETWORK_ERROR:
        dictionary.errors?.networkError || "Network connection error",
      GRAPHQL_ERROR: dictionary.errors?.graphqlError || "Data query failed",
      CACHE_ERROR: dictionary.errors?.cacheError || "Cache operation failed",
      VALIDATION_ERROR: dictionary.errors?.validationError || "Invalid input",
      UNKNOWN_ERROR:
        dictionary.errors?.unknownError || "An unexpected error occurred",
    };

    return errorMessages[error.code] || this.getFallbackMessage(error);
  }

  /**
   * Get fallback error message when dictionary is not available
   */
  private getFallbackMessage(error: AppError): string {
    const fallbackMessages: Record<ErrorCode, string> = {
      POKEMON_NOT_FOUND: "The requested Pokemon could not be found.",
      GENERATION_NOT_FOUND: "The requested generation does not exist.",
      INVALID_POKEMON_ID: "Please provide a valid Pokemon ID.",
      INVALID_GENERATION: "Please select a valid generation (1-9).",
      API_ERROR: "Unable to fetch data. Please try again later.",
      NETWORK_ERROR: "Please check your internet connection.",
      GRAPHQL_ERROR: "Failed to load Pokemon data.",
      CACHE_ERROR: "Failed to access cached data.",
      VALIDATION_ERROR: "Please check your input and try again.",
      UNKNOWN_ERROR: "Something went wrong. Please try again.",
    };

    return fallbackMessages[error.code];
  }

  /**
   * Get recovery suggestions based on error type
   */
  getRecoverySuggestions(error: AppError, dictionary?: Dictionary): string[] {
    const suggestions: string[] = [];

    switch (error.code) {
      case "NETWORK_ERROR":
        suggestions.push(
          dictionary?.errors?.suggestions?.checkInternet ||
            "Check your internet connection",
          dictionary?.errors?.suggestions?.refreshPage || "Refresh the page",
        );
        break;

      case "POKEMON_NOT_FOUND":
      case "INVALID_POKEMON_ID":
        suggestions.push(
          dictionary?.errors?.suggestions?.checkPokemonId ||
            "Check the Pokemon ID",
          dictionary?.errors?.suggestions?.browsePokedex ||
            "Browse the Pokedex",
        );
        break;

      case "API_ERROR":
      case "GRAPHQL_ERROR":
        suggestions.push(
          dictionary?.errors?.suggestions?.tryAgainLater ||
            "Try again in a few moments",
          dictionary?.errors?.suggestions?.contactSupport ||
            "Contact support if the problem persists",
        );
        break;

      case "CACHE_ERROR":
        suggestions.push(
          dictionary?.errors?.suggestions?.clearCache ||
            "Clear your browser cache",
          dictionary?.errors?.suggestions?.refreshPage || "Refresh the page",
        );
        break;

      default:
        suggestions.push(
          dictionary?.errors?.suggestions?.refreshPage || "Refresh the page",
          dictionary?.errors?.suggestions?.goHome || "Return to home page",
        );
    }

    return suggestions;
  }

  /**
   * Log error based on severity
   */
  private logError(error: AppError, report: ErrorReport): void {
    if (!this.options.logToConsole) return;

    const logMethod = this.getLogMethod(error.severity);

    console.group(`🚨 ${error.name} [${error.severity.toUpperCase()}]`);
    logMethod("Message:", error.message);
    logMethod("Code:", error.code);
    logMethod("Timestamp:", error.timestamp);

    if (error.context) {
      logMethod("Context:", error.context);
    }

    if (report.additionalContext) {
      logMethod("Additional Context:", report.additionalContext);
    }

    if (error.stack) {
      console.trace(error.stack);
    }

    console.groupEnd();
  }

  /**
   * Get appropriate console method based on severity
   */
  private getLogMethod(severity: ErrorSeverity): typeof console.log {
    switch (severity) {
      case "critical":
      case "high":
        return console.error;
      case "medium":
        return console.warn;
      case "low":
        return console.log;
      default:
        return console.log;
    }
  }

  /**
   * Add error to queue with size limit
   */
  private addToQueue(report: ErrorReport): void {
    this.errorQueue.push(report);

    // Maintain queue size limit
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }
  }

  /**
   * Report error to server (implement based on your logging service)
   */
  private async reportToServer(report: ErrorReport): Promise<void> {
    if (!this.options.logToServer) return;

    try {
      // TODO: Implement server logging
      // Example: Send to logging service like Sentry, LogRocket, etc.
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(report),
      // });

      // For now, just log that we would report this error
      console.debug(
        "[ErrorHandler] Would report error to server:",
        report.error.code,
      );
    } catch (err) {
      console.error("Failed to report error to server:", err);
    }
  }

  /**
   * Get error history
   */
  getErrorHistory(): ErrorReport[] {
    return [...this.errorQueue];
  }

  /**
   * Clear error history
   */
  clearErrorHistory(): void {
    this.errorQueue = [];
  }

  /**
   * Check if should retry based on error type
   */
  shouldRetry(error: AppError): boolean {
    // Retry on network and temporary API errors
    if (
      error instanceof NetworkError ||
      (error instanceof APIError && error.statusCode && error.statusCode >= 500)
    ) {
      return true;
    }

    // Don't retry on validation or not found errors
    if (
      error instanceof ValidationError ||
      error.code === "POKEMON_NOT_FOUND" ||
      error.code === "GENERATION_NOT_FOUND"
    ) {
      return false;
    }

    return false;
  }

  /**
   * Get retry delay based on attempt number
   */
  getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s...
    return Math.min(1000 * Math.pow(2, attempt - 1), 30000);
  }
}

// Export singleton instance
export const errorHandler = ErrorHandlerService.getInstance();

// Export convenience functions
export const handleError = (
  error: unknown,
  context?: Record<string, unknown>,
) => errorHandler.handleError(error, context);

export const getUserMessage = (error: AppError, dictionary?: Dictionary) =>
  errorHandler.getUserMessage(error, dictionary);

export const getRecoverySuggestions = (
  error: AppError,
  dictionary?: Dictionary,
) => errorHandler.getRecoverySuggestions(error, dictionary);
