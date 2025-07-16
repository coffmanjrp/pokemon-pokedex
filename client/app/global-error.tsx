"use client";

import { useEffect } from "react";
import { errorHandler } from "@/lib/errors/errorHandler";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical error that broke the entire app
    errorHandler.handleError(error, {
      digest: error.digest,
      component: "GlobalErrorBoundary",
      severity: "critical",
    });
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Critical Error
            </h1>
            <p className="text-gray-600 mb-8">
              The application encountered a critical error and cannot continue.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
