import { injectable, inject } from "inversify";
import { Controller } from "./controller";
import { createRoute } from "@hono/zod-openapi";
import { CONFIG } from "../ioc/config";
import { OpenApiHonoProvider } from "../core/hono-provider";
import { NotificationService } from "../services/notification.service";
import {
  SaveSubscriptionRequestSchema,
  SaveSubscriptionResponseSchema,
  SendChatNotificationRequestSchema,
  SendChatNotificationResponseSchema,
  SendPostNotificationRequestSchema,
  SendPostNotificationResponseSchema,
} from "../schemas/notification.schema";
import { PushSubscription } from "../models/push-subscription.model";
import { NullErrorResponseSchema } from "../constants/types";
import { z } from "zod";

@injectable()
export class NotificationController implements Controller {
  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider,
    @inject(CONFIG.NotificationService)
    private notificationService: NotificationService
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerMiddlewaresAfterGlobal(): void {}

  public registerRoutes(): void {
    this.registerSaveSubscriptionRoute();
    this.registerSendChatNotificationRoute();
    this.registerSendPostNotificationRoute();
    this.registerUnsubscribeRoute();
  }

  private registerSaveSubscriptionRoute() {
    const route = createRoute({
      method: "post",
      path: "/api/notifications/subscribe",
      tags: ["Notifications"],
      request: {
        body: {
          content: {
            "application/json": {
              schema: SaveSubscriptionRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Push subscription saved successfully",
          content: {
            "application/json": {
              schema: SaveSubscriptionResponseSchema,
            },
          },
        },
        500: {
          description: "Failed to save subscription",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        const body = await c.req.json();
        const subscription = new PushSubscription(
          body.endpoint,
          body.keys,
          body.user_id
        );
        console.log("Subscription:", subscription);
        await this.notificationService.saveSubscription(subscription);

        return c.json(
          {
            success: true as const,
            message: "Push subscription saved successfully",
          },
          200
        );
      } catch (error) {
        console.error("Error saving subscription:", error);
        return c.json(
          {
            success: false as const,
            message: `Failed to save subscription: ${(error as Error).message}`,
            error: error,
          },
          500
        );
      }
    });
  }

  private registerSendChatNotificationRoute() {
    const route = createRoute({
      method: "post",
      path: "/api/notifications/chat",
      tags: ["Notifications"],

      request: {
        body: {
          content: {
            "application/json": {
              schema: SendChatNotificationRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Chat notification sent successfully",
          content: {
            "application/json": {
              schema: SendChatNotificationResponseSchema,
            },
          },
        },
        500: {
          description: "Failed to send chat notification",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        const { toUserId, message, sender, senderId } = await c.req.json();
        await this.notificationService.sendChatNotification(
          toUserId,
          message,
          sender,
          senderId,
        );

        return c.json(
          {
            success: true as const,
            message: "Chat notification sent successfully",
          },
          200
        );
      } catch (error) {
        console.error("Error sending chat notification:", error);
        return c.json(
          {
            success: false as const,
            message: `Failed to send chat notification: ${
              (error as Error).message
            }`,
            error: error,
          },
          500
        );
      }
    });
  }

  private registerSendPostNotificationRoute() {
    const route = createRoute({
      method: "post",
      path: "/api/notifications/post",
      tags: ["Notifications"],

      request: {
        body: {
          content: {
            "application/json": {
              schema: SendPostNotificationRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Post notification sent successfully",
          content: {
            "application/json": {
              schema: SendPostNotificationResponseSchema,
            },
          },
        },
        500: {
          description: "Failed to send post notification",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        const { userId, postId, poster } = await c.req.json();
        await this.notificationService.sendPostNotification(
          userId,
          postId,
          poster
        );

        return c.json(
          {
            success: true as const,
            message: "Post notification sent successfully",
          },
          200
        );
      } catch (error) {
        console.error("Error sending post notification:", error);
        return c.json(
          {
            success: false as const,
            message: `Failed to send post notification: ${
              (error as Error).message
            }`,
            error: error,
          },
          500
        );
      }
    });
  }

  private registerUnsubscribeRoute() {
    const route = createRoute({
      method: "delete",
      path: "/api/notifications/unsubscribe",
      tags: ["Notifications"],
      request: {
        body: {
          content: {
            "application/json": {
              schema: z.object({
                user_id: z.number(),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Push subscription deleted successfully",
          content: {
            "application/json": {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
              }),
            },
          },
        },
        500: {
          description: "Failed to delete push subscription",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        const { user_id } = await c.req.json();
        await this.notificationService.deleteSubscriptionByUserId(user_id);

        return c.json(
          {
            success: true as const,
            message: "Push subscription deleted successfully",
          },
          200
        );
      } catch (error) {
        console.error("Error deleting subscription:", error);
        return c.json(
          {
            success: false as const,
            message: `Failed to delete subscription: ${
              (error as Error).message
            }`,
            error: null,
          },
          500
        );
      }
    });
  }
}
