import { BehavioralEvent } from "../types";

export class EventStreamArchitecture {
  private eventProcessors: Map<string, EventProcessor> = new Map();
  private eventAggregators: Map<string, EventAggregator> = new Map();

  registerEventProcessor(name: string, processor: EventProcessor): void {
    this.eventProcessors.set(name, processor);
  }

  registerEventAggregator(name: string, aggregator: EventAggregator): void {
    this.eventAggregators.set(name, aggregator);
  }

  processEvent(event: BehavioralEvent): ProcessedEvent {
    const processors = Array.from(this.eventProcessors.values());
    let processedEvent: ProcessedEvent = {
      originalEvent: event,
      processedData: {},
      enrichments: [],
      timestamp: Date.now(),
    };

    for (const processor of processors) {
      processedEvent = processor.process(processedEvent);
    }

    return processedEvent;
  }

  aggregateEvents(sessionId: string, events: BehavioralEvent[]): AggregatedEvents {
    const aggregations: Record<string, unknown> = {};

    for (const aggregator of this.eventAggregators.values()) {
      aggregations[aggregator.name] = aggregator.aggregate(sessionId, events);
    }

    return {
      sessionId,
      eventCount: events.length,
      aggregations,
      timestamp: Date.now(),
    };
  }

  createEventSchema(eventType: BehavioralEventType): EventSchema {
    const schemas: Record<BehavioralEventType, EventSchema> = {
      view_product: {
        requiredFields: ["entityId", "entityType"],
        optionalFields: ["scrollDepth", "timeOnPage"],
        validationRules: [],
      },
      click_recommendation: {
        requiredFields: ["entityId", "entityType"],
        optionalFields: ["position", "context"],
        validationRules: [],
      },
      view_comparison: {
        requiredFields: ["entityId", "entityType"],
        optionalFields: ["comparedWith", "duration"],
        validationRules: [],
      },
      advisor_interaction: {
        requiredFields: ["entityId", "entityType"],
        optionalFields: ["question", "response", "confidence"],
        validationRules: [],
      },
      save_item: {
        requiredFields: ["entityId", "entityType"],
        optionalFields: ["saveType"],
        validationRules: [],
      },
      scroll_depth: {
        requiredFields: ["entityId", "entityType"],
        optionalFields: ["scrollDepth", "maxDepth"],
        validationRules: [],
      },
      provider_click: {
        requiredFields: ["entityId", "entityType"],
        optionalFields: ["provider", "context"],
        validationRules: [],
      },
      price_filter: {
        requiredFields: [],
        optionalFields: ["minPrice", "maxPrice", "filterType"],
        validationRules: [],
      },
      feature_filter: {
        requiredFields: [],
        optionalFields: ["feature", "minValue", "filterType"],
        validationRules: [],
      },
    };

    return schemas[eventType];
  }

  createDefaultProcessors(): void {
    this.registerEventProcessor("enrichment", {
      name: "enrichment",
      process: (event) => {
        const enriched = { ...event };
        enriched.processedData = {
          ...event.processedData,
          enrichedAt: Date.now(),
          sessionId: event.originalEvent.sessionId,
        };
        enriched.enrichments.push("timestamp-enrichment");
        return enriched;
      },
    });

    this.registerEventProcessor("deduplication", {
      name: "deduplication",
      process: (event) => {
        const enriched = { ...event };
        enriched.processedData = {
          ...event.processedData,
          deduplicated: true,
        };
        enriched.enrichments.push("deduplication-check");
        return enriched;
      },
    });
  }

  createDefaultAggregators(): void {
    this.registerEventAggregator("engagement", {
      name: "engagement",
      aggregate: (sessionId, events) => {
        const engagementEvents = events.filter((e) => e.type === "view_product" || e.type === "click_recommendation");
        return {
          totalEvents: engagementEvents.length,
          uniqueEntities: new Set(engagementEvents.map((e) => e.entityId)).size,
          avgDepth: engagementEvents.length / Math.max(new Set(engagementEvents.map((e) => e.entityId)).size, 1),
        };
      },
    });

    this.registerEventAggregator("conversion", {
      name: "conversion",
      aggregate: (sessionId, events) => {
        const clickEvents = events.filter((e) => e.type === "click_recommendation");
        const saveEvents = events.filter((e) => e.type === "save_item");
        return {
          clickRate: clickEvents.length / Math.max(events.length, 1),
          saveRate: saveEvents.length / Math.max(events.length, 1),
          conversionSignals: clickEvents.length + saveEvents.length * 2,
        };
      },
    });
  }
}

interface EventProcessor {
  name: string;
  process: (event: ProcessedEvent) => ProcessedEvent;
}

interface EventAggregator {
  name: string;
  aggregate: (sessionId: string, events: BehavioralEvent[]) => unknown;
}

interface ProcessedEvent {
  originalEvent: BehavioralEvent;
  processedData: Record<string, unknown>;
  enrichments: string[];
  timestamp: number;
}

interface AggregatedEvents {
  sessionId: string;
  eventCount: number;
  aggregations: Record<string, unknown>;
  timestamp: number;
}

interface EventSchema {
  requiredFields: string[];
  optionalFields: string[];
  validationRules: ValidationRule[];
}

interface ValidationRule {
  field: string;
  rule: string;
  errorMessage: string;
}
