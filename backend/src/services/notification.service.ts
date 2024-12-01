import { injectable, inject } from "inversify";
import webPush from "web-push";
import { CONFIG } from "../ioc/config";
import { PushSubscriptionRepository } from "../interfaces/push-subscription-repository.interface";
import { PushSubscription } from "../models/push-subscription.model";

@injectable()
export class NotificationService {
  constructor(
    @inject(CONFIG.PushSubscriptionRepository)
    private pushSubscriptionRepo: PushSubscriptionRepository
  ) {
    webPush.setVapidDetails(
      "mailto:example@example.com",
      process.env.VAPID_PUBLIC_KEY || "",
      process.env.VAPID_PRIVATE_KEY || ""
    );
  }

  async saveSubscription(subscription: PushSubscription): Promise<PushSubscription> {
    return await this.pushSubscriptionRepo.save(subscription);
  }

  async sendChatNotification(toUserId: number, message: string, sender: string) {
    const subscriptions = await this.pushSubscriptionRepo.findByUserId(toUserId);

    const payload = JSON.stringify({
      title: `Message from ${sender}`,
      body: message,
      url: `/chat/${toUserId}`,
    });

    await Promise.all(
      subscriptions.map((sub) =>
        webPush
          .sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys as { p256dh: string; auth: string },
            },
            payload
          )
          .catch((error) => console.error("Error sending chat notification:", error))
      )
    );
  }

  async sendPostNotification(userId: number, postId: number, poster: string) {
    const connections = await this.pushSubscriptionRepo.getAllActiveSubscriptions();

    const payload = JSON.stringify({
      title: `${poster} has a new post`,
      body: "Check it out on your timeline!",
      url: `/feed/${postId}`,
    });

    await Promise.all(
      connections.map((sub) =>
        webPush
          .sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys as { p256dh: string; auth: string },
            },
            payload
          )
          .catch((error) => console.error("Error sending post notification:", error))
      )
    );
  }
}
