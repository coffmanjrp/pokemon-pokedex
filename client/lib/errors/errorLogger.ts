/**
 * Error Logging System
 * Handles persistent error logging and reporting
 */

import { AppError } from "./customErrors";
import { ErrorReport } from "./errorHandler";

export interface ErrorLogEntry {
  id: string;
  timestamp: Date;
  error: AppError;
  url: string;
  userAgent: string;
  context: Record<string, unknown> | undefined;
  reported: boolean;
}

export interface ErrorLogStorage {
  entries: ErrorLogEntry[];
  lastCleanup: Date;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private readonly STORAGE_KEY = "pokemon-pokedex-error-logs";
  private readonly MAX_ENTRIES = 100;
  private readonly RETENTION_DAYS = 7;
  private readonly BATCH_SIZE = 10;

  private constructor() {
    // Cleanup old logs on initialization
    this.cleanupOldLogs();
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Log an error to persistent storage
   */
  async logError(report: ErrorReport): Promise<void> {
    if (typeof window === "undefined") return;

    const entry: ErrorLogEntry = {
      id: this.generateId(),
      timestamp: report.timestamp,
      error: report.error,
      url: report.url,
      userAgent: report.userAgent,
      context: report.additionalContext,
      reported: false,
    };

    const storage = this.getStorage();
    storage.entries.push(entry);

    // Maintain size limit
    if (storage.entries.length > this.MAX_ENTRIES) {
      storage.entries = storage.entries.slice(-this.MAX_ENTRIES);
    }

    this.saveStorage(storage);

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.debug("[ErrorLogger] Logged error:", entry);
    }
  }

  /**
   * Get all error logs
   */
  getErrorLogs(): ErrorLogEntry[] {
    const storage = this.getStorage();
    return storage.entries;
  }

  /**
   * Get unreported error logs
   */
  getUnreportedErrors(): ErrorLogEntry[] {
    const storage = this.getStorage();
    return storage.entries.filter((entry) => !entry.reported);
  }

  /**
   * Mark errors as reported
   */
  markAsReported(ids: string[]): void {
    const storage = this.getStorage();

    storage.entries = storage.entries.map((entry) => {
      if (ids.includes(entry.id)) {
        return { ...entry, reported: true };
      }
      return entry;
    });

    this.saveStorage(storage);
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byCode: Record<string, number>;
    bySeverity: Record<string, number>;
    last24Hours: number;
    last7Days: number;
  } {
    const storage = this.getStorage();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats = {
      total: storage.entries.length,
      byCode: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      last24Hours: 0,
      last7Days: 0,
    };

    storage.entries.forEach((entry) => {
      // Count by error code
      stats.byCode[entry.error.code] =
        (stats.byCode[entry.error.code] || 0) + 1;

      // Count by severity
      stats.bySeverity[entry.error.severity] =
        (stats.bySeverity[entry.error.severity] || 0) + 1;

      // Count recent errors
      const entryDate = new Date(entry.timestamp);
      if (entryDate > oneDayAgo) {
        stats.last24Hours++;
      }
      if (entryDate > sevenDaysAgo) {
        stats.last7Days++;
      }
    });

    return stats;
  }

  /**
   * Export error logs as JSON
   */
  exportLogs(): string {
    const storage = this.getStorage();
    return JSON.stringify(storage.entries, null, 2);
  }

  /**
   * Clear all error logs
   */
  clearLogs(): void {
    const storage: ErrorLogStorage = {
      entries: [],
      lastCleanup: new Date(),
    };
    this.saveStorage(storage);
  }

  /**
   * Send error logs to server (batch)
   */
  async reportErrorBatch(): Promise<void> {
    const unreported = this.getUnreportedErrors();
    if (unreported.length === 0) return;

    // Process in batches
    for (let i = 0; i < unreported.length; i += this.BATCH_SIZE) {
      const batch = unreported.slice(i, i + this.BATCH_SIZE);

      try {
        // TODO: Implement actual API call
        // await fetch('/api/errors/batch', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ errors: batch }),
        // });

        // Mark as reported
        const ids = batch.map((entry) => entry.id);
        this.markAsReported(ids);

        if (process.env.NODE_ENV === "development") {
          console.debug(`[ErrorLogger] Reported ${batch.length} errors`);
        }
      } catch (err) {
        console.error("[ErrorLogger] Failed to report error batch:", err);
        // Continue with next batch
      }
    }
  }

  /**
   * Get storage from localStorage
   */
  private getStorage(): ErrorLogStorage {
    if (typeof window === "undefined") {
      return { entries: [], lastCleanup: new Date() };
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.entries = parsed.entries.map((entry: ErrorLogEntry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
          error: {
            ...entry.error,
            timestamp: new Date(entry.error.timestamp),
          },
        }));
        parsed.lastCleanup = new Date(parsed.lastCleanup);
        return parsed;
      }
    } catch (err) {
      console.error("[ErrorLogger] Failed to parse stored logs:", err);
    }

    return { entries: [], lastCleanup: new Date() };
  }

  /**
   * Save storage to localStorage
   */
  private saveStorage(storage: ErrorLogStorage): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
    } catch (err) {
      console.error("[ErrorLogger] Failed to save logs:", err);
      // If storage is full, remove oldest entries
      if (err instanceof DOMException && err.name === "QuotaExceededError") {
        storage.entries = storage.entries.slice(-50);
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
        } catch {
          // Give up
        }
      }
    }
  }

  /**
   * Generate unique ID for log entry
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clean up old logs
   */
  private cleanupOldLogs(): void {
    const storage = this.getStorage();
    const now = new Date();
    const retentionDate = new Date(
      now.getTime() - this.RETENTION_DAYS * 24 * 60 * 60 * 1000,
    );

    // Only cleanup once per day
    if (
      storage.lastCleanup &&
      new Date(storage.lastCleanup).toDateString() === now.toDateString()
    ) {
      return;
    }

    // Remove old entries
    const beforeCount = storage.entries.length;
    storage.entries = storage.entries.filter(
      (entry) => new Date(entry.timestamp) > retentionDate,
    );

    const removed = beforeCount - storage.entries.length;
    if (removed > 0) {
      console.debug(`[ErrorLogger] Cleaned up ${removed} old log entries`);
    }

    storage.lastCleanup = now;
    this.saveStorage(storage);
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance();

// Export convenience functions
export const logError = (report: ErrorReport) => errorLogger.logError(report);
export const getErrorLogs = () => errorLogger.getErrorLogs();
export const getErrorStats = () => errorLogger.getErrorStats();
export const clearErrorLogs = () => errorLogger.clearLogs();
export const exportErrorLogs = () => errorLogger.exportLogs();
