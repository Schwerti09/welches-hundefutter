import { EEATBlock, Source } from "../types";

export class EEATInfrastructure {
  private authors: Map<string, AuthorProfile> = new Map();
  private editorialReviews: Map<string, EditorialReview> = new Map();
  private sources: Map<string, Source[]> = new Map();

  createAuthor(
    id: string,
    name: string,
    credentials: string[],
    bio: string
  ): AuthorProfile {
    const author: AuthorProfile = {
      id,
      name,
      credentials,
      bio,
      expertise: [],
      createdAt: Date.now(),
    };

    this.authors.set(id, author);
    return author;
  }

  createEditorialReview(
    id: string,
    reviewer: string,
    reviewDate: number
  ): EditorialReview {
    const review: EditorialReview = {
      id,
      reviewer,
      reviewDate,
      comments: [],
      approved: false,
    };

    this.editorialReviews.set(id, review);
    return review;
  }

  createEEATBlock(
    authorId: string,
    editorialReviewId: string,
    sources: Source[],
    updateFrequency: EEATBlock["updateFrequency"]
  ): EEATBlock {
    const author = this.authors.get(authorId);
    const review = this.editorialReviews.get(editorialReviewId);

    if (!author || !review) {
      throw new Error("Author or editorial review not found");
    }

    return {
      authorId,
      authorName: author.name,
      authorCredentials: author.credentials,
      editorialReviewId,
      editorialReviewer: review.reviewer,
      lastReviewedAt: review.reviewDate,
      factChecked: false,
      sources,
      lastUpdatedAt: Date.now(),
      updateFrequency,
    };
  }

  addSource(entityId: string, source: Source): void {
    const entitySources = this.sources.get(entityId) || [];
    entitySources.push(source);
    this.sources.set(entityId, entitySources);
  }

  markAsFactChecked(entityId: string, factCheckerId: string): void {
    const sources = this.sources.get(entityId);
    if (sources) {
      sources.forEach((source) => {
        // Mark source as verified
      });
    }
  }

  getAuthor(authorId: string): AuthorProfile | undefined {
    return this.authors.get(authorId);
  }

  getEditorialReview(reviewId: string): EditorialReview | undefined {
    return this.editorialReviews.get(reviewId);
  }

  getSources(entityId: string): Source[] {
    return this.sources.get(entityId) || [];
  }

  isUpdateDue(eeatBlock: EEATBlock): boolean {
    const now = Date.now();
    const updateIntervals: Record<EEATBlock["updateFrequency"], number> = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
      quarterly: 90 * 24 * 60 * 60 * 1000,
    };

    const interval = updateIntervals[eeatBlock.updateFrequency];
    return now - eeatBlock.lastUpdatedAt > interval;
  }
}

interface AuthorProfile {
  id: string;
  name: string;
  credentials: string[];
  bio: string;
  expertise: string[];
  createdAt: number;
}

interface EditorialReview {
  id: string;
  reviewer: string;
  reviewDate: number;
  comments: string[];
  approved: boolean;
}
