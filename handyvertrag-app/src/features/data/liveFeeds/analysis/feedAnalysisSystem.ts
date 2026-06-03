export interface FeedFieldAnalysis {
  fieldName: string;
  fieldType: "string" | "number" | "boolean" | "date" | "url" | "unknown";
  confidence: number;
  sampleValues: string[];
  nullCount: number;
  uniqueCount: number;
}

export interface FeedSchemaAnalysis {
  feedId: string;
  totalRows: number;
  columns: string[];
  fieldAnalysis: Map<string, FeedFieldAnalysis>;
  detectedFields: {
    pricingFields: string[];
    providerFields: string[];
    deviceFields: string[];
    affiliateLinkFields: string[];
    cashbackFields: string[];
    contractDurationFields: string[];
    dataVolumeFields: string[];
  };
  generatedAt: number;
}

export class FeedAnalysisSystem {
  private analysisCache: Map<string, FeedSchemaAnalysis> = new Map();

  analyzeFeed(feedId: string, rows: Record<string, unknown>[]): FeedSchemaAnalysis {
    if (rows.length === 0) {
      throw new Error("Feed has no rows to analyze");
    }

    const columns = this.detectColumns(rows);
    const fieldAnalysis = new Map<string, FeedFieldAnalysis>();

    for (const column of columns) {
      fieldAnalysis.set(column, this.analyzeField(column, rows));
    }

    const detectedFields = this.detectSpecialFields(fieldAnalysis);

    const analysis: FeedSchemaAnalysis = {
      feedId,
      totalRows: rows.length,
      columns,
      fieldAnalysis,
      detectedFields,
      generatedAt: Date.now(),
    };

    this.analysisCache.set(feedId, analysis);
    return analysis;
  }

  private detectColumns(rows: Record<string, unknown>[]): string[] {
    const columnSet = new Set<string>();

    for (const row of rows) {
      for (const key of Object.keys(row)) {
        columnSet.add(key);
      }
    }

    return Array.from(columnSet);
  }

  private analyzeField(fieldName: string, rows: Record<string, unknown>[]): FeedFieldAnalysis {
    const values: string[] = [];
    let nullCount = 0;
    const uniqueValues = new Set<string>();

    for (const row of rows) {
      const value = row[fieldName];

      if (value === null || value === undefined) {
        nullCount++;
        continue;
      }

      const stringValue = String(value);
      values.push(stringValue);
      uniqueValues.add(stringValue);
    }

    const fieldType = this.detectFieldType(values);
    const confidence = this.calculateFieldConfidence(fieldName, fieldType, values, nullCount, rows.length);

    return {
      fieldName,
      fieldType,
      confidence,
      sampleValues: values.slice(0, 5),
      nullCount,
      uniqueCount: uniqueValues.size,
    };
  }

  private detectFieldType(values: string[]): "string" | "number" | "boolean" | "date" | "url" | "unknown" {
    if (values.length === 0) return "unknown";

    const sampleSize = Math.min(values.length, 10);
    let numberCount = 0;
    let booleanCount = 0;
    let dateCount = 0;
    let urlCount = 0;

    for (let i = 0; i < sampleSize; i++) {
      const value = values[i];

      if (!isNaN(Number(value))) {
        numberCount++;
      }

      if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
        booleanCount++;
      }

      if (this.isDate(value)) {
        dateCount++;
      }

      if (this.isUrl(value)) {
        urlCount++;
      }
    }

    if (urlCount > sampleSize * 0.8) return "url";
    if (numberCount > sampleSize * 0.8) return "number";
    if (booleanCount > sampleSize * 0.8) return "boolean";
    if (dateCount > sampleSize * 0.8) return "date";

    return "string";
  }

  private isDate(value: string): boolean {
    return !isNaN(Date.parse(value));
  }

  private isUrl(value: string): boolean {
    return value.startsWith("http://") || value.startsWith("https://");
  }

  private calculateFieldConfidence(fieldName: string, fieldType: string, values: string[], nullCount: number, totalRows: number): number {
    let confidence = 50;

    const nullRatio = nullCount / totalRows;
    confidence -= nullRatio * 50;

    const fieldNameLower = fieldName.toLowerCase();

    if (fieldType === "number" && (fieldNameLower.includes("price") || fieldNameLower.includes("cost"))) {
      confidence += 30;
    }

    if (fieldType === "url" && fieldNameLower.includes("link")) {
      confidence += 30;
    }

    if (fieldType === "string" && (fieldNameLower.includes("name") || fieldNameLower.includes("title"))) {
      confidence += 20;
    }

    return Math.min(100, Math.max(0, confidence));
  }

  private detectSpecialFields(fieldAnalysis: Map<string, FeedFieldAnalysis>): {
    pricingFields: string[];
    providerFields: string[];
    deviceFields: string[];
    affiliateLinkFields: string[];
    cashbackFields: string[];
    contractDurationFields: string[];
    dataVolumeFields: string[];
  } {
    const pricingFields: string[] = [];
    const providerFields: string[] = [];
    const deviceFields: string[] = [];
    const affiliateLinkFields: string[] = [];
    const cashbackFields: string[] = [];
    const contractDurationFields: string[] = [];
    const dataVolumeFields: string[] = [];

    for (const [fieldName, analysis] of fieldAnalysis) {
      const fieldNameLower = fieldName.toLowerCase();

      if (fieldNameLower.includes("price") || fieldNameLower.includes("cost") || fieldNameLower.includes("fee")) {
        pricingFields.push(fieldName);
      }

      if (fieldNameLower.includes("provider") || fieldNameLower.includes("merchant") || fieldNameLower.includes("network")) {
        providerFields.push(fieldName);
      }

      if (fieldNameLower.includes("device") || fieldNameLower.includes("phone") || fieldNameLower.includes("hundefutter")) {
        deviceFields.push(fieldName);
      }

      if (fieldNameLower.includes("link") || fieldNameLower.includes("url") || fieldNameLower.includes("affiliate")) {
        affiliateLinkFields.push(fieldName);
      }

      if (fieldNameLower.includes("cashback") || fieldNameLower.includes("bonus") || fieldNameLower.includes("rebate")) {
        cashbackFields.push(fieldName);
      }

      if (fieldNameLower.includes("duration") || fieldNameLower.includes("contract") || fieldNameLower.includes("term")) {
        contractDurationFields.push(fieldName);
      }

      if (fieldNameLower.includes("data") || fieldNameLower.includes("volume") || fieldNameLower.includes("gb")) {
        dataVolumeFields.push(fieldName);
      }
    }

    return {
      pricingFields,
      providerFields,
      deviceFields,
      affiliateLinkFields,
      cashbackFields,
      contractDurationFields,
      dataVolumeFields,
    };
  }

  getAnalysis(feedId: string): FeedSchemaAnalysis | undefined {
    return this.analysisCache.get(feedId);
  }

  getAllAnalyses(): FeedSchemaAnalysis[] {
    return Array.from(this.analysisCache.values());
  }
}
