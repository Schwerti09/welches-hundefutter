import { NormalizedOffer } from "../types";

export interface FailedRow {
  rowNumber: number;
  rawData: Record<string, unknown>;
  error: string;
  stage: string;
  timestamp: number;
  recoverable: boolean;
}

export interface RecoveryAttempt {
  attemptId: string;
  rowNumber: number;
  stage: string;
  success: boolean;
  error?: string;
  timestamp: number;
}

export interface PartialIngestionResult {
  totalRows: number;
  successfullyProcessed: number;
  failedRows: FailedRow[];
  partialSuccess: boolean;
  rawDataPreserved: boolean;
  recoveryAttempts: RecoveryAttempt[];
}

export class SafeFailureRecovery {
  private failedRows: Map<number, FailedRow> = new Map();
  private recoveryAttempts: Map<string, RecoveryAttempt> = new Map();
  private rawDataBackup: Map<number, Record<string, unknown>> = new Map();
  private partialIngestionEnabled: boolean = true;

  enablePartialIngestion(): void {
    this.partialIngestionEnabled = true;
  }

  disablePartialIngestion(): void {
    this.partialIngestionEnabled = false;
  }

  isolateBrokenRow(rowNumber: number, rawData: Record<string, unknown>, error: string, stage: string): void {
    const failedRow: FailedRow = {
      rowNumber,
      rawData,
      error,
      stage,
      timestamp: Date.now(),
      recoverable: this.isRecoverable(error, stage),
    };

    this.failedRows.set(rowNumber, failedRow);
    this.rawDataBackup.set(rowNumber, rawData);
  }

  preserveRawData(rowNumber: number, rawData: Record<string, unknown>): void {
    this.rawDataBackup.set(rowNumber, rawData);
  }

  retryRecoverableStage(rowNumber: number, stage: string, retryFunction: () => void): boolean {
    const failedRow = this.failedRows.get(rowNumber);
    if (!failedRow || !failedRow.recoverable) {
      return false;
    }

    const attemptId = `attempt-${rowNumber}-${stage}-${Date.now()}`;
    try {
      retryFunction();
      const attempt: RecoveryAttempt = {
        attemptId,
        rowNumber,
        stage,
        success: true,
        timestamp: Date.now(),
      };
      this.recoveryAttempts.set(attemptId, attempt);
      return true;
    } catch (error) {
      const attempt: RecoveryAttempt = {
        attemptId,
        rowNumber,
        stage,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: Date.now(),
      };
      this.recoveryAttempts.set(attemptId, attempt);
      return false;
    }
  }

  continuePartialIngestion(normalizedOffers: NormalizedOffer[]): PartialIngestionResult {
    if (!this.partialIngestionEnabled) {
      throw new Error("Partial ingestion is disabled");
    }

    const totalRows = this.rawDataBackup.size;
    const successfullyProcessed = normalizedOffers.length;
    const failedRows = Array.from(this.failedRows.values());
    const recoveryAttempts = Array.from(this.recoveryAttempts.values());

    return {
      totalRows,
      successfullyProcessed,
      failedRows,
      partialSuccess: successfullyProcessed > 0,
      rawDataPreserved: this.rawDataBackup.size === totalRows,
      recoveryAttempts,
    };
  }

  isRecoverable(error: string, stage: string): boolean {
    const nonRecoverableErrors = [
      "malformed ZIP",
      "encoding failure",
      "file not found",
      "permission denied",
    ];

    for (const nonRecoverableError of nonRecoverableErrors) {
      if (error.toLowerCase().includes(nonRecoverableError)) {
        return false;
      }
    }

    return true;
  }

  getFailedRow(rowNumber: number): FailedRow | undefined {
    return this.failedRows.get(rowNumber);
  }

  getAllFailedRows(): FailedRow[] {
    return Array.from(this.failedRows.values());
  }

  getRecoverableFailedRows(): FailedRow[] {
    return this.getAllFailedRows().filter(row => row.recoverable);
  }

  getRecoveryAttempt(attemptId: string): RecoveryAttempt | undefined {
    return this.recoveryAttempts.get(attemptId);
  }

  getAllRecoveryAttempts(): RecoveryAttempt[] {
    return Array.from(this.recoveryAttempts.values());
  }

  getRawDataBackup(rowNumber: number): Record<string, unknown> | undefined {
    return this.rawDataBackup.get(rowNumber);
  }

  getAllRawDataBackup(): Map<number, Record<string, unknown>> {
    return this.rawDataBackup;
  }

  clearFailedRows(): void {
    this.failedRows.clear();
  }

  clearRecoveryAttempts(): void {
    this.recoveryAttempts.clear();
  }

  clearRawDataBackup(): void {
    this.rawDataBackup.clear();
  }

  generateFailureReport(): {
    totalFailedRows: number;
    recoverableFailedRows: number;
    totalRecoveryAttempts: number;
    successfulRecoveries: number;
    failedRecoveries: number;
    rawDataPreserved: boolean;
  } {
    const failedRows = this.getAllFailedRows();
    const recoverableFailedRows = this.getRecoverableFailedRows();
    const recoveryAttempts = this.getAllRecoveryAttempts();
    const successfulRecoveries = recoveryAttempts.filter(a => a.success).length;
    const failedRecoveries = recoveryAttempts.filter(a => !a.success).length;

    return {
      totalFailedRows: failedRows.length,
      recoverableFailedRows: recoverableFailedRows.length,
      totalRecoveryAttempts: recoveryAttempts.length,
      successfulRecoveries,
      failedRecoveries,
      rawDataPreserved: this.rawDataBackup.size === failedRows.length,
    };
  }
}
