import { FeedRelated } from "../schemas/feed.schema";
import { Feed } from "../models/feed.model";

export interface FeedRepository {
  findById(id: number): Promise<Feed | null>;
  findByUserId(userId: BigInt): Promise<Feed[]>;
  save(feed: Feed): Promise<Feed>;
  create(feed: Feed): Promise<Feed>;
  update(feed: Feed): Promise<Feed>;
  delete(id: number): Promise<void>;
  getFeedsByPage(page?: number, limit?: number): Promise<Feed[]>;
  searchFeeds(keyword: string): Promise<Feed[]>;
  getPaginatedFeeds(
    visible: BigInt[],
    limit: number | undefined,
    cursor: number | undefined
  ): Promise<FeedRelated[]>;
}
