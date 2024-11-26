import { PushSubscription } from "../models/push-subscription.model";

export interface PushSubscriptionRepository {
  save(subscription: PushSubscription): Promise<PushSubscription>;
  findByEndpoint(endpoint: string): Promise<PushSubscription | null>;
  findByUserId(userId: number): Promise<PushSubscription[]>;
  delete(endpoint: string): Promise<void>;
  deleteByUserId(userId: number): Promise<void>;
  updateUserId(
    endpoint: string,
    userId: number | null
  ): Promise<PushSubscription>;
  getAllActiveSubscriptions(): Promise<PushSubscription[]>;
}
