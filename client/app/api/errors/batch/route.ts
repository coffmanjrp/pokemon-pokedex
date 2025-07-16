import { NextRequest, NextResponse } from "next/server";

interface ErrorEntry {
  id: string;
  timestamp: string;
  code: string;
  severity: string;
  message: string;
  url: string;
  userAgent: string;
  context?: Record<string, unknown>;
  stack?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { errors } = body as { errors: ErrorEntry[] };

    if (!errors || !Array.isArray(errors)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // In production, this would send to a monitoring service like Sentry
    // For now, log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Error Batch API] Received errors:", errors.length);
      errors.forEach((error) => {
        console.log(
          `[Error ${error.severity}] ${error.code}: ${error.message}`,
        );
        if (error.stack) {
          console.log("Stack:", error.stack);
        }
      });
    }

    // TODO: In production, integrate with error monitoring service
    // Example integration points:
    // - Sentry: Sentry.captureException()
    // - DataDog: datadogLogs.logger.error()
    // - CloudWatch: cloudWatchClient.putLogEvents()
    // - Custom database logging

    return NextResponse.json(
      { success: true, processed: errors.length },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Error Batch API] Failed to process error batch:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
