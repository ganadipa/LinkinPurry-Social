import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { OpenApiHonoProvider } from "../core/hono-provider";
import { UserService } from "../services/user.service";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { createRoute } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { NullErrorResponseSchema } from "../constants/types";
import {
  GetUserByIdParamsSchema,
  GetUserByIdResponseSchema,
} from "../schemas/user.schema";
import { URL_PUBLIC_UPLOADS } from "../constants/constants";

@injectable()
export class UserController implements Controller {
  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider,
    @inject(CONFIG.UserService) private userService: UserService
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerMiddlewaresAfterGlobal(): void {}

  public registerRoutes(): void {
    // get user by id
    this.registerGetUserByIdRoute();
  }

  // get user by id
  private registerGetUserByIdRoute() {
    const route = createRoute({
      method: "get",
      path: "/api/users/{id}",
      tags: ["Users"],
      responses: {
        200: {
          description: "User retrieved successfully",
          content: {
            "application/json": {
              schema: GetUserByIdResponseSchema,
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
      },
      request: {
        params: GetUserByIdParamsSchema,
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        const { id } = c.req.param();
        if (!id) {
          throw new BadRequestException("User ID is required");
        }

        const user = await this.userService.getUserById(Number(id));
        if (!user) {
          return c.json({ success: false, message: "User not found" }, 404);
        }

        return c.json(
          {
            success: true,
            message: "User retrieved successfully",
            body: {
              id: Number(user.id),
              full_name: user.full_name,
              profile_photo_path: URL_PUBLIC_UPLOADS + user.profile_photo_path,
            },
          },
          200
        );
      } catch (exception) {
        return this.handleException(c, exception);
      }
    });
  }

  private handleException(c: any, exception: any) {
    if (exception instanceof HTTPException) {
      return c.json(
        {
          success: false,
          message: exception.message,
          error: null,
        },
        exception.status
      );
    }

    return c.json(
      {
        success: false,
        message: "Internal Server Error",
        error: null,
      },
      500
    );
  }
}
