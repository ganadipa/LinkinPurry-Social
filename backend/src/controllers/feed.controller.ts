import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { createRoute, z } from "@hono/zod-openapi";
import { createMiddleware } from "hono/factory";
import { CONFIG } from "../ioc/config";
import { OpenApiHonoProvider } from "../core/hono-provider";
import { BadRequestException } from "../exceptions/bad-request.exception";
import {
  CreatePostEnv,
  DeletePostEnv,
  GetFeedEnv,
  UpdatePostEnv,
} from "../constants/context-env.types";
import {
  CreatePostRequestSchema,
  CreatePostSuccessSchema,
  DeletePostSuccessSchema,
  EditPostRequestSchema,
  EditPostSuccessSchema,
  GetFeedSuccessSchema,
} from "../schemas/feed.schema";
import { NullErrorResponseSchema } from "../constants/types";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import { InternalErrorException } from "../exceptions/internal-error.exception";
import { HTTPException } from "hono/http-exception";
import { FeedService } from "../services/feed.service";

import { NotificationService } from "../services/notification.service";
import { ConnectionService } from "../services/connection.service";
import { URL_PUBLIC_UPLOADS } from "../constants/constants";

@injectable()
export class FeedController implements Controller {
  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider,
    @inject(CONFIG.FeedService) private feedService: FeedService,
    @inject(CONFIG.NotificationService)
    private notificationService: NotificationService,
    @inject(CONFIG.ConnectionService)
    private connectionService: ConnectionService
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}
  public registerMiddlewaresAfterGlobal(): void {}
  public registerRoutes(): void {
    this.registerGetFeedRoute();
    this.registerCreatePostRoute();
    this.registerUpdatePostRoute();
    this.registerDeletePostRoute();
  }

  private setGetFeedQueryMiddleware = createMiddleware<GetFeedEnv>(
    async (c, next) => {
      try {
        const limit = c.req.query("limit");
        const cursor = c.req.query("cursor");

        let limitValue: number | undefined;
        const constraint = z.string().transform((value) => {
          if (value === "") {
            return undefined;
          }
          const parsed = parseInt(value);
          if (isNaN(parsed)) {
            throw new Error("Invalid number");
          }
          return parsed;
        });

        if (limit) {
          limitValue = constraint.parse(limit);
        }

        let cursorValue: number | undefined;
        if (cursor) {
          cursorValue = constraint.parse(cursor);
        }

        c.set("limit", limitValue);
        c.set("cursor", cursorValue);
        await next();
      } catch (exception) {
        console.log(exception);
        throw new BadRequestException("Invalid query parameters");
      }
    }
  );

  private createPostBodyMiddleware = createMiddleware<CreatePostEnv>(
    async (c, next) => {
      console.log("in duh middleware");
      const json = await c.req.json();
      console.log(json);
      const expected = CreatePostRequestSchema.safeParse(json);
      console.log(expected);
      if (!expected.success) {
        console.log("invalid request body");
        throw new BadRequestException("Invalid request body");
      }

      c.set("content", expected.data.content);
      await next();
    }
  );

  private setUpdatePostParamsAndQueryMiddleware =
    createMiddleware<UpdatePostEnv>(async (c, next) => {
      try {
        const postId = c.req.param("postId");
        const payload = await c.req.json();
        const expected = EditPostRequestSchema.safeParse(payload);

        if (!expected.success) {
          throw new BadRequestException(
            "Invalid request body: content is required, even if it must be an empty string"
          );
        }

        if (!postId) {
          throw new BadRequestException(
            "Invalid parameters: postId is required"
          );
        }

        const postIdConstraint = z.string().transform((value) => {
          const parsed = parseInt(value);
          if (isNaN(parsed)) {
            throw new Error("Invalid number");
          }
          return parsed;
        });

        const postIdValue = postIdConstraint.parse(postId);

        c.set("postId", postIdValue);
        c.set("content", payload.content);
        await next();
      } catch (exception) {
        console.log(exception);
        throw new BadRequestException("Invalid parameters");
      }
    });

  private setDeletePostParamsMiddleware = createMiddleware<DeletePostEnv>(
    async (c, next) => {
      try {
        const postId = c.req.param("postId");

        if (!postId) {
          throw new BadRequestException(
            "Invalid parameters: postId is required"
          );
        }

        const postIdConstraint = z.string().transform((value) => {
          const parsed = parseInt(value);
          if (isNaN(parsed)) {
            throw new Error("Invalid number");
          }
          return parsed;
        });

        const postIdValue = postIdConstraint.parse(postId);

        c.set("postId", postIdValue);
        await next();
      } catch (exception) {
        console.log(exception);
        throw new BadRequestException("Invalid parameters");
      }
    }
  );

  private registerGetFeedRoute() {
    const route = createRoute({
      middleware: [this.setGetFeedQueryMiddleware] as const,
      method: "get",
      path: "/api/feed",
      tags: ["Feed"],
      security: [],
      request: {
        query: z.object({
          limit: z.string().optional(),
          cursor: z.string().optional(),
        }),
      },
      responses: {
        200: {
          description: "Successfully get feed",
          content: {
            "application/json": {
              schema: GetFeedSuccessSchema,
            },
          },
        },
        400: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
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
        const limit = c.var.limit;
        const cursor = c.var.cursor;
        const user = c.var.user;

        if (!user) {
          throw new UnauthorizedException("Unauthorized");
        }

        if (!user.id) {
          throw new InternalErrorException(
            "User from the repo somehow does not have an ID"
          );
        }

        const feed = await this.feedService.getFeed(
          Number(user.id),
          limit,
          cursor
        );

        const cursorAfter = feed.reduce((min, post) => {
          return post.post.id < min ? post.post.id : min;
        }, Number.MAX_SAFE_INTEGER);

        const feed_adjusted_profile_photo = feed.map((post) => {
          return {
            ...post,
            user: {
              ...post.user,
              profile_photo_path:
                URL_PUBLIC_UPLOADS + post.user.profile_photo_path,
            },
          };
        });

        return c.json(
          {
            success: true as const,
            message: "Successfully get feed",
            body: {
              cursor: cursorAfter,
              posts: feed_adjusted_profile_photo,
            },
          },
          200
        );
      } catch (exception) {
        if (exception instanceof HTTPException) {
          let status: 400 | 500;

          switch (exception.status) {
            case 400:
              status = 400;
              break;
            default:
              status = 500;
              break;
          }

          c.status(status);
          return c.json(
            {
              success: false as const,
              message: exception.message,
              error: null,
            },
            status
          );
        }

        c.status(500);
        return c.json(
          {
            success: false as const,
            message: "Internal server error",
            error: null,
          },
          500
        );
      }
    });
  }

  private registerCreatePostRoute() {
    const route = createRoute({
      method: "post",
      path: "/api/feed",
      middleware: [this.createPostBodyMiddleware] as const,
      tags: ["Feed"],

      request: {
        body: {
          content: {
            "application/json": {
              schema: z.object({
                content: z.string(),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successfully create post",
          content: {
            "application/json": {
              schema: CreatePostSuccessSchema,
            },
          },
        },
        400: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
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
        const user = c.var.user;
        const content = c.var.content;

        if (!user) {
          throw new UnauthorizedException("Unauthorized");
        }

        if (!user.id) {
          throw new InternalErrorException(
            "User from the repo somehow does not have an ID"
          );
        }

        const feed = await this.feedService.createPost(
          Number(user.id),
          content
        );
        console.log(feed);

        if (
          !feed.id ||
          !feed.user_id ||
          !feed.content ||
          !feed.created_at ||
          !feed.updated_at
        ) {
          throw new InternalErrorException("Failed to create post");
        }

        const connectedUserIds =
          await this.connectionService.getAllConnectedUserIds(BigInt(user.id));
        await this.notificationService.sendPostNotification(
          connectedUserIds,
          Number(feed.id),
          user.full_name
        );

        return c.json(
          {
            success: true as const,
            message: "Successfully create post",
            body: {
              post: {
                id: Number(feed.id),
                content: feed.content,
                created_at: feed.created_at.getTime(),
                updated_at: feed.updated_at.getTime(),
              },
              user: {
                id: Number(user.id),
                fullname: user.full_name,
                username: user.username,
                profile_photo_path:
                  URL_PUBLIC_UPLOADS + user.profile_photo_path,
              },
            },
          },
          200
        );
      } catch (err) {
        if (err instanceof HTTPException) {
          let status: 400 | 401 | 500;

          switch (err.status) {
            case 400:
              status = 400;
              break;
            case 401:
              status = 401;
              break;
            default:
              status = 500;
              break;
          }

          c.status(status);
          return c.json(
            {
              success: false as const,
              message: err.message,
              error: null,
            },
            status
          );
        }

        c.status(500);
        return c.json(
          {
            success: false as const,
            message: "Internal server error",
            error: null,
          },
          500
        );
      }
    });
  }

  private registerUpdatePostRoute() {
    const route = createRoute({
      method: "put",
      path: "/api/feed/{postId}",
      middleware: [this.setUpdatePostParamsAndQueryMiddleware] as const,
      tags: ["Feed"],

      request: {
        params: z.object({
          postId: z.string(),
        }),
        body: {
          content: {
            "application/json": {
              schema: z.object({
                content: z.string(),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successfully update post",
          content: {
            "application/json": {
              schema: EditPostSuccessSchema,
            },
          },
        },
        400: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        403: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
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
        const user = c.var.user;
        const postId = c.var.postId;
        const content = c.var.content;

        if (!user) {
          throw new UnauthorizedException("Unauthorized");
        }

        if (!user.id) {
          throw new InternalErrorException(
            "User from the repo somehow does not have an ID"
          );
        }

        console.log("updating");
        const feed = await this.feedService.updatePost(
          Number(user.id),
          Number(postId),
          content
        );
        console.log("updated");

        if (
          !feed.id ||
          !feed.user_id ||
          !feed.content ||
          !feed.created_at ||
          !feed.updated_at
        ) {
          throw new InternalErrorException("Failed to update post");
        }
        console.log("returning");

        return c.json(
          {
            success: true as const,
            message: "Successfully update post",
            body: {
              post: {
                id: Number(feed.id),
                content: feed.content,
                created_at: feed.created_at.getTime(),
                updated_at: feed.updated_at.getTime(),
              },
              user: {
                id: Number(user.id),
                fullname: user.full_name,
                username: user.username,
                profile_photo_path:
                  URL_PUBLIC_UPLOADS + user.profile_photo_path,
              },
            },
          },
          200
        );
      } catch (err) {
        console.log(err);
        if (err instanceof HTTPException) {
          let status: 400 | 401 | 403 | 500;

          switch (err.status) {
            case 400:
              status = 400;
              break;
            case 401:
              status = 401;
              break;
            case 403:
              status = 403;
              break;
            default:
              status = 500;
              break;
          }

          c.status(status);
          return c.json(
            {
              success: false as const,
              message: err.message,
              error: null,
            },
            status
          );
        }

        c.status(500);
        return c.json(
          {
            success: false as const,
            message: "Internal server error",
            error: null,
          },
          500
        );
      }
    });
  }

  private registerDeletePostRoute() {
    const route = createRoute({
      method: "delete",
      path: "/api/feed/{postId}",
      request: {
        params: z.object({
          postId: z.string(),
        }),
      },
      middleware: [this.setDeletePostParamsMiddleware] as const,
      tags: ["Feed"],

      responses: {
        200: {
          description: "Successfully delete post",
          content: {
            "application/json": {
              schema: DeletePostSuccessSchema,
            },
          },
        },
        400: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        403: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
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
        const user = c.var.user;
        const postId = c.var.postId;

        if (!user) {
          throw new UnauthorizedException("Unauthorized");
        }

        if (!user.id) {
          throw new InternalErrorException(
            "User from the repo somehow does not have an ID"
          );
        }

        const feed = await this.feedService.deletePost(
          Number(user.id),
          Number(postId)
        );

        return c.json(
          {
            success: true as const,
            message: "Successfully delete post",
            body: null,
          },
          200
        );
      } catch (err) {
        if (err instanceof HTTPException) {
          let status: 400 | 401 | 403 | 500;

          switch (err.status) {
            case 400:
              status = 400;
              break;
            case 401:
              status = 401;
              break;
            case 403:
              status = 403;
              break;
            default:
              status = 500;
              break;
          }

          c.status(status);
          return c.json(
            {
              success: false as const,
              message: err.message,
              error: null,
            },
            status
          );
        }

        c.status(500);
        return c.json(
          {
            success: false as const,
            message: "Internal server error",
            error: null,
          },
          500
        );
      }
    });
  }
}
