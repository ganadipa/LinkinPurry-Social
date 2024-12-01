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

@injectable()
export class NotificationController implements Controller {
  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider,
    @inject(CONFIG.NotificationService) private notificationService: NotificationService
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerMiddlewaresAfterGlobal(): void {}

  public registerRoutes(): void {
    this.registerSaveSubscriptionRoute();
    this.registerSendChatNotificationRoute();
    this.registerSendPostNotificationRoute();
  }

  private registerSaveSubscriptionRoute() {
    const route = createRoute({
      method: "post",
      path: "/api/notifications/subscribe",
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
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        const body = await c.req.json();
        const subscription = new PushSubscription(body.endpoint, body.keys);
        await this.notificationService.saveSubscription(subscription);

        return c.json({
          success: true,
          message: "Push subscription saved successfully",
        });
      } catch (error) {
        console.error("Error saving subscription:", error);
        return c.json({
          success: false,
          message: `Failed to save subscription: ${(error as Error).message}`,
        });
      }
    });
  }

  private registerSendChatNotificationRoute() {
    const route = createRoute({
      method: "post",
      path: "/api/notifications/chat",
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
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        const { toUserId, message, sender } = await c.req.json();
        await this.notificationService.sendChatNotification(toUserId, message, sender);

        return c.json({
          success: true,
          message: "Chat notification sent successfully",
        });
      } catch (error) {
        console.error("Error sending chat notification:", error);
        return c.json({
          success: false,
          message: `Failed to send chat notification: ${(error as Error).message}`,
        });
      }
    });
  }

  private registerSendPostNotificationRoute() {
    const route = createRoute({
      method: "post",
      path: "/api/notifications/post",
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
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        const { userId, postId, poster } = await c.req.json();
        await this.notificationService.sendPostNotification(userId, postId, poster);

        return c.json({
          success: true,
          message: "Post notification sent successfully",
        });
      } catch (error) {
        console.error("Error sending post notification:", error);
        return c.json({
          success: false,
          message: `Failed to send post notification: ${(error as Error).message}`,
        });
      }
    });
  }
}
