import { inject, injectable } from "inversify";
import { CONFIG } from "../../ioc/config";
import { PushSubscription } from "../../models/push-subscription.model";
import { PrismaProvider } from "../../prisma/prisma";
import { PushSubscriptionRepository } from "../../interfaces/push-subscription-repository.interface";
import { InputJsonValue } from "@prisma/client/runtime/library";

@injectable()
export class DbPushSubscriptionRepository
  implements PushSubscriptionRepository
{
  constructor(@inject(CONFIG.PrismaProvider) private prisma: PrismaProvider) {}

  public async save(subscription: PushSubscription): Promise<PushSubscription> {
    const savedSubscription =
      await this.prisma.prisma.push_subscriptions.upsert({
        where: {
          endpoint: subscription.endpoint,
        },
        update: {
          user_id: subscription.user_id,
          keys: subscription.keys as InputJsonValue,
        },
        create: {
          endpoint: subscription.endpoint,
          user_id: subscription.user_id,
          keys: subscription.keys as InputJsonValue,
          created_at: new Date(),
        },
      });

    return savedSubscription;
  }

  public async findByEndpoint(
    endpoint: string
  ): Promise<PushSubscription | null> {
    const subscription = await this.prisma.prisma.push_subscriptions.findUnique(
      {
        where: {
          endpoint: endpoint,
        },
      }
    );

    return subscription;
  }

  public async findByUserId(userId: number): Promise<PushSubscription[]> {
    const subscriptions = await this.prisma.prisma.push_subscriptions.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return subscriptions;
  }

  public async delete(endpoint: string): Promise<void> {
    await this.prisma.prisma.push_subscriptions.delete({
      where: {
        endpoint: endpoint,
      },
    });
  }

  public async deleteByUserId(userId: number): Promise<void> {
    await this.prisma.prisma.push_subscriptions.deleteMany({
      where: {
        user_id: userId,
      },
    });
  }

  public async updateUserId(
    endpoint: string,
    userId: number | null
  ): Promise<PushSubscription> {
    const updatedSubscription =
      await this.prisma.prisma.push_subscriptions.update({
        where: {
          endpoint: endpoint,
        },
        data: {
          user_id: userId,
        },
      });

    return updatedSubscription;
  }

  public async getAllActiveSubscriptions(): Promise<PushSubscription[]> {
    const subscriptions = await this.prisma.prisma.push_subscriptions.findMany({
      where: {
        user_id: {
          not: null,
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return subscriptions;
  }
}
