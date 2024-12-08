import { inject, injectable } from "inversify";
import { FeedRepository } from "../interfaces/feed-repository.interface";
import { CONFIG } from "../ioc/config";
import { Feed } from "../models/feed.model";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { ForbiddenException } from "../exceptions/forbidden.exception";
import { ConnectionRepository } from "../interfaces/connection-repository.interface";

@injectable()
export class FeedService {
  constructor(
    @inject(CONFIG.FeedRepository) private feedRepository: FeedRepository,
    @inject(CONFIG.ConnectionRepository)
    private connectionRepository: ConnectionRepository
  ) {}

  public async getFeed(
    userid: number,
    limit: number | undefined,
    cursor: number | undefined
  ) {
    const friends = await this.connectionRepository.getFriendsId(
      BigInt(userid)
    );

    let visible = [];
    for (const friend of friends) {
      visible.push(friend);
    }
    visible.push(BigInt(userid));

    const feeds = await this.feedRepository.getPaginatedFeeds(
      visible,
      limit,
      cursor
    );

    return feeds;
  }

  public async createPost(userId: number, content: string) {
    const feed = new Feed(content, userId);

    const createdFeed = await this.feedRepository.save(feed);

    return createdFeed;
  }

  public async updatePost(userId: number, postId: number, content: string) {
    const targetFeed = await this.feedRepository.findById(postId);

    if (!targetFeed) {
      throw new BadRequestException("Post not found");
    }

    if (Number(targetFeed.user_id) !== userId) {
      throw new ForbiddenException("You are not allowed to update this post");
    }

    targetFeed.content = content;
    return await this.feedRepository.save(targetFeed);
  }

  public async deletePost(userId: number, postId: number) {
    const targetFeed = await this.feedRepository.findById(postId);

    if (!targetFeed) {
      throw new BadRequestException("Post not found");
    }

    if (Number(targetFeed.user_id) !== userId) {
      throw new ForbiddenException(
        "You don't have permission to delete this post"
      );
    }

    return await this.feedRepository.delete(postId);
  }
}
