/**
 * Production Logging System
 * Provides structured logging for production deployment
 */

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
  stack?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
}

export class ProductionLogger {
  private static instance: ProductionLogger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private isProduction: boolean = process.env.NODE_ENV === "production";

  private constructor() {}

  static getInstance(): ProductionLogger {
    if (!ProductionLogger.instance) {
      ProductionLogger.instance = new ProductionLogger();
    }
    return ProductionLogger.instance;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    const logEntry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      context,
      error,
      stack: error?.stack,
    };

    this.logs.push(logEntry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // In development, log to console
    if (!this.isProduction) {
      console.log(`[${level.toUpperCase()}] ${message}`, context || "", error || "");
    }

    // In production, send to external logging service
    if (this.isProduction) {
      this.sendToExternalLogging(logEntry);
    }
  }

  private sendToExternalLogging(logEntry: LogEntry): void {
    // Placeholder for external logging service integration
    // In production, this would send to services like:
    // - Datadog
    // - Sentry
    // - LogRocket
    // - New Relic
    // - CloudWatch
    // - etc.
    
    if (logEntry.level === LogLevel.ERROR || logEntry.level === LogLevel.FATAL) {
      // Send critical errors to error tracking service
      // Example: Sentry.captureException(logEntry.error);
    }
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  clearLogs(): void {
    this.logs = [];
  }

  getLogCount(): number {
    return this.logs.length;
  }

  getErrorCount(): number {
    return this.logs.filter(log => log.level === LogLevel.ERROR || log.level === LogLevel.FATAL).length;
  }

  getWarningCount(): number {
    return this.logs.filter(log => log.level === LogLevel.WARN).length;
  }
}

export const logger = ProductionLogger.getInstance();
