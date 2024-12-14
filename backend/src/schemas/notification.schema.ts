import { z } from "zod";

// schema for saving push subscription
export const SaveSubscriptionRequestSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
  user_id: z.number(),
});

export const SaveSubscriptionResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

// schema for sending chat notification
export const SendChatNotificationRequestSchema = z.object({
  toUserId: z.number(),
  message: z.string(),
  sender: z.string(),
  senderId: z.number(),
});

export const SendChatNotificationResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

// schema for sending post notification
export const SendPostNotificationRequestSchema = z.object({
  userId: z.number(),
  postId: z.number(),
  poster: z.string(),
});

export const SendPostNotificationResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});
