import { products } from "@/data/products";
import { DeviceIntelligenceEngine } from "../../devices/intelligence/deviceIntelligence";
import { ContractIntelligenceEngine } from "../../contracts/intelligence/contractIntelligence";
import { SmartTaggingEngine } from "../tagging/smartTaggingEngine";
import { SemanticEntityManager } from "../entities/semanticEntity";
import { DataNormalizer } from "../normalization/dataNormalizer";

export class DataEnrichmentPipeline {
  private deviceIntelligenceEngine: DeviceIntelligenceEngine;
  private contractIntelligenceEngine: ContractIntelligenceEngine;
  private smartTaggingEngine: SmartTaggingEngine;
  private entityManager: SemanticEntityManager;
  private normalizer: DataNormalizer;

  constructor() {
    this.deviceIntelligenceEngine = new DeviceIntelligenceEngine();
    this.contractIntelligenceEngine = new ContractIntelligenceEngine();
    this.smartTaggingEngine = new SmartTaggingEngine();
    this.entityManager = new SemanticEntityManager();
    this.normalizer = new DataNormalizer();
  }

  enrichAllProducts(): Map<string, any> {
    const enrichedData = new Map<string, any>();

    for (const product of products) {
      const deviceIntelligence = this.deviceIntelligenceEngine.generateIntelligence(product);
      const deviceTags = this.smartTaggingEngine.generateDeviceTags(deviceIntelligence);

      const enrichedProduct = {
        ...product,
        intelligence: deviceIntelligence,
        tags: deviceTags,
        normalized: {
          name: this.normalizer.normalizeDeviceName(product.name),
          brand: this.normalizer.normalizeProviderName(product.brand),
        },
      };

      enrichedData.set(product.id, enrichedProduct);

      // Create semantic entity
      this.entityManager.createDeviceEntity(
        product.id,
        product.name,
        {
          brand: product.brand,
          classification: deviceIntelligence.classification,
          scores: deviceIntelligence.scores,
          semanticTags: deviceTags,
          bestForLabels: deviceIntelligence.bestForLabels,
        }
      );

      // Enrich offers
      for (const offer of product.offers) {
        const contractIntelligence = this.contractIntelligenceEngine.generateIntelligence(offer, product);
        const contractTags = this.smartTaggingEngine.generateContractTags(contractIntelligence);
        const combinedTags = this.smartTaggingEngine.generateCombinedTags(deviceIntelligence, contractIntelligence);

        const enrichedOffer = {
          ...offer,
          intelligence: contractIntelligence,
          tags: contractTags,
          combinedTags,
        };

        // Create contract entity
        this.entityManager.createContractEntity(
          offer.id,
          `${product.name} - ${offer.provider}`,
          {
            provider: offer.provider,
            classification: contractIntelligence.classification,
            scores: contractIntelligence.scores,
            semanticTags: contractTags,
            suitability: contractIntelligence.suitability,
          }
        );

        // Relate device and contract
        this.entityManager.relateEntities(product.id, offer.id);
      }
    }

    return enrichedData;
  }

  getEnrichedProduct(productId: string): any | undefined {
    const enrichedData = this.enrichAllProducts();
    return enrichedData.get(productId);
  }

  getAllEntities(): Map<string, any> {
    this.enrichAllProducts();
    const entities = new Map<string, any>();

    for (const [id, entity] of this.entityManager["entities"]) {
      entities.set(id, entity);
    }

    return entities;
  }

  getEnrichmentStatistics(): {
    totalProducts: number;
    totalOffers: number;
    totalEntities: number;
    totalTags: number;
  } {
    const enrichedData = this.enrichAllProducts();
    const entities = this.getAllEntities();

    let totalOffers = 0;
    let totalTags = 0;

    for (const product of enrichedData.values()) {
      totalOffers += product.offers.length;
      totalTags += product.tags.length;
    }

    return {
      totalProducts: enrichedData.size,
      totalOffers,
      totalEntities: entities.size,
      totalTags,
    };
  }
}
