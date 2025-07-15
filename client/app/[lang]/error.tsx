"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiExclamationTriangle, HiHome, HiArrowPath } from "react-icons/hi2";
import { Locale } from "@/lib/dictionaries";
import {
  errorHandler,
  getUserMessage,
  getRecoverySuggestions,
} from "@/lib/errors/errorHandler";
import { AppError, normalizeError } from "@/lib/errors/customErrors";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
  params?: { lang: Locale };
}

export default function ErrorPage({ error, reset, params }: ErrorPageProps) {
  const router = useRouter();
  const lang = params?.lang || "en";

  // Normalize and handle the error
  const appError: AppError = normalizeError(error);

  useEffect(() => {
    // Log error with additional context
    errorHandler.handleError(error, {
      digest: error.digest,
      component: "ErrorBoundary",
      lang,
    });
  }, [error, lang]);

  // Get user-friendly message (fallback without dictionary for now)
  const userMessage = getUserMessage(appError);
  const suggestions = getRecoverySuggestions(appError);

  const handleReset = () => {
    // Clear any error state and retry
    reset();
  };

  const handleGoHome = () => {
    router.push(`/${lang}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8">
        {/* Error Icon */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/20">
          <HiExclamationTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>

        {/* Error Content */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {lang === "ja" ? "エラーが発生しました" : "Something went wrong"}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {userMessage}
          </p>

          {/* Recovery Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h2 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                {lang === "ja" ? "解決方法:" : "Try these steps:"}
              </h2>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <HiArrowPath className="mr-2 h-5 w-5" />
              {lang === "ja" ? "もう一度試す" : "Try Again"}
            </button>

            <button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <HiHome className="mr-2 h-5 w-5" />
              {lang === "ja" ? "ホームに戻る" : "Go Home"}
            </button>
          </div>
        </div>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
              Error Details (Development Only)
            </summary>
            <div className="mt-2 space-y-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Type:</strong> {appError.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Code:</strong> {appError.code}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Severity:</strong> {appError.severity}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
              <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 overflow-auto">
                {error.stack}
              </pre>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
