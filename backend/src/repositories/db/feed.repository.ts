import { inject, injectable } from "inversify";
import { CONFIG } from "../../ioc/config";
import { Feed } from "../../models/feed.model";
import { PrismaProvider } from "../../prisma/prisma";
import { FeedRepository } from "../../interfaces/feed-repository.interface";

@injectable()
export class DbFeedRepository implements FeedRepository {
  constructor(@inject(CONFIG.PrismaProvider) private prisma: PrismaProvider) {}

  public async findById(id: number): Promise<Feed | null> {
    const feed = await this.prisma.prisma.feed.findUnique({
      where: {
        id: id,
      },
    });

    if (!feed) {
      return null;
    }

    return feed;
  }

  public async findByUserId(userId: bigint): Promise<Feed[]> {
    const feeds = await this.prisma.prisma.feed.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return feeds;
  }

  public async save(feed: Feed): Promise<Feed> {
    if (feed.id) {
      return this.update(feed);
    }
    return this.create(feed);
  }

  public async create(feed: Feed): Promise<Feed> {
    const newFeed = await this.prisma.prisma.feed.create({
      data: {
        content: feed.content,
        user_id: feed.user_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return newFeed;
  }

  public async update(feed: Feed): Promise<Feed> {
    const updatedFeed = await this.prisma.prisma.feed.update({
      where: {
        id: feed.id,
      },
      data: {
        ...feed,
        updated_at: new Date(),
      },
    });

    return updatedFeed;
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.prisma.feed.delete({
      where: {
        id: id,
      },
    });
  }

  public async getFeedsByPage(
    page: number = 1,
    limit: number = 10
  ): Promise<Feed[]> {
    const feeds = await this.prisma.prisma.feed.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        users: true, // This will include the user data in the response
      },
    });

    return feeds;
  }

  public async searchFeeds(keyword: string): Promise<Feed[]> {
    const feeds = await this.prisma.prisma.feed.findMany({
      where: keyword
        ? {
            content: {
              contains: keyword,
              mode: "insensitive",
            },
          }
        : {},
      orderBy: {
        created_at: "desc",
      },
      include: {
        users: true,
      },
    });

    return feeds;
  }
}
