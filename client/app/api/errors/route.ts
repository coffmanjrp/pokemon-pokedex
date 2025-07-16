import { NextRequest, NextResponse } from "next/server";

interface ErrorReport {
  id: string;
  timestamp: string;
  code: string;
  severity: string;
  message: string;
  name: string;
  url: string;
  userAgent: string;
  context?: Record<string, unknown>;
  additionalContext?: Record<string, unknown>;
  stack?: string;
}

export async function POST(request: NextRequest) {
  try {
    const error = (await request.json()) as ErrorReport;

    if (!error || !error.code || !error.message) {
      return NextResponse.json(
        { error: "Invalid error report" },
        { status: 400 },
      );
    }

    // In production, this would send to a monitoring service
    if (process.env.NODE_ENV === "development") {
      console.log("[Error API] Received error:", {
        code: error.code,
        severity: error.severity,
        message: error.message,
        url: error.url,
      });

      if (error.stack) {
        console.log("Stack trace:", error.stack);
      }
    }

    // Log critical and high severity errors with more detail
    if (error.severity === "critical" || error.severity === "high") {
      console.error(
        `[${error.severity.toUpperCase()}] ${error.code}: ${error.message}`,
      );
      console.error("URL:", error.url);
      console.error("User Agent:", error.userAgent);

      if (error.context) {
        console.error("Context:", error.context);
      }

      if (error.additionalContext) {
        console.error("Additional Context:", error.additionalContext);
      }
    }

    // TODO: In production, integrate with error monitoring service
    // Example integration points:
    // - Sentry: Sentry.captureException()
    // - DataDog: datadogLogs.logger.error()
    // - CloudWatch: cloudWatchClient.putLogEvents()
    // - Custom database logging

    return NextResponse.json({ success: true, id: error.id }, { status: 200 });
  } catch (error) {
    console.error("[Error API] Failed to process error report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
