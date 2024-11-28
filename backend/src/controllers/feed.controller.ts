import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { createRoute, z } from "@hono/zod-openapi";
import { createMiddleware } from "hono/factory";
import { CONFIG } from "../ioc/config";
import { OpenApiHonoProvider } from "../core/hono-provider";
import { ZodValidationService } from "../services/zod-validation.service";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { GetFeedEnv } from "../constants/context-env.types";
import { GetFeedSuccessSchema } from "../schemas/feed.schema";
import { ErrorResponseSchema } from "../constants/types";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import { InternalErrorException } from "../exceptions/internal-error.exception";
import { HTTPException } from "hono/http-exception";
import { FeedService } from "../services/feed.service";

@injectable()
export class FeedController implements Controller {
  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider,
    @inject(CONFIG.FeedService) private feedService: FeedService
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}
  public registerMiddlewaresAfterGlobal(): void {}
  public registerRoutes(): void {
    this.registerGetFeedRoute();
    // this.registerCreatePostRoute();
    // this.registerUpdatePostRoute();
    // this.registerDeletePostRoute();
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

  private registerGetFeedRoute() {
    const route = createRoute({
      middleware: [this.setGetFeedQueryMiddleware] as const,
      method: "get",
      path: "/api/feed",
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
              schema: ErrorResponseSchema,
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
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
        return c.json(
          {
            success: true as const,
            message: "Successfully get feed",
            body: feed,
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
}
