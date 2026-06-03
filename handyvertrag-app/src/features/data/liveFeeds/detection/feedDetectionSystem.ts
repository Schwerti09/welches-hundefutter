import { FeedType, FeedFile } from "../types";

export class FeedDetectionSystem {
  private detectedFeedTypes: Map<string, FeedType> = new Map();

  detectFeedType(fileName: string, filePath: string): FeedType {
    const extension = this.getFileExtension(fileName);

    if (extension === "zip") {
      this.detectedFeedTypes.set(filePath, "zip");
      return "zip";
    }

    if (extension === "csv") {
      this.detectedFeedTypes.set(filePath, "csv");
      return "csv";
    }

    if (extension === "xml") {
      this.detectedFeedTypes.set(filePath, "xml");
      return "xml";
    }

    if (extension === "json") {
      this.detectedFeedTypes.set(filePath, "json");
      return "json";
    }

    this.detectedFeedTypes.set(filePath, "csv");
    return "csv";
  }

  getDetectedFeedType(filePath: string): FeedType | undefined {
    return this.detectedFeedTypes.get(filePath);
  }

  routeParser(feedFile: FeedFile): string {
    const feedType = feedFile.fileType;

    switch (feedType) {
      case "zip":
        return "zip-parser";
      case "csv":
        return "csv-parser";
      case "xml":
        return "xml-parser";
      case "json":
        return "json-parser";
      default:
        return "csv-parser";
    }
  }

  routeIngestion(feedFile: FeedFile): string {
    const networkType = feedFile.networkType;

    switch (networkType) {
      case "awin":
        return "awin-ingestion";
      case "communicationads":
        return "communicationads-ingestion";
      case "tariffuxx":
        return "tariffuxx-ingestion";
      case "direct_api":
        return "direct-api-ingestion";
      case "scraping":
        return "scraping-ingestion";
      default:
        return "default-ingestion";
    }
  }

  private getFileExtension(fileName: string): string {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
  }
}
